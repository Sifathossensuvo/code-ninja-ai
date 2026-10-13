export function NinjaMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-label="Code Ninja emblem"
      role="img"
    >
      <path
        className="hood"
        d="M60 5 77 10 91 32 111 94 88 103 69 117 51 114 32 104 9 94 30 34 43 13Z"
      />
      <path className="hood-inner" d="m60 15 18 21 15 41-11 24-22 10-23-11-13-23 14-41Z" />
      <path d="m28 65 15-17 34 1 17 17-10 26-24 14-23-14Z" className="mask" />
      <path d="m34 70 20 5-7 8-9-5Zm52 0-20 5 7 8 9-5Z" className="eyes" />
      <path d="m55 87 5-5 5 5-5 8Z" className="mask" />
      <path d="m39 37 18-6 21 7M16 91l17-8m71 8-17-8" className="details" />
    </svg>
  );
}
export function Globe() {
  return (
    <div className="globe-display">
      <svg viewBox="0 0 200 160" role="img" aria-label="Global network hologram">
        <defs>
          <radialGradient id="glow">
            <stop stopColor="currentColor" stopOpacity=".25" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <clipPath id="sphere">
            <circle cx="100" cy="76" r="50" />
          </clipPath>
        </defs>
        <circle cx="100" cy="76" r="75" fill="url(#glow)" />
        <g className="globe-orbits">
          <ellipse cx="100" cy="76" rx="76" ry="59" />
          <circle cx="100" cy="76" r="50" />
          <ellipse cx="100" cy="76" rx="25" ry="50" />
          <ellipse cx="100" cy="76" rx="43" ry="50" />
          <ellipse cx="100" cy="76" rx="50" ry="18" />
          <ellipse cx="100" cy="76" rx="50" ry="36" />
          <path d="M50 76h100M100 26v100" />
        </g>
        <g clipPath="url(#sphere)" className="continents">
          <path d="m61 41 13-10 19 5 7 12-12 8-4 15-11 3-7-14-12-6Zm32 31 17-8 17 10-4 18-12 17-10-8-5-16Zm21-40 26 10 8 15-12 13-16-10-14-13Z" />
        </g>
        <g className="globe-grid">
          <path d="M5 20h30M5 20v28m160-28h30v28M5 126v16h40m110 0h40v-16" />
          <path d="M10 10v140M190 10v140M4 46h192M4 104h192" />
        </g>
      </svg>
      <div>
        GLOBAL NODES
        <br />
        ONLINE: 24,892
      </div>
      <div className="equalizer">▂▅▂▆▃▅▇▃▂▆▅▃▇▅▂▆▂▃▇▅</div>
    </div>
  );
}
