const PendingStatus = (props: IconProps) => {
  const { width = 10, height = 10, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="5" cy="5" r="5" fill="#FE0404" />
    </svg>
  );
};
export default PendingStatus;
