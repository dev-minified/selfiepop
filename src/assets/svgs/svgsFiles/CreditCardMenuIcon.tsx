const CreditCardMenuIcon = (props: IconProps) => {
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
        d="M22.2 22.955H7.8C6.807 22.955 6 22.147 6 21.155V10.845C6 9.85304 6.807 9.04504 7.8 9.04504H22.2C23.192 9.04504 24 9.85304 24 10.845V21.156C24 22.147 23.192 22.955 22.2 22.955ZM7.8 10.845V21.156H22.202L22.2 10.845H7.8Z"
        fill={fill}
      />
      <path d="M23.1 13.545H6.89999V15.345H23.1V13.545Z" fill={fill} />
      <path d="M19.5 17.145H16.8V18.946H19.5V17.145Z" fill={fill} />
    </svg>
  );
};
export default CreditCardMenuIcon;
