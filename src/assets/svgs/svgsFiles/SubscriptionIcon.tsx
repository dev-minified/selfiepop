const SubscriptionIcon = (props: IconProps) => {
  const { width = 23, height = 22, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 23 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M11.5 17.9989L4.39324 22L5.98024 13.9654L0 8.40354L8.08819 7.43873L11.5 0L14.9118 7.43873L23 8.40354L17.0198 13.9654L18.6068 22L11.5 17.9989ZM11.5 15.6761L15.7794 18.085L14.8231 13.2478L18.4234 9.89838L13.5535 9.31767L11.5 4.83923L9.44646 9.31868L4.57662 9.89838L8.17686 13.2478L7.22063 18.085L11.5 15.6761V15.6761Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default SubscriptionIcon;
