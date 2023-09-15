const AAlphabet = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <path
        d="M50 99.1666C77.154 99.1666 99.1667 77.1539 99.1667 49.9999C99.1667 22.8459 77.154 0.833252 50 0.833252C22.846 0.833252 0.833313 22.8459 0.833313 49.9999C0.833313 77.1539 22.846 99.1666 50 99.1666Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.8467 25.9984C39.4454 25.1428 41.3852 25.2366 42.8939 26.2424L72.3939 45.9091C73.7618 46.8209 74.5833 48.3561 74.5833 50C74.5833 51.6439 73.7618 53.179 72.3939 54.0909L42.8939 73.7575C41.3852 74.7634 39.4454 74.8571 37.8467 74.0015C36.248 73.1459 35.25 71.4799 35.25 69.6666V30.3333C35.25 28.5201 36.248 26.854 37.8467 25.9984Z"
        fill="url(#paint0_linear)"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="35.25"
          y1="39.9926"
          x2="76.0786"
          y2="40.3766"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FA5853" />
          <stop offset="0.497534" stopColor="#F46692" />
          <stop offset="1" stopColor="#FFC444" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default AAlphabet;
