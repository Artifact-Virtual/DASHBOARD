#!/usr/bin/env python3
"""
Headless Multi-ARC Constitutional Intelligence Network Data Generator
Runs in background without UI, generating rich simulation data continuously.
"""
import time
import json
import os
import numpy as np
from shared.context import LiveContextLoop
from fuel_simulation.fuel_sim import FuelSimulator
from arc_simulation.arc_sim import ArcSimulator
from adam_simulation.adam_sim import AdamAgent

DATA_DIR = "simulation_data"
STATE_PATH = os.path.join(DATA_DIR, "latest.json")
CONTROL_PATH = os.path.join(DATA_DIR, "control.json")
RESET_PATH = os.path.join(DATA_DIR, "reset.json")
HEADLESS_STATE_PATH = os.path.join(DATA_DIR, "headless_state.json")

os.makedirs(DATA_DIR, exist_ok=True)


def read_control():
    try:
        with open(CONTROL_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return {"play": True, "speed": 0.5}


def check_reset():
    """Check if a reset command has been issued"""
    try:
        if os.path.exists(RESET_PATH):
            with open(RESET_PATH, "r") as f:
                reset_data = json.load(f)
            # Remove the reset file after reading
            os.remove(RESET_PATH)
            return True
    except Exception:
        pass
    return False


def write_state(state):
    # Convert numpy arrays and sets to lists for JSON serialization
    def convert_numpy_and_sets(obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, set):
            return list(obj)
        elif isinstance(obj, dict):
            return {k: convert_numpy_and_sets(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_numpy_and_sets(item) for item in obj]
        else:
            return obj

    converted_state = convert_numpy_and_sets(state)
    
    # Write both legacy format and headless format
    with open(STATE_PATH, "w") as f:
        json.dump(converted_state, f, indent=2)
    
    with open(HEADLESS_STATE_PATH, "w") as f:
        json.dump(converted_state, f, indent=2)


def main():
    print("🔄 Starting Headless Multi-ARC Constitutional Intelligence Network...")
    print("📦 Creating FuelSimulator...")
    fuel = FuelSimulator(n_agents=8)
    print("⚙️ Creating Advanced LiveContextLoop...")
    loop = LiveContextLoop(ArcSimulator, AdamAgent, fuel, initial_arc_count=3)
    print("✅ Headless daemon initialization complete!")
    print("🔄 Running headless data generation (Ctrl+C to stop)...")
    
    step_count = 0
    try:
        while True:
            step_count += 1
            
            # Check for reset command first
            if check_reset():
                print("🔄 Reset command received - reinitializing simulation...")
                fuel = FuelSimulator(n_agents=8)
                loop = LiveContextLoop(ArcSimulator, AdamAgent, fuel, initial_arc_count=3)
                print("✅ Simulation reset complete")
            
            control = read_control()
            
            if control.get("play", True):
                try:
                    loop.step()
                    if loop.logs:
                        write_state(loop.logs[-1])
                    
                    # Print periodic status
                    if step_count % 50 == 0:
                        current_state = loop.get_current_state()
                        fuel_alive = current_state.get('fuel_alive', 0)
                        total_blocks = sum(arc['total_blocks'] for arc in current_state.get('network_state', {}).get('arcs', []))
                        era = current_state.get('era', 1)
                        print(f"📊 Step {step_count}: {fuel_alive} agents alive, {total_blocks} blocks, Era {era}")
                        
                except Exception as e:
                    print(f"❌ Error during step {step_count}: {e}")
                    import traceback
                    traceback.print_exc()
            
            time.sleep(float(control.get("speed", 0.5)))
            
    except KeyboardInterrupt:
        print("\n🛑 Headless daemon stopped by user")
        print(f"📊 Final stats: Completed {step_count} steps")


if __name__ == "__main__":
    main()
