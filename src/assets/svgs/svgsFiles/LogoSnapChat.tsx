const LogoSnapChat = (props: IconProps) => {
  // const pc = props?.primaryColor || primary;
  // const sc = props?.secondaryColor || seconday;
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
          d="M0,0v54h54V0H0z M43.887,35.111c-0.202,0.474-1.114,1.147-4.304,1.641c-0.261,0.04-0.362,0.381-0.517,1.095
		c-0.057,0.26-0.114,0.515-0.193,0.784c-0.068,0.233-0.213,0.342-0.456,0.342h-0.04c-0.169,0-0.409-0.03-0.714-0.09
		c-0.54-0.106-1.146-0.204-1.916-0.204c-0.45,0-0.915,0.039-1.383,0.117c-0.957,0.16-1.769,0.735-2.63,1.345
		c-1.25,0.886-2.541,1.801-4.552,1.801c-0.088,0-0.173-0.003-0.259-0.007h0c-0.055,0.004-0.112,0.007-0.169,0.007
		c-2.011,0-3.301-0.915-4.549-1.799c-0.862-0.611-1.675-1.187-2.633-1.347c-0.467-0.078-0.933-0.117-1.383-0.117
		c-0.81,0-1.449,0.125-1.916,0.217c-0.284,0.056-0.528,0.103-0.714,0.103c-0.194,0-0.405-0.042-0.496-0.356
		c-0.08-0.271-0.137-0.534-0.192-0.789c-0.143-0.654-0.244-1.057-0.517-1.099c-3.189-0.494-4.102-1.167-4.305-1.645
		c-0.029-0.068-0.045-0.137-0.049-0.205c-0.01-0.183,0.119-0.346,0.3-0.375c4.902-0.809,7.1-5.833,7.191-6.046
		c0.003-0.006,0.005-0.012,0.008-0.018c0.3-0.61,0.359-1.139,0.175-1.573c-0.336-0.795-1.434-1.144-2.16-1.375
		c-0.178-0.056-0.346-0.11-0.479-0.162c-1.449-0.575-1.57-1.164-1.513-1.465c0.097-0.512,0.78-0.869,1.332-0.869
		c0.151,0,0.285,0.027,0.397,0.079c0.652,0.306,1.24,0.461,1.746,0.461c0.701,0,1.006-0.295,1.044-0.334
		c-0.018-0.333-0.04-0.68-0.062-1.039c-0.146-2.324-0.327-5.211,0.406-6.86c2.198-4.941,6.858-5.324,8.233-5.324
		c0.035,0,0.603-0.006,0.603-0.006l0.081,0c1.379,0,6.049,0.385,8.248,5.328c0.733,1.649,0.552,4.539,0.406,6.861l-0.006,0.101
		c-0.02,0.323-0.04,0.638-0.056,0.939c0.035,0.036,0.316,0.307,0.951,0.332h0.001c0.483-0.018,1.037-0.173,1.646-0.459
		C38.672,23.018,38.87,23,39.005,23c0.206,0,0.415,0.04,0.588,0.113l0.01,0.004c0.492,0.175,0.815,0.521,0.822,0.882
		c0.006,0.34-0.253,0.852-1.524,1.356c-0.132,0.052-0.3,0.106-0.479,0.162c-0.727,0.231-1.824,0.58-2.16,1.375
		c-0.184,0.434-0.125,0.962,0.175,1.572c0.003,0.006,0.006,0.012,0.008,0.018c0.091,0.213,2.287,5.235,7.191,6.046
		c0.181,0.03,0.31,0.192,0.301,0.376C43.933,34.974,43.916,35.043,43.887,35.111z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M43.636,34.529c-4.904-0.81-7.1-5.833-7.191-6.046c-0.002-0.006-0.005-0.012-0.008-0.018
		c-0.3-0.61-0.359-1.139-0.175-1.572c0.336-0.795,1.433-1.144,2.16-1.375c0.178-0.057,0.347-0.11,0.479-0.162
		c1.272-0.504,1.531-1.016,1.524-1.356c-0.007-0.362-0.329-0.708-0.822-0.882l-0.01-0.004C39.419,23.041,39.211,23,39.005,23
		c-0.135,0-0.333,0.018-0.511,0.101c-0.609,0.286-1.163,0.44-1.646,0.459h-0.001c-0.635-0.024-0.916-0.296-0.951-0.332
		c0.016-0.301,0.036-0.615,0.056-0.939l0.006-0.101c0.146-2.322,0.328-5.212-0.406-6.861C33.353,10.385,28.683,10,27.304,10
		l-0.081,0c0,0-0.568,0.006-0.603,0.006c-1.376,0-6.036,0.384-8.233,5.324c-0.733,1.648-0.552,4.536-0.406,6.86
		c0.022,0.359,0.045,0.706,0.062,1.039c-0.037,0.039-0.343,0.334-1.044,0.334c-0.507,0-1.095-0.155-1.746-0.461
		c-0.112-0.052-0.245-0.079-0.397-0.079c-0.552,0-1.234,0.357-1.332,0.869c-0.057,0.301,0.064,0.89,1.513,1.465
		c0.133,0.053,0.301,0.106,0.479,0.162c0.726,0.231,1.823,0.58,2.16,1.375c0.184,0.434,0.125,0.963-0.175,1.573
		c-0.003,0.006-0.005,0.012-0.008,0.018c-0.091,0.213-2.289,5.237-7.191,6.046c-0.181,0.03-0.31,0.192-0.3,0.375
		c0.004,0.068,0.02,0.136,0.049,0.205c0.203,0.478,1.116,1.151,4.305,1.645c0.274,0.042,0.375,0.445,0.517,1.099
		c0.055,0.254,0.113,0.517,0.192,0.789c0.091,0.313,0.302,0.356,0.496,0.356c0.186,0,0.431-0.048,0.714-0.103
		c0.466-0.091,1.106-0.217,1.916-0.217c0.45,0,0.915,0.039,1.383,0.117c0.958,0.16,1.771,0.736,2.633,1.347
		c1.248,0.885,2.538,1.799,4.549,1.799c0.057,0,0.115-0.002,0.169-0.007h0c0.086,0.004,0.172,0.007,0.259,0.007
		c2.011,0,3.301-0.915,4.552-1.801c0.86-0.61,1.673-1.185,2.63-1.345c0.468-0.078,0.933-0.117,1.383-0.117
		c0.77,0,1.376,0.098,1.916,0.204c0.305,0.06,0.545,0.09,0.714,0.09h0.04c0.244,0,0.388-0.109,0.456-0.342
		c0.079-0.268,0.136-0.524,0.193-0.784c0.156-0.714,0.256-1.055,0.517-1.095c3.19-0.494,4.102-1.167,4.304-1.641
		c0.029-0.068,0.046-0.137,0.05-0.206C43.947,34.721,43.818,34.559,43.636,34.529z"
        />
      </g>
    </svg>
  );
};
export default LogoSnapChat;