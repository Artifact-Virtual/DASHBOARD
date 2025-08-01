import numpy as np
import random


class MessageBus:
    def __init__(self):
        self.events = []

    def post_event(self, event):
        self.events.append(event)

    def get_events_for_arc(self, arc_id):
        return [e for e in self.events if e.get("target_arc") == arc_id]

    def resolve_cross_arc_events(self, network):
        # Clear after handling; you can expand for actual dispute resolution
        self.events = []

    def get_state(self):
        return {"events": self.events}


class AgentRegistry:
    def __init__(self):
        self.arcs = {}
        
    def register_arc(self, arc_id, arc):
        self.arcs[arc_id] = arc
        
    def arc_counts(self):
        return list(range(len(self.arcs)))


class LiveContextLoop:
    def __init__(self, arc_sim_class, adam_class, fuel_sim):
        self.arc_sim_class = arc_sim_class
        self.adam_class = adam_class
        self.fuel_sim = fuel_sim
        self.message_bus = MessageBus()
        self.agent_registry = AgentRegistry()
        self.step_count = 0
        self.logs = []
        
        # Initialize multiple ARCs and ADAMs
        self.arcs = []
        self.adams = []
        
        # Create 3 ARC-ADAM pairs
        for i in range(3):
            arc = arc_sim_class(i)
            adam = adam_class(i)
            self.arcs.append(arc)
            self.adams.append(adam)
            self.agent_registry.register_arc(i, arc)
    
    def step(self):
        self.step_count += 1
        crisis_mode = self.step_count % 50 == 0  # Crisis every 50 steps
        
        # Step all ARCs
        for i, (arc, adam) in enumerate(zip(self.arcs, self.adams)):
            arc.step(adam, None, self.agent_registry, self.message_bus)
        
        # Step FUEL simulation
        self.fuel_sim.step(crisis_mode=crisis_mode)
        
        # Resolve cross-ARC events
        self.message_bus.resolve_cross_arc_events(None)
        
        # Collect state for logging
        state = self.get_current_state()
        self.logs.append(state)
        
        # Keep only last 100 logs to prevent memory issues
        if len(self.logs) > 100:
            self.logs = self.logs[-100:]
    
    def get_current_state(self):
        # Collect fuel agent data
        fuel_stats = self.fuel_sim.get_stats()
        alive_agents = [stat for stat in fuel_stats if stat[2]]  # alive agents
        dead_agents = [stat for stat in fuel_stats if not stat[2]]  # dead agents
        
        fuel_levels = [stat[1] for stat in alive_agents]
        avg_fuel = np.mean(fuel_levels) if fuel_levels else 0
        
        # Collect ARC data
        arc_data = []
        for i, arc in enumerate(self.arcs):
            arc_info = {
                "arc_id": i,
                "total_blocks": len(arc.blocks),
                "disputed_blocks": len(arc.disputed_blocks),
                "last_block_valid": arc.blocks[-1]["valid"] if arc.blocks else True
            }
            arc_data.append(arc_info)
        
        # Collect ADAM data
        adam_scores = []
        adam_guilt = []
        adam_policies = []
        
        for adam in self.adams:
            adam_state = adam.get_state()
            adam_scores.append(len(adam.council_log))  # Use council events as score
            adam_guilt.append(adam.guilt)
            adam_policies.append(adam.policy)
        
        return {
            "step": self.step_count,
            "fuel_alive": len(alive_agents),
            "fuel_dead": len(dead_agents),
            "fuel_avg": float(avg_fuel),
            "fuel_deaths_this_step": self.fuel_sim.dead_last_step,
            "adam_scores": np.array(adam_scores),
            "adam_guilt": np.array(adam_guilt),
            "adam_policies": adam_policies,
            "arc_data": arc_data,
            "crisis_mode": self.step_count % 50 == 0,
            "total_disputes": len(self.message_bus.events)
        }
