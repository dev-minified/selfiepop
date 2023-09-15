import { useAppSelector } from 'hooks/useAppSelector';
import styled from 'styled-components';

const StyledLoader = styled.div<{ isLoading: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgb(0 0 0 / 32%);
  z-index: 99;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-transition: all 0.4s ease;
  transition: all 0.4s ease;
  opacity: 0;
  visibility: hidden;

  .loading-logo {
    width: 3em;
    display: block;
    -webkit-animation: animateScale 2s ease-in-out infinite alternate;
    animation: animateScale 2s ease-in-out infinite alternate;
    .pl {
      /* display: block; */
      /* width: 1em;
      height: 1em; */
    }
    .pl__ring,
    .pl__ball {
      animation: ring 2s ease-out infinite;
    }
    .pl__ball {
      animation-name: ball;
    }
  }

  .loading-logo svg {
    display: block;
    width: 100%;
    height: auto;
    vertical-align: top;
  }

  ${({ isLoading }) =>
    isLoading &&
    `opacity: 1;
  visibility: visible;`}

  /* Animation */
@keyframes ring {
    from {
      stroke-dasharray: 0 257 0 0 1 0 0 258;
    }
    25% {
      stroke-dasharray: 0 0 0 0 257 0 258 0;
    }
    50%,
    to {
      stroke-dasharray: 0 0 0 0 0 515 0 0;
    }
  }
  @keyframes ball {
    from,
    50% {
      animation-timing-function: ease-in;
      stroke-dashoffset: 1;
    }
    64% {
      animation-timing-function: ease-in;
      stroke-dashoffset: -109;
    }
    78% {
      animation-timing-function: ease-in;
      stroke-dashoffset: -145;
    }
    92% {
      animation-timing-function: ease-in;
      stroke-dashoffset: -157;
    }
    57%,
    71%,
    85%,
    99%,
    to {
      animation-timing-function: ease-out;
      stroke-dashoffset: -163;
    }
  }
`;

export default function Loader(props: { loading?: boolean }) {
  const loading = useAppSelector((state) => state.global?.loading);

  return (
    <StyledLoader isLoading={props.loading ?? loading} className="pre-loader">
      <div className="pre-loader-holder">
        <strong className="loading-logo">
          <svg
            className="pl"
            viewBox="0 0 200 200"
            width="200"
            height="200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
                <stop offset="0%" stopColor="hsl(332,87%,48%)" />
                <stop offset="100%" stopColor="hsl(0,0%,20%)" />
              </linearGradient>
              <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(332,87%,48%)" />
                <stop offset="100%" stopColor="hsl(331,88%,19%)" />
              </linearGradient>
            </defs>
            <circle
              className="pl__ring"
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="url(#pl-grad1)"
              strokeWidth="36"
              strokeDasharray="0 257 1 257"
              strokeDashoffset="0.01"
              strokeLinecap="round"
              transform="rotate(-90,100,100)"
            />
            <line
              className="pl__ball"
              stroke="url(#pl-grad2)"
              x1="100"
              y1="18"
              x2="100.01"
              y2="182"
              strokeWidth="36"
              strokeDasharray="1 165"
              strokeLinecap="round"
            />
          </svg>
        </strong>
      </div>
    </StyledLoader>
  );
}
type RequestLoaderPorps = IconProps & {
  children?: any;
  isLoading: boolean;
};
const RequstLoderSel = styled.div<{
  isLoading: boolean;
}>`
  width: 100%;

  display: block;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-animation: animateScale 2s ease-in-out infinite alternate;
  animation: animateScale 2s ease-in-out infinite alternate;
  .pl {
    /* display: block; */
    /* width: 1em;
      height: 1em; */
  }
  .pl__ring,
  .pl__ball {
    animation: ring 2s ease-out infinite;
  }
  .pl__ball {
    animation-name: ball;
  }

  svg {
    display: block;
    /* width: 100%; */
    height: auto;
    vertical-align: top;
  }

  ${({ isLoading }) =>
    isLoading &&
    `opacity: 1;
  visibility: visible;`}

  /* Animation */
@keyframes ring {
    from {
      stroke-dasharray: 0 257 0 0 1 0 0 258;
    }
    25% {
      stroke-dasharray: 0 0 0 0 257 0 258 0;
    }
    50%,
    to {
      stroke-dasharray: 0 0 0 0 0 515 0 0;
    }
  }
  @keyframes ball {
    from,
    50% {
      animation-timing-function: ease-in;
      stroke-dashoffset: 1;
    }
    64% {
      animation-timing-function: ease-in;
      stroke-dashoffset: -109;
    }
    78% {
      animation-timing-function: ease-in;
      stroke-dashoffset: -145;
    }
    92% {
      animation-timing-function: ease-in;
      stroke-dashoffset: -157;
    }
    57%,
    71%,
    85%,
    99%,
    to {
      animation-timing-function: ease-out;
      stroke-dashoffset: -163;
    }
  }
`;
export const RequestLoader = (props: RequestLoaderPorps) => {
  const {
    width = 28,
    height = 28,
    children,
    isLoading,
    className = '',

    ...rest
  } = props;
  return isLoading ? (
    <RequstLoderSel
      isLoading={isLoading}
      className={`pre-loader ${className}`}
      // wwidth={width}
      // hheight={height}
    >
      <svg
        className="pl"
        viewBox="0 0 200 200"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <defs>
          <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stopColor="hsl(332,87%,48%)" />
            <stop offset="100%" stopColor="hsl(0,0%,20%)" />
          </linearGradient>
          <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(332,87%,48%)" />
            <stop offset="100%" stopColor="hsl(331,88%,19%)" />
          </linearGradient>
        </defs>
        <circle
          className="pl__ring"
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke="url(#pl-grad1)"
          strokeWidth="36"
          strokeDasharray="0 257 1 257"
          strokeDashoffset="0.01"
          strokeLinecap="round"
          transform="rotate(-90,100,100)"
        />
        <line
          className="pl__ball"
          stroke="url(#pl-grad2)"
          x1="100"
          y1="18"
          x2="100.01"
          y2="182"
          strokeWidth="36"
          strokeDasharray="1 165"
          strokeLinecap="round"
        />
      </svg>
    </RequstLoderSel>
  ) : children ? (
    children
  ) : null;
};
