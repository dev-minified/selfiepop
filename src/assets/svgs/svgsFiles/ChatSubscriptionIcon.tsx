const primary = 'var(--pallete-primary-main)';
const seconday = 'white';
const ChatSubscriptionIcon = ({
  primaryColor,
  secondaryColor,
}: {
  primaryColor?: string;
  secondaryColor?: string;
}) => {
  const pc = primaryColor || primary;
  const sc = secondaryColor || seconday;
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="54px"
      height="54px"
      viewBox="0 0 54 54"
      enableBackground="new 0 0 54 54"
      xmlSpace="preserve"
    >
      <g id="Layer_1" fill={sc}>
        <path
          d="M0,0v54h54V0H0z M11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5
		L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5L11.5,11.5z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M11.3,14.2c2-2,4.6-3.1,7.4-3.2c2.8-0.1,5.5,0.9,7.7,2.7c2.1-1.8,4.9-2.8,7.7-2.7c2.8,0.1,5.5,1.3,7.4,3.2
		c2,2,3.1,4.6,3.3,7.4c0.1,2.8-0.8,5.5-2.7,7.6L28.8,42.6c-0.6,0.6-1.4,1-2.3,1c-0.9,0-1.7-0.3-2.4-0.8L24,42.6L10.7,29.3
		c-1.8-2.1-2.8-4.8-2.7-7.6C8.1,18.9,9.3,16.2,11.3,14.2z M13.7,16.7c-1.4,1.4-2.2,3.3-2.3,5.2c0,2,0.7,3.9,2,5.3l0.2,0.3l12.7,12.7
		l9.1-9l-6-6l-1.8,1.8c-0.5,0.5-1,0.9-1.7,1.1c-0.6,0.3-1.3,0.4-2,0.4c-1.4,0-2.7-0.5-3.6-1.5c-1-1-1.5-2.3-1.5-3.6
		c0-1.4,0.5-2.7,1.5-3.6l3.6-3.6c-1.4-1.1-3.2-1.7-5.1-1.7c-1.8,0.1-3.6,0.8-4.9,2L13.7,16.7z M28.2,21.5c0.3-0.3,0.8-0.5,1.2-0.5
		c0.5,0,0.9,0.2,1.2,0.5l7.3,7.2l1.2-1.2c1.4-1.4,2.2-3.3,2.3-5.3c0-2-0.7-3.9-2.1-5.4c-1.4-1.4-3.3-2.3-5.3-2.4c-2-0.1-4,0.6-5.5,2
		l-0.3,0.2l-5.4,5.4c-0.3,0.3-0.5,0.7-0.5,1.1c0,0.4,0.1,0.8,0.4,1.2l0.1,0.1c0.3,0.3,0.7,0.5,1.1,0.5c0.4,0,0.8-0.1,1.2-0.4
		l0.1-0.1L28.2,21.5z"
        />
      </g>
    </svg>
  );
};
export default ChatSubscriptionIcon;
