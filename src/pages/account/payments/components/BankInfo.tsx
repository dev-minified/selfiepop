import { ClockSky, GreenDollarSign } from 'assets/svgs';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/bank-info.css';
import 'styles/section-head.css';

interface IBankInfoProps {
  withdrawalPending: string | number;
  withdrawalAvailable: string | number;
  className?: string;
  showWithdrawal?: boolean;
}

const BankInfo: React.FC<IBankInfoProps> = (props) => {
  const {
    withdrawalAvailable,
    withdrawalPending,
    className,
    showWithdrawal = true,
  } = props;
  return (
    <div className={className}>
      {/* <h3 className="section-title">
        <span className="title-icon">
          <Wallet />
        </span>
        Wallet
      </h3> */}
      <div className="bank-info mb-30">
        <div className="box pending">
          <span className="icon-holder">
            <ClockSky />
          </span>
          {/* <span className="icon-time"></span> */}
          <div className="textbox">
            <strong className="amount">
              ${(Number(withdrawalPending) || 0).toFixed(2)}
            </strong>
            <span className="status">Pending</span>
          </div>
        </div>
        {!showWithdrawal ? (
          <Link to={'/account/payments/withdraw'} className="box available">
            <span className="icon-holder">
              <GreenDollarSign />
            </span>
            {/* <span className="icon-dollar"></span> */}
            <div className="textbox">
              <strong className="amount">
                ${(Number(withdrawalAvailable) || 0).toFixed(2)}
              </strong>
              <span className="status">Available for Withdrawal</span>
            </div>
          </Link>
        ) : (
          <p className="box available textbox not-availabile">
            <div className="textbox">
              <span className="status">Not Available</span>
            </div>
          </p>
        )}
      </div>
    </div>
  );
};

export default styled(BankInfo)`
  /* .section-title {
    font-size: 16px;
    font-weight: 500;
  } */

  .title-icon {
    display: inline-block;
    vertical-align: top;
    line-height: 1;
    color: var(--pallete-primary-main);
    margin: 0 15px 0 0;
  }
  .not-availabile {
    margin-bottom: 0px;
  }
`;
