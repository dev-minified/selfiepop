import { SUPPORT_TICKETS_STATUS_OPTIONS } from 'appconstants';
import { SupportTicket } from 'assets/svgs';
import NewButton from 'components/NButton';
import Header from 'components/Tables/components/Header';
import Pagination from 'components/pagination';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ITicket } from 'interfaces/Ticket';
import { PaginationProps } from 'rc-pagination';
import * as React from 'react';
import styled from 'styled-components';
import 'styles/order-widget.css';
import Footer from './SupportFooter';

dayjs.extend(utc);

interface selectIProps {
  label: string;
  value: string;
}
export interface ISupportTable<T> {
  key: string;
  data: T[];
  paginationProps: PaginationProps;
  showHeader?: boolean;
  title: string | React.ReactElement;
  selectProps?: {
    selected?: selectIProps;
    options?: selectIProps[];
    handleChange?: any;
  };
  options?: { [key: string]: boolean };
  onRowClick?: (row: T, key?: T[keyof T] | number) => void;
  icon?: React.ReactElement;
  emptyTitle?: string | React.ReactElement;
  onCreateTicketCallback: (ticket: ITicket) => void;
  className?: string;
}

const SupportTable: React.FC<ISupportTable<ITicket>> = ({
  title,
  data = [],
  selectProps = {},
  paginationProps,
  onRowClick = () => {},
  emptyTitle = 'You currently do not have any Purchases',
  icon,
  onCreateTicketCallback,
  className,
}) => {
  const {
    selected,
    options = SUPPORT_TICKETS_STATUS_OPTIONS,
    handleChange,
  } = selectProps;
  return (
    <div className={className}>
      <Header
        icon={icon}
        title={title}
        options={{ select: true }}
        selectOptions={{
          placeholder: 'Ticket Status:',
          defaultValue: { label: 'All', value: '' },
          value: selected,
          options: options,
          onChange: handleChange,
          isSearchable: false,
        }}
        classes={{ main: 'mb-35' }}
      />
      <div className="support_table pb-10">
        <div className="table-body">
          {data.length ? (
            <div className="table-content">
              <div id="list-area" className="mb-30">
                {data.map((row) => {
                  return (
                    <div
                      key={row._id}
                      className="primary-shadow order-widget"
                      style={{ display: 'block' }}
                      onClick={() => {
                        onRowClick && onRowClick(row);
                      }}
                    >
                      <div className="order-widget-wrap">
                        <div className="img-holder">
                          <SupportTicket />
                        </div>
                        <div className="wrap">
                          <div className="title-wrap">
                            <strong className="title">{row.issueTitle}</strong>
                            <span className="ticket-opened">
                              Opened By:&nbsp;
                              <strong>{`${
                                row?.userId?.pageTitle ?? 'Incognito User'
                              }`}</strong>
                            </span>
                          </div>
                          <div className="text-wrap">
                            {row.createdAt && (
                              <span className="date">
                                Opened:&nbsp;
                                <time dateTime={row.createdAt}>
                                  {dayjs(row.createdAt).format('MM/DD/YYYY')}
                                </time>
                              </span>
                            )}
                            {row.issueLastUpdated && (
                              <span className="date">
                                Last Updated:&nbsp;
                                <time dateTime={row.issueLastUpdated}>
                                  {dayjs
                                    .utc(row.issueLastUpdated)
                                    .local()
                                    .format('MM/DD/YYYY - h:mm A')}
                                </time>
                              </span>
                            )}
                            <span className="status text-capitalize">
                              Status: <span>{row.issueStatus}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {Number(paginationProps?.total) >
                Number(paginationProps?.pageSize) && (
                <Pagination {...paginationProps} />
              )}
            </div>
          ) : (
            <div style={{ maxWidth: '402px', margin: '0 auto' }}>
              <NewButton
                block
                type="primary"
                shape="circle"
                className="btn-disabled"
              >
                {emptyTitle}
              </NewButton>
            </div>
          )}
        </div>
      </div>
      <Footer onCreateTicketCallback={onCreateTicketCallback} />
    </div>
  );
};

export default styled(SupportTable)`
  .support_table {
    padding-bottom: 100px !important;

    @media (max-width: 1023px) {
      padding-bottom: 70px !important;
    }

    @media (max-width: 767px) {
      padding-bottom: 30px !important;
    }

    .order-widget {
      .wrap {
        min-width: 0;
      }

      .img-holder {
        margin-top: -2px;

        svg {
          border-radius: 0;
          object-fit: inherit;
        }
      }

      .title {
        display: block;
        min-width: 0;
        flex-grow: 1;
        flex-basis: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .order-widget-wrap {
    align-items: flex-start;
  }

  .ticket-opened {
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-main-500);
    padding: 0 0 0 5px;

    strong {
      font-weight: 500;
      color: var(--pallete-text-main);
    }
  }

  .order-widget {
    .img-holder {
      border-radius: 0;
      width: 18px;
      height: 22px;
      min-width: 18px;
      margin: 3px 10px 0 0;
    }

    .text-wrap {
      margin-left: -28px;
    }
  }
`;
