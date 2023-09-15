const TipsReceviedIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '29', height = '24', fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 29 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M11 19.904C6.082 19.904 2.095 15.918 2.095 11C2.095 6.082 6.082 2.095 11 2.095C15.692 2.095 19.528 5.727 19.871 10.332C20.527 10.123 21.225 10.008 21.949 10.002C21.445 4.396 16.738 0 11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C12.839 22 14.569 21.543 16.093 20.745C15.721 20.158 15.435 19.514 15.249 18.827C13.986 19.514 12.539 19.904 11 19.904Z"
        fill={fill}
      />
      <path
        d="M11.168 7.36194C11.579 7.36194 11.906 7.50594 12.148 7.79194C12.396 8.07394 12.52 8.50094 12.52 9.07394H14.667C14.667 8.14294 14.419 7.38594 13.924 6.80394C13.429 6.21694 12.743 5.86394 11.866 5.74394V4.18994H10.677V5.72194C9.79098 5.80894 9.07998 6.10894 8.54498 6.62494C8.00998 7.14094 7.74298 7.80194 7.74298 8.60794C7.74298 9.07594 7.81998 9.47894 7.97298 9.81794C8.13098 10.1569 8.34898 10.4529 8.62698 10.7059C8.90898 10.9539 9.24598 11.1759 9.63698 11.3719C10.029 11.5629 10.494 11.7569 11.034 11.9519C11.574 12.1479 11.955 12.3629 12.178 12.5969C12.406 12.8259 12.52 13.1369 12.52 13.5279C12.52 13.9049 12.394 14.2059 12.141 14.4299C11.889 14.6499 11.544 14.7599 11.108 14.7599C10.583 14.7599 10.179 14.6099 9.89698 14.3089C9.61998 14.0019 9.48098 13.5669 9.48098 12.9979H7.33398C7.33398 13.9769 7.61098 14.7619 8.16598 15.3529C8.72598 15.9399 9.51398 16.2869 10.529 16.3909V17.8089H11.71V16.3839C12.631 16.2929 13.355 15.9949 13.88 15.4879C14.405 14.9819 14.668 14.3229 14.668 13.5119C14.668 13.0769 14.599 12.6979 14.46 12.3729C14.321 12.0439 14.121 11.7529 13.858 11.4989C13.595 11.2409 13.274 11.0119 12.892 10.8119C12.511 10.6059 12.023 10.3889 11.428 10.1599C10.839 9.93094 10.435 9.70594 10.217 9.48694C9.99898 9.26994 9.88998 8.97894 9.88998 8.61594C9.88998 8.22394 10.002 7.91894 10.224 7.69894C10.447 7.47494 10.762 7.36194 11.168 7.36194Z"
        fill={fill}
      />
      <path
        d="M21.244 19.644L18 16.4L19.4 15L21.244 16.844L26.088 12L27.487 13.4L21.244 19.644Z"
        fill={fill}
      />
    </svg>
  );
};
export default TipsReceviedIcon;
