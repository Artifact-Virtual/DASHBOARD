#!/usr/bin/env python3
"""
Professional WebSocket Server for ARC Multi-Network Simulation
Streams real-time data to React dashboard with trading-style aesthetics
"""

import asyncio
import json
import os
import time
from typing import Dict, Any
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ARC Multi-Network WebSocket API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationManager:
    def __init__(self):
        # Don't initialize simulation - read from files instead
        self.running = False
        self.step_count = 0
        self.history = []
        self.connected_clients = set()
        self.data_dir = "simulation_data"
        self.state_file = "latest.json"
        self.last_update = 0
        
    def read_simulation_data(self):
        """Read simulation data from headless daemon files"""
        try:
            state_path = os.path.join(self.data_dir, self.state_file)
            if os.path.exists(state_path):
                with open(state_path, 'r') as f:
                    data = json.load(f)
                return data
        except Exception as e:
            print(f"Error reading simulation data: {e}")
        return None
        
    async def start_data_streaming(self):
        """Start streaming data from headless daemon files"""
        self.running = True
        while self.running:
            try:
                # Read latest data from headless daemon
                data = self.read_simulation_data()
                
                if data and data.get('step', 0) != self.last_update:
                    self.last_update = data.get('step', 0)
                    
                    # Enhance data for dashboard
                    dashboard_data = {
                        'timestamp': time.time(),
                        'step': data.get('step', 0),
                        'era': data.get('era', 0),
                        'crisis_mode': data.get('crisis_mode', False),
                        'crisis_indicators': data.get('crisis_indicators', []),
                        'network_state': data.get('network_state', {}),
                        'fuel_state': data.get('fuel_state', {}),
                        'system_events': data.get('system_events', [])
                    }
                    
                    # Store in history
                    self.history.append(dashboard_data)
                    
                    # Limit history for performance
                    if len(self.history) > 100:
                        self.history = self.history[-50:]
                    
                    # Broadcast to all connected clients
                    await self.broadcast_data(dashboard_data)
                
                # Check for updates every 500ms
                await asyncio.sleep(0.5)
                
            except Exception as e:
                print(f"Data streaming error: {e}")
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"Data streaming error: {e}")
                await asyncio.sleep(1)
    
    async def broadcast_data(self, data):
        """Broadcast data to all connected WebSocket clients"""
        if self.connected_clients:
            message = json.dumps(data, default=str)
            disconnected = set()
            
            for client in self.connected_clients:
                try:
                    await client.send_text(message)
                except:
                    disconnected.add(client)
            
            # Remove disconnected clients
            self.connected_clients -= disconnected
            
            for client in self.connected_clients:
                try:
                    await client.send_text(message)
                except:
                    disconnected.add(client)
            
            # Remove disconnected clients
            self.connected_clients -= disconnected
    
    def add_client(self, websocket: WebSocket):
        """Add a new WebSocket client"""
        self.connected_clients.add(websocket)
    
    def remove_client(self, websocket: WebSocket):
        """Remove a WebSocket client"""
        self.connected_clients.discard(websocket)

# Global simulation manager
sim_manager = SimulationManager()

# Start data streaming when server starts
@app.on_event("startup")
async def startup_event():
    """Start the data streaming task"""
    asyncio.create_task(sim_manager.start_data_streaming())

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data streaming"""
    await websocket.accept()
    sim_manager.add_client(websocket)
    
    try:
        # Send initial data if available
        if sim_manager.history:
            await websocket.send_text(json.dumps(sim_manager.history[-1], default=str))
        
        # Keep connection alive
        while True:
            try:
                # Simple ping-pong to keep connection alive
                await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                    
            except asyncio.TimeoutError:
                # Send heartbeat
                await websocket.send_text(json.dumps({"type": "heartbeat"}))
                continue
                
    except WebSocketDisconnect:
        sim_manager.remove_client(websocket)

@app.get("/api/status")
async def get_status():
    """Get current simulation status"""
    data = sim_manager.read_simulation_data()
    if data:
        return {"status": "running", "step": data.get('step', 0)}
    return {"status": "no_data"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting ARC Multi-Network WebSocket Server...")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws")
    print("🌐 API endpoint: http://localhost:8000/api/status")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

async def handle_command(command: Dict[str, Any], websocket: WebSocket):
    """Handle commands from frontend"""
    cmd_type = command.get('type')
    
    if cmd_type == 'start_simulation':
        if not sim_manager.running:
            asyncio.create_task(sim_manager.start_simulation())
        await websocket.send_text(json.dumps({"type": "simulation_started"}))
    
    elif cmd_type == 'stop_simulation':
        sim_manager.running = False
        await websocket.send_text(json.dumps({"type": "simulation_stopped"}))
    
    elif cmd_type == 'inject_crisis':
        crisis_type = command.get('crisis_type', 'Economic Collapse')
        severity = command.get('severity', 0.5)
        duration = command.get('duration', 5)
        sim_manager.inject_crisis(crisis_type, severity, duration)
        await websocket.send_text(json.dumps({"type": "crisis_injected", "crisis": crisis_type}))
    
    elif cmd_type == 'add_arc':
        arc_id = sim_manager.add_arc()
        await websocket.send_text(json.dumps({"type": "arc_added", "arc_id": arc_id}))
    
    elif cmd_type == 'remove_arc':
        arc_id = sim_manager.remove_arc()
        await websocket.send_text(json.dumps({"type": "arc_removed", "arc_id": arc_id}))
    
    elif cmd_type == 'update_tokenomics':
        config = command.get('config', {})
        sim_manager.update_tokenomics(config)
        await websocket.send_text(json.dumps({"type": "tokenomics_updated"}))

@app.get("/api/status")
async def get_status():
    """Get current simulation status"""
    return {
        "running": sim_manager.running,
        "step_count": sim_manager.step_count,
        "connected_clients": len(sim_manager.connected_clients),
        "current_price": sim_manager.tokenomics_config['current_price']
    }

@app.get("/api/history")
async def get_history(limit: int = 100):
    """Get simulation history"""
    return sim_manager.history[-limit:]

# Serve React build files (when available)
# app.mount("/", StaticFiles(directory="dashboard/build", html=True), name="static")

if __name__ == "__main__":
    print("🚀 Starting ARC Multi-Network WebSocket Server...")
    print("💡 Professional trading dashboard backend")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws")
    print("🌐 API endpoint: http://localhost:8000/api/status")
    
    uvicorn.run(
        "websocket_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
