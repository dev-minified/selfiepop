const DescriptionIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '16', height = '16' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.1111 16H0.888889C0.653141 16 0.427048 15.9157 0.260349 15.7657C0.0936505 15.6157 0 15.4122 0 15.2V0.8C0 0.587827 0.0936505 0.384344 0.260349 0.234315C0.427048 0.0842854 0.653141 0 0.888889 0H15.1111C15.3469 0 15.573 0.0842854 15.7397 0.234315C15.9064 0.384344 16 0.587827 16 0.8V15.2C16 15.4122 15.9064 15.6157 15.7397 15.7657C15.573 15.9157 15.3469 16 15.1111 16ZM14.2222 14.4V1.6H1.77778V14.4H14.2222ZM4.44444 4H11.5556V5.6H4.44444V4ZM4.44444 7.2H11.5556V8.8H4.44444V7.2ZM4.44444 10.4H8.88889V12H4.44444V10.4Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default DescriptionIcon;
