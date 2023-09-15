const TimeExtendIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '42px', height = '42px' } = props;
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 42 42"
      enableBackground="new 0 0 42 42"
      xmlSpace="preserve"
      {...props}
    >
      <circle cx="21" cy="21" r="21" fill="#5CD553" />
      <g>
        <g>
          <path
            fill="#fff"
            d="M21.3,8C14,8,8,14,8,21.3s6,13.3,13.3,13.3s13.3-6,13.3-13.3S28.6,8,21.3,8z M21.3,32
			c-5.9,0-10.7-4.8-10.7-10.7s4.8-10.7,10.7-10.7S32,15.4,32,21.3S27.2,32,21.3,32z M24.6,26.4l-4.6-3.3c-0.2-0.1-0.3-0.3-0.3-0.5
			v-8.8c0-0.4,0.3-0.6,0.6-0.6h1.7c0.4,0,0.6,0.3,0.6,0.6v7.6l3.6,2.6c0.3,0.2,0.3,0.6,0.1,0.9l-1,1.4
			C25.3,26.6,24.9,26.6,24.6,26.4L24.6,26.4z"
          />
        </g>
      </g>
    </svg>
  );
};
export default TimeExtendIcon;
