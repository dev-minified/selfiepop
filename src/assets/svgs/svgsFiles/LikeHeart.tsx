const LikeHeart = (props: React.SVGAttributes<SVGElement>) => {
  const { fill = 'var(--pallete-text-main)', ...rest } = props;
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icon-heart"
      {...rest}
    >
      <path
        d="M11.0009 1.65429C13.5848 -0.627558 17.5777 -0.551821 20.0669 1.90098C22.5551 4.35486 22.6409 8.2629 20.3265 10.812L10.9987 20L1.67308 10.812C-0.641281 8.2629 -0.554383 4.34837 1.93267 1.90098C4.42412 -0.548575 8.40935 -0.630804 11.0009 1.65429ZM18.5094 3.42979C16.8594 1.80469 14.1974 1.73869 12.4705 3.26425L11.002 4.56044L9.53243 3.26533C7.79996 1.73761 5.14351 1.80469 3.48914 3.43195C1.85017 5.04407 1.76767 7.62455 3.27795 9.32971L10.9998 16.937L18.7217 9.3308C20.233 7.62455 20.1505 5.04732 18.5094 3.42979Z"
        fill={fill}
      />
    </svg>
  );
};
export default LikeHeart;