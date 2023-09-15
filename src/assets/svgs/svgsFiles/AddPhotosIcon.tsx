function AddPhotosIcon(props: React.SVGAttributes<SVGElement>) {
  const { width = '27', height = '27', fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M18.121 0H3.307C1.48 0 0 1.48 0 3.307V18.121C0 19.948 1.48 21.429 3.307 21.429H13.667V19.048H6.181L14.947 10.281L18.332 13.666H21.429V3.307C21.429 1.48 19.948 0 18.121 0ZM19.047 11.015L15.789 7.756C15.565 7.533 15.263 7.407 14.947 7.407C14.631 7.407 14.328 7.532 14.105 7.756L2.905 18.956C2.595 18.807 2.381 18.489 2.381 18.121V3.307C2.381 2.796 2.796 2.381 3.307 2.381H18.121C18.633 2.381 19.047 2.796 19.047 3.307V11.015Z"
        fill={fill}
      />
      <path
        d="M6.54796 8.33399C7.53434 8.33399 8.33396 7.53437 8.33396 6.54799C8.33396 5.56161 7.53434 4.76199 6.54796 4.76199C5.56158 4.76199 4.76196 5.56161 4.76196 6.54799C4.76196 7.53437 5.56158 8.33399 6.54796 8.33399Z"
        fill={fill}
      />
      <path
        d="M21.4291 19.048V18.121V15.477H19.0481V19.048H18.1211H15.4771V21.429H18.1211H19.0481V25H21.4291V21.429H25.0001V19.048H21.4291Z"
        fill={fill}
      />
    </svg>
  );
}
export default AddPhotosIcon;