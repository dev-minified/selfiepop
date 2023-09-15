const ChevronRight = (props: React.SVGAttributes<SVGElement>) => {
  const { ...rest } = props;
  return (
    <svg
      width="9"
      height="15"
      viewBox="0 0 12 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.366116 19.6339C-0.122041 19.1457 -0.122041 18.3543 0.366115 17.8661L8.23223 10L0.366114 2.13388C-0.122042 1.64573 -0.122042 0.854272 0.366114 0.366118C0.854269 -0.122039 1.64573 -0.122039 2.13388 0.366118L10.8839 9.11612C11.372 9.60427 11.372 10.3957 10.8839 10.8839L2.13388 19.6339C1.64573 20.122 0.854271 20.122 0.366116 19.6339Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default ChevronRight;
