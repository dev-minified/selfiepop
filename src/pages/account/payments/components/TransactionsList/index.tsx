import {
  AvatarName,
  ChargeBackIcon,
  CommissionIcon,
  CreditTransaction,
  DebitTransaction,
  Membership,
  MessageBuyIcon,
  PayToView,
  PostTip,
  RefundIcon,
  SaleApproved,
  SaledeliveredIcon,
  SaleIcon,
  TimeExtendIcon,
  WithdrawalIcon,
  WithdrawalPaid,
} from 'assets/svgs';
import classNames from 'classnames';
import ImageModifications from 'components/ImageModifications';
import Pagination from 'components/pagination';
import dayjs from 'dayjs';
import { WalletEventIdTypes, WalletEventTypes } from 'enums';
import { ITransaction } from 'interfaces/ITransaction';
import { PaginationProps } from 'rc-pagination';
import React from 'react';
import styled from 'styled-components';

interface ITransactionsListProps {
  transactions: ITransaction[];
  paginationProps: PaginationProps;
  showHeader?: boolean;
  className?: string;
}

export const getId = (eventType?: string, id?: string) => {
  switch (eventType) {
    case WalletEventIdTypes['Message Unlock']:
      return `u-${id}`;
    case WalletEventIdTypes['Post Tip']:
      return `t-${id}`;
    case WalletEventIdTypes['Pay To View']:
      return `p-${id}`;
    default:
      return `m-${id}`;
  }
};
const TransactionsList: React.FC<ITransactionsListProps> = (props) => {
  const { transactions, paginationProps } = props;
  const {
    selectComponentClass,
    onShowSizeChange,
    showSizeChanger,
    defaultPageSize = 20,
    ...rest
  } = paginationProps;
  const getIcon = (eventType?: string, event?: ITransaction['event']) => {
    switch (eventType) {
      case WalletEventTypes.Sale:
        return <SaleIcon />;
      // case WalletEventTypes['Gift Received']:
      //   return (
      //     <span className="transaction_gift">
      //       <Gift />
      //     </span>
      //   );
      case WalletEventTypes.Commission:
        return <CommissionIcon />;
      case WalletEventTypes.Refund:
        return <RefundIcon />;
      case WalletEventTypes['Sale Approved']:
        return <SaleApproved />;
      case WalletEventTypes['Sale Delivered']:
        return <SaledeliveredIcon />;
      case WalletEventTypes['Withdrawal Paid']:
        return <WithdrawalPaid />;
      case WalletEventTypes.Withdrawal:
        return <WithdrawalIcon />;
      case WalletEventTypes['Message Unlock']:
        return <MessageBuyIcon />;
      case WalletEventTypes['Time Extend']:
        return <TimeExtendIcon />;
      case WalletEventTypes['Membership']:
        return <Membership />;
      case WalletEventTypes['Subscription Renew']:
        // return <Membership />;
        if (event && typeof event.buyerId === 'object') {
          return (
            <ImageModifications
              round={true}
              imgeSizesProps={{
                onlyMobile: true,
              }}
              src={event.buyerId.profileImage}
              fallbackComponent={
                <AvatarName
                  text={
                    event.buyerId.pageTitle ||
                    event.buyerId.username ||
                    'Incognito User'
                  }
                />
              }
            />
          );
        }
        return <Membership />;
      case WalletEventTypes['Post Tip']:
        return <PostTip />;
      case WalletEventTypes['Pay To View']:
        return <PayToView />;
      case WalletEventTypes.Debit:
        return <DebitTransaction />;
      case WalletEventTypes.Credit:
        return <CreditTransaction />;
      case WalletEventTypes['Chargeback Repayment']:
        return <ChargeBackIcon />;

      default:
        return '';
    }
  };
  const getTitle = (eventType?: string) => {
    switch (eventType) {
      case WalletEventTypes['Subscription Renew']:
        return 'Renew Membership';

      default:
        return eventType;
    }
  };

  return (
    <div className={classNames('transaction-table mb-30', props.className)}>
      {/* {showHeader && (
        <div className="table-head">
          <div className="title-box">Type</div>
          <div className="title-box">Transaction ID</div>
          <div className="title-box">Date</div>
          <div className="title-box">Status</div>
          <div className="title-box">Price</div>
        </div>
      )} */}
      <div className="pagination-select-holder">
        Showing
        <Pagination
          itemRender={() => <></>}
          selectComponentClass={selectComponentClass}
          onShowSizeChange={onShowSizeChange}
          showSizeChanger={showSizeChanger}
          defaultPageSize={defaultPageSize}
        />
      </div>
      <div className="table-body">
        {transactions?.map(({ event }, index) => (
          <div key={index} className="table-row">
            <div className="icon">{getIcon(event.eventType, event)}</div>
            <div className="table-content">
              <div className="top-row">
                <div className="text text-capitalize text-title">
                  {getTitle(event.eventType)}
                </div>
                <div className="text price-txt">
                  {event.metadata &&
                    event.eventType === WalletEventTypes.Commission && (
                      <div className="text">
                        <div className="oder-id">
                          <span>Gross Price: </span>
                          <span className="text-highlighted">
                            $
                            {Number(
                              event.metadata?.grossPrice -
                                (event.metadata?.buyerFees || 0) || 0,
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  <strong className="price">
                    ${(Number(event.eventPrice) || 0).toFixed(2)}
                  </strong>
                </div>
              </div>
              <div className="bottom-row text">
                {/* <div
                  className={`${
                    event?.memberOrderId ? 'eventorderId' : ''
                  } text orderId`}
                > */}

                {event.orderId && (
                  <div className="oder-id">
                    <span>Order ID#: </span>
                    <span className="text-highlighted">
                      {(event.orderId as any)?._id}
                    </span>
                  </div>
                )}

                {event?.memberOrderId && (
                  <div className="oder-id">
                    <span>UID#: </span>
                    <span className="text-highlighted">
                      {getId(event.eventType, event?.memberOrderId)}
                    </span>
                  </div>
                )}
                {/* </div> */}
                <div className="text date-txt">
                  <span className="text-highlighted">{` ${dayjs(
                    event.eventDate,
                  ).format('MM/DD/YYYY')}`}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* {Number(paginationProps?.total) > 5 && ( */}
      <Pagination {...rest} />
      {/* )} */}
    </div>
  );
};

export default styled(TransactionsList)`
  &.transaction-table {
    font-size: 14px;
    line-height: 16px;
    .icon {
      rect,
      circle {
        fill: #c90e67;
      }
    }

    .icon {
      margin: 0 13px 0 0;
      width: 36px;
      height: 36px;
      min-width: 36px;
    }

    .table-body {
      margin: 0 0 30px;
      position: relative;
      overflow: hidden;
    }

    .table-row {
      border: none;
      padding: 8px 15px 8px 12px;
      align-items: center;

      @media (max-width: 767px) {
        align-items: flex-start;
      }

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
      }

      &:hover {
        .sp_dark & {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .text {
      width: auto !important;
      margin: 0 !important;
      font-size: 12px;

      @media (max-width: 679px) {
        padding: 0 !important;
      }

      &.text-title {
        font-size: 14px;
        line-height: 16px;
      }
    }

    .top-row {
      margin: 0 0 6px;

      @media (max-width: 679px) {
        justify-content: space-between;
      }
    }

    .bottom-row {
      display: flex;
      flex-direction: row;
      padding: 0;
      margin: 0;

      @media (max-width: 679px) {
        display: block;
      }
    }

    .oder-id {
      padding: 0 24px 0 0;

      @media (max-width: 679px) {
        padding: 0 10px 0 0;
      }
    }

    .price-txt {
      padding: 0;
      display: flex;
      align-items: center;

      @media (max-width: 679px) {
        position: static;
        margin: 0;
      }
    }

    .price {
      background: none;
      padding: 0;
      min-width: inherit;
      margin: 0;
      font-size: 14px;
    }

    .date-txt {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      text-align: right;
      padding: 0;

      @media (max-width: 679px) {
        text-align: left;
      }

      .sp_dark & {
        color: rgba(255, 255, 255, 0.6);
      }

      .text-highlighted {
        font-weight: 400;
        .sp_dark & {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
  .icon img {
    width: 100%;
    height: 100%;
  }

  .transaction_gift {
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #5cd553;
    color: white;
    width: 42px;
    height: 42px;

    svg {
      width: 20px;
      height: auto;
    }
  }
  .eventorderId {
    display: flex;
    flex-direction: column;
    flex-basis: 295px;
    .mem-id {
      padding: 5px 0 0;
    }
  }

  .pagination-select-holder {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 14px;

    .rc-pagination {
      margin: 0;

      li {
        padding: 0;
        &:empty {
          display: none;
        }
      }

      .react-select-container {
        width: 45px;
        margin: 0 0 0 3px;
      }

      .react-select__value-container {
        padding: 0;

        input {
          display: none;
        }
      }

      .react-select__indicators {
        width: auto;
        height: auto;
        padding: 0;
        position: static;
        background: none !important;
      }

      .react-select__single-value {
        position: static;
        transform: none;
      }

      .react-select__indicator {
        padding: 0;

        svg {
          width: 12px;
          height: auto;
        }
      }

      .react-select__control {
        border: none !important;
        background: none;
        padding: 0;
        min-height: inherit;
      }

      .react-select__menu {
        min-width: 68px;
        border-radius: 8px;
        overflow: hidden;
      }
    }
  }
`;
