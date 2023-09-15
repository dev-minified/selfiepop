import { ORDER_STATUS_FILTER_OPTIONS } from 'appconstants';
import NewButton from 'components/NButton';
import { RequestLoader } from 'components/SiteLoader';
import Pagination from 'components/pagination';
import { PaginationProps } from 'rc-pagination';
import { ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import 'styles/order-widget.css';
import Header from './components/Header';
import SimpleView from './simple-view';
import UnlockedView from './unlocked-view';

interface selectIProps {
  label: ReactNode;
  value: string;
}
const EmptyTitleComp = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  width: 100%;
`;
type VIEWTYPE = 'unlockedView' | 'simpleView';
const Loader = (
  <RequestLoader
    width="28px"
    height="28px"
    color="var(--pallete-primary-main)"
    isLoading
  />
);
export interface IOrderTable<T> {
  key: string;
  data: T[];
  paginationProps: PaginationProps;
  showHeader?: boolean;
  title: string | React.ReactElement;
  selectProps?: {
    selected?: selectIProps;
    options?: selectIProps[];
    handleChange?: any;
    onSort?: (direction?: string) => void | Promise<any>;
    defaultValue?: selectIProps;
    sortable?: boolean;
  };
  view?: VIEWTYPE;
  options?: { [key: string]: boolean };
  onRowClick?: (row?: T, key?: T[keyof T] | number) => void;
  icon?: React.ReactElement;
  emptyTitle?: string | React.ReactElement;
  orderClassName?: string;
  showPagination?: boolean;
  isloading?: boolean;
  showLoadMore?: boolean;
  loadMore?: (...args: any[]) => void | Promise<any>;
}

const OrderTable: React.FC<IOrderTable<any>> = ({
  key = '',
  title,
  data = [],
  selectProps = {},
  paginationProps,
  options: displayOptions = {},
  onRowClick = () => {},
  emptyTitle = 'You currently do not have any Purchases',
  icon,
  view = 'simpleView',
  orderClassName,
  showPagination = true,
  showLoadMore = false,
  isloading = false,
  loadMore,
}) => {
  const {
    selected,
    options = ORDER_STATUS_FILTER_OPTIONS,
    handleChange,
    onSort,
    defaultValue = { label: 'All', value: '' },
    sortable = false,
  } = selectProps;
  const RenderView = useMemo(() => {
    switch (view) {
      case 'simpleView':
        return (
          <SimpleView
            key={key}
            data={data}
            onRowClick={onRowClick}
            options={displayOptions}
          />
        );
      case 'unlockedView':
        return (
          <UnlockedView
            key={key}
            data={data}
            onRowClick={onRowClick}
            options={displayOptions}
          />
        );

      default:
        break;
    }
  }, [data, displayOptions, key, onRowClick, view]);
  return (
    <div className={orderClassName}>
      <Header
        sortable={sortable}
        view={view}
        icon={icon}
        title={title}
        // options={{ select: true }}
        options={{ select: !isloading }}
        onSort={onSort}
        selectOptions={{
          placeholder: 'filter By:',
          defaultValue: defaultValue,
          value: selected,
          options: options,
          onChange: handleChange,
          isSearchable: false,
        }}
        classes={{ main: 'mb-15' }}
      />
      <div className="order-table pb-10">
        <div className="table-body">
          {data?.length ? (
            <div className="table-content">
              {RenderView}
              {showPagination &&
                Number(paginationProps?.total) >
                  Number(paginationProps?.pageSize) && (
                  <Pagination {...paginationProps} />
                )}
              {isloading
                ? Loader
                : showLoadMore && (
                    <NewButton
                      block
                      type="primary"
                      shape="circle"
                      onClick={loadMore}
                    >
                      Load more
                    </NewButton>
                  )}
              {/* {showLoadMore && (
                <NewButton
                  block
                  type="primary"
                  shape="circle"
                  onClick={loadMore}
                >
                  Load more
                </NewButton>
              )} */}
            </div>
          ) : isloading ? (
            Loader
          ) : (
            <div style={{ maxWidth: '402px', margin: '0 auto' }}>
              <EmptyTitleComp className="py-30 px-10 empty-data text-center">
                {emptyTitle}
              </EmptyTitleComp>
              {/* <NewButton
                block
                type="primary"
                shape="circle"
                className="btn-disabled"
              >
                {emptyTitle}
              </NewButton> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
