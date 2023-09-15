const QRIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="3" fill="white" />
      <path
        d="M26.4 22.2004C23.8742 23.1243 23.1236 23.8741 22.1998 26.4C21.2759 23.8741 20.526 23.1243 18 22.2004C20.5258 21.2758 21.2757 20.5263 22.1998 18C23.1236 20.5263 23.8742 21.2758 26.4 22.2004Z"
        fill="var(--pallete-primary-main)"
      />
      <rect
        x="5.5"
        y="5.5"
        width="9"
        height="9"
        rx="1.5"
        fill="white"
        stroke="var(--pallete-primary-main)"
      />
      <circle cx="10" cy="10" r="2" fill="var(--pallete-primary-main)" />
      <rect
        x="5.5"
        y="17.5"
        width="9"
        height="9"
        rx="1.5"
        fill="white"
        stroke="var(--pallete-primary-main)"
      />
      <circle cx="10" cy="22" r="2" fill="var(--pallete-primary-main)" />
      <rect
        x="17.5"
        y="5.5"
        width="9"
        height="9"
        rx="1.5"
        fill="white"
        stroke="var(--pallete-primary-main)"
      />
      <circle cx="22" cy="10" r="2" fill="var(--pallete-primary-main)" />
    </svg>
  );
};
export default QRIcon;
