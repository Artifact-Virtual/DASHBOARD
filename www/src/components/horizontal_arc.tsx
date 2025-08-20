import React from 'react';

interface HorizontalArcProps {
  className?: string;
  color?: string; // Expects a tailwind color class e.g. 'text-arcx-orange'
  direction?: 'left-to-right' | 'right-to-left';
  height?: number;
}

const HorizontalArc: React.FC<HorizontalArcProps> = ({
  className = '',
  color = 'text-arcx-orange',
  direction = 'left-to-right',
  height = 50,
}) => {
  // A gentle upward curve. M starts at bottom-left, Q control point is top-center (and pulls it up), ends at bottom-right.
  const arcPath = `M 0 ${height - 1} Q 500 -10 1000 ${height - 1}`;
  const animationClass = direction === 'left-to-right' ? 'animate-traverse-arc-ltr' : 'animate-traverse-arc-rtl';

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Arc Path */}
        <path
          d={arcPath}
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className={`${color} opacity-20`}
        />

        {/* Comet with Glow */}
        <circle
          r="2"
          fill="currentColor"
          className={`${color} ${animationClass} animate-glow-pulse`}
          style={{ offsetPath: `path("${arcPath}")` }}
        >
        </circle>
      </svg>
    </div>
  );
};

export default HorizontalArc;
