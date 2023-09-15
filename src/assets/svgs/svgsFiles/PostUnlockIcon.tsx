const PostUnlockIcon = (props: IconProps) => {
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
        d="M16.9144 24.3991L23.729 18L26 20.133L16.9144 28.6667L10.6667 22.7986L12.9393 20.6655L16.9144 24.3991Z"
        fill="#F4F7FB"
      />
      <path
        d="M24.2574 12.796C20.1714 14.29 18.9567 15.504 17.462 19.5907C15.9667 15.5033 14.7534 14.29 10.6667 12.796C14.754 11.2993 15.9667 10.0873 17.462 6C18.9567 10.0873 20.1714 11.2993 24.2574 12.796Z"
        fill="#F4F7FB"
      />
    </svg>
  );
};
export default PostUnlockIcon;
