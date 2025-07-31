
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


# Minimal implementation of LiveContextLoop for demon.py

import numpy as np

class LiveContextLoop:
    """
    Orchestrates simulation steps, crisis detection, and event aggregation for ARC, ADAM, and FUEL.
    """
    def __init__(self, arc, adam, fuel):
        self.arc = arc
        self.adam = adam
        self.fuel = fuel
        self.step_num = 0
        self.logs = []
        self.crisis_mode = False
        self.era = 0
        self.crisis_history = []

    def detect_crisis(self, fuel_stats, arc_stats):
        # Crisis: >1 FUEL agent dies in a step or >2 invalid ARC blocks in last 7 blocks
        fuel_deaths = fuel_stats.get('deaths', 0)
        invalid_blocks = arc_stats.get('invalid_blocks', [])
        recent_invalid = sum(invalid_blocks[-7:]) if invalid_blocks else 0
        crisis = fuel_deaths > 1 or recent_invalid > 2
        return crisis

    def step(self):
        self.step_num += 1

        # Advance ARC, ADAM, FUEL
        arc_state = self.arc.step() if hasattr(self.arc, 'step') else {}
        adam_state = self.adam.step() if hasattr(self.adam, 'step') else {}
        fuel_state = self.fuel.step() if hasattr(self.fuel, 'step') else {}

        # Extract scores/guilt from ADAM
        adam_scores = adam_state.get('scores', np.zeros(1)) if isinstance(adam_state, dict) else np.zeros(1)
        adam_guilt = adam_state.get('guilt', np.zeros(1)) if isinstance(adam_state, dict) else np.zeros(1)

        # Extract FUEL stats
        fuel_stats = fuel_state.get('stats', {}) if isinstance(fuel_state, dict) else {}

        # Extract ARC stats
        arc_stats = arc_state.get('stats', {}) if isinstance(arc_state, dict) else {}

        # Crisis detection
        self.crisis_mode = self.detect_crisis(fuel_stats, arc_stats)
        if self.crisis_mode:
            self.era += 1
            self.crisis_history.append(self.step_num)

        # Aggregate events
        events = []
        if hasattr(self.arc, 'get_events'):
            events += self.arc.get_events()
        if hasattr(self.adam, 'get_events'):
            events += self.adam.get_events()
        if hasattr(self.fuel, 'get_events'):
            events += self.fuel.get_events()

        # Log state
        state = {
            "step": self.step_num,
            "crisis_mode": self.crisis_mode,
            "era": self.era,
            "adam_scores": adam_scores,
            "adam_guilt": adam_guilt,
            "fuel_stats": fuel_stats,
            "arc_stats": arc_stats,
            "events": events,
            "crisis_history": self.crisis_history,
        }
        self.logs.append(state)
