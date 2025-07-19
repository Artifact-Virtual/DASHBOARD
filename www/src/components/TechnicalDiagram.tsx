import React from 'react';

export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'input' | 'process' | 'output' | 'decision' | 'storage' | 'quantum';
  details?: string;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  type?: 'data' | 'control' | 'quantum' | 'feedback' | 'output';
}

interface TechnicalDiagramProps {
  title: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  width?: number;
  height?: number;
  description?: string;
}

const TechnicalDiagram: React.FC<TechnicalDiagramProps> = ({
  title,
  nodes,
  connections,
  width = 800,
  height = 500,
  description
}) => {
  const getNodeStyle = (type: string) => {
    const baseStyle = "stroke-white/30 stroke-2 fill-black/50";
    switch (type) {
      case 'quantum':
        return `${baseStyle} fill-purple-900/30 stroke-purple-400`;
      case 'input':
        return `${baseStyle} fill-blue-900/30 stroke-blue-400`;
      case 'output':
        return `${baseStyle} fill-green-900/30 stroke-green-400`;
      case 'process':
        return `${baseStyle} fill-orange-900/30 stroke-orange-400`;
      case 'decision':
        return `${baseStyle} fill-yellow-900/30 stroke-yellow-400`;
      case 'storage':
        return `${baseStyle} fill-gray-900/30 stroke-gray-400`;
      default:
        return baseStyle;
    }
  };

  const getConnectionStyle = (type?: string) => {
    switch (type) {
      case 'quantum':
        return 'stroke-purple-400 stroke-2';
      case 'data':
        return 'stroke-blue-400 stroke-2';
      case 'control':
        return 'stroke-orange-400 stroke-2';
      case 'feedback':
        return 'stroke-green-400 stroke-2 stroke-dasharray="5,5"';
      case 'output':
        return 'stroke-green-400 stroke-2';
      default:
        return 'stroke-white/50 stroke-2';
    }
  };

  const renderNode = (node: DiagramNode) => {
    const nodeStyle = getNodeStyle(node.type);
    
    if (node.type === 'decision') {
      // Diamond shape for decision nodes
      const size = 60;
      const points = [
        [node.x, node.y - size/2],
        [node.x + size/2, node.y],
        [node.x, node.y + size/2],
        [node.x - size/2, node.y]
      ].map(p => p.join(',')).join(' ');
      
      return (
        <g key={node.id}>
          <polygon
            points={points}
            className={nodeStyle}
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-white text-xs font-mono"
          >
            {node.label}
          </text>
        </g>
      );
    } else if (node.type === 'storage') {
      // Cylinder shape for storage
      return (
        <g key={node.id}>
          <ellipse
            cx={node.x}
            cy={node.y - 15}
            rx="40"
            ry="8"
            className={nodeStyle}
          />
          <rect
            x={node.x - 40}
            y={node.y - 15}
            width="80"
            height="30"
            className={nodeStyle}
          />
          <ellipse
            cx={node.x}
            cy={node.y + 15}
            rx="40"
            ry="8"
            className={nodeStyle}
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-white text-xs font-mono"
          >
            {node.label}
          </text>
        </g>
      );
    } else {
      // Rectangle for other node types
      return (
        <g key={node.id}>
          <rect
            x={node.x - 50}
            y={node.y - 20}
            width="100"
            height="40"
            rx="5"
            className={nodeStyle}
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-white text-xs font-mono"
          >
            {node.label}
          </text>
        </g>
      );
    }
  };

  const renderConnection = (connection: DiagramConnection) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    const connectionStyle = getConnectionStyle(connection.type);
    
    return (
      <g key={`${connection.from}-${connection.to}`}>
        <defs>
          <marker
            id={`arrowhead-${connection.from}-${connection.to}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-current"
            />
          </marker>
        </defs>
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          className={connectionStyle}
          markerEnd={`url(#arrowhead-${connection.from}-${connection.to})`}
        />
        {connection.label && (
          <text
            x={(fromNode.x + toNode.x) / 2}
            y={(fromNode.y + toNode.y) / 2 - 10}
            textAnchor="middle"
            className="fill-white/70 text-xs font-mono"
          >
            {connection.label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="my-12 p-6 border border-white/10 rounded-lg bg-black/30">
      <h3 className="text-xl font-light tracking-wide text-white mb-2">{title}</h3>
      {description && (
        <p className="text-white/60 text-sm font-light mb-6">{description}</p>
      )}
      
      <div className="flex justify-center">
        <svg 
          width={width} 
          height={height} 
          className="border border-white/5 rounded bg-black/20"
          viewBox={`0 0 ${width} ${height}`}
        >
          {/* Grid background */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Render connections first (behind nodes) */}
          {connections.map(renderConnection)}
          
          {/* Render nodes */}
          {nodes.map(renderNode)}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-400/30 border border-purple-400 rounded"></div>
          <span className="text-white/60">Quantum</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-400/30 border border-blue-400 rounded"></div>
          <span className="text-white/60">Input</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-400/30 border border-orange-400 rounded"></div>
          <span className="text-white/60">Process</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400/30 border border-green-400 rounded"></div>
          <span className="text-white/60">Output</span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDiagram;
