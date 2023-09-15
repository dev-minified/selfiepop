const Uploader = ({
  color = 'var(--pallete-primary-main)',
  width = '20px',
  height = '20px',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        d="M11 22C4.928 22 1.47653e-06 17.072 9.45698e-07 11C4.14867e-07 4.928 4.928 -2.32222e-06 11 -2.85305e-06C17.072 -3.38388e-06 22 4.928 22 11C22 17.072 17.072 22 11 22ZM11 2.2C6.138 2.2 2.2 6.138 2.2 11C2.2 15.862 6.138 19.8 11 19.8C15.862 19.8 19.8 15.862 19.8 11C19.8 6.138 15.862 2.2 11 2.2ZM9.9 11L6.6 11L11 6.6L15.4 11L12.1 11L12.1 15.4L9.9 15.4L9.9 11Z"
        fill={color}
      />
    </svg>
  );
};
export default Uploader;
