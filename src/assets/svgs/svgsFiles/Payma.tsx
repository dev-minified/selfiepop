const Payma = ({
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
    >
      <g id="Layer_1" fill={sc}>
        <path
          d="M27.146,17.661c-1.607,0-2.899,0.415-3.879,1.242c-0.978,0.829-1.473,1.953-1.492,3.376h3.007
     c0-0.667,0.217-1.193,0.651-1.579c0.433-0.389,1.004-0.583,1.713-0.583c0.742,0,1.306,0.201,1.69,0.596
     c0.384,0.395,0.573,0.972,0.573,1.724c0,0.568-0.164,1.096-0.495,1.587c-0.215,0.32-0.722,0.861-1.526,1.62
     c-0.805,0.76-1.344,1.454-1.615,2.092c-0.273,0.635-0.41,1.483-0.41,2.556h2.811c0.014-1.158,0.295-2.041,0.84-2.642l1.521-1.458
     c1.257-1.27,1.883-2.559,1.885-3.867c0-1.47-0.46-2.616-1.39-3.435C30.102,18.071,28.807,17.661,27.146,17.661z"
        />
        <path
          d="M26.848,32.445c-0.52,0-0.932,0.146-1.236,0.438c-0.305,0.291-0.459,0.674-0.459,1.146c0,0.436,0.146,0.807,0.439,1.103
     c0.295,0.295,0.711,0.445,1.256,0.445c0.547,0,0.963-0.15,1.262-0.445c0.299-0.298,0.447-0.665,0.447-1.101
     c0-0.455-0.154-0.834-0.459-1.133C27.794,32.598,27.375,32.445,26.848,32.445z"
        />
        <path
          d="M0,0v54h54V0H0z M40.48,39.087c0.312,1.129,0.655,2.237,0.908,3.411c-0.021,0-0.053,0-0.074,0.002
     c-1.071-0.387-2.238-0.831-3.545-1.275c-1.142-0.389-2.574-1.076-3.774-1.045c-0.099,0.004-0.185,0.028-0.282,0.043
     c0.018-0.008,0.032-0.019,0.049-0.026c-2.046,0.971-4.334,1.53-6.762,1.53c-8.561,0-15.5-6.771-15.5-15.113
     C11.5,18.265,18.439,11.5,27,11.5c8.559,0,15.5,6.764,15.5,15.112c0,3.188-1.02,6.141-2.748,8.579
     c-0.05,0.136-0.091,0.271-0.104,0.41C39.557,36.729,40.168,37.949,40.48,39.087z"
        />
      </g>
      <g id="Layer_2" fill={pc}>
        <path
          d="M39.752,35.191C41.48,32.753,42.5,29.8,42.5,26.612C42.5,18.264,35.559,11.5,27,11.5
     c-8.561,0-15.5,6.765-15.5,15.113c0,8.343,6.939,15.113,15.5,15.113c2.428,0,4.716-0.56,6.762-1.53
     c-0.017,0.008-0.031,0.019-0.049,0.026c0.098-0.015,0.184-0.039,0.282-0.043c1.2-0.031,2.633,0.656,3.774,1.045
     c1.307,0.444,2.474,0.889,3.545,1.275c0.021-0.002,0.053-0.002,0.074-0.002c-0.253-1.174-0.597-2.282-0.908-3.411
     c-0.313-1.138-0.924-2.358-0.832-3.485C39.661,35.462,39.702,35.327,39.752,35.191z M28.109,35.132
     c-0.299,0.295-0.715,0.445-1.262,0.445c-0.545,0-0.961-0.15-1.256-0.445c-0.293-0.296-0.439-0.667-0.439-1.103
     c0-0.473,0.154-0.855,0.459-1.146c0.305-0.292,0.717-0.438,1.236-0.438c0.527,0,0.946,0.152,1.25,0.453
     c0.305,0.299,0.459,0.678,0.459,1.133C28.557,34.467,28.408,34.834,28.109,35.132z M30.535,26.192l-1.521,1.458
     c-0.545,0.601-0.826,1.483-0.84,2.642h-2.811c0-1.072,0.137-1.921,0.41-2.556c0.271-0.638,0.811-1.332,1.615-2.092
     c0.805-0.759,1.312-1.3,1.526-1.62c0.331-0.491,0.495-1.019,0.495-1.587c0-0.752-0.189-1.329-0.573-1.724
     c-0.385-0.395-0.948-0.596-1.69-0.596c-0.709,0-1.28,0.194-1.713,0.583c-0.435,0.386-0.651,0.912-0.651,1.579h-3.007
     c0.02-1.423,0.515-2.547,1.492-3.376c0.979-0.827,2.271-1.242,3.879-1.242c1.66,0,2.955,0.41,3.884,1.229
     c0.93,0.819,1.39,1.965,1.39,3.435C32.418,23.633,31.792,24.922,30.535,26.192z"
        />
      </g>
    </svg>
  );
};
export default Payma;