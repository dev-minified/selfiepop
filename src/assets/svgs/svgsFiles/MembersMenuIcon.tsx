const MembersMenuIcon = (props: IconProps) => {
  const {
    width = 30,
    height = 30,
    fill = 'var(--pallete-primary-main)',
    ...rest
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <mask
        id="mask0_1626_7455"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="4"
        y="4"
        width="22"
        height="22"
      >
        <rect x="4" y="4" width="22" height="22" fill={fill} />
      </mask>
      <g mask="url(#mask0_1626_7455)">
        <path
          d="M4.91666 22.3333V19.7666C4.91666 19.2472 5.05034 18.7698 5.3177 18.3343C5.58506 17.8989 5.94027 17.5666 6.38332 17.3375C7.33055 16.8638 8.29305 16.5086 9.27082 16.2718C10.2486 16.035 11.2417 15.9166 12.25 15.9166C13.2583 15.9166 14.2514 16.035 15.2292 16.2718C16.2069 16.5086 17.1694 16.8638 18.1167 17.3375C18.5597 17.5666 18.9149 17.8989 19.1823 18.3343C19.4496 18.7698 19.5833 19.2472 19.5833 19.7666V22.3333H4.91666ZM21.4167 22.3333V19.5833C21.4167 18.9111 21.2295 18.2656 20.8552 17.6468C20.4809 17.0281 19.95 16.4972 19.2625 16.0541C20.0417 16.1458 20.775 16.3024 21.4625 16.5239C22.15 16.7454 22.7917 17.0166 23.3875 17.3375C23.9375 17.643 24.3576 17.9829 24.6479 18.3573C24.9382 18.7316 25.0833 19.1402 25.0833 19.5833V22.3333H21.4167ZM12.25 15C11.2417 15 10.3785 14.6409 9.66041 13.9229C8.94235 13.2048 8.58332 12.3416 8.58332 11.3333C8.58332 10.325 8.94235 9.46176 9.66041 8.74371C10.3785 8.02565 11.2417 7.66663 12.25 7.66663C13.2583 7.66663 14.1215 8.02565 14.8396 8.74371C15.5576 9.46176 15.9167 10.325 15.9167 11.3333C15.9167 12.3416 15.5576 13.2048 14.8396 13.9229C14.1215 14.6409 13.2583 15 12.25 15ZM21.4167 11.3333C21.4167 12.3416 21.0576 13.2048 20.3396 13.9229C19.6215 14.6409 18.7583 15 17.75 15C17.5819 15 17.368 14.9809 17.1083 14.9427C16.8486 14.9045 16.6347 14.8625 16.4667 14.8166C16.8792 14.3277 17.1962 13.7854 17.4177 13.1895C17.6392 12.5937 17.75 11.975 17.75 11.3333C17.75 10.6916 17.6392 10.0729 17.4177 9.47704C17.1962 8.88121 16.8792 8.33885 16.4667 7.84996C16.6805 7.77357 16.8944 7.72392 17.1083 7.701C17.3222 7.67808 17.5361 7.66663 17.75 7.66663C18.7583 7.66663 19.6215 8.02565 20.3396 8.74371C21.0576 9.46176 21.4167 10.325 21.4167 11.3333ZM6.74999 20.5H17.75V19.7666C17.75 19.5986 17.708 19.4458 17.6239 19.3083C17.5399 19.1708 17.4292 19.0638 17.2917 18.9875C16.4667 18.575 15.634 18.2656 14.7937 18.0593C13.9535 17.8531 13.1055 17.75 12.25 17.75C11.3944 17.75 10.5465 17.8531 9.70624 18.0593C8.86596 18.2656 8.03332 18.575 7.20832 18.9875C7.07082 19.0638 6.96006 19.1708 6.87603 19.3083C6.792 19.4458 6.74999 19.5986 6.74999 19.7666V20.5ZM12.25 13.1666C12.7542 13.1666 13.1858 12.9871 13.5448 12.6281C13.9038 12.2691 14.0833 11.8375 14.0833 11.3333C14.0833 10.8291 13.9038 10.3975 13.5448 10.0385C13.1858 9.67947 12.7542 9.49996 12.25 9.49996C11.7458 9.49996 11.3142 9.67947 10.9552 10.0385C10.5962 10.3975 10.4167 10.8291 10.4167 11.3333C10.4167 11.8375 10.5962 12.2691 10.9552 12.6281C11.3142 12.9871 11.7458 13.1666 12.25 13.1666Z"
          fill="white"
        />
      </g>
    </svg>
  );
};
export default MembersMenuIcon;
