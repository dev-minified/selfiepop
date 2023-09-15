import {
  LinkTypeName,
  ORDER_STATUS_FILTER_OPTIONS,
  ORDER_STATUS_FILTER_OPTIONS_OBJ,
} from 'appconstants';
import { ArrowBack, ProfleTickIcon, TickStar } from 'assets/svgs';
import OrderTable from 'components/Tables/Order';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  getSalesOrders,
  resetSalesOrders,
  setSelectedOrder,
} from 'store/reducer/Orders';
import { getSortbyParam, parseQuery } from 'util/index';
type Props = {
  onRowClicked?: (row: any) => void;
  showRightView?: () => void;
};
const PAGE_LIMIT = 20;
const SalesRoomListing = (props: Props) => {
  const { onRowClicked, showRightView } = props;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { orders } = useAppSelector((state) => state.profileOrders);
  const [selected, setSelected] = useState<{ label: any; value: any }>(
    ORDER_STATUS_FILTER_OPTIONS[0],
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedOrder = useAppSelector(
    (state) => state.profileOrders.selectedOrder,
  );

  const {
    page: pageNumber,
    orderby,
    filterby,
    order: orderId,
  } = parseQuery(useLocation().search);

  useEffect(() => {
    if (!user?.allowSelling) {
      history.push('/my-profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const resetState = () => {
    dispatch(resetSalesOrders());
  };
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);
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
    const statusFilter =
      ORDER_STATUS_FILTER_OPTIONS.find((v) => v.value === filterby) ||
      ORDER_STATUS_FILTER_OPTIONS[0];
    setSelected(statusFilter);
    setIsLoading(true);
    dispatch(
      getSalesOrders({
        options: paramsList,
        callback: (res) => {
          setIsLoading(false);
          if (!selectedOrder?._id) {
            const findOrderById = res?.items?.find(
              (order: any) => order?._id === orderId,
            );
            findOrderById && setSelected({ label: 'Filter By:', value: '' });
            dispatch(setSelectedOrder(findOrderById || res?.items?.[0]));
          }
        },
      }),
    )
      .unwrap()
      .then(() => {
        setIsLoading(false);
      })
      .catch((e: Error) => {
        setIsLoading(false);
        console.log(e);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, orderby, filterby, orderId]);

  const handleChange = (v: any) => {
    resetState();
    const Parsequery = { page: pageNumber, orderby, filterby };
    Parsequery.filterby = v.value;
    Parsequery.page = '1';
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const handlePage = (page: number) => {
    resetState();
    const Parsequery = { page: pageNumber as string, orderby, filterby };
    const page1 = page.toString();
    if (page1 !== Parsequery.page) {
      dispatch(setSelectedOrder(undefined));
    }
    Parsequery.page = page1;
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const { totalCount = 0, items = [] } = orders;

  // if (isLoading) {
  //   return <RequestLoader isLoading={isLoading} />;
  // }
  const defaultOption =
    ORDER_STATUS_FILTER_OPTIONS_OBJ[ORDER_STATUS_FILTER_OPTIONS[0].value];
  return (
    <OrderTable
      orderClassName="salesOrders widget-sales"
      emptyTitle="You don't have any sales..."
      icon={<TickStar />}
      key={'_id'}
      isloading={isLoading}
      title={
        <span>
          <span className="title-text">
            <span className="title-text-holder">My Sales :</span>
            <span className="counter-text">{totalCount} Orders </span>
          </span>
        </span>
      }
      selectProps={{
        selected: ORDER_STATUS_FILTER_OPTIONS_OBJ[selected.value],
        handleChange,
        defaultValue: defaultOption,
      }}
      data={items.map((item: any, index: number) => {
        const isUserVerified =
          item?.buyer?.isEmailVerified && item?.buyer?.idIsVerified;
        return {
          image: item?.buyer?.profileImage,
          subtitle: (
            <span className="text-uppercase">@{item?.buyer?.username}</span>
          ),
          // subtitle: (
          //   <span className="text-uppercase">
          //     {LinkTypeName[item.popType as keyof typeof LinkTypeName]}
          //   </span>
          // ),
          usertitle: (
            <h4 className="name_title text-uppercase">
              {`${item?.buyer?.pageTitle ?? 'Incognito User'}`}

              {isUserVerified ? (
                <ProfleTickIcon
                  width="15"
                  height="15"
                  fill="var(--pallete-primary-main)"
                />
              ) : null}
            </h4>
          ),
          meta: (
            <span className="text-capitalize">
              {LinkTypeName[item.popType as keyof typeof LinkTypeName]}
            </span>
          ),
          user: item?.buyer,
          title: `${item?.buyer?.pageTitle ?? 'Incognito User'}`,
          status: item.orderStatus,
          price: item.price,
          index: index,
          date: new Date(item.dateOrderStarted).toLocaleDateString(),
          ...item,
        };
      })}
      onRowClick={(row) => {
        dispatch(setSelectedOrder(row));
        // updateOrder(row?._id);
        onRowClicked?.(row);
        showRightView?.();
      }}
      paginationProps={{
        total: totalCount,
        current: parseInt(pageNumber as string) || 1,
        pageSize: PAGE_LIMIT,
        onChange: handlePage,
        showLessItems: true,
        nextIcon: <ArrowBack />,
        prevIcon: <ArrowBack />,
        showPrevNextJumpers: window.innerWidth > 600,
      }}
    />
  );
};

export default SalesRoomListing;
