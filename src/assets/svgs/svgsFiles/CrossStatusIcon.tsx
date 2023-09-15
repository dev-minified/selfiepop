const CrossStatusIcon = (props: IconProps) => {
  const { width = 6, height = 6, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M5 0L6 1L1 6L0 5L5 0Z" fill="white" />
      <path d="M4.37114e-08 1L1 0L6 5L5 6L4.37114e-08 1Z" fill="white" />
    </svg>
  );
};
export default CrossStatusIcon;
