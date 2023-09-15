const ChevronDown = ({
  width = '20',
  height = '20',
  color = 'currentColor',
}: {
  width?: string;
  height?: string;
  color?: string;
}) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 768 768"
    >
      <path
        fill={color}
        d="M237 274.5l147 147 147-147 45 45-192 192-192-192z"
      ></path>
    </svg>
  );
};
export default ChevronDown;
