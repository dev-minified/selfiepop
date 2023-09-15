const ImageIcon = (props: React.SVGAttributes<SVGElement>) => {
  const {
    width = '18',
    height = '18',
    // fill = 'var(--pallete-text-main-600)',
    ...rest
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.77778 2C2.34822 2 2 2.34822 2 2.77778V15.2222C2 15.5309 2.17979 15.7975 2.44036 15.9232L11.8484 6.51512C12.036 6.32758 12.2903 6.22222 12.5556 6.22222C12.8208 6.22222 13.0751 6.32758 13.2627 6.51512L16 9.25245V2.77778C16 2.34822 15.6518 2 15.2222 2H2.77778ZM18 2.77778C18 1.24365 16.7563 0 15.2222 0H2.77778C1.24365 0 0 1.24365 0 2.77778V15.2222C0 16.7563 1.24365 18 2.77778 18H15.2222C16.7563 18 18 16.7563 18 15.2222V2.77778ZM16 12.0809L12.5556 8.63644L5.19199 16H15.2222C15.6518 16 16 15.6518 16 15.2222V12.0809Z"
        fill="white"
      />
      <path
        d="M7 5.5C7 6.32843 6.32843 7 5.5 7C4.67157 7 4 6.32843 4 5.5C4 4.67157 4.67157 4 5.5 4C6.32843 4 7 4.67157 7 5.5Z"
        fill="white"
      />
    </svg>
  );
};
export default ImageIcon;
