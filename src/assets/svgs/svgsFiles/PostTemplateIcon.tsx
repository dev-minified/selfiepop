const PostTemplateIcon = (props: React.SVGAttributes<SVGElement>) => {
  const { ...rest } = props;
  return (
    <svg
      width="23"
      height="21"
      viewBox="0 0 23 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M20.7 0L23 4.66667V19.8333C23 20.1428 22.8788 20.4395 22.6632 20.6583C22.4475 20.8771 22.155 21 21.85 21H1.15C0.845001 21 0.552494 20.8771 0.336827 20.6583C0.12116 20.4395 0 20.1428 0 19.8333V4.67133L2.3 0H20.7ZM20.7 7H2.3V18.6667H20.7V7ZM11.5 8.16667L16.1 12.8333H12.65V17.5H10.35V12.8333H6.9L11.5 8.16667ZM19.2786 2.33333H3.7214L2.57255 4.66667H11.5006H20.4286L19.2786 2.33333Z"
        fill="#A3B9CC"
      />
    </svg>
  );
};
export default PostTemplateIcon;
