const LogoYoutube = ({
  primaryColor = 'var(--pallete-primary-main)',
  secondaryColor = 'white',
}: {
  primaryColor?: string;
  secondaryColor?: string;
}) => {
  const pc = primaryColor;
  const sc = secondaryColor;
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
        <polygon points="24,32.736 32.499,27.521 24,22.304 	" />
        <path
          d="M0,0v54h54V0H0z M43.289,35.252c-0.391,1.477-1.543,2.636-3.005,3.03C37.631,39,27,39,27,39s-10.631,0-13.284-0.718
		c-1.462-0.395-2.615-1.554-3.007-3.03C10,32.577,10,27,10,27s0-5.58,0.709-8.253c0.392-1.474,1.545-2.638,3.007-3.031
		C16.369,15,27,15,27,15s10.631,0,13.284,0.716c1.461,0.394,2.613,1.558,3.005,3.031C44,21.42,44,27,44,27S44,32.577,43.289,35.252z
		"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M40.284,15.716C37.631,15,27,15,27,15s-10.631,0-13.284,0.716c-1.462,0.394-2.615,1.558-3.007,3.031
		C10,21.42,10,27,10,27s0,5.577,0.709,8.252c0.392,1.477,1.545,2.636,3.007,3.03C16.369,39,27,39,27,39s10.631,0,13.284-0.718
		c1.462-0.395,2.614-1.554,3.005-3.03C44,32.577,44,27,44,27s0-5.58-0.711-8.253C42.897,17.273,41.745,16.109,40.284,15.716z
		 M24,32.736V22.304l8.499,5.218L24,32.736z"
        />
      </g>
    </svg>
  );
};
export default LogoYoutube;
