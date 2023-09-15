const SubscriptionMenuIcon = (props: IconProps) => {
  const { width = 23, height = 22, fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1626_7456)">
        <path
          d="M14.5 20.7264L8.6292 24L9.9402 17.4262L5 12.8756L11.6815 12.0862L14.5 6L17.3184 12.0862L24 12.8756L19.0598 17.4262L20.3708 24L14.5 20.7264ZM14.5 18.8259L18.0352 20.7968L17.2452 16.8391L20.2193 14.0987L16.1964 13.6235L14.5 9.95937L12.8036 13.6244L8.78069 14.0987L11.7548 16.8391L10.9649 20.7968L14.5 18.8259Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_1626_7456">
          <rect width="19" height="18" fill={fill} transform="translate(5 6)" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default SubscriptionMenuIcon;
