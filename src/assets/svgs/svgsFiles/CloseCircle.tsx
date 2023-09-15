function CloseCircle(props: React.SVGAttributes<SVGElement>) {
  const { ...rest } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="var(--pallete-text-main)"
        fillOpacity="0.22"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M12 10.8891L15.8891 7L17 8.11094L13.1109 12L17 15.8891L15.8891 17L12 13.1109L8.11094 17L7 15.8891L10.8891 12L7 8.11094L8.11094 7L12 10.8891Z"
        fill="white"
      />
    </svg>
  );
}
export default CloseCircle;
