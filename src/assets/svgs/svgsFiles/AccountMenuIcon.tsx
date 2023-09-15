const AccountMenuIcon = (props: IconProps) => {
  const { width = 30, height = 30, fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.84 23.5H14.16C13.45 23.5 12.873 22.922 12.873 22.213V21.35C12.726 21.301 12.58 21.246 12.438 21.188C12.294 21.129 12.153 21.064 12.013 20.995L11.403 21.605C11.16 21.848 10.837 21.982 10.493 21.982C10.149 21.982 9.826 21.848 9.584 21.605L8.396 20.417C8.153 20.174 8.019 19.85 8.019 19.507C8.019 19.163 8.153 18.84 8.397 18.597L9.007 17.987C8.937 17.847 8.871 17.705 8.813 17.562C8.755 17.419 8.7 17.275 8.651 17.127H7.787C7.077 17.127 6.5 16.55 6.5 15.84V14.16C6.5 13.45 7.077 12.873 7.787 12.873H8.65C8.699 12.726 8.754 12.58 8.813 12.438C8.873 12.294 8.937 12.153 9.007 12.013L8.396 11.403C8.152 11.16 8.019 10.837 8.019 10.493C8.019 10.149 8.153 9.826 8.397 9.583L9.584 8.395C9.827 8.152 10.15 8.018 10.494 8.018C10.838 8.018 11.161 8.152 11.404 8.395L12.014 9.006C12.154 8.936 12.295 8.871 12.438 8.812C12.58 8.754 12.726 8.699 12.873 8.65V7.787C12.873 7.077 13.45 6.5 14.16 6.5H15.84C16.549 6.5 17.127 7.077 17.127 7.787V8.65C17.274 8.699 17.419 8.754 17.562 8.812C17.705 8.872 17.847 8.936 17.987 9.006L18.597 8.395C18.84 8.152 19.163 8.018 19.507 8.018C19.85 8.018 20.174 8.152 20.417 8.395L21.605 9.583C21.848 9.825 21.982 10.148 21.982 10.492C21.982 10.836 21.848 11.159 21.605 11.402L20.995 12.012C21.064 12.152 21.13 12.293 21.188 12.436C21.246 12.579 21.301 12.724 21.35 12.872H22.213C22.922 12.872 23.5 13.449 23.5 14.159V15.839C23.5 16.549 22.922 17.126 22.213 17.126H21.35C21.301 17.273 21.246 17.418 21.188 17.561C21.13 17.704 21.064 17.846 20.995 17.986L21.605 18.596C21.848 18.839 21.982 19.162 21.982 19.505C21.982 19.849 21.848 20.173 21.605 20.416L21.595 20.426L20.417 21.604C20.174 21.847 19.85 21.981 19.507 21.981C19.163 21.981 18.84 21.847 18.597 21.604L17.987 20.994C17.847 21.063 17.706 21.128 17.563 21.187C17.42 21.246 17.275 21.3 17.127 21.349V22.212C17.127 22.922 16.549 23.5 15.84 23.5ZM14.266 22.107H15.735V20.279L16.266 20.15C16.527 20.087 16.784 20.003 17.03 19.901C17.275 19.798 17.516 19.676 17.746 19.536L18.214 19.252L19.508 20.545L20.546 19.507L19.252 18.213L19.537 17.745C19.576 17.682 19.612 17.618 19.648 17.554C19.743 17.383 19.828 17.207 19.902 17.029C20.004 16.783 20.088 16.527 20.151 16.267L20.28 15.735H22.108V14.266H20.28L20.15 13.734C20.086 13.472 20.003 13.215 19.901 12.97C19.799 12.726 19.676 12.485 19.536 12.253L19.252 11.786L20.545 10.492L19.506 9.454L18.214 10.747L17.746 10.463C17.515 10.322 17.274 10.199 17.028 10.098C16.784 9.996 16.527 9.913 16.265 9.849L15.734 9.721V7.893H14.266V9.721L13.734 9.85C13.474 9.913 13.217 9.997 12.971 10.1C12.726 10.201 12.484 10.323 12.254 10.464L11.787 10.748L10.493 9.455L9.455 10.493L10.748 11.787L10.464 12.254C10.323 12.484 10.2 12.726 10.099 12.972C9.997 13.217 9.913 13.474 9.85 13.734L9.721 14.266H7.893V15.735H9.721L9.85 16.266C9.913 16.527 9.997 16.784 10.1 17.03C10.173 17.208 10.258 17.384 10.353 17.554C10.389 17.619 10.426 17.684 10.464 17.746L10.748 18.214L9.455 19.507L10.493 20.545L11.787 19.252L12.254 19.536C12.484 19.677 12.726 19.799 12.972 19.901C13.216 20.003 13.473 20.086 13.735 20.15L14.266 20.279V22.107ZM15 18.975C14.346 18.975 13.697 18.812 13.124 18.504C12.78 18.32 12.466 18.087 12.189 17.811C11.438 17.06 11.025 16.062 11.025 15C11.025 13.938 11.438 12.94 12.189 12.189C12.94 11.438 13.938 11.025 15 11.025C16.062 11.025 17.06 11.438 17.811 12.189C18.561 12.94 18.975 13.938 18.975 15C18.975 16.062 18.561 17.06 17.811 17.811C17.535 18.087 17.22 18.321 16.876 18.504C16.303 18.812 15.654 18.975 15 18.975ZM15 12.418C14.311 12.418 13.662 12.687 13.175 13.175C12.687 13.662 12.418 14.311 12.418 15C12.418 15.689 12.687 16.338 13.175 16.826C13.355 17.005 13.559 17.157 13.782 17.276C14.153 17.476 14.575 17.582 15 17.582C15.431 17.582 15.841 17.479 16.218 17.276C16.442 17.158 16.646 17.005 16.826 16.826C17.313 16.338 17.582 15.689 17.582 15C17.582 14.311 17.313 13.662 16.826 13.175C16.338 12.687 15.689 12.418 15 12.418Z"
        fill={fill}
      />
    </svg>
  );
};
export default AccountMenuIcon;
