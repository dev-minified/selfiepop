import { getOrder, getOrders, getUnlockedOrders } from 'api/Order';
import { ExtraOrderTypes, ORDER_STATUS_FILTER_OPTIONS } from 'appconstants';
import { ArrowBack, Dollar } from 'assets/svgs';
import OrderTable from 'components/Tables/Order';
import dayjs from 'dayjs';
import { ServiceType } from 'enums';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useRequestLoader from 'hooks/useRequestLoader';
import TwoPanelLayout from 'layout/TwoPanelLayout';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getSortbyParam, parseQuery } from 'util/index';
import OrderDetail from './[id]';
const PAGE_LIMIT = 10;

interface Props {
  className?: string;
}

function MyPurchases({ className }: Props) {
  const history = useHistory();
  const { showLeftView, showRightView } = useControllTwopanelLayoutView();
  const [selected, setSelected] = useState<any>({
    label: 'All',
    value: '',
  });
  const [mergedOrders, setMergedOrders] = useState<{
    totalCount: number;
    items: any[];
  }>({ totalCount: 0, items: [] });
  const [orders, setOrders] = useState<{
    totalCount: number;
    items: any[];
    fetchMore: boolean;
  }>({ totalCount: 0, items: [], fetchMore: true });
  const [unlockOrders, setUnlockOrders] = useState<{
    totalCount: number;
    items: any[];
    fetchMore: boolean;
  }>({ totalCount: 0, items: [], fetchMore: true });
  const [selectedOrder, setSelectedOrder] = useState<any>({});
  const [isloading, setIsLoading] = useState<boolean>(false);

  const {
    page: pageNumber,
    orderby,
    filterby,
    order: orderId,
    sortdir,
  } = parseQuery(useLocation().search);

  const { setLoading } = useRequestLoader();
  const resetState = () => {
    setSelectedOrder({});
    setOrders({ items: [], totalCount: 0, fetchMore: true });
    setMergedOrders({ items: [], totalCount: 0 });
    setUnlockOrders({ items: [], totalCount: 0, fetchMore: true });
  };
  const fetchOrders = () => {
    const pageQueryLimit = PAGE_LIMIT;
    // const pageIndex = Number(pageNumber) || 1;
    // const skip = (pageIndex - 1) * pageQueryLimit;
    const skiporders = orders?.items?.length;
    const skipUnlockOrders = unlockOrders?.items?.length;

    const paramsList: any = {
      skip: skiporders,
      orderId,
      limit: pageQueryLimit,
      sort: getSortbyParam(orderby),
      filter: filterby,
      order: sortdir || 'desc',
      isActive: true,
      type: 'buyer',
    };
    const statusFilter = ORDER_STATUS_FILTER_OPTIONS.find(
      (v) => v.value === filterby,
    ) || { label: 'All', value: '' };
    setSelected(statusFilter);
    const filterSelected = filterby
      ? JSON.parse(filterby as string)
      : { orderStatus: 'All' };
    const apicalls: Promise<any>[] = [];
    if (orders.fetchMore) {
      apicalls.push(
        getOrders(paramsList, {
          ignoreStatusCodes: [500],
        }).catch(() => {
          return { success: false, items: [], totalCount: 0 };
        }),
      );
    } else {
      apicalls.push(
        new Promise((res) =>
          res({ ...orders, items: [], totalCount: orders.totalCount }),
        ),
      );
    }
    if (
      (filterSelected.orderStatus === 'All' ||
        filterSelected.orderStatus === 'Completed') &&
      unlockOrders.fetchMore
    ) {
      apicalls.push(
        getUnlockedOrders(
          { ...paramsList, skip: skipUnlockOrders },
          {
            ignoreStatusCodes: [500],
          },
        ).catch(() => {
          return { success: false, data: { items: [], totalCount: 0 } };
        }),
      );
    }

    setLoading(true);
    Promise.all(apicalls)
      .then((res) => {
        setLoading(false);
        const ordersn = res[0];
        const unlockorder = res?.[1];
        let unlockTotal = 0;
        let unlocitems: any[] = [];
        if (orderId) {
          setMergedOrders(() => {
            return {
              items: [...ordersn?.items],
              totalCount: 1,
            };
          });

          setOrders({
            ...{
              items: [...ordersn?.items],
              totalCount: 1,
            },
            fetchMore: false,
          });
          return;
        }
        if (unlockorder) {
          unlockTotal = unlockorder?.data?.totalCount || 0;
          unlocitems = (unlockorder?.data?.items || []).map(
            (order: Record<string, any>) => {
              let popType = 'tip';
              let title = 'Tip';
              if (order.postId) {
                popType = ExtraOrderTypes.post_unlock;
                title = 'Post Unlock';
              }
              if (order.tipId) {
                popType = ExtraOrderTypes.tip;
                title = 'Tip';
              }
              if (order.messageId) {
                popType = ExtraOrderTypes.message_unlock;
                title = 'Message Unlock';
              }
              return { orderStatus: order.status, popType, title, ...order };
            },
          );
        }

        const totalCounts = (ordersn?.totalCount || 0) + unlockTotal;
        const items = [...(ordersn?.items || []), ...unlocitems].sort(
          (a, b) => {
            const isBfr = dayjs(a.createdAt).isBefore(dayjs(b.createdAt));

            if (isBfr) {
              return 1;
            }
            return -1;
          },
        );
        setMergedOrders(() => {
          return {
            items: [...mergedOrders.items, ...items],
            totalCount: totalCounts,
          };
        });
        const sordersitems = [
          ...(orders?.items || []),
          ...(ordersn?.items || []),
        ];
        setOrders({
          ...ordersn,
          items: sordersitems,
          fetchMore: sordersitems?.length < (ordersn?.totalCount || 0),
        });

        if (unlockorder?.data) {
          const uItems = [...unlockOrders?.items, ...unlocitems];
          setUnlockOrders({
            ...unlockorder?.data,
            items: uItems,
            fetchMore: uItems.length < (unlockTotal || 0),
          });
        }
        if (!selectedOrder?._id) {
          const findOrderById = orders?.items?.find(
            (order: any) => order._id === orderId,
          );
          findOrderById && setSelected({ label: 'Filter By:', value: '' });
          setSelectedOrder(findOrderById || orders?.items?.[0] || {});
        }
        setIsLoading(false);
      })
      .catch((e: Error) => {
        setLoading(false);
        setIsLoading(false);
        console.log(e);
      });
  };
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, orderby, filterby, orderId, sortdir]);

  const handleChange = (v: any) => {
    resetState();
    const Parsequery = { orderby, filterby, sortdir };
    // const Parsequery = { page: pageNumber, orderby, filterby, sortdir };
    Parsequery.filterby = v.value;
    Parsequery.sortdir = sortdir || 'desc';
    // Parsequery.page = '1';
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };
  const handleSort = () => {
    resetState();
    const Parsequery = { orderby, filterby, sortdir };
    // const Parsequery = { page: pageNumber, orderby, filterby, sortdir };
    let sort = 'asc';
    if (sortdir) {
      sort = sortdir === 'asc' ? 'desc' : 'asc';
    }
    Parsequery.sortdir = sort;
    // Parsequery.page = '1';
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const handlePage = (page: number) => {
    const Parsequery = { page: pageNumber, orderby, filterby, sortdir };
    Parsequery.sortdir = sortdir || 'desc';
    Parsequery.page = page.toString();
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const updateOrder = async (orderId: string) => {
    const order = await getOrder(orderId).catch(console.log);
    if (order) {
      setMergedOrders((prev: any) => {
        const orders = [...prev.items];
        const orderIndex = orders?.findIndex((o: any) => o._id === orderId);
        if (orderIndex > -1) {
          orders.splice(orderIndex, 1, order);
        }

        return {
          ...prev,
          items: orders,
        };
      });
      setSelectedOrder((prev: any) => {
        if (order._id === prev._id) {
          return order;
        }

        return prev;
      });
    }
  };

  const { totalCount = 0, items = [] } = mergedOrders;
  useEffect(() => {
    showLeftView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleLoadMore = () => {
    if (!isloading && (orders?.fetchMore || unlockOrders?.fetchMore)) {
      setIsLoading(true);
      fetchOrders();
    }
  };
  return (
    <div className={className}>
      <TwoPanelLayout
        leftView={
          <OrderTable
            orderClassName={className}
            view="unlockedView"
            icon={<Dollar />}
            key={'_id'}
            showLoadMore={
              mergedOrders?.items?.length < mergedOrders?.totalCount
            }
            loadMore={handleLoadMore}
            title={
              <span>
                <span className="title-text">
                  <span className="title-text-holder">My Purchases :</span>
                  <span className="counter-text">{totalCount} Orders </span>
                </span>
                {/* {seleted.label !== 'All' ? seleted.label : ''} */}
              </span>
            }
            selectProps={{ selected, handleChange, onSort: handleSort }}
            data={items.map((item: any) => {
              return {
                image: item?.seller?.profileImage,
                title: item.title,
                subtitle: (
                  <span className="text-capitalize">{`${
                    item?.seller?.pageTitle ?? 'Incognito User'
                  }`}</span>
                ),
                status: item.orderStatus,
                date: dayjs(item.dateOrderStarted || item.createdAt).format(
                  'MMM D, YYYY h:mm A',
                ),
                ...(item.popType === ServiceType.POPLIVE
                  ? {
                      duedate: dayjs(item.dueDate).format('MMM D, YYYY h:mm A'),
                    }
                  : {}),
                ...item,
              };
            })}
            paginationProps={{
              total: totalCount,
              current: parseInt(pageNumber as string) || 1,
              pageSize: PAGE_LIMIT,
              onChange: handlePage,
              nextIcon: <ArrowBack />,
              prevIcon: <ArrowBack />,
              showLessItems: window.innerWidth < 600,
              showPrevNextJumpers: window.innerWidth > 600,
            }}
            options={{
              date: true,
              sDate: true,
              price: false,
            }}
            showPagination={false}
            onRowClick={(row) => {
              setSelectedOrder(row);
              showRightView();
            }}
          />
        }
        rightView={
          <div className="p-20">
            <OrderDetail
              order={selectedOrder}
              updateOrder={updateOrder}
              isSeller={false}
            />
          </div>
        }
      />
    </div>
  );
}
export default styled(MyPurchases)`
  .select-box {
    width: 130px;
    margin: 0 15px 0 0;
  }

  .react-select__value-container {
    font-size: 12px;
    font-weight: 500;
    padding: 0 8px;
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

    .rc-badget-dot {
      display: none;
    }
  }

  .react-select__menu {
    overflow: hidden;
    border: 1px solid var(--pallete-colors-border);
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
    border-radius: 4px;

    .react-select__menu-list {
      padding: 5px;
    }

    .react-select__option {
      background: none;
      color: #8d778d;
      padding: 6px 10px;
      min-width: inherit;
      margin: 0;
      text-align: left;
      font-size: 12px;
      line-height: 15px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;

      &:hover:not(.react-select__option--is-selected),
      &.react-select__option--is-focused:not(
          .react-select__option--is-selected
        ) {
        color: var(--pallete-text-secondary-100);
        background: rgba(230, 236, 245, 0.62);
      }

      &.react-select__option--is-selected {
        color: var(--pallete-text-secondary-100);
        background: none;
      }
    }
  }

  .sort_order {
    width: 30px;
    height: 30px;
    /* border: 1px solid var(--pallete-colors-border); */
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover,
    &.active {
      background: var(--colors-indigo-200);
      color: #fff;
      border-color: var(--colors-indigo-200);

      path {
        fill: #fff;
      }
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;

      .sort-area {
        pointer-events: none;
      }

      &:hover,
      &.active {
        opacity: 0.6;
        background: none;
        color: var(--pallete-text-main);
        border-color: #d9e2ea;

        path {
          fill: #000;
        }
      }
    }
  }
`;
