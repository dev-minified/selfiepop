const ProductAndServicesIcon = (props: IconProps) => {
  const { width = 30, height = 30, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <mask
        id="mask0_1626_8046"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="14"
        y="12"
        width="14"
        height="14"
      >
        <rect x="14" y="12" width="14" height="14" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1626_8046)">
        <path
          d="M20.2414 24.5417V23.2C19.6678 23.0542 19.1939 22.8014 18.8196 22.4417C18.4453 22.082 18.1706 21.557 17.9956 20.8667L19.4248 20.3125C19.5706 20.8084 19.7821 21.1802 20.0591 21.4282C20.3362 21.6761 20.7081 21.8 21.1748 21.8C21.5539 21.8 21.8578 21.7174 22.0862 21.5521C22.3147 21.3868 22.4289 21.1487 22.4289 20.8375C22.4289 20.5459 22.3171 20.3028 22.0935 20.1084C21.8699 19.9139 21.4373 19.7195 20.7956 19.525C19.8526 19.2431 19.2085 18.8858 18.8633 18.4532C18.5182 18.0205 18.3456 17.5417 18.3456 17.0167C18.3456 16.3556 18.5376 15.8403 18.9216 15.4709C19.3057 15.1014 19.7456 14.8584 20.2414 14.7417V13.4584H21.7873V14.7417C22.2442 14.8195 22.6574 15.0285 23.0269 15.3688C23.3963 15.7091 23.6539 16.1125 23.7998 16.5792L22.3706 17.1917C22.2539 16.8806 22.0935 16.6327 21.8894 16.448C21.6852 16.2632 21.3984 16.1709 21.0289 16.1709C20.6498 16.1709 20.3654 16.2535 20.1758 16.4188C19.9862 16.5841 19.8914 16.7639 19.8914 16.9584C19.8914 17.2403 20.0057 17.4615 20.2341 17.6219C20.4626 17.7823 20.9901 17.9889 21.8164 18.2417C22.5164 18.4459 23.056 18.774 23.4352 19.2261C23.8144 19.6782 23.9942 20.2056 23.9748 20.8084C23.9553 21.5667 23.7439 22.1355 23.3404 22.5146C22.9369 22.8938 22.4192 23.1417 21.7873 23.2584V24.5417H20.2414Z"
          fill="white"
        />
      </g>
      <mask
        id="mask1_1626_8046"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="4"
        y="2"
        width="24"
        height="24"
      >
        <rect x="4" y="2" width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask1_1626_8046)">
        <path
          d="M14 14C12.9 14 11.9583 13.6083 11.175 12.825C10.3917 12.0417 10 11.1 10 10C10 8.9 10.3917 7.95833 11.175 7.175C11.9583 6.39167 12.9 6 14 6C15.1 6 16.0417 6.39167 16.825 7.175C17.6083 7.95833 18 8.9 18 10C18 11.1 17.6083 12.0417 16.825 12.825C16.0417 13.6083 15.1 14 14 14ZM6 22V19.2C6 18.65 6.14167 18.1333 6.425 17.65C6.70833 17.1667 7.1 16.8 7.6 16.55C8.45 16.1167 9.40833 15.75 10.475 15.45C11.5417 15.15 12.7167 15 14 15H14.35C14.45 15 14.55 15.0167 14.65 15.05C14.5167 15.35 14.4042 15.6625 14.3125 15.9875C14.2208 16.3125 14.15 16.65 14.1 17H14C12.8167 17 11.7542 17.15 10.8125 17.45C9.87083 17.75 9.1 18.05 8.5 18.35C8.35 18.4333 8.22917 18.55 8.1375 18.7C8.04583 18.85 8 19.0167 8 19.2V20H14.3C14.4 20.35 14.5333 20.6958 14.7 21.0375C14.8667 21.3792 15.05 21.7 15.25 22H6ZM14 12C14.55 12 15.0208 11.8042 15.4125 11.4125C15.8042 11.0208 16 10.55 16 10C16 9.45 15.8042 8.97917 15.4125 8.5875C15.0208 8.19583 14.55 8 14 8C13.45 8 12.9792 8.19583 12.5875 8.5875C12.1958 8.97917 12 9.45 12 10C12 10.55 12.1958 11.0208 12.5875 11.4125C12.9792 11.8042 13.45 12 14 12Z"
          fill="white"
        />
      </g>
    </svg>
  );
};
export default ProductAndServicesIcon;