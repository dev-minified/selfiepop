const primary = 'var(--pallete-primary-main)';
const seconday = 'white';
const Star = ({
  primaryColor,
  secondaryColor,
  width = 54,
  height = 54,
}: {
  primaryColor?: string;
  secondaryColor?: string;
  width?: number | string;
  height?: number | string;
}) => {
  const pc = primaryColor || primary;
  const sc = secondaryColor || seconday;
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 54 54"
      className="star"
    >
      <g id="Layer_1" fill={sc}>
        <path
          d="M0,0v54h54V0H0z M11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5
		L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M46.5,26C34.8,30.3,31.3,33.8,27,45.5C22.7,33.8,19.2,30.3,7.5,26C19.2,21.7,22.7,18.2,27,6.5
		C31.3,18.2,34.8,21.7,46.5,26"
        />
      </g>
    </svg>
  );
};
export default Star;
