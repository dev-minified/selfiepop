const StarEmptySquare = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '30', height = '30', color = 'white', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M17.043 5.019L16.199 5.005L14.388 5C6.507 5.038 5.185 5.882 5.02 12.935L5.006 13.8L5 14.69L5.006 16.198C5.086 23.55 6.06 24.814 12.913 24.978L13.801 24.993L15.313 24.999C23.468 24.98 24.816 24.203 24.98 17.042L24.994 16.198L25 14.686C24.98 6.531 24.204 5.183 17.043 5.019ZM15 22C13.46 17.79 12.21 16.541 8 15C12.21 13.459 13.459 12.21 15 8C16.54 12.21 17.791 13.46 22 15C17.79 16.541 16.539 17.79 15 22Z"
        fill={color}
      />
    </svg>
  );
};
export default StarEmptySquare;
