import { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  spinnerClass?: string;
  message?: string;
}

function Spinner({
  className,
  spinnerClass = '',
  message,
}: Props): ReactElement {
  return (
    <div className={`${className} ${spinnerClass}`}>
      <div>
        <div className="lds-dual-ring"></div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default styled(Spinner)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  text-align: center;
  p {
    color: white;
    font-size: 2rem;
  }
  .lds-dual-ring {
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .lds-dual-ring:after {
    content: ' ';
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
