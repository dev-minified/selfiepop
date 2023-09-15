const StarMenuIcon = (props: IconProps) => {
  const { width = 30, height = 30, fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 14.6297C18.2 16.3938 16.7641 17.8297 15 22.6297C13.2359 17.8297 11.8 16.3938 7 14.6297C11.8 12.8656 13.2359 11.4297 15 6.6297C16.7641 11.4297 18.2 12.8656 23 14.6297Z"
        fill={fill}
      />
    </svg>
  );
};
export default StarMenuIcon;
