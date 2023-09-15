const ClockSky = (props: React.SVGAttributes<SVGElement>) => {
  const {
    width = '24',
    height = '24',
    fill = 'var(--pallete-text-main-600)',
    ...rest
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath="url(#clip0_1228_943)">
        <path
          d="M12 2.18286C6.57714 2.18286 2.18286 6.57828 2.18286 12C2.18286 17.4228 6.57828 21.8183 12 21.8183C17.4228 21.8183 21.8183 17.4228 21.8183 12C21.8183 6.57714 17.4228 2.18286 12 2.18286ZM0 12C0 5.37257 5.37257 0 12 0C18.6274 0 24 5.37257 24 12C24 18.6274 18.6274 24 12 24C5.37257 24 0 18.6274 0 12Z"
          fill="#ACDFF6"
        />
        <path
          d="M12.0001 4.36328C12.6024 4.36328 13.0904 4.85242 13.0904 5.45471V11.3256L16.8515 13.2056C17.391 13.4753 17.6093 14.1313 17.3395 14.6696C17.0698 15.2079 16.415 15.4273 15.8755 15.1587L11.5133 12.9759C11.143 12.7896 10.9087 12.4124 10.9087 11.9999V5.45471C10.9087 4.85242 11.3978 4.36328 12.0001 4.36328Z"
          fill="#ACDFF6"
        />
      </g>
      <defs>
        <clipPath id="clip0_1228_943">
          <rect width="24" height="24" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default ClockSky;
