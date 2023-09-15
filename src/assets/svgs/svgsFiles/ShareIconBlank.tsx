const ShareIconBlank = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '20', height = '20', fill = 'currentColor', ...rest } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 10C2.5 10.663 2.76339 11.2989 3.23223 11.7678C3.70107 12.2366 4.33696 12.5 5 12.5C5.66304 12.5 6.29893 12.2366 6.76777 11.7678C7.23661 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.23661 8.70107 6.76777 8.23223C6.29893 7.76339 5.66304 7.5 5 7.5C4.33696 7.5 3.70107 7.76339 3.23223 8.23223C2.76339 8.70107 2.5 9.33696 2.5 10Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5C12.5 5.66304 12.7634 6.29893 13.2322 6.76777C13.7011 7.23661 14.337 7.5 15 7.5C15.663 7.5 16.2989 7.23661 16.7678 6.76777C17.2366 6.29893 17.5 5.66304 17.5 5C17.5 4.33696 17.2366 3.70107 16.7678 3.23223C16.2989 2.76339 15.663 2.5 15 2.5C14.337 2.5 13.7011 2.76339 13.2322 3.23223C12.7634 3.70107 12.5 4.33696 12.5 5Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 15C12.5 15.663 12.7634 16.2989 13.2322 16.7678C13.7011 17.2366 14.337 17.5 15 17.5C15.663 17.5 16.2989 17.2366 16.7678 16.7678C17.2366 16.2989 17.5 15.663 17.5 15C17.5 14.337 17.2366 13.7011 16.7678 13.2322C16.2989 12.7634 15.663 12.5 15 12.5C14.337 12.5 13.7011 12.7634 13.2322 13.2322C12.7634 13.7011 12.5 14.337 12.5 15Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 8.91683L12.75 6.0835"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 11.0835L12.75 13.9168"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default ShareIconBlank;
