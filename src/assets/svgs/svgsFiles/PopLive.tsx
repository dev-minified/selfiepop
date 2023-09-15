const PopLive = ({
  primaryColor,
  secondaryColor,
}: {
  primaryColor?: string;
  secondaryColor?: string;
}) => {
  const primary = 'var(--pallete-primary-main)';
  const seconday = 'var(--pallete-background-default)';
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
      className="poplive"
    >
      <g id="Layer_1" fill={sc}>
        <path
          d="M30.555,23.17c0.981,0,1.779-0.812,1.779-1.813v-1.813c0-1.003-0.798-1.813-1.779-1.813c-0.98,0-1.774,0.812-1.774,1.813
     v1.813C28.779,22.358,29.574,23.17,30.555,23.17z"
        />
        <path
          d="M23.445,23.17c0.983,0,1.778-0.812,1.778-1.813v-1.813c0-1.003-0.796-1.813-1.778-1.813s-1.778,0.812-1.778,1.813v1.813
     C21.667,22.358,22.463,23.17,23.445,23.17z"
        />
        <path
          d="M0,0v54h54V0H0z M37.667,37.064h-6.521l-6.639,5.07c-0.311,0.246-0.688,0.366-1.065,0.366c-0.272,0-0.543-0.063-0.797-0.19
     c-0.599-0.31-0.98-0.937-0.98-1.623v-3.623h-5.333c-2.943,0-5.334-2.439-5.334-5.438V18.94c0-3,2.392-5.438,5.333-5.438h21.334
     c2.938,0,5.333,2.437,5.333,5.437v12.687H43C43,34.626,40.607,37.064,37.667,37.064z"
        />
        <path
          d="M31.247,27.131c-2.535,1.982-5.965,1.982-8.502,0c-0.779-0.617-1.894-0.458-2.494,0.337
     c-0.596,0.793-0.447,1.929,0.331,2.538c1.896,1.48,4.114,2.266,6.416,2.266c2.302,0,4.52-0.784,6.415-2.266
     c0.78-0.609,0.928-1.745,0.33-2.538C33.146,26.676,32.031,26.515,31.247,27.131z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M42.999,18.939c0-3-2.396-5.437-5.333-5.437H16.332c-2.941,0-5.333,2.438-5.333,5.438v12.686
     c0,2.999,2.391,5.438,5.334,5.438h5.333v3.623c0,0.687,0.381,1.313,0.98,1.623c0.254,0.127,0.525,0.19,0.797,0.19
     c0.377,0,0.754-0.12,1.065-0.366l6.639-5.07h6.521c2.94,0,5.333-2.438,5.333-5.438h-0.001V18.939z M28.78,19.544
     c0-1.001,0.794-1.813,1.774-1.813c0.981,0,1.779,0.81,1.779,1.813v1.813c0,1.001-0.798,1.813-1.779,1.813
     c-0.98,0-1.775-0.812-1.774-1.813V19.544z M21.667,19.544c0-1.001,0.796-1.813,1.778-1.813s1.778,0.81,1.778,1.813v1.813
     c0,1.001-0.795,1.813-1.778,1.813c-0.982,0-1.778-0.812-1.778-1.813V19.544z M33.413,30.006c-1.896,1.481-4.113,2.266-6.415,2.266
     c-2.302,0-4.52-0.785-6.416-2.266c-0.778-0.609-0.927-1.745-0.331-2.538c0.6-0.795,1.715-0.954,2.494-0.337
     c2.537,1.982,5.967,1.982,8.502,0c0.784-0.616,1.899-0.455,2.496,0.337C34.341,28.261,34.193,29.396,33.413,30.006z"
        />
      </g>
    </svg>
  );
};
export default PopLive;