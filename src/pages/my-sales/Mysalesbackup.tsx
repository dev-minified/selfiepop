import { getOrder, getOrders, refuseOrder } from 'api/Order';
import { LinkTypeName, ORDER_STATUS_FILTER_OPTIONS } from 'appconstants';
import { ArrowBack, TickStar } from 'assets/svgs';
import OrderTable from 'components/Tables/Order';
import { OrderStatus } from 'enums';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useRequestLoader from 'hooks/useRequestLoader';
import TwoPanelLayout from 'layout/TwoPanelLayout';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import { getSortbyParam, parseQuery } from 'util/index';
import OrderDetail from './[id]';

const PAGE_LIMIT = 5;

export default function MySales() {
  const history = useHistory();
  const { showLeftView, showRightView } = useControllTwopanelLayoutView();
  const [selected, setSelected] = useState<{ label: any; value: any }>({
    label: 'All',
    value: '',
  });
  const [orders, setOrders] = useState<any>({});
  const [selectedOrder, setSelectedOrder] = useState<any>({});
  const {
    page: pageNumber,
    orderby,
    filterby,
    order: orderId,
  } = parseQuery(useLocation().search);
  const { withLoader } = useRequestLoader();
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
    withLoader(getOrders(paramsList))
      .then((res) => {
        setOrders(res);
        if (!selectedOrder?._id) {
          const findOrderById = res?.items?.find(
            (order: any) => order._id === orderId,
          );
          findOrderById && setSelected({ label: 'Filter By:', value: '' });
          setSelectedOrder(findOrderById || res?.items?.[0] || {});
        }
      })
      .catch((e: Error) => console.log(e));
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

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev: any) => ({
      ...prev,
      items:
        prev.items?.map((o: any) =>
          o._id === orderId ? { ...o, orderStatus: status } : o,
        ) || [],
    }));
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder((prev: any) => ({ ...prev, orderStatus: status }));
    }
  };

  const onRefuseOrder = (orderId: string) => {
    swal({
      title: 'Order Cancelation!',
      text: 'Are you sure you want to cancel the order?',
      icon: 'warning',
      buttons: ['Close', 'Ok'],
    }).then(async (isRefuse) => {
      if (isRefuse) {
        const res = await withLoader(refuseOrder(orderId)).catch(() => {
          swal('Error', 'Could not process your request', 'error');
        });

        if (res) {
          swal('Success', 'Order has been canceled', 'success');
          updateOrderStatus(orderId, OrderStatus.CANCELED);
        }
      }
    });
  };

  const updateOrder = async (orderId: string) => {
    const order = await getOrder(orderId).catch(console.log);
    if (order) {
      setOrders((prev: any) => {
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

  const { totalCount = 0, items = [] } = orders;

  useEffect(() => {
    showLeftView();
  }, []);

  return (
    <TwoPanelLayout
      leftView={
        <OrderTable
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
              title: `${item?.buyer?.firstName || ''} 
                    ${item?.buyer?.lastName || ''}`,
              status: item.orderStatus,
              price: item.price,
              date: new Date(item.dateOrderStarted).toLocaleDateString(),
              ...item,
            };
          })}
          onRowClick={(row) => {
            setSelectedOrder(row);
            updateOrder(row._id);
            showRightView();
          }}
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
        />
      }
      rightView={
        <div className="p-20">
          <OrderDetail
            isSeller={true}
            order={selectedOrder}
            onRefuseOrder={onRefuseOrder}
            updateOrder={updateOrder}
          />
        </div>
      }
    />
  );
}
