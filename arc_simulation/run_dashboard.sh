#!/bin/bash
cd /home/adam/repos/DASHBOARD/arc_simulation
echo "🚀 Starting Artifact Virtual Multi-ARC Network Dashboard..."

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    echo "📦 Activating virtual environment..."
    source .venv/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "⚠️  No .venv found, using system Python"
fi

python3 -m streamlit run streamlit_dashboard.py --server.port 8501 --server.address 0.0.0.0
