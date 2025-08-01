#!/usr/bin/env python3
"""
Professional WebSocket Server for ARC Multi-Network Simulation
Streams real-time data to React dashboard with trading-style aesthetics
"""

import asyncio
import json
import time
from typing import Dict, Any
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from shared.context import LiveContextLoop
from fuel_simulation.fuel_sim import FuelSimulator
from arc_simulation.arc_sim import ArcSimulator
from adam_simulation.adam_sim import AdamAgent

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
        # Initialize the simulation
        fuel_sim = FuelSimulator(n_agents=8)
        self.live_context_loop = LiveContextLoop(
            ArcSimulator, AdamAgent, fuel_sim, initial_arc_count=3
        )
        self.running = False
        self.step_count = 0
        self.history = []
        self.connected_clients = set()
        self.tokenomics_config = {
            'initial_treasury': 1000000,
            'fuel_cost': 0.01,
            'target_price': 1.0,
            'current_price': 0.001,  # Start very low
            'burn_rate': 0.02,
            'staking_apy': 0.12,
            'bridge_fee_rate': 0.005,
            'validator_reward_rate': 0.1,
            'inflation_rate': 0.03,
            'price_strategy': 'Conservative Growth'
        }
        
    async def start_simulation(self):
        """Start the simulation loop"""
        self.running = True
        while self.running:
            try:
                start_time = time.time()
                
                # Execute simulation step
                self.live_context_loop.step()
                self.step_count += 1
                
                # Get current state
                current_state = self.live_context_loop.get_current_state()
                
                # Calculate price evolution based on tokenomics
                self._update_tokenomics(current_state)
                
                # Add timing information
                step_duration = time.time() - start_time
                
                # Prepare enhanced data for dashboard
                dashboard_data = {
                    'timestamp': time.time(),
                    'step': self.step_count,
                    'duration': step_duration,
                    'simulation_state': current_state,
                    'tokenomics': self.tokenomics_config,
                    'price_history': self._get_price_history(),
                    'network_health': self._calculate_network_health(current_state),
                    'trading_metrics': self._generate_trading_metrics(current_state)
                }
                
                # Store in history
                self.history.append(dashboard_data)
                
                # Limit history for performance
                if len(self.history) > 200:
                    self.history = self.history[-100:]
                
                # Broadcast to all connected clients
                await self.broadcast_data(dashboard_data)
                
                # Control simulation speed
                await asyncio.sleep(0.5)  # 2 steps per second
                
            except Exception as e:
                print(f"Simulation error: {e}")
                await asyncio.sleep(1)
    
    def _update_tokenomics(self, current_state):
        """Update FUEL token price based on network activity"""
        # Price evolution algorithm based on network health and activity
        economic_health = current_state.get('economic_health', 1.0)
        fuel_alive = current_state.get('fuel_alive', 0)
        network_activity = current_state.get('total_disputes', 0)
        
        # Price impact factors
        health_factor = economic_health * 1.5  # Health boost
        activity_factor = min(2.0, fuel_alive / 8.0)  # Agent activity
        network_factor = max(0.5, 1.0 - (network_activity * 0.1))  # Network stability
        
        # Strategy-based price targets
        price_targets = {
            'Conservative Growth': 1.0,
            'Aggressive Growth': 10.0,
            'BTC Parity Target': 65000.0,
            'ETH Parity Target': 3500.0,
            'Stable Dollar Peg': 1.0,
            'Custom Target': self.tokenomics_config.get('custom_target', 1.0)
        }
        
        target_price = price_targets.get(self.tokenomics_config['price_strategy'], 1.0)
        
        # Calculate price change
        current_price = self.tokenomics_config['current_price']
        price_momentum = health_factor * activity_factor * network_factor
        
        # Growth rate based on distance from target
        distance_to_target = target_price - current_price
        growth_rate = min(0.05, distance_to_target * 0.001) * price_momentum
        
        # Apply price change
        new_price = current_price * (1 + growth_rate)
        self.tokenomics_config['current_price'] = max(0.0001, new_price)
        
        # Update treasury and other metrics
        self.tokenomics_config['market_cap'] = self.tokenomics_config['current_price'] * 1000000
        self.tokenomics_config['price_change_24h'] = growth_rate * 100
        
    def _get_price_history(self):
        """Get recent price history for charts"""
        return [
            {
                'timestamp': h['timestamp'],
                'price': h['tokenomics']['current_price'],
                'volume': h['simulation_state'].get('total_disputes', 0) * 1000
            }
            for h in self.history[-50:]  # Last 50 data points
        ]
    
    def _calculate_network_health(self, current_state):
        """Calculate comprehensive network health metrics"""
        economic_health = current_state.get('economic_health', 1.0)
        fuel_alive = current_state.get('fuel_alive', 0)
        total_violations = current_state.get('total_violations', 0)
        
        # Network health score (0-100)
        health_score = (
            economic_health * 40 +  # Economic health weight
            (fuel_alive / 8.0) * 30 +  # Agent survival weight
            max(0, (1 - total_violations * 0.1)) * 30  # Violation penalty
        )
        
        return {
            'overall_score': min(100, health_score),
            'economic_health': economic_health * 100,
            'agent_survival_rate': (fuel_alive / 8.0) * 100,
            'network_stability': max(0, (1 - total_violations * 0.1)) * 100,
            'status': 'Excellent' if health_score > 80 else 'Good' if health_score > 60 else 'Poor'
        }
    
    def _generate_trading_metrics(self, current_state):
        """Generate trading-style metrics for professional dashboard"""
        price = self.tokenomics_config['current_price']
        
        # Simulate order book data
        spread = price * 0.001  # 0.1% spread
        
        return {
            'bid': price - spread,
            'ask': price + spread,
            'spread': spread,
            'volume_24h': current_state.get('total_disputes', 0) * 10000,
            'high_24h': price * 1.1,
            'low_24h': price * 0.9,
            'price_change_percent': self.tokenomics_config.get('price_change_24h', 0),
            'market_cap': self.tokenomics_config.get('market_cap', 0),
            'circulating_supply': current_state.get('fuel_mainnet', {}).get('circulating_supply', 1000000)
        }
    
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
    
    def add_client(self, websocket: WebSocket):
        """Add a new WebSocket client"""
        self.connected_clients.add(websocket)
    
    def remove_client(self, websocket: WebSocket):
        """Remove a WebSocket client"""
        self.connected_clients.discard(websocket)
    
    def toggle_simulation(self):
        """Start/stop simulation"""
        self.running = not self.running
        return self.running
    
    def inject_crisis(self, crisis_type: str, severity: float, duration: int):
        """Inject crisis into simulation"""
        self.live_context_loop.inject_crisis(crisis_type, severity, duration)
    
    def add_arc(self):
        """Add new ARC to network"""
        return self.live_context_loop.add_arc()
    
    def remove_arc(self):
        """Remove ARC from network"""
        return self.live_context_loop.remove_arc()
    
    def update_tokenomics(self, config: Dict[str, Any]):
        """Update tokenomics configuration"""
        self.tokenomics_config.update(config)

# Global simulation manager
sim_manager = SimulationManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time data streaming"""
    await websocket.accept()
    sim_manager.add_client(websocket)
    
    try:
        # Send initial data
        if sim_manager.history:
            await websocket.send_text(json.dumps(sim_manager.history[-1], default=str))
        
        # Keep connection alive
        while True:
            try:
                # Ping to keep connection alive
                data = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
                
                # Handle commands from frontend
                try:
                    command = json.loads(data)
                    await handle_command(command, websocket)
                except json.JSONDecodeError:
                    pass
                    
            except asyncio.TimeoutError:
                # Send heartbeat
                await websocket.send_text(json.dumps({"type": "heartbeat"}))
                continue
                
    except WebSocketDisconnect:
        sim_manager.remove_client(websocket)

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
