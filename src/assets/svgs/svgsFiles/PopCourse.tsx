const PopCourse = (props: any) => {
  const primary = 'var(--pallete-primary-main)';
  const seconday = 'white';
  const {
    primaryColor: pc = primary,
    secondaryColor: sc = seconday,
    ...rest
  } = props;
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 54 54"
      enableBackground="new 0 0 54 54"
      xmlSpace="preserve"
      {...rest}
    >
      <g id="Layer_1" fill={sc}>
        <path
          d="M0,0v54h54V0H0z M41,16.947c0,14.187-7.761,20.632-17.333,20.632h-2.747c0.306-4.439,1.661-7.125,5.197-10.317
		c1.739-1.57,1.592-2.476,0.735-1.956c-5.899,3.581-8.828,8.421-8.958,16.149L17.889,42H15c0-2.009,0.168-3.832,0.5-5.5
		c-0.332-1.907-0.5-4.495-0.5-7.763C15,20.598,21.467,14,29.444,14c2.889,0,5.778,1.474,11.556,0V16.947z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M29.444,14C21.467,14,15,20.598,15,28.737c0,3.269,0.168,5.857,0.5,7.763C15.168,38.168,15,39.991,15,42
		h2.889l0.004-0.545c0.13-7.728,3.059-12.568,8.958-16.149c0.857-0.52,1.004,0.386-0.735,1.956
		c-3.536,3.192-4.891,5.878-5.197,10.317h2.747C33.239,37.579,41,31.135,41,16.947V14C35.222,15.474,32.333,14,29.444,14z"
        />
      </g>
    </svg>
  );
};
export default PopCourse;
