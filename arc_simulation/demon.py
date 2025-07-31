import time
import json
import os
import subprocess
from typing import Dict, Any, Optional, List
from arc_simulation.arc_sim import ArcSimulator
from adam_simulation.adam_sim import AdamAgent
from fuel_simulation.fuel_sim import FuelSimulator
from shared.context import LiveContextLoop
import numpy as np

DATA_DIR = "simulation_data"
STATE_PATH = os.path.join(DATA_DIR, "latest.json")
CONTROL_PATH = os.path.join(DATA_DIR, "control.json")
RESET_PATH = os.path.join(DATA_DIR, "reset.json")

os.makedirs(DATA_DIR, exist_ok=True)


def read_control() -> Dict[str, Any]:
    try:
        with open(CONTROL_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return {"play": True, "speed": 0.5}


def check_reset() -> bool:
    """Check if a reset command has been issued"""
    try:
        if os.path.exists(RESET_PATH):
            with open(RESET_PATH, "r") as f:
                json.load(f)  # Removed unused variable
            # Remove the reset file after reading
            os.remove(RESET_PATH)
            return True
    except Exception:
        pass
    return False


def write_state(state: Dict[str, Any]) -> None:
    # Convert numpy arrays to lists for JSON serialization
    json_state = state.copy()
    if 'adam_scores' in json_state:
        if hasattr(json_state['adam_scores'], 'tolist'):
            json_state['adam_scores'] = json_state['adam_scores'].tolist()
    if 'adam_guilt' in json_state:
        if hasattr(json_state['adam_guilt'], 'tolist'):
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


def start_service(command: List[str], log_path: str) -> Optional[subprocess.Popen]:
    """Start a service and log its output."""
    try:
        with open(log_path, "w") as log_file:
            process = subprocess.Popen(
                command, stdout=log_file, stderr=log_file
            )
        return process
    except Exception as e:
        print(f"Error starting service {command}: {e}")
        return None


def monitor_services(services: Dict[str, Dict[str, Any]]) -> None:
    """Monitor multiple services and restart if necessary."""
    while True:
        for name, service in services.items():
            if service["process"].poll() is not None:  # Process has terminated
                print(f"Service {name} has stopped. Restarting...")
                services[name]["process"] = start_service(
                    service["command"], service["log_path"]
                )
        time.sleep(5)


def main() -> None:
    arc = ArcSimulator(arc_id="arc_1")
    adam = AdamAgent(arc_id="adam_1")
    fuel = FuelSimulator(n_agents=8)
    loop = LiveContextLoop(arc, adam, fuel)

    # Start additional services
    services = {
        "landing_page": {
            "command": ["npm", "run", "dev"],
            "log_path": "/tmp/landing_page.log",
            "process": None
        }
    }

    # Initialize services
    for name, service in services.items():
        print(f"Starting service: {name}")
        service["process"] = start_service(
            service["command"], service["log_path"]
        )

    # Monitor services in a separate thread
    import threading
    threading.Thread(
        target=monitor_services, args=(services,), daemon=True
    ).start()

    while True:
        if check_reset():
            print("🔄 Reset command received - reinitializing simulation...")
            arc = ArcSimulator(arc_id="arc_1")
            adam = AdamAgent(arc_id="adam_1")
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
