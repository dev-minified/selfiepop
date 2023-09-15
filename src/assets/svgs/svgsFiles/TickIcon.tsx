const TickIcon = (props: IconType) => {
  const { width, height, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle
        cx="12.5"
        cy="12.5"
        r="11.5"
        fill="var(--pallete-primary-main)"
        stroke="var(--pallete-primary-main)"
        strokeWidth="2"
      />
      <path
        d="M11.2503 18L6 12.4994L7.74969 10.6662L11.2503 14.3338L18.2491 7L20 8.83312L11.2503 18Z"
        fill="white"
      />
    </svg>
  );
};
export default TickIcon;
