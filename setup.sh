#!/bin/bash

# Setup script for Artifact Virtual Dashboard
# Handles both npm install for the landing page and Python requirements for arc simulation

set -e

echo "Artifact Virtual Dashboard Setup"
echo "===================================="

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WWW_DIR="$SCRIPT_DIR/www"
ARC_SIM_DIR="$SCRIPT_DIR/arc_simulation"

echo "📁 Working from: $SCRIPT_DIR"

# Step 1: Setup React landing page
echo ""
echo "🌐 Setting up React landing page..."
if [ -d "$WWW_DIR" ]; then
    cd "$WWW_DIR"
    echo "📦 Installing npm dependencies..."
    if npm install; then
        echo "✅ React landing page dependencies installed"
    else
        echo "❌ Failed to install npm dependencies"
        exit 1
    fi
else
    echo "❌ www directory not found at $WWW_DIR"
    exit 1
fi

# Step 2: Setup Arc Simulation Python environment
echo ""
echo "🐍 Setting up Arc Simulation Python environment..."
if [ -d "$ARC_SIM_DIR" ]; then
    cd "$ARC_SIM_DIR"
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "🔧 Creating Python virtual environment..."
        python3 -m venv venv --system-site-packages
    fi
    
    # Activate virtual environment and install requirements
    echo "📦 Installing Python dependencies..."
    if ./venv/bin/pip install -r requirements.txt; then
        echo "✅ Arc Simulation Python dependencies installed"
    else
        echo "❌ Failed to install Python dependencies"
        exit 1
    fi
else
    echo "❌ arc_simulation directory not found at $ARC_SIM_DIR"
    exit 1
fi

# Step 3: Verify installations
echo ""
echo "🔍 Verifying installations..."

# Check React build
cd "$WWW_DIR"
if npm list > /dev/null 2>&1; then
    echo "✅ React dependencies verified"
else
    echo "⚠️  React dependencies may have issues"
fi

# Check Python packages
cd "$ARC_SIM_DIR"
if ./venv/bin/python -c "import streamlit, plotly, numpy, pandas, matplotlib; print('All packages imported successfully')"; then
    echo "✅ Python dependencies verified"
else
    echo "⚠️  Python dependencies may have issues"
fi

echo ""
echo "Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  🌐 Start landing page: ./start-systemd.sh"
echo "  📊 Start Arc simulation: cd arc_simulation && ./venv/bin/streamlit run streamlit_dashboard.py --server.port 8502"
echo "  🔴 Start live stream: cd arc_simulation && ./venv/bin/streamlit run live_stream.py --server.port 8503"
echo ""
