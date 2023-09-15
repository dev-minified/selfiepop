const Play = (props?: IconProps) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="36"
        height="36"
        rx="18"
        fill="var(--pallete-text-main)"
        fillOpacity="0.5"
      />
      <path
        d="M27.8709 17.7096L12.629 25.001L12.629 10.4183L27.8709 17.7096Z"
        fill="white"
      />
    </svg>
  );
};
export default Play;
