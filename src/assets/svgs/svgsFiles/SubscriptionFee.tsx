const SubscriptionFee = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '12', height = '11', ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 28 30"
      fill="none"
      {...rest}
    >
      <path
        d="M-1.52588e-05 30L1.66869e-07 21L11 21L-1.52588e-05 30Z"
        fill="var(--pallete-primary-main)"
      />
      <rect width="28" height="24" rx="3" fill="var(--pallete-primary-main)" />
      <path
        d="M19.6302 6L12.5193 13.199L8.37142 8.99873L6 11.3984L12.5193 18L22 8.39966L19.6302 6Z"
        fill="white"
      />
    </svg>
  );
};
export default SubscriptionFee;
