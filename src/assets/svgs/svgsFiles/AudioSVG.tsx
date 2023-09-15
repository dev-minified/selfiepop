function AudioSVG(props: React.SVGAttributes<SVGElement>) {
  const { width = '22', height = '18', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M4.889 13.0698H1C0.734784 13.0698 0.48043 12.9645 0.292893 12.777C0.105357 12.5894 0 12.3351 0 12.0698V6.06985C0 5.80463 0.105357 5.55028 0.292893 5.36274C0.48043 5.1752 0.734784 5.06985 1 5.06985H4.889L10.183 0.737846C10.2563 0.677793 10.3451 0.639782 10.4391 0.628239C10.5331 0.616695 10.6284 0.632094 10.714 0.672643C10.7996 0.713192 10.872 0.777221 10.9226 0.857278C10.9732 0.937335 11.0001 1.03012 11 1.12485V17.0148C11.0001 17.1096 10.9732 17.2024 10.9226 17.2824C10.872 17.3625 10.7996 17.4265 10.714 17.467C10.6284 17.5076 10.5331 17.523 10.4391 17.5115C10.3451 17.4999 10.2563 17.4619 10.183 17.4018L4.89 13.0698H4.889ZM18.406 17.2038L16.99 15.7878C17.938 14.9444 18.6964 13.9095 19.2152 12.7515C19.734 11.5936 20.0015 10.3387 20 9.06985C20.0012 7.73594 19.7054 6.4185 19.1339 5.21322C18.5624 4.00794 17.7296 2.94508 16.696 2.10185L18.116 0.681846C19.3345 1.71339 20.3132 2.99833 20.9841 4.44704C21.6549 5.89575 22.0016 7.47336 22 9.06985C22 12.2928 20.614 15.1918 18.406 17.2038ZM14.863 13.6608L13.441 12.2388C13.9265 11.8655 14.3196 11.3856 14.5899 10.8361C14.8602 10.2866 15.0006 9.68225 15 9.06985C15 7.63985 14.25 6.38485 13.12 5.67785L14.559 4.23885C15.3165 4.79604 15.9321 5.5237 16.3562 6.36296C16.7802 7.20223 17.0008 8.12953 17 9.06985C17 10.9118 16.17 12.5598 14.863 13.6608Z"
        fill="var(--pallete-primary-main)"
      />
    </svg>
  );
}
export default AudioSVG;
