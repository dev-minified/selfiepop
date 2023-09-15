const HorizontalDotsForVerification = (
  props: React.SVGAttributes<SVGElement>,
) => {
  const { width = '26', height = '6', fill = 'none', ...rest } = props;
  return (
    <svg
      viewBox="0 0 26 6"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      {...rest}
    >
      <circle cx="3" cy="3" r="3" fill="#BABABA" />
      <circle cx="13" cy="3" r="3" fill="#BABABA" />
      <circle cx="23" cy="3" r="3" fill="#BABABA" />
    </svg>
  );
};
export default HorizontalDotsForVerification;
