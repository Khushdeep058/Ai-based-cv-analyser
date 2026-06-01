import React, { useEffect, useState } from 'react';

const ScoreMeter = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#16a34a'; // green-600
    if (score >= 60) return '#ea580c'; // orange-600
    return '#dc2626'; // red-600
  };

  const strokeColor = getColor();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <defs>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#neonGlow)"
          className="transition-[stroke-dashoffset] duration-100 ease-linear"
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold text-on-surface leading-none tracking-tight">
          {animatedScore}
        </span>
        <span className="font-label text-base font-semibold text-on-surface-variant">
          /100
        </span>
      </div>
    </div>
  );
};

export default ScoreMeter;
