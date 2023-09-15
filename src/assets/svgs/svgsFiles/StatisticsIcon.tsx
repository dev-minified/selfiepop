const StatisticsIcon = (props: IconProps) => {
  const { width = 19, height = 19, ...rest } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 19 19"
      fill="none"
      className="statistics"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M0.95 0H18.05C18.302 0 18.5436 0.11121 18.7218 0.309165C18.8999 0.50712 19 0.775605 19 1.05556V17.9444C19 18.2244 18.8999 18.4929 18.7218 18.6908C18.5436 18.8888 18.302 19 18.05 19H0.95C0.698044 19 0.456408 18.8888 0.278249 18.6908C0.100089 18.4929 0 18.2244 0 17.9444V1.05556C0 0.775605 0.100089 0.50712 0.278249 0.309165C0.456408 0.11121 0.698044 0 0.95 0ZM1.9 2.11111V16.8889H17.1V2.11111H1.9ZM4.75 10.5556H6.65V14.7778H4.75V10.5556ZM8.55 4.22222H10.45V14.7778H8.55V4.22222ZM12.35 7.38889H14.25V14.7778H12.35V7.38889Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default StatisticsIcon;
