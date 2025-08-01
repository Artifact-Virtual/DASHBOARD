import time
import json
import os
import numpy as np
from shared.context import LiveContextLoop

DATA_DIR = "simulation_data"
STATE_PATH = os.path.join(DATA_DIR, "latest.json")
CONTROL_PATH = os.path.join(DATA_DIR, "control.json")
RESET_PATH = os.path.join(DATA_DIR, "reset.json")

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
    
    with open(STATE_PATH, "w") as f:
        json.dump(converted_state, f, indent=2)

def main():
    from fuel_simulation.fuel_sim import FuelSimulator
    from arc_simulation.arc_sim import ArcSimulator
    from adam_simulation.adam_sim import AdamAgent

    print("🔄 Starting DEBUG daemon initialization...")
    print("📦 Creating FuelSimulator...")
    fuel = FuelSimulator(n_agents=8)
    print("⚙️ Creating LiveContextLoop...")
    loop = LiveContextLoop(ArcSimulator, AdamAgent, fuel)
    print("✅ DEBUG Daemon initialization complete!")
    print("🔄 Entering main loop...")
    
    step_count = 0
    while step_count < 5:  # Only run 5 steps for debug
        step_count += 1
        print(f"\n--- DEBUG Step {step_count} ---")
        
        # Check for reset command first
        print("🔍 Checking reset...")
        if check_reset():
            print("🔄 Reset command received - reinitializing simulation...")
            # Reinitialize all components
            fuel = FuelSimulator(n_agents=8)
            loop = LiveContextLoop(ArcSimulator, AdamAgent, fuel)
            print("✅ Simulation reset complete")
        
        print("📖 Reading control...")
        control = read_control()
        print(f"Control: {control}")
        
        if control.get("play", True):
            try:
                print("⏯️ Executing step...")
                loop.step()
                print("💾 Writing state...")
                if loop.logs:
                    write_state(loop.logs[-1])
                print("✅ Step completed!")
            except Exception as e:
                print(f"❌ Error during step: {e}")
                import traceback
                traceback.print_exc()
        
        sleep_time = float(control.get("speed", 0.5))
        print(f"😴 Sleeping for {sleep_time}s...")
        time.sleep(sleep_time)
    
    print("🏁 DEBUG daemon finished 5 steps successfully!")

if __name__ == "__main__":
    main()
