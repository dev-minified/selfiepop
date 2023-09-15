type MessageProps = IconProps;
const Message = (props: MessageProps) => {
  const {
    color = 'var(--pallete-primary-main)',
    width = 21,
    height = 21,
    ...rest
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.36683 1.39901C0 2.79804 0 5.04971 0 9.55308V18.6827C0 19.6173 0 20.0845 0.120703 20.3346C0.37975 20.8712 0.986942 21.1287 1.54085 20.9368C1.79894 20.8472 2.12176 20.5169 2.76738 19.8561H2.76739L2.76741 19.856C3.29094 19.3201 3.55271 19.0522 3.84116 18.8358C4.44564 18.3824 5.14793 18.0847 5.8886 17.9678C6.24204 17.912 6.61224 17.912 7.35261 17.912H12.25C16.0854 17.912 18.0031 17.912 19.2939 16.8278C19.5301 16.6293 19.7468 16.4075 19.9407 16.1657C21 14.8445 21 12.8817 21 8.95601C21 5.03032 21 3.06747 19.9407 1.74634C19.7468 1.50448 19.5301 1.28272 19.2939 1.08423C18.0031 0 16.0854 0 12.25 0H9.33333C4.93355 0 2.73368 0 1.36683 1.39901ZM5.24993 10.7477C6.21643 10.7477 6.99993 9.94567 6.99993 8.95645C6.99993 7.96723 6.21643 7.16525 5.24993 7.16525C4.28342 7.16525 3.49993 7.96723 3.49993 8.95645C3.49993 9.94567 4.28342 10.7477 5.24993 10.7477ZM12.2499 8.95645C12.2499 9.94567 11.4664 10.7477 10.4999 10.7477C9.53346 10.7477 8.74993 9.94567 8.74993 8.95645C8.74993 7.96723 9.53346 7.16525 10.4999 7.16525C11.4664 7.16525 12.2499 7.96723 12.2499 8.95645ZM15.7501 10.7477C16.7166 10.7477 17.5001 9.94567 17.5001 8.95645C17.5001 7.96723 16.7166 7.16525 15.7501 7.16525C14.7837 7.16525 14.0001 7.96723 14.0001 8.95645C14.0001 9.94567 14.7837 10.7477 15.7501 10.7477Z"
        fill={color}
      />
    </svg>
  );
};
export default Message;
