const InfoIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '34', height = '34', fill = '#CFABCD', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M18.7 8.5H15.3V11.9H18.7V8.5Z" fill={fill} fillOpacity="0.7" />
      <path
        d="M15.3 18.7V25.5H20.4V22.1H18.7V15.3H13.6V18.7H15.3Z"
        fill={fill}
        fillOpacity="0.7"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.4 17C3.4 24.497 9.503 30.6 17 30.6C24.497 30.6 30.6 24.497 30.6 17C30.6 9.503 24.497 3.4 17 3.4C9.503 3.4 3.4 9.503 3.4 17ZM17 0C7.616 0 0 7.616 0 17C0 26.384 7.616 34 17 34C26.384 34 34 26.384 34 17C34 7.616 26.384 0 17 0Z"
        fill={fill}
        fillOpacity="0.7"
      />
    </svg>
  );
};
export default InfoIcon;
