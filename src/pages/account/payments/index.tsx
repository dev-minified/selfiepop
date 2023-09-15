import {
  getDashboardLink,
  getStripeConnectLink,
  getStripeId,
  getWalletHistory,
} from 'api/billing';
import { HIDE_WITHDRAWAL } from 'appconstants';
import { ArrowBack, DollarAlt, TickIcon } from 'assets/svgs';
import { DateRangeType } from 'components/DatePicker';
import { default as NewButton } from 'components/NButton';
import Select from 'components/Select';
import HeaderOption from 'components/Tables/components/Header';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import useRequestLoader from 'hooks/useRequestLoader';
import { ITransaction } from 'interfaces/ITransaction';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Utils from 'utils';
import BankInfo from './components/BankInfo';
import TransactionsList from './components/TransactionsList';

const GetHeaderStyled = styled.div`
  .button-primary {
    background: var(--colors-indigo-200);
    border-color: var(--colors-indigo-200);
    .sp_dark & {
      background: #c90e67;
      border-color: #c90e67;
    }
    &.button-outline {
      &:not(:hover) {
        color: var(--colors-indigo-200);
        border-color: var(--colors-indigo-200);
      }
    }
    &:hover {
      background: var(--pallete-primary-dark);
      border-color: var(--pallete-primary-dark);
    }

    svg {
      width: 18px;
      height: 18px;
      margin: 0 5px 0 0;
    }
  }
`;

const SubHeaderOptions = styled.div`
  .btn-wrap {
    margin: 10px 0 0;
  }
  .datepicker-area {
    position: relative;
    padding-right: 50px;

    &:after {
      position: absolute;
      right: 20px;
      top: 8px;
      width: 10px;
      height: 10px;
      border-top: 2px solid rgba(255, 255, 255, 0.6);
      border-left: 2px solid rgba(255, 255, 255, 0.6);
      content: '';
      transform: rotate(-135deg);
    }

    .starting-date,
    .ending-date {
      display: inline-block;
    }
  }
  .react-select__control {
    border-radius: 40px;
    border-color: #d9e2ea;
    min-height: 28px;
    .react-select__indicator-separator {
      display: none;
    }

    .react-select__indicators {
      width: 28px;
      height: 28px;
      background: none;
    }
  }

  .react-select__control {
    border-radius: 40px;
    border: none !important;
    min-height: 28px;
    .react-select__indicator-separator {
      display: none;
    }

    .react-select__indicators {
      width: 38px;
      height: 32px;
      background: none !important;
      opacity: 0.6l;
    }

    .react-select__value-container {
      padding: 2px 8px 2px 15px;
    }
  }
  @media (min-width: 768px) {
    position: relative;
    .datepicker-area {
      width: 59%;
      max-width: calc(100% - 210px);
    }
    .sort-box {
      width: 192px !important;
    }

    .btn-wrap {
      margin: 0;
      .button {
        min-width: 143px;
      }
    }
  }
`;
const PAGE_LIMIT = 20;
dayjs.extend(isBetween);

const EVENT_STATUSES = [
  'All',
  'Commission',
  'Withdrawal',
  'Withdrawal Paid',
  'Sale',
  'Sale Delivered',
  'Sale Approved',
  'Refund',
  'Platform Fee',
  'Time Extend',
  'Message Unlock',
  'Pay To View',
  'Membership',
  'Post Tip',
  'Chargeback Repayment',
  'Renew Membership',
  'Debit',
  'Credit',
];

const PageSizeOptions = [
  // { label: '5', value: '5' },
  // { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

const CustomSelect = (props: any) => {
  return (
    <>
      <Select
        {...props}
        isSearchable={false}
        options={PageSizeOptions}
        onChange={(value) =>
          props.onChange(value?.value || PageSizeOptions[0].value)
        }
        defaultValue={PageSizeOptions[0]}
        placeholder="Page Size"
        menuPlacement="top"
        styles={{ container: (base) => ({ ...base, width: '90px' }) }}
        value={{ label: props.value, value: props.value }}
      />
    </>
  );
};
CustomSelect.Option = 'option';

interface props {
  className?: string;
}

const Payments: React.FC<props> = (props) => {
  const { className } = props;
  const { user, setUser } = useAuth();
  const { code, page, pageSize = 20 } = useQuery();
  const history = useHistory();
  const location = useLocation();
  const [walletHistory, setWalletHistory] = useState<any>({});
  const [walletEvents, setWalletEvents] = useState<ITransaction[]>([]);
  const [filters, setFilters] = useState<{
    status: string;
    dateRange: DateRangeType | null;
  }>({ status: '', dateRange: null });
  const { withLoader } = useRequestLoader();
  const connectBankAccount = () => {
    getStripeConnectLink(user?.email, {
      ignoreStatusCodes: [500],
    })
      .then((response) => {
        window.open(response.url, '_self');
      })
      .catch((e) => {
        let error = 'Sorry something went wrong';
        if (e && e?.message) {
          error = e.message;
        }
        toast.error(error);

        console.log(e);
      });
  };

  const connectedBankAccount = () => {
    getDashboardLink({
      ignoreStatusCodes: [500],
    })
      .then((response) => {
        window.open(response.url, '_self');
      })
      .catch((e) => {
        let error = 'Sorry something went wrong';
        if (e && e?.message) {
          error = e.message;
        }
        toast.error(error);

        console.log(e);
      });
  };

  useEffect(() => {
    if (code) {
      getStripeId(code as string)
        .then((res) => {
          if (res?.stripeSellerAccountId) {
            const stripeSellerAccountId = res.stripeSellerAccountId;
            setUser({ ...user, stripeSellerAccountId: stripeSellerAccountId });
            history.replace(location.pathname);
          }
        })
        .catch((e: Error) => {
          Utils.showAlert(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    getTransactions(
      parseInt(page as string),
      filters,
      parseInt(pageSize as string),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  useEffect(() => {
    if (filters.status || filters.dateRange) {
      getTransactions(1, filters, 20);
      history.push({
        pathname: location.pathname,
        search: 'page=1&pageSize=20',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const getTransactions = (
    pageNumber: number,
    currentFilters: typeof filters,
    size: number,
  ) => {
    const pageIndex = pageNumber || 1;
    const skip = (pageIndex - 1) * (size || PAGE_LIMIT);
    const { status, dateRange } = currentFilters;

    const params: Parameters<typeof getWalletHistory>[0] = {
      skip,
      limit: size || PAGE_LIMIT,
    };
    if (status) {
      params.status = status;
    }
    if (filters.status === 'All') {
      params.status = '';
    }
    if (filters.status === 'Message Unlock') {
      params.status = 'Message Buy';
    }
    if (filters.status === 'Renew Membership') {
      params.status = 'Subscription Renew';
    }
    if (dateRange) {
      params.startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
      params.endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    }

    withLoader(getWalletHistory(params))
      .then((res) => {
        let events = [];

        if (res.item?.walletEvents) {
          events = res.item?.walletEvents?.map((e: any) => {
            return e.event?.eventType === 'Message Buy'
              ? {
                  ...e,
                  event: { ...(e.event || {}), eventType: 'Message Unlock' },
                }
              : { ...e };
          });
        }

        setWalletHistory({
          ...res,
          walletEvents: events || [],
        });
        setWalletEvents(events || []);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const onConnectBankClick = () => {
    if (user.stripeSellerAccountId) return connectedBankAccount();
    connectBankAccount();
  };

  const GetHeader = () => {
    let message = 'Connect Your Bank Account';

    if (user.stripeSellerAccountId) {
      if (
        walletHistory.capabilities?.card_payments.toLowerCase() ===
          'inactive' ||
        walletHistory.capabilities?.transfers.toLowerCase() === 'inactive'
      ) {
        message = 'Additional Info Required for Withdrawal';
      } else {
        message = 'Bank Account Connected!!';
      }
    }
    return (
      <div
        id="connect-bank-account"
        className="mb-25"
        onClick={onConnectBankClick}
      >
        <GetHeaderStyled>
          <NewButton
            className="text-uppercase"
            type="primary"
            disabled={
              !!user.stripeSellerAccountId &&
              !(
                walletHistory.capabilities?.card_payments.toLowerCase() ===
                  'inactive' ||
                walletHistory.capabilities?.transfers.toLowerCase() ===
                  'inactive'
              )
            }
            outline={!!user.stripeSellerAccountId}
            block
            icon={
              user.stripeSellerAccountId &&
              !(
                walletHistory.capabilities?.card_payments.toLowerCase() ===
                  'inactive' ||
                walletHistory.capabilities?.transfers.toLowerCase() ===
                  'inactive'
              ) ? (
                <TickIcon width={30} height={30} />
              ) : (
                <DollarAlt />
              )
            }
            style={{ fontSize: 16 }}
          >
            <span className="social--text">{message}</span>
          </NewButton>
        </GetHeaderStyled>
      </div>
    );
  };
  let mobilepaginatinProps = {};

  mobilepaginatinProps = {
    showLessItems: true,
    nextIcon: <ArrowBack />,
    prevIcon: <ArrowBack />,
  };

  const getWalletHeader = () => {
    if (!!HIDE_WITHDRAWAL[user?._id || '']) {
      return false;
    }
    return !user?.isSpManaged;
  };
  return (
    <div className={className}>
      {getWalletHeader() ? <GetHeader /> : null}
      <BankInfo
        withdrawalAvailable={walletHistory.withdrawalAvailable}
        withdrawalPending={walletHistory.withdrawalPending}
        showWithdrawal={getWalletHeader()}
      />
      {/* <hr className="mb-30" /> */}
      <SubHeaderOptions>
        <HeaderOption
          view="wallet_view"
          user={user}
          totalEvent={walletHistory?.total || 0}
          allowExport
          options={{ calender: true, select: true, search: false }}
          classes={{ main: 'mb-30' }}
          selectOptions={{
            options: EVENT_STATUSES.map((status) => ({
              label: status,
              value: status,
            })),
            onChange: (option: { label: string; value: string }) => {
              setFilters((prev) => ({ ...prev, status: option.value }));
            },
          }}
          onDateRangeChange={(dateRange: DateRangeType) => {
            setFilters((prev) => ({ ...prev, dateRange }));
          }}
        />
      </SubHeaderOptions>
      <TransactionsList
        showHeader
        transactions={walletEvents}
        paginationProps={{
          total: walletHistory?.total,
          current: parseInt(page as string) || 1,
          pageSize: parseInt(pageSize as string) || PAGE_LIMIT,
          onChange: (page, size) => {
            if (size === parseInt(pageSize as string)) {
              history.push({
                pathname: location.pathname,
                search: `page=${page}&pageSize=${size}`,
              });
            }
          },
          defaultPageSize: parseInt(pageSize as string) || PAGE_LIMIT,

          selectComponentClass: CustomSelect,
          ...mobilepaginatinProps,
          onShowSizeChange: (current, size) => {
            history.push({
              pathname: location.pathname,
              search: `page=1&pageSize=${size}`,
            });
          },
          nextIcon: <ArrowBack />,
          prevIcon: <ArrowBack />,
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default styled(Payments)``;
