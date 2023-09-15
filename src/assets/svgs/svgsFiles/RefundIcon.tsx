const RefundIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '42px', height = '42px' } = props;
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 42 42"
      enableBackground="new 0 0 42 42"
      xmlSpace="preserve"
      {...props}
    >
      <circle fill="#5cd553" cx="21" cy="21" r="21" />
      <path
        fill="#FFFFFF"
        d="M28.004,13.995c-1.799-1.798-4.268-2.913-7.009-2.913c-5.483,0-9.913,4.438-9.913,9.918
	s4.43,9.918,9.913,9.918c4.628,0,8.486-3.16,9.589-7.438h-2.58c-1.018,2.889-3.771,4.959-7.009,4.959
	c-4.107,0-7.443-3.336-7.443-7.439s3.336-7.439,7.443-7.439c2.06,0,3.895,0.855,5.235,2.207l-3.995,3.992h8.683v-8.678
	L28.004,13.995z"
      />
    </svg>
  );
};
export default RefundIcon;
