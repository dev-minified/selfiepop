const CrownIcon = (props: IconProps) => {
  const {
    width = 36,
    height = 36,
    fill = 'var(--pallete-primary-main)',
    color = 'white',
    ...rest
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="36" height="36" rx="18" fill={fill} />
      <path
        d="M8 24H28V26H8V24ZM8 10L13 13.5L18 7L23 13.5L28 10V22H8V10ZM10 13.841V20H26V13.841L22.58 16.235L18 10.28L13.42 16.235L10 13.84V13.841Z"
        fill={color}
      />
    </svg>
  );
};
export default CrownIcon;
