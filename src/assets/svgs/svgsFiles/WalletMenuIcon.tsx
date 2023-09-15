function WalletMenuIcon(props: React.SVGAttributes<SVGElement>) {
  const { width = '30', height = '30', fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M21.909 22.5H8.09C7.138 22.5 6.362 21.726 6.362 20.772V10.878C6.362 9.92502 7.137 9.15002 8.09 9.15002H21.909C22.862 9.15002 23.638 9.92502 23.638 10.878V20.772C23.638 21.726 22.862 22.5 21.909 22.5ZM8.09 10.878V20.772H21.912L21.909 10.878H8.09Z"
        fill={fill}
      />
      <path d="M20.083 5.5V9.272H7.853L20.083 5.5Z" fill={fill} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.001 16.355C23.001 16.985 22.49 17.498 21.859 17.498H17.765C17.133 17.498 16.622 16.985 16.622 16.355V15.528C16.622 14.898 17.133 14.387 17.765 14.387H21.859C22.49 14.387 23.001 14.898 23.001 15.528V16.355Z"
        fill={fill}
      />
    </svg>
  );
}
export default WalletMenuIcon;
