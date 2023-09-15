import { getOrder } from 'api/Order';
import ComponentsHeader from 'components/ComponentsHeader';
import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import OrderDetail from 'pages/my-purchases/[id]';
import { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import {
  setMergedPurchaseOrders,
  setSelectedOrder,
} from 'store/reducer/purchaseOrder';
import styled from 'styled-components';
import LeftSliderArrow from './../../assets/svgs/svgsFiles/LeftSliderArrow';
import RightSliderArrow from './../../assets/svgs/svgsFiles/RightSliderArrow';
const PAGE_LIMIT = 10;

interface Props {
  className?: string;
  TopHeader?: boolean;
}

function MyPurchases({ className, TopHeader = true }: Props) {
  const mergedOrders = useAppSelector(
    (state) => state.purchaseOrders.mergedOrders,
  );
  const selectedOrder = useAppSelector(
    (state) => state.purchaseOrders.selectedOrder,
  );
  const dispatch = useAppDispatch();
  const [nextAndPrev, setNextAndPrev] = useState(0);
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
      const prev = mergedOrders;
      const orders = [...prev.items];
      const orderIndex = orders?.findIndex((o: any) => o._id === orderId);
      if (orderIndex > -1) {
        orders.splice(orderIndex, 1, order);
      }
      dispatch(setMergedPurchaseOrders({ ...prev, items: orders }));

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
    dispatch(setSelectedOrder(mergedOrders.items[index] || {}));
  };
  const onToggleNext = (e: any) => {
    let index = nextAndPrev + 1;
    if (index === mergedOrders.items.length - 1) {
      e.preventDefault();
      index = mergedOrders.items.length - 1;
    }
    setNextAndPrev(index);
    dispatch(setSelectedOrder(mergedOrders.items[index] || {}));
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
                  if (nextAndPrev < mergedOrders.items.length - 1) {
                    onToggleNext(e);
                  }
                }}
              >
                <RightSliderArrow
                  width={11}
                  height={11}
                  fill={`${
                    nextAndPrev < mergedOrders.items.length - 1
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
            isSeller={false}
          />
        </Scrollbar>
      </div>
    </div>
  );
}
export default styled(MyPurchases)`
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  height: 100%;
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
`;
