// import NewButton from 'components/NButton';
import {
  CommissionIcon,
  Dollar,
  DollarAlt,
  DollarChat,
  Membership,
  MessageBuyIcon,
  PayToView,
  RefundIcon,
  SaleApproved,
  SaleIcon,
  SaledeliveredIcon,
  TimeExtendIcon,
  WithdrawalIcon,
  WithdrawalPaid,
} from 'assets/svgs';
import dayjs from 'dayjs';
import { WalletEventTypes } from 'enums';
import { ReactElement } from 'react';
import styled from 'styled-components';
interface Props {
  className?: string;
  purchaseWallet?: Record<string, any>;
}

function PurchaseHistory({ className, purchaseWallet }: Props): ReactElement {
  const getIcon = (eventType?: string) => {
    switch (eventType) {
      case WalletEventTypes.Sale:
        return <SaleIcon />;
      // case WalletEventTypes['Gift Received']?.toLowerCase():
      //   return (
      //     <Gift width={'24'} height={'24'} fill={'var(--pallete-primary-main)'} color={'var(--pallete-primary-main)'} />
      //   );
      case WalletEventTypes.Commission?.toLowerCase():
        return <CommissionIcon width={'24'} height={'24'} />;
      case WalletEventTypes.Refund?.toLowerCase():
        return <RefundIcon width={'24'} height={'24'} />;
      case WalletEventTypes.Sale?.toLowerCase():
        return <DollarChat width={'24'} height={'24'} />;
      case WalletEventTypes['Sale Approved']?.toLowerCase():
        return <SaleApproved width={'24'} height={'24'} />;
      case WalletEventTypes['Sale Delivered']?.toLowerCase():
        return <SaledeliveredIcon width={'24'} height={'24'} />;
      case WalletEventTypes['Withdrawal Paid']?.toLowerCase():
        return <WithdrawalPaid width={'24'} height={'24'} />;
      case WalletEventTypes.Withdrawal:
        return <WithdrawalIcon width={'24'} height={'24'} />;
      case WalletEventTypes['Message Unlock']?.toLowerCase():
        return <MessageBuyIcon width={'24'} height={'24'} />;
      case WalletEventTypes['Message Buy']?.toLowerCase():
        return <MessageBuyIcon width={'24'} height={'24'} />;
      case WalletEventTypes['Time Extend']?.toLowerCase():
        return <TimeExtendIcon width={'24'} height={'24'} />;
      case WalletEventTypes['Subscription Renew']?.toLowerCase():
        return <Membership width={'24'} height={'24'} />;
      case WalletEventTypes['Membership']?.toLowerCase():
        return <Membership width={'24'} height={'24'} />;
      case WalletEventTypes['Post Tip']?.toLowerCase():
        return (
          <span className="dollar-purchase-icon">
            <Dollar />
          </span>
        );
      case WalletEventTypes['Pay To View']?.toLowerCase():
        return <PayToView width={'24'} height={'24'} />;
      default:
        return '';
    }
  };
  // const getIcon = (value: any) => {
  //   if (value.includes('sale')) {
  //     return <DollarChat />;

  //   }
  //   else if() {

  //   }
  //   else if (value.includes('gift')) {
  //     return (
  //       <Gift width={'24'} height={'24'} fill={'var(--pallete-primary-main)'} color={'var(--pallete-primary-main)'} />
  //     );
  //   }
  // };
  return (
    <div className={`${className} purchae-table-area`}>
      <div className="purchase-heading-area">
        <span className="img-icon">
          <DollarAlt />
        </span>
        <h3>Purchase History</h3>
      </div>

      <table className="table-gifts">
        <thead>
          <tr>
            <th> TIME</th>
            <th>AMOUNT</th>
            <th>TYPE</th>
          </tr>
        </thead>
        <tbody>
          {purchaseWallet?.walletEvents?.map((wallet: any) => (
            <tr key={wallet?._id}>
              <td>
                <strong>{`${dayjs(wallet?.event?.eventDate).format(
                  'MMM DD , YYYY h:mm a',
                )}`}</strong>
              </td>
              <td>
                <strong>
                  $
                  {(
                    Number(
                      wallet?.event?.grossPrice ?? wallet?.event?.eventPrice,
                    ) || 0
                  ).toFixed(2)}
                </strong>
              </td>
              <td className="icon_wallet">
                <span className="img-icon">
                  {getIcon(wallet?.event?.eventType.toLowerCase())}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default styled(PurchaseHistory)`
  padding: 15px;
  background: var(--pallete-background-default);
  border-radius: 5px;

  @media (max-width: 767px) {
    padding: 0;
  }

  .icon_wallet {
    circle {
      fill: var(--pallete-primary-main);
    }
  }
  .purchase-heading-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 20px;
    color: var(--pallete-primary-main);

    .img-icon {
      width: 18px;
      height: 18px;
      margin: 0 10px 0 0;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    h3 {
      font-size: 14px;
      line-height: 17px;
      color: var(--pallete-primary-main);
      margin: 0;
    }
  }

  .table-gifts {
    width: 100%;

    th {
      border-bottom: 1px solid rgba(59, 113, 158, 0.55);
      font-size: 12px;
      line-height: 15px;
      font-weight: 500;
      color: var(--pallete-primary-darker);
      padding: 0 0 10px;
      text-transform: uppercase;

      .sp_dark & {
        border-bottom-color: rgba(201, 14, 103, 0.4);
      }
    }

    th,
    td {
      padding-right: 5px;

      &:last-child {
        text-align: right;
        padding-right: 0;
      }
    }

    td {
      font-size: 13px;
      line-height: 16px;
      color: var(--pallete-text-main-550);
      padding-top: 8px;
      padding-bottom: 8px;
      /* border-bottom: 1px solid #e9edf0; */
    }

    tbody {
      tr:first-child {
        td {
          padding-top: 15px;
        }
      }
    }

    .img-icon {
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: auto;

      svg {
        display: block;
        width: 100%;
        height: auto;
      }
    }

    .dollar-purchase-icon {
      width: 18px;
      height: 18px;
      background: var(--pallete-primary-main);
      border-radius: 100%;
      padding: 0 4px;
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    strong {
      font-weight: 500;
    }
  }
`;
