const PopSnap = (props: IconProps) => {
  const primary = 'var(--pallete-primary-main)';
  const seconday = 'white';
  const {
    primaryColor: pc = primary,
    secondaryColor: sc = seconday,
    ...rest
  } = props;
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
      className="default-star"
      {...rest}
    >
      <g id="Layer_2" fill={sc}>
        <path
          d="M0,0v54h54V0H0z M27,44.5c-3.851-10.526-6.976-13.65-17.5-17.498C20.026,23.148,23.149,20.026,27,9.5
		c3.85,10.526,6.977,13.648,17.5,17.502C33.977,30.85,30.85,33.976,27,44.5z"
        />
      </g>
      <g id="Layer_1" fill={pc}>
        <path
          d="M27,9.5c-3.851,10.526-6.974,13.648-17.5,17.502C20.024,30.85,23.149,33.974,27,44.5
		c3.85-10.524,6.977-13.65,17.5-17.498C33.977,23.148,30.85,20.026,27,9.5z"
        />
      </g>
    </svg>
  );
};
export default PopSnap;
