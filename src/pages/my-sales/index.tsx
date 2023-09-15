import { getOrder } from 'api/Order';
import { LinkTypeName, ORDER_STATUS_FILTER_OPTIONS } from 'appconstants';
import { ArrowBack, TickStar } from 'assets/svgs';
import OrderTable from 'components/Tables/Order';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useRequestLoader from 'hooks/useRequestLoader';
import TwoPanelLayout from 'layout/TwoPanelLayout';
import OrderDetail from 'pages/my-sales/[id]';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getSalesOrders,
  setSalesOrders,
  setSelectedOrder,
} from 'store/reducer/Orders';
import styled from 'styled-components';
import { getSortbyParam, parseQuery } from 'util/index';

const PAGE_LIMIT = 5;

function MySalesRightView() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showLeftView, showRightView } = useControllTwopanelLayoutView();
  const { orders } = useAppSelector((state) => state.profileOrders);
  const [selected, setSelected] = useState<{ label: any; value: any }>({
    label: 'All',
    value: '',
  });
  const selectedOrder = useAppSelector(
    (state) => state.profileOrders.selectedOrder,
  );

  const {
    page: pageNumber,
    orderby,
    filterby,
    order: orderId,
  } = parseQuery(useLocation().search);
  const { withLoader } = useRequestLoader();
  useEffect(() => {
    if (!user?.allowSelling) {
      history.push('/my-profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    const pageIndex = Number(pageNumber) || 1;
    const skip = (pageIndex - 1) * PAGE_LIMIT;
    const paramsList: any = {
      skip,
      orderId,
      limit: PAGE_LIMIT,
      sort: getSortbyParam(orderby),
      filter: filterby,
      order: 'desc',
      isActive: true,
    };
    const statusFilter = ORDER_STATUS_FILTER_OPTIONS.find(
      (v) => v.value === filterby,
    ) || { label: 'All', value: '' };
    setSelected(statusFilter);
    withLoader(
      dispatch(
        getSalesOrders({
          options: paramsList,
          callback: (res) => {
            if (!selectedOrder?._id) {
              const findOrderById = res?.items?.find(
                (order: any) => order?._id === orderId,
              );
              findOrderById && setSelected({ label: 'Filter By:', value: '' });
              dispatch(
                setSelectedOrder(findOrderById || res?.items?.[0] || {}),
              );
            }
          },
        }),
      ),
    ).catch((e: Error) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, orderby, filterby, orderId]);

  const handleChange = (v: any) => {
    const Parsequery = { page: pageNumber, orderby, filterby };
    Parsequery.filterby = v.value;
    Parsequery.page = '1';
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const handlePage = (page: number) => {
    const Parsequery = { page: pageNumber, orderby, filterby };
    Parsequery.page = page.toString();
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const updateOrder = async (orderId: string) => {
    const order = await getOrder(orderId).catch(console.log);
    if (order) {
      const prevIems = [...orders.items];
      const orderIndex = prevIems?.findIndex((o: any) => o?._id === orderId);
      if (orderIndex > -1) {
        prevIems.splice(orderIndex, 1, order);
      }
      dispatch(setSalesOrders({ ...orders, items: prevIems }));
      dispatch(
        setSelectedOrder((prev: any) => {
          if (order?._id === prev?._id) {
            return order;
          }

          return prev;
        }),
      );
    }
  };

  const { totalCount = 0, items = [] } = orders;

  useEffect(() => {
    showLeftView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <TwoPanelLayout
        leftView={
          <OrderTable
            orderClassName="salesOrders"
            emptyTitle="You currently do not have any Sales"
            icon={<TickStar />}
            key={'_id'}
            title={
              <span>
                <span className="title-text">
                  <span className="title-text-holder">My Sales :</span>
                  <span className="counter-text">{totalCount} Orders </span>
                </span>
              </span>
            }
            selectProps={{ selected, handleChange }}
            data={items.map((item: any) => {
              return {
                image: item?.buyer?.profileImage,
                subtitle: (
                  <span className="text-uppercase">
                    {LinkTypeName[item.popType as keyof typeof LinkTypeName]}
                  </span>
                ),
                title: `${item?.buyer?.pageTitle ?? 'Incognito User'}`,
                status: item.orderStatus,
                price: item.price,
                date: new Date(item.dateOrderStarted).toLocaleDateString(),
                ...item,
              };
            })}
            onRowClick={(row) => {
              dispatch(setSelectedOrder(row));
              updateOrder(row?._id);
              showRightView();
            }}
            paginationProps={{
              total: totalCount,
              current: parseInt(pageNumber as string) || 1,
              pageSize: PAGE_LIMIT,
              onChange: handlePage,
              showLessItems: window.innerWidth < 600,
              nextIcon: <ArrowBack />,
              prevIcon: <ArrowBack />,
              showPrevNextJumpers: window.innerWidth > 600,
            }}
          />
        }
        rightView={
          <div className="p-20">
            <OrderDetail
              order={selectedOrder}
              updateOrder={updateOrder}
              isSeller={true}
            />
          </div>
        }
      />
    </div>
  );
}
export default styled(MySalesRightView)`
  /* padding: 20px;
  @media (max-width: 767px) {
    padding: 20px 10px;
  } */
`;
