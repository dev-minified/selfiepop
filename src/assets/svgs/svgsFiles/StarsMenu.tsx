const StarsMenu = (props: IconProps) => {
  const { width = 30, height = 30, fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1626_7460)">
        <path
          d="M18.8178 9.97857C16.5211 10.8102 15.84 11.4845 15 13.7582C14.16 11.4845 13.4789 10.8102 11.1823 9.97857C13.4789 9.14697 14.16 8.47267 15 6.19897C15.84 8.47267 16.5211 9.14697 18.8178 9.97857Z"
          fill={fill}
        />
        <path
          d="M18.8178 20.8444C16.5211 21.676 15.84 22.3514 15 24.624C14.16 22.3514 13.4789 21.676 11.1823 20.8444C13.4789 20.0139 14.16 19.3385 15 17.0648C15.84 19.3385 16.5211 20.0139 18.8178 20.8444Z"
          fill={fill}
        />
        <path
          d="M9.51224 11.6328C10.3522 13.9065 11.0333 14.5797 13.33 15.4124C11.0333 16.244 10.3533 16.9183 9.51224 19.192C8.67224 16.9194 7.99112 16.244 5.69446 15.4124C7.99112 14.5797 8.67224 13.9065 9.51224 11.6328Z"
          fill={fill}
        />
        <path
          d="M20.4878 11.6318C21.3278 13.9055 22.0089 14.5787 24.3056 15.4114C22.01 16.243 21.3278 16.9184 20.4878 19.191C19.6478 16.9184 18.9667 16.243 16.6689 15.4114C18.9667 14.5798 19.6489 13.9055 20.4878 11.6318Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_1626_7460">
          <rect
            width="20"
            height="22"
            fill="white"
            transform="translate(5 4)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
export default StarsMenu;