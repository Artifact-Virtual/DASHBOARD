import time
import json
import os
from arc_simulation.arc_sim import ArcSimulator
from adam_simulation.adam_sim import AdamAgent
from fuel_simulation.fuel_sim import FuelSimulator
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
    # Convert numpy arrays to lists for JSON serialization
    json_state = state.copy()
    if 'adam_scores' in json_state:
        json_state['adam_scores'] = json_state['adam_scores'].tolist()
    if 'adam_guilt' in json_state:
        json_state['adam_guilt'] = json_state['adam_guilt'].tolist()
    
    with open(STATE_PATH, "w") as f:
        json.dump(json_state, f)
    # Clean up any other files in DATA_DIR except latest.json and control.json
    for fname in os.listdir(DATA_DIR):
        if fname not in ("latest.json", "control.json"):
            try:
                os.remove(os.path.join(DATA_DIR, fname))
            except Exception:
                pass

def main():
    arc = ArcSimulator()
    adam = AdamAgent()
    fuel = FuelSimulator(n_agents=8)
    loop = LiveContextLoop(arc, adam, fuel)
    
    while True:
        # Check for reset command first
        if check_reset():
            print("🔄 Reset command received - reinitializing simulation...")
            # Reinitialize all components
            arc = ArcSimulator()
            adam = AdamAgent()
            fuel = FuelSimulator(n_agents=8)
            loop = LiveContextLoop(arc, adam, fuel)
            print("✅ Simulation reset complete")
        
        control = read_control()
        if control.get("play", True):
            loop.step()
            write_state(loop.logs[-1])
        time.sleep(float(control.get("speed", 0.5)))

if __name__ == "__main__":
    main()
