const Membership = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '40', height = '40', fill = 'none', ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill={fill}
      {...rest}
    >
      <rect width="40" height="40" rx="20" fill="var(--pallete-primary-main)" />
      <path
        d="M10.9498 12.9933C12.1376 11.7788 13.7308 11.0684 15.4096 11.0047C17.0885 10.941 18.7288 11.5287 20.0014 12.65C21.2729 11.5306 22.911 10.9435 24.5878 11.0063C26.2646 11.069 27.8564 11.7769 29.0445 12.9883C30.2325 14.1996 30.9291 15.8251 30.9949 17.5391C31.0606 19.2532 30.4907 20.9294 29.3991 22.2322L21.4482 30.3866C21.0829 30.7601 20.593 30.9787 20.0767 30.9985C19.5603 31.0183 19.0558 30.8379 18.6641 30.4933L18.5515 30.3876L10.6016 22.2322C9.51063 20.9305 8.94039 19.2559 9.00494 17.543C9.06948 15.8301 9.76405 14.2053 10.9498 12.9933V12.9933ZM12.3976 14.4734C11.5603 15.3297 11.0776 16.4827 11.0498 17.6931C11.022 18.9035 11.4511 20.0784 12.2481 20.9739L12.3976 21.1351L20.0004 28.9075L25.4303 23.3553L21.8107 19.655L20.7253 20.7646C20.4401 21.0563 20.1015 21.2877 19.7288 21.4456C19.3561 21.6035 18.9567 21.6849 18.5532 21.685C17.7385 21.6852 16.957 21.3545 16.3807 20.7656C15.8045 20.1768 15.4806 19.378 15.4804 18.5451C15.4803 17.7122 15.8037 16.9133 16.3797 16.3241L18.532 14.1228C17.6755 13.4239 16.6034 13.06 15.508 13.0962C14.4127 13.1325 13.3659 13.5666 12.5553 14.3206L12.3976 14.4734V14.4734ZM21.0868 17.4337C21.2788 17.2375 21.5392 17.1272 21.8107 17.1272C22.0822 17.1272 22.3426 17.2375 22.5346 17.4337L26.8781 21.8742L27.6031 21.1351C28.4544 20.2654 28.9391 19.0896 28.9535 17.8593C28.9678 16.629 28.5107 15.4417 27.6799 14.5515C26.8491 13.6612 25.7105 13.1387 24.5077 13.0955C23.3048 13.0524 22.1332 13.4921 21.2434 14.3206L21.0868 14.4734L17.8286 17.8043C17.6511 17.9856 17.5449 18.2272 17.5302 18.4833C17.5155 18.7394 17.5932 18.992 17.7487 19.1934L17.8286 19.2844C18.006 19.4659 18.2423 19.5744 18.4928 19.5895C18.7433 19.6045 18.9904 19.525 19.1874 19.3661L19.2764 19.2844L21.0868 17.4337V17.4337Z"
        fill="white"
      />
    </svg>
  );
};
export default Membership;