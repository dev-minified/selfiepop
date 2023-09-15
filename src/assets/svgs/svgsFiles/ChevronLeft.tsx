const ChevronLeft = (props: React.SVGAttributes<SVGElement>) => {
  const { ...rest } = props;

  return (
    <svg
      width="9"
      height="15"
      viewBox="0 0 9 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M6.93794 14.4182C7.12408 14.6005 7.36099 14.7 7.6402 14.7C8.19862 14.7 8.64705 14.2691 8.64705 13.7222C8.64705 13.4487 8.52859 13.2002 8.33399 13.0096L2.41136 7.3417L8.33399 1.69042C8.5286 1.49983 8.64705 1.24295 8.64705 0.97779C8.64705 0.430891 8.19862 7.16746e-07 7.6402 6.67928e-07C7.36099 6.43518e-07 7.12409 0.0994368 6.93795 0.281736L0.355358 6.57936C0.118452 6.79481 0.00846029 7.05997 -6.42557e-07 7.34999C-6.67911e-07 7.64001 0.118452 7.8886 0.355357 8.11233L6.93794 14.4182Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default ChevronLeft;
