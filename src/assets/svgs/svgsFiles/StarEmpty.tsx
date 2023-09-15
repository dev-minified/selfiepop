const StarEmpty = (props: React.SVGAttributes<SVGElement>) => {
  const { width = 30, height = 30, fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M27 15.001C19.783 17.641 17.6389 19.783 14.999 27C12.3591 19.783 10.217 17.641 3.00003 15.001C10.217 12.3596 12.3591 10.218 14.999 3C17.6389 10.2175 19.783 12.359 27 15.001Z"
        stroke={fill}
        strokeWidth="2"
      />
    </svg>
  );
};
export default StarEmpty;
