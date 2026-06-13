interface TechFloraLogoProps {
  className?: string;
  fillColor?: string;
  strokeColor?: string;
}

export function TechFloraLogo({
  className = "w-10 h-10",
  fillColor = "#93C5FD",
  strokeColor = "#2563EB"
}: TechFloraLogoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield outline */}
      <path
        d="M100 20 L160 40 L160 90 Q160 140 100 180 Q40 140 40 90 L40 40 Z"
        fill="white"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Decorative flower/pinwheel petals */}
      <g transform="translate(100, 100)">
        {/* Petal 1 - Top */}
        <path
          d="M 0,-35 Q 8,-30 10,-20 Q 12,-10 8,-5 Q 4,0 0,0 Q -4,0 -8,-5 Q -12,-10 -10,-20 Q -8,-30 0,-35 Z"
          fill={fillColor}
        />

        {/* Petal 2 - Top Right */}
        <path
          d="M 25,-25 Q 32,-20 33,-10 Q 34,0 28,3 Q 22,6 17,3 Q 12,0 10,-5 Q 8,-10 12,-20 Q 16,-25 25,-25 Z"
          fill={fillColor}
        />

        {/* Petal 3 - Right */}
        <path
          d="M 35,0 Q 30,8 20,10 Q 10,12 5,8 Q 0,4 0,0 Q 0,-4 5,-8 Q 10,-12 20,-10 Q 30,-8 35,0 Z"
          fill={fillColor}
        />

        {/* Petal 4 - Bottom Right */}
        <path
          d="M 25,25 Q 20,32 10,33 Q 0,34 -3,28 Q -6,22 -3,17 Q 0,12 5,10 Q 10,8 20,12 Q 25,16 25,25 Z"
          fill={fillColor}
        />

        {/* Petal 5 - Bottom */}
        <path
          d="M 0,35 Q -8,30 -10,20 Q -12,10 -8,5 Q -4,0 0,0 Q 4,0 8,5 Q 12,10 10,20 Q 8,30 0,35 Z"
          fill={fillColor}
        />

        {/* Petal 6 - Bottom Left */}
        <path
          d="M -25,25 Q -32,20 -33,10 Q -34,0 -28,-3 Q -22,-6 -17,-3 Q -12,0 -10,5 Q -8,10 -12,20 Q -16,25 -25,25 Z"
          fill={fillColor}
        />

        {/* Petal 7 - Left */}
        <path
          d="M -35,0 Q -30,-8 -20,-10 Q -10,-12 -5,-8 Q 0,-4 0,0 Q 0,4 -5,8 Q -10,12 -20,10 Q -30,8 -35,0 Z"
          fill={fillColor}
        />

        {/* Petal 8 - Top Left */}
        <path
          d="M -25,-25 Q -20,-32 -10,-33 Q 0,-34 3,-28 Q 6,-22 3,-17 Q 0,-12 -5,-10 Q -10,-8 -20,-12 Q -25,-16 -25,-25 Z"
          fill={fillColor}
        />

        {/* Center circle with Chrome logo */}
        <circle cx="0" cy="0" r="18" fill="white" stroke={strokeColor} strokeWidth="3"/>

        {/* Chrome Logo */}
        <g transform="scale(0.35)">
          {/* Chrome outer ring - three segments */}
          <path
            d="M 0,-30 A 30,30 0 0,1 26,-15 L 13,-7.5 A 15,15 0 0,0 0,-15 Z"
            fill="#EA4335"
          />
          <path
            d="M 26,-15 A 30,30 0 0,1 -26,-15 L -13,-7.5 A 15,15 0 0,0 13,-7.5 Z"
            fill="#FBBC04"
          />
          <path
            d="M -26,-15 A 30,30 0 0,1 0,-30 L 0,-15 A 15,15 0 0,0 -13,-7.5 Z"
            fill="#34A853"
          />

          {/* Chrome center circle */}
          <circle cx="0" cy="-15" r="10" fill="#4285F4"/>
        </g>
      </g>

      {/* Bottom shield accent */}
      <path
        d="M 60 160 L 100 175 L 140 160"
        fill="none"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TechFloraLogoSmall({ className = "w-6 h-6" }: { className?: string }) {
  return <TechFloraLogo className={className} />;
}
