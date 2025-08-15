import React from 'react'

interface HealthwyzLogoProps {
  width?: number
  height?: number
  className?: string
  showText?: boolean
}

const HealthwyzLogo: React.FC<HealthwyzLogoProps> = ({
  width = 200,
  height = 60,
  className = "",
  showText = true
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} >
      <defs>
        <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c896" />
          <stop offset="100%" stopColor="#125ff9" />
        </linearGradient>
      </defs>

      <g transform="translate(20, 10)">
        <path d="M40 0c5.5 0 10 4.5 10 10v20h20c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10H50v20c0 5.5-4.5 10-10 10H20c-5.5 0-10-4.5-10-10V70H-10c-5.5 0-10-4.5-10-10V40c0-5.5 4.5-10 10-10H10V10c0-5.5 4.5-10 10-10h20z" fill="url(#modernGradient)" />
        
        {/* Sigmoid curve as smooth diagonal */}
        <path d="M5 72 
                 C10 72, 15 69, 20 62
                 C25 55, 30 48, 35 44
                 C40 40, 45 33, 50 26
                 C55 19, 60 16, 75 16" 
              stroke="white" 
              strokeWidth="3.5" 
              fill="none" 
              strokeLinecap="round" 
              opacity="0.95" />
        
        {/* Inflection point marker */}
        <circle cx="35" cy="44" r="1.5" fill="white" opacity="0.8"/>
      </g>

      {showText && (
        <text
          x="120"
          y="70"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="42"
          fontWeight="700"
          fill="#2d3748"
          letterSpacing="-2px"
        >
          Healthwyz
        </text>
      )}
    </svg>
  )
}

export default HealthwyzLogo