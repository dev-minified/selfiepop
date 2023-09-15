import { getWalletHistory } from 'api/billing';
import { UpDownArrow } from 'assets/svgs';
import DatePicker, { DateRangeType } from 'components/DatePicker';
import FilterOptions from 'components/FilterOptions';
import Button from 'components/NButton';
import Select from 'components/Select';
import dayjs from 'dayjs';
import { WalletEventTypes } from 'enums';
import { getId } from 'pages/account/payments/components/TransactionsList';
import * as React from 'react';
import { CSVLink } from 'react-csv';
import styled from 'styled-components';
type VIEWTYPE = 'unlockedView' | 'simpleView' | 'wallet_view';
interface IAppProps {
  options?: { search?: boolean; calender?: boolean; select?: boolean };
  title?: string | React.ReactElement;
  selectOptions?: any;
  totalEvent?: number;
  className?: string;
  classes?: { main?: string };
  icon?: React.ReactElement;
  allowExport?: Boolean;
  sortable?: Boolean;
  onDateRangeChange?: (dateRange: DateRangeType) => void;
  view?: VIEWTYPE;
  user?: IUser;
  onSort?: (direction?: string) => void | Promise<any>;
}

const App: React.FunctionComponent<IAppProps> = ({
  options = {},
  selectOptions,
  title,
  className,
  classes = {},
  icon,
  onDateRangeChange,
  view = 'simpleView',
  allowExport = false,
  sortable = true,
  onSort,
  totalEvent = 0,
  user,
}) => {
  const [paymentReport, setPaymentReport] = React.useState<any>([]);
  const [exportLoading, setExportLoading] = React.useState<boolean>(false);
  const ref = React.useRef<any>(null);
  const { search, calender, select } = options;
  const { main: mainClass } = classes;
  const [dateRange, setDateRange] = React.useState<[Date, Date]>([
    dayjs().subtract(6, 'months').toDate(),
    new Date(),
  ]);
  return (
    <div className={`${className} ${mainClass}`}>
      {calender ? (
        <DatePicker
          dateRange={dateRange}
          onChange={(dateRange) => {
            const start = dayjs(dateRange[0]);
            const end = dayjs(dateRange[1]);
            if (end.diff(start, 'dates') >= 1) {
              setDateRange(dateRange);
              onDateRangeChange?.(dateRange);
            }
          }}
        />
      ) : // view === 'simpleView' && (
      //   <strong className="title">
      //     <span>{icon}</span>
      //     {title}
      //   </strong>
      // )
      null}

      {view === 'simpleView' ? (
        <React.Fragment>
          <div className="sort-box" style={{ width: '100%' }}>
            {select && (
              <div className="select-box">
                <FilterOptions
                  {...selectOptions}
                  optionspostions="left"
                  sortable={false}
                />
                {/* <Select size="small" placeholder="Select" {...selectOptions} /> */}
              </div>
            )}
            {search && (
              <span className="btn-search">
                <img
                  src="/assets/images/svg/icon-search.svg"
                  alt="img description"
                />
              </span>
            )}
          </div>
        </React.Fragment>
      ) : view === 'unlockedView' ? (
        <React.Fragment>
          <div className="sort-box" style={{ width: '100%' }}>
            {select && (
              <div className="select-box">
                <FilterOptions
                  {...selectOptions}
                  optionspostions="left"
                  sortable={sortable}
                  onSortChange={onSort}
                />
              </div>
            )}
          </div>
        </React.Fragment>
      ) : view === 'wallet_view' ? (
        <React.Fragment>
          <div className="sort-box" style={{ width: 'auto' }}>
            {select && (
              <div className="select-box">
                <Select size="small" placeholder="Select" {...selectOptions} />
              </div>
            )}
            {search && (
              <span className="btn-search">
                <img
                  src="/assets/images/svg/icon-search.svg"
                  alt="img description"
                />
              </span>
            )}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="sort-box" style={{ width: 'auto' }}>
            {select && (
              <div className="select-box">
                <Select size="small" placeholder="Select" {...selectOptions} />
              </div>
            )}
            <span
              className="sort_order"
              onClick={() => {
                onSort?.();
              }}
            >
              <UpDownArrow />
            </span>
          </div>
        </React.Fragment>
      )}
      {allowExport && user?.allowPaymentExport && (
        <div className="btn-wrap">
          <Button
            isLoading={exportLoading}
            onClick={() => {
              setExportLoading(true);
              getWalletHistory({ limit: totalEvent }).then((res) => {
                setPaymentReport(
                  res?.item?.walletEvents.map(({ event }: any) => {
                    const obj: any = {};
                    obj.Title = event['Subscription Renew']
                      ? 'Renew Membership'
                      : event.eventType;
                    obj.Date = `${dayjs(event.eventDate).format('MM/DD/YYYY')}`;
                    obj.Price = (Number(event.eventPrice) || 0).toFixed(2);
                    if (event.orderId) {
                      obj['Order ID#:'] = (event.orderId as any)?._id;
                    }
                    if (
                      event.metadata &&
                      event.eventType === WalletEventTypes.Commission
                    ) {
                      obj['Gross Price'] = `$ ${Number(
                        event.metadata?.grossPrice -
                          (event.metadata?.buyerFees || 0) || 0,
                      ).toFixed(2)}`;
                    }
                    if (event?.memberOrderId) {
                      obj['UID'] = getId(event.eventType, event?.memberOrderId);
                    }
                    return obj;
                  }),
                );
                setExportLoading(false);
                ref.current.link.click();
              });
            }}
          >
            Export CSV
          </Button>
          <CSVLink ref={ref} filename="Payment_Report" data={paymentReport} />
        </div>
      )}
    </div>
  );
};

export default styled(App)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin: 0 0 14px;

  .title {
    display: block;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
    color: var(--pallete-text-main-50);

    svg {
      display: inline-block;
      vertical-align: middle;
      fill: var(--pallete-primary-main);
      stroke: var(--pallete-primary-main);
      margin: -2px 15px 0 0;
    }

    .counter-text {
      color: #e41076;
      font-weight: 400;
      margin: 0 0 0 5px;
    }
  }

  .calendar-field {
    position: relative;
    width: 47%;
  }

  .datepicker-area {
    background: #191919;
    border: none;
    border-radius: 24px;
    text-align: center;
    padding: 8px 25px 8px 45px;
    font-size: 13px;
    line-height: 16px;

    @media (max-width: 767px) {
      width: 100%;
      margin: 0 0 10px;
    }

    .icon {
      left: 18px;
      width: 15px;
      top: 6px;

      @media (max-width: 640px) {
        /* left: auto; */
        position: absolute;
      }

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .calendar-field .icon {
    width: 18px;
    position: absolute;
    top: 50%;
    left: 20px;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    z-index: 1;
  }

  .calendar-field .icon img {
    width: 100%;
    height: auto;
    display: block;
  }

  .calendar-field .text-input {
    background: #f7f7f7;
    border-radius: 30px;
    border: 1px solid var(--pallete-colors-border);
    text-align: center;
    color: var(--pallete-text-main);
    height: 44px;
    width: 100%;
    padding: 10px 15px 8px 45px;
    font-weight: 500;
  }

  .calendar-field .text-input:focus {
    outline: none;
  }

  .sort-box {
    /* width: 310px; */
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .select-box {
    /* width: 244px; */
    width: 100%;
  }

  .btn-search {
    width: 44px;
    height: 44px;
    display: block;
    padding: 11px;
    border-radius: 5px;
    background: rgba(229, 16, 117, 0.4);
    margin-left: 10px;
  }

  .btn-search img {
    display: block;
    max-width: none;
    width: 100%;
    height: auto;
  }

  .btn-search:hover {
    background: #000;
  }

  @media (max-width: 767px) {
    .title {
      width: 100%;
      margin: 0 0 15px;
    }

    .calendar-field {
      width: calc(100% - 60px);
      margin: 0 0 20px;
    }

    .sort-box {
      width: 100% !important;
    }

    .select-box {
      width: 100%;
    }
  }
`;
