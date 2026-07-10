/**
 * Decorative terrain backdrop shared by the app mocks — a stylized outdoor map
 * (forest patches, a river, contours, a trail) in soft daylight tones so the
 * water-blue UI reads clearly on top. Pure SVG, no external assets.
 */
export function MapTerrain() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 760"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <rect width="360" height="760" fill="#F0F3EC" />
      {/* Forest patches */}
      <path
        d="M-20 60c90-40 180-10 220 40s130 40 180 10v170c-70 40-160 10-210-30S60 200-20 240Z"
        fill="#E0EBD8"
      />
      <path
        d="M-20 430c70-50 170-20 230 30s110 60 170 30v290H-20Z"
        fill="#DCE8D3"
      />
      <path d="M120 640c50-30 130-20 180 10s60 40 60 40v70H80Z" fill="#D3E2C8" />
      {/* Contour lines */}
      <g fill="none" stroke="#E4E9DE" strokeWidth="1.5">
        <path d="M-10 150c80 20 140 80 150 150s60 120 130 140" />
        <path d="M-10 190c70 20 120 70 130 130s70 130 150 150" />
        <path d="M240 40c-20 60 10 120 60 150s70 90 50 150" />
      </g>
      {/* River */}
      <path
        d="M300 -20c-40 80-120 90-150 160s30 130-10 200-120 90-110 180 90 130 70 240"
        fill="none"
        stroke="#BEE0F2"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M300 -20c-40 80-120 90-150 160s30 130-10 200-120 90-110 180 90 130 70 240"
        fill="none"
        stroke="#CFE9F7"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Trail */}
      <path
        d="M40 720c40-90 130-100 160-170s-20-120 30-190 110-70 120-150"
        fill="none"
        stroke="#D9C6A8"
        strokeWidth="4"
        strokeDasharray="10 8"
        strokeLinecap="round"
      />
    </svg>
  );
}
