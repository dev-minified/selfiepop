function UnlockOrdersIcon(props: React.SVGAttributes<SVGElement>) {
  const { width = '20', height = '20', ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 23 23"
      fill="none"
      {...rest}
    >
      <path
        d="M13.2915 10.5416H3.70817C2.64962 10.5416 1.7915 11.3997 1.7915 12.4583V18.2083C1.7915 19.2668 2.64962 20.125 3.70817 20.125H13.2915C14.35 20.125 15.2082 19.2668 15.2082 18.2083V12.4583C15.2082 11.3997 14.35 10.5416 13.2915 10.5416Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8.49984 16.2917C9.02911 16.2917 9.45817 15.8626 9.45817 15.3333C9.45817 14.8041 9.02911 14.375 8.49984 14.375C7.97056 14.375 7.5415 14.8041 7.5415 15.3333C7.5415 15.8626 7.97056 16.2917 8.49984 16.2917Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M4.6665 10.5416V5.74996C4.6665 4.7333 5.07037 3.75827 5.78926 3.03938C6.50815 2.32049 7.48317 1.91663 8.49984 1.91663C9.5165 1.91663 10.4915 2.32049 11.2104 3.03938C11.9293 3.75827 12.3332 4.7333 12.3332 5.74996"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
export default UnlockOrdersIcon;
