const RefreshIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '22', height = '22', ...rest } = props;
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      {...rest}
    >
      <g opacity="0.6" clipPath="url(#clip0_1531_1164)">
        <path
          d="M18.3337 10.0836C18.1095 8.4705 17.3611 6.97582 16.2039 5.82984C15.0467 4.68385 13.5448 3.95014 11.9295 3.74172C10.3143 3.5333 8.67531 3.86174 7.26509 4.67644C5.85487 5.49114 4.75164 6.74691 4.12533 8.2503M3.66699 4.58363V8.2503H7.33366"
          stroke={'white'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.66699 11.917C3.89117 13.5301 4.63951 15.0248 5.79674 16.1708C6.95397 17.3168 8.45588 18.0505 10.0711 18.2589C11.6864 18.4673 13.3253 18.1389 14.7356 17.3242C16.1458 16.5095 17.249 15.2537 17.8753 13.7503M18.3337 17.417V13.7503H14.667"
          stroke={'white'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1531_1164">
          <rect width="22" height="22" fill={'currentColor'} />
        </clipPath>
      </defs>
    </svg>
  );
};
export default RefreshIcon;
