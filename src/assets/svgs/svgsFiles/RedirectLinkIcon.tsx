const RedirectLinkIcon = (props: IconProps) => {
  const { width = 23, height = 23, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      fill="none"
      {...rest}
    >
      <path
        d="M19.8 14.056C19.5878 14.056 19.3843 14.1403 19.2343 14.2903C19.0843 14.4403 19 14.6438 19 14.856V20.6C19 20.8122 18.9157 21.0157 18.7657 21.1657C18.6157 21.3157 18.4122 21.4 18.2 21.4H9.4C9.18783 21.4 8.98434 21.3157 8.83431 21.1657C8.68429 21.0157 8.6 20.8122 8.6 20.6V11.8C8.6 11.5878 8.68429 11.3843 8.83431 11.2343C8.98434 11.0843 9.18783 11 9.4 11H15.144C15.3562 11 15.5597 10.9157 15.7097 10.7657C15.8597 10.6157 15.944 10.4122 15.944 10.2C15.944 9.98783 15.8597 9.78434 15.7097 9.63431C15.5597 9.48429 15.3562 9.4 15.144 9.4H9.4C8.76348 9.4 8.15303 9.65286 7.70294 10.1029C7.25286 10.553 7 11.1635 7 11.8V20.6C7 21.2365 7.25286 21.847 7.70294 22.2971C8.15303 22.7471 8.76348 23 9.4 23H18.2C18.8365 23 19.447 22.7471 19.8971 22.2971C20.3471 21.847 20.6 21.2365 20.6 20.6V14.856C20.6 14.6438 20.5157 14.4403 20.3657 14.2903C20.2157 14.1403 20.0122 14.056 19.8 14.056ZM22.936 7.496C22.8548 7.30052 22.6995 7.14518 22.504 7.064C22.4078 7.02301 22.3045 7.00126 22.2 7H17.4C17.1878 7 16.9843 7.08429 16.8343 7.23431C16.6843 7.38434 16.6 7.58783 16.6 7.8C16.6 8.01217 16.6843 8.21566 16.8343 8.36569C16.9843 8.51571 17.1878 8.6 17.4 8.6H20.272L12.032 16.832C11.957 16.9064 11.8975 16.9949 11.8569 17.0923C11.8163 17.1898 11.7954 17.2944 11.7954 17.4C11.7954 17.5056 11.8163 17.6102 11.8569 17.7077C11.8975 17.8051 11.957 17.8936 12.032 17.968C12.1064 18.043 12.1949 18.1025 12.2923 18.1431C12.3898 18.1837 12.4944 18.2046 12.6 18.2046C12.7056 18.2046 12.8102 18.1837 12.9077 18.1431C13.0051 18.1025 13.0936 18.043 13.168 17.968L21.4 9.728V12.6C21.4 12.8122 21.4843 13.0157 21.6343 13.1657C21.7843 13.3157 21.9878 13.4 22.2 13.4C22.4122 13.4 22.6157 13.3157 22.7657 13.1657C22.9157 13.0157 23 12.8122 23 12.6V7.8C22.9987 7.69546 22.977 7.59218 22.936 7.496Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default RedirectLinkIcon;