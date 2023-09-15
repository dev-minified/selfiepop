import { ChevronRight } from 'assets/svgs';
import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  icon?: string | ReactNode | ReactElement;
  title?: string;
  subtitle?: string;
}

export const PopWidget = ({ className, icon, title, subtitle }: Props) => {
  return (
    <div className={className}>
      <div className="icon">
        {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
      </div>
      <div className="text-holder">
        <div className="text-box">
          <h5>{title}</h5>
          <p>{subtitle}</p>
          <span className="arrow">
            <ChevronRight />
          </span>
        </div>
      </div>
    </div>
  );
};

export default styled(PopWidget)`
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 23px 30px 23px 0;

  @media (max-width: 767px) {
    padding: 15px 20px 15px 0;
  }

  .icon {
    width: 54px;

    @media (max-width: 767px) {
      width: 34px;
    }

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .text-holder {
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0 0 0 15px;

    @media (max-width: 767px) {
      padding: 0 0 0 10px;
    }
  }

  .arrow {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    color: #a3a3a4;
  }

  p {
    margin: 0;
  }

  h5 {
    font-weight: 500;
    margin: 2px 0 1px;
  }
`;
