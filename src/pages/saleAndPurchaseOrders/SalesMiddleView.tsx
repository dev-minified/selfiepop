import { getOrder } from 'api/Order';
import { RightSliderArrow } from 'assets/svgs';
import ComponentsHeader from 'components/ComponentsHeader';
import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
// import TwoPanelLayout from 'layout/TwoPanelLayout';
import OrderDetail from 'pages/my-sales/[id]';
import { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { setSalesOrders, setSelectedOrder } from 'store/reducer/Orders';
import styled from 'styled-components';
import LeftSliderArrow from './../../assets/svgs/svgsFiles/LeftSliderArrow';

interface Props {
  className?: string;
  TopHeader?: boolean;
}
const MySalesRightView = ({ className, TopHeader = true }: Props) => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.profileOrders);

  const selectedOrder = useAppSelector(
    (state) => state.profileOrders.selectedOrder,
  );
  const [nextAndPrev, setNextAndPrev] = useState(selectedOrder?.index || 0);
  useEffect(() => {
    if (selectedOrder?.index != null) {
      setNextAndPrev(selectedOrder?.index);
    }
  }, [selectedOrder?._id]);
  const updateOrder = async (orderId: string) => {
    const order = orderId
      ? await getOrder(orderId).catch(console.log)
      : undefined;
    if (order) {
      const prevIems = [...orders.items];
      const orderIndex = prevIems?.findIndex((o: any) => o?._id === orderId);
      if (orderIndex > -1) {
        prevIems.splice(orderIndex, 1, order);
      }
      dispatch(setSalesOrders({ ...orders, items: prevIems }));
      const newOrder = order._id === selectedOrder?._id ? order : selectedOrder;

      dispatch(setSelectedOrder(newOrder));
    }
  };
  const onTogglePrev = (e: any) => {
    let index = nextAndPrev - 1;
    if (index <= 0) {
      e.preventDefault();
      index = 0;
    }
    setNextAndPrev(index);
    dispatch(setSelectedOrder(orders.items[index] || {}));
  };
  const onToggleNext = (e: any) => {
    let index = nextAndPrev + 1;
    if (index === orders.items.length - 1) {
      e.preventDefault();
      index = orders.items.length - 1;
    }

    setNextAndPrev(index);
    dispatch(setSelectedOrder(orders.items[index] || {}));
  };
  return (
    <div className={`${className} ${!isDesktop ? 'sale-is-Mobile' : ''}`}>
      {TopHeader && (
        <ComponentsHeader
          title={selectedOrder?.title}
          icon={
            <span className="top-icon">
              <span
                className="left-icon"
                onClick={(e) => {
                  if (nextAndPrev > 0) {
                    onTogglePrev(e);
                  }
                }}
              >
                <LeftSliderArrow
                  width={11}
                  height={11}
                  fill={`${
                    nextAndPrev > 0 ? 'currentColor' : 'rgb(235, 238, 241)'
                  }`}
                />
              </span>
              <span
                className="right-icon"
                onClick={(e) => {
                  if (nextAndPrev < orders.items.length - 1) {
                    onToggleNext(e);
                  }
                }}
              >
                <RightSliderArrow
                  width={11}
                  height={11}
                  fill={`${
                    nextAndPrev < orders.items.length - 1
                      ? 'currentColor'
                      : 'rgb(235, 238, 241)'
                  }`}
                />
              </span>
            </span>
          }
        />
      )}

      <div className="scroll-wrapper">
        <Scrollbar
          className="custom-scroll-bar"
          style={{ overflowX: 'hidden' }}
        >
          <OrderDetail
            order={selectedOrder}
            updateOrder={updateOrder}
            isSeller={true}
          />
        </Scrollbar>
      </div>
    </div>
  );
};
export default styled(MySalesRightView)`
  height: 100%;
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  &.sale-is-Mobile {
    height: calc(100vh - 130px);
  }
  .scroll-wrapper {
    flex-grow: 1;
    flex-basis: 0;
    min-height: 0;
  }
  .slide-header {
    border-right: none;
  }
  .top-icon {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--pallete-primary-darker);
    cursor: pointer;

    svg {
      width: 11px;
      height: auto;
      margin: 0 15px 0 0;
    }
  }

  /* padding: 20px;
  @media (max-width: 767px) {
    padding: 20px 10px;
  } */
`;
