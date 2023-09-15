const DoubleArrow = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '256', height = '256', ...rest } = props;
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 256 256"
      {...rest}
    >
      <g>
        <rect width={width} height={height} fill="none" />
      </g>
      <g>
        <path
          d="M80,212c-1,0-2-0.4-2.8-1.2l-32-32c-1.6-1.6-1.6-4.1,0-5.7c1.6-1.6,4.1-1.6,5.7,0L80,202.3l29.2-29.2
		c1.6-1.6,4.1-1.6,5.7,0c1.6,1.6,1.6,4.1,0,5.7l-32,32C82,211.6,81,212,80,212z"
        />
      </g>
      <g>
        <path d="M80,212c-2.2,0-4-1.8-4-4V48c0-2.2,1.8-4,4-4s4,1.8,4,4v160C84,210.2,82.2,212,80,212z" />
      </g>
      <g>
        <path
          d="M176,212c-1,0-2-0.4-2.8-1.2l-32-32c-1.6-1.6-1.6-4.1,0-5.7c1.6-1.6,4.1-1.6,5.7,0l29.2,29.2l29.2-29.2
		c1.6-1.6,4.1-1.6,5.7,0c1.6,1.6,1.6,4.1,0,5.7l-32,32C178,211.6,177,212,176,212z"
        />
      </g>
      <g>
        <path d="M176,212c-2.2,0-4-1.8-4-4V48c0-2.2,1.8-4,4-4s4,1.8,4,4v160C180,210.2,178.2,212,176,212z" />
      </g>
    </svg>
  );
};
export default DoubleArrow;