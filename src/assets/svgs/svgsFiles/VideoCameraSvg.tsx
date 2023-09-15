const VideoCameraSvg = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '20', height = '14', fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 4.99963L17.553 2.72363C17.7054 2.64747 17.8748 2.61151 18.045 2.61918C18.2152 2.62684 18.3806 2.67788 18.5256 2.76744C18.6706 2.85699 18.7902 2.98211 18.8733 3.1309C18.9563 3.2797 18.9999 3.44724 19 3.61763V10.3816C18.9999 10.552 18.9563 10.7196 18.8733 10.8684C18.7902 11.0172 18.6706 11.1423 18.5256 11.2318C18.3806 11.3214 18.2152 11.3724 18.045 11.3801C17.8748 11.3878 17.7054 11.3518 17.553 11.2756L13 8.99963V4.99963Z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 1H3C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13H11C12.1046 13 13 12.1046 13 11V3C13 1.89543 12.1046 1 11 1Z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default VideoCameraSvg;
