export const getOrderPrice = (order: any) => {
  let price = order?.offerPrice === undefined ? order.price : order?.offerPrice;
  if (order?.priceVariation?._id) {
    price =
      order?.offerPrice === undefined
        ? order?.priceVariation?.price || 0
        : order?.offerPrice;
    if (order.coupon?.amount) {
      price = price - order.coupon.amount < 0 ? 0 : price - order.coupon.amount;
    }
  }
  return price;
};
