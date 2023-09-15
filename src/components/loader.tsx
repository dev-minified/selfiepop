import { useAppSelector } from 'hooks/useAppSelector';
import styled from 'styled-components';
import Logo from 'theme/logo';

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
    width: 260px;
    display: block;
    -webkit-animation: animateScale 2s ease-in-out infinite alternate;
    animation: animateScale 2s ease-in-out infinite alternate;
  }

  .loading-logo svg {
    width: 100%;
    height: auto;
    vertical-align: top;
  }

  ${({ isLoading }) =>
    isLoading &&
    `opacity: 1;
  visibility: visible;`}

  @-webkit-keyframes animateScale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    100% {
      -webkit-transform: scale(1.4);
      transform: scale(1.4);
    }
  }

  @keyframes animateScale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    100% {
      -webkit-transform: scale(1.4);
      transform: scale(1.4);
    }
  }
`;

export default function Loader(props: { loading?: boolean }) {
  const loading = useAppSelector((state) => state.global?.loading);

  return (
    <StyledLoader isLoading={props.loading ?? loading} className="pre-loader">
      <div className="pre-loader-holder">
        <strong className="loading-logo">
          <Logo />
        </strong>
      </div>
    </StyledLoader>
  );
}
export const WhatsAppLoader = styled.div`
  z-index: 9;
  display: flex;
  padding-bottom: 1rem;
  justify-content: center;

  -moz-user-select: none;
  -webkit-user-select: none;
`;
