const Copy = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="5"
        y="1"
        width="10"
        height="10"
        rx="1"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="1"
        y="6"
        width="10"
        height="10"
        rx="1"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};
export default Copy;
