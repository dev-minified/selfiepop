function defaultImagePlaceholder(props: React.SVGAttributes<SVGElement>) {
  const { height = 48, width = 48, ...rest } = props;
  return (
    <svg
      height={height}
      id="image"
      viewBox="0 0 48 48"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={0}
        fill="#e0e0e0"
        className="vi-primary"
        height="26"
        width="36"
        x="6"
        y="11"
      />
      <path
        className="vi-accent"
        fillRule="evenodd"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={0}
        fill="#bababa"
        d="M6,37L19,24l5,5L35,18l7,7V37H6ZM24.5,17A2.5,2.5,0,1,1,22,19.5,2.5,2.5,0,0,1,24.5,17Z"
      />
    </svg>
  );
}
export default defaultImagePlaceholder;
