#!/bin/bash
# Setup script for Multi-ARC Constitutional Intelligence Dashboard
# Supports both legacy Streamlit and new React + WebSocket interface

set -e  # Exit on any error

echo "🚀 Setting up Multi-ARC CI Dashboard..."
echo "========================================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
echo "🔍 Checking system requirements..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists node; then
    echo "⚠️  Node.js not found. Installing Node.js..."
    # Install Node.js via NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installed"
else
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
fi

if ! command_exists npm; then
    echo "❌ npm is required but not installed."
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: $NPM_VERSION"
fi

echo "✅ System requirements satisfied"

# Create and/or activate virtual environment
echo "📦 Setting up Python virtual environment..."
if [ -d ".venv" ]; then
    echo "   • Activating existing virtual environment (.venv)"
    source .venv/bin/activate
else
    echo "   • Creating new virtual environment (.venv)"
    python3 -m venv .venv
    source .venv/bin/activate
fi
echo "✅ Python virtual environment ready"

# Install Python requirements
echo "📦 Installing Python dependencies..."
pip install --upgrade pip --break-system-packages
pip install --break-system-packages -r requirements.txt
echo "✅ Python dependencies installed"

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p simulation_data
mkdir -p logs
echo "✅ Project directories created"

# Setup React dashboard if it doesn't exist
echo "⚛️  Setting up React Dashboard..."
if [ ! -d "react-dashboard" ]; then
    echo "   • Creating React dashboard structure..."
    
    # Create React app structure
    mkdir -p react-dashboard/src/components
    mkdir -p react-dashboard/src/hooks
    mkdir -p react-dashboard/src/styles
    mkdir -p react-dashboard/public
    
    # Create package.json
    cat > react-dashboard/package.json << 'EOF'
{
  "name": "arc-professional-dashboard",
  "version": "1.0.0",
  "description": "Multi-ARC Constitutional Intelligence Trading Dashboard",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4",
    "plotly.js": "^2.18.0",
    "react-plotly.js": "^2.6.0",
    "socket.io-client": "^4.6.1",
    "axios": "^1.3.4",
    "moment": "^2.29.4",
    "lodash": "^4.17.21"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:8000"
}
EOF
    
    echo "✅ React dashboard structure created"
else
    echo "✅ React dashboard already exists"
fi

# Install React dependencies
echo "📦 Installing React dependencies..."
cd react-dashboard
if [ ! -d "node_modules" ]; then
    echo "   • Installing npm packages..."
    npm install
    echo "✅ React dependencies installed"
else
    echo "✅ React dependencies already installed"
fi
cd ..

# Create initial simulation data if not exists
echo "📊 Initializing simulation data..."
if [ ! -f "simulation_data/control.json" ]; then
    cat > simulation_data/control.json << 'EOF'
{
    "running": false,
    "step": 0,
    "last_update": "2024-01-01T00:00:00",
    "mode": "professional_dashboard"
}
EOF
    echo "✅ Initial control data created"
fi

# Verify setup
echo "🔍 Verifying setup..."
if [ -f ".venv/bin/python" ] && [ -d "react-dashboard/node_modules" ]; then
    echo "✅ Setup verification passed"
else
    echo "❌ Setup verification failed"
    exit 1
fi

echo ""
echo "🎉 Multi-ARC Constitutional Intelligence Dashboard Setup Complete!"
echo "========================================================================="
echo "📍 Python Backend: Virtual environment ready with all dependencies"
echo "📍 React Frontend: Trading dashboard ready"
echo "📍 WebSocket Server: FastAPI + WebSocket backend configured"
echo "📍 Data Directory: simulation_data/ ready for live data"
echo ""
echo "🚀 To start the dashboard:"
echo "   ./start.sh"
echo ""
echo "🔧 To manually activate the environment:"
echo "   source .venv/bin/activate"
echo ""
echo "⚛️  Dashboard Features:"
echo "   • Real-time WebSocket streaming (60fps)"
echo "   • Professional trading aesthetics"
echo "   • Dynamic ARC management"
echo "   • Crisis injection controls"
echo "   • Multi-dimensional analytics"
echo "   • Constitutional intelligence monitoring"
echo "========================================================================="
