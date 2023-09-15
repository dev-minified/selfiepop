const PlayButton = () => {
  return (
    <svg
      width="110"
      height="110"
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_69:260)">
        <path
          d="M55 95C32.908 95 15 77.092 15 55C15 32.908 32.908 15 55 15C77.092 15 95 32.908 95 55C95 77.092 77.092 95 55 95ZM55 87C63.4869 87 71.6263 83.6286 77.6274 77.6274C83.6286 71.6263 87 63.4869 87 55C87 46.5131 83.6286 38.3737 77.6274 32.3726C71.6263 26.3714 63.4869 23 55 23C46.5131 23 38.3737 26.3714 32.3726 32.3726C26.3714 38.3737 23 46.5131 23 55C23 63.4869 26.3714 71.6263 32.3726 77.6274C38.3737 83.6286 46.5131 87 55 87ZM49.488 40.66L69.004 53.668C69.2235 53.8141 69.4034 54.0121 69.5279 54.2445C69.6524 54.4768 69.7176 54.7364 69.7176 55C69.7176 55.2636 69.6524 55.5232 69.5279 55.7555C69.4034 55.9879 69.2235 56.1859 69.004 56.332L49.484 69.34C49.2433 69.4995 48.9639 69.591 48.6755 69.6046C48.387 69.6182 48.1003 69.5535 47.8456 69.4174C47.591 69.2812 47.3779 69.0787 47.229 68.8313C47.0802 68.5839 47.001 68.3008 47 68.012V41.988C47.0005 41.6986 47.0796 41.4148 47.2286 41.1667C47.3777 40.9187 47.5913 40.7157 47.8466 40.5794C48.1019 40.4432 48.3894 40.3787 48.6784 40.3929C48.9675 40.4071 49.2473 40.4994 49.488 40.66Z"
          fill="white"
          fillOpacity="0.6"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_69:260"
          x="0"
          y="0"
          width="110"
          height="110"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_69:260"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_69:260"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
export default PlayButton;
