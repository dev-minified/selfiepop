function Youtube({
  primaryColor,
  secondaryColor,
}: {
  primaryColor?: string;
  secondaryColor?: string;
}) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="40px"
      height="40px"
      viewBox="0 0 40 40"
      enableBackground="new 0 0 40 40"
      xmlSpace="preserve"
    >
      <circle
        fill={secondaryColor || 'var(--pallete-background-default)'}
        cx="20"
        cy="20"
        r="19"
      />
      <path
        fill={primaryColor || 'var(--pallete-primary-darker)'}
        d="M31.182,14.232c-0.268-1.031-1.06-1.844-2.063-2.12c-1.821-0.5-9.119-0.5-9.119-0.5s-7.298,0-9.119,0.5
	c-1.003,0.276-1.796,1.088-2.063,2.12C8.331,16.101,8.331,20,8.331,20s0,3.898,0.488,5.77c0.267,1.03,1.059,1.842,2.063,2.117
	C12.702,28.389,20,28.389,20,28.389s7.298,0,9.119-0.502c1.003-0.275,1.795-1.087,2.063-2.117c0.487-1.871,0.487-5.77,0.487-5.77
	S31.669,16.101,31.182,14.232z M17.813,24.011v-7.293l5.833,3.647L17.813,24.011z"
      />
    </svg>
  );
}
export default Youtube;
