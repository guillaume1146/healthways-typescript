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
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c896" />
          <stop offset="100%" stopColor="#125ff9" />
        </linearGradient>
      </defs>

      {/* Modern Medical Cross */}
      <g transform="translate(20, 10)">
        {/* Cross Shape */}
        <path
          d="M40 0c5.5 0 10 4.5 10 10v20h20c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10H50v20c0 5.5-4.5 10-10 10H20c-5.5 0-10-4.5-10-10V70H-10c-5.5 0-10-4.5-10-10V40c0-5.5 4.5-10 10-10H10V10c0-5.5 4.5-10 10-10h20z"
          fill="url(#modernGradient)"
        />
        
        {/* Centered Dramatic Thin S-Curve */}
        <path
          d="M8 76 C16 70 24 62 28 52 C32 42 34 38 38 34 C42 30 46 28 52 24 C58 20 66 16 74 12 C82 8 92 4 100 -4"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>

      {/* Healthwyz Text */}
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