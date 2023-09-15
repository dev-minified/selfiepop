const DeclinedStatus = (props: IconProps) => {
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
      <path d="M7.5 1.5L8.5 2.5L2.5 8.5L1.5 7.5L7.5 1.5Z" fill="#6B6B6B" />
      <circle cx="5" cy="5" r="4.375" stroke="#6B6B6B" strokeWidth="1.25" />
    </svg>
  );
};
export default DeclinedStatus;
