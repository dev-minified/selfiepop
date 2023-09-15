const Shoutout = ({
  primaryColor,
  secondaryColor,
}: {
  primaryColor?: string;
  secondaryColor?: string;
}) => {
  const primary = 'var(--pallete-primary-main)';
  const seconday = 'var(--pallete-background-default)';
  const pc = primaryColor || primary;
  const sc = secondaryColor || seconday;
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="54px"
      height="54px"
      viewBox="0 0 54 54"
      enableBackground="new 0 0 54 54"
      xmlSpace="preserve"
      className="shoutout"
    >
      <g id="Layer_1" fill={sc}>
        <rect x="20.889" y="16.197" width="12.222" height="21.605" />
        <rect x="14.778" y="16.197" width="3.055" height="3.086" />
        <rect x="36.167" y="34.717" width="3.056" height="3.086" />
        <rect x="14.778" y="22.371" width="3.055" height="3.085" />
        <rect x="14.778" y="28.542" width="3.055" height="3.087" />
        <rect x="14.778" y="34.717" width="3.055" height="3.086" />
        <rect x="36.167" y="28.542" width="3.056" height="3.087" />
        <rect x="36.167" y="16.197" width="3.056" height="3.086" />
        <rect x="36.167" y="22.371" width="3.056" height="3.085" />
        <path
          d="M47.107,0H6.893H0v6.893v40.214V54h6.894h40.213H54v-6.893V6.893V0H47.107z M42.277,39.357
     c-0.002,0.405-0.162,0.791-0.445,1.08c-0.284,0.285-0.667,0.447-1.068,0.451H13.238c-0.402,0-0.788-0.162-1.071-0.449
     c-0.285-0.287-0.444-0.677-0.444-1.082V14.643c0.002-0.405,0.162-0.792,0.446-1.079c0.285-0.287,0.667-0.449,1.068-0.453h27.525
     c0.838,0,1.516,0.687,1.516,1.532V39.357z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M40.762,13.111H13.237c-0.401,0.004-0.783,0.166-1.068,0.453c-0.284,0.287-0.444,0.674-0.446,1.079v24.714
     c0,0.405,0.159,0.795,0.444,1.082c0.283,0.287,0.669,0.449,1.071,0.449h27.526c0.401-0.004,0.784-0.166,1.068-0.451
     c0.283-0.289,0.443-0.675,0.445-1.08V14.643C42.277,13.798,41.6,13.111,40.762,13.111z M17.833,37.803h-3.055v-3.086h3.055V37.803z
      M17.833,31.629h-3.055v-3.087h3.055V31.629z M17.833,25.456h-3.055v-3.085h3.055V25.456z M17.833,19.283h-3.055v-3.086h3.055
     V19.283z M33.111,37.803H20.889V16.197h12.222V37.803z M39.223,37.803h-3.056v-3.086h3.056V37.803z M39.223,31.629h-3.056v-3.087
     h3.056V31.629z M39.223,25.456h-3.056v-3.085h3.056V25.456z M39.223,19.283h-3.056v-3.086h3.056V19.283z"
        />
      </g>
    </svg>
  );
};
export default Shoutout;
