const LeafIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '21', height = '18' } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 4V6.5C21 10.09 17.9445 13 14.175 13H11.55V18H9.45V11L9.46995 10C9.7377 6.644 12.6829 4 16.275 4H21ZM4.2 0C7.4466 0 10.2018 2.005 11.1751 4.786C9.60015 6.061 8.56065 7.914 8.4168 10H7.35C3.2907 10 0 6.866 0 3V0H4.2Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default LeafIcon;
