const StarCircle = (props: IconProps) => {
  const { width = 36, height = 36, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="36" height="36" rx="18" fill="var(--pallete-primary-main)" />
      <path
        d="M29 18.0009C22.3844 20.4209 20.419 22.3844 17.9991 29C15.5791 22.3844 13.6156 20.4209 7 18.0009C13.6156 15.5796 15.5791 13.6165 17.9991 7C20.4185 13.6165 22.3844 15.5796 29 18.0009Z"
        fill="white"
      />
    </svg>
  );
};
export default StarCircle;
