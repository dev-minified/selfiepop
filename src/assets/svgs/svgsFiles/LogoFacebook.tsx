const LogoFacebook = ({
  primaryColor,
  secondaryColor,
}: {
  primaryColor?: string;
  secondaryColor?: string;
}) => {
  const primary = 'var(--pallete-primary-main)';
  const seconday = 'white';
  const pc = primaryColor || primary;
  const sc = secondaryColor || seconday;
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 54 54"
      enableBackground="new 0 0 54 54"
      xmlSpace="preserve"
    >
      <g id="Layer_1" fill={sc}>
        <path
          d="M0,0v54h54V0H0z M34.336,27h-5.032v19h-7.536V27H18v-6.549h3.768v-3.933c0-5.341,2.127-8.518,8.166-8.518h5.032v6.549
		H31.82c-2.348,0-2.504,0.916-2.504,2.626l-0.012,3.277H35L34.336,27z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M29.315,17.175c0-1.71,0.156-2.626,2.504-2.626h3.146V8h-5.032c-6.039,0-8.166,3.177-8.166,8.518v3.933H18
		V27h3.768v19h7.536V27h5.032L35,20.452h-5.696L29.315,17.175z"
        />
      </g>
    </svg>
  );
};
export default LogoFacebook;
