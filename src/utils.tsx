import swal from 'sweetalert';
import { getOrder } from './api/Order';

const Utils: Record<string, any> = {};

Utils.showAlert = (title: string, icon = 'error', text = '') => {
  swal({
    title,
    text,
    icon,
  });
};

Utils.fetchOrderUser = async (orderID: string) => {
  const order = await getOrder(orderID).catch((e: Error) => console.log(e));
  if (!order) return null;
  const user = order.seller;

  if (user) {
    user.themeName = user.themeColor.colorSetName
      .toLowerCase()
      .replace(' ', '-');
    user.themeNumber = 1;
    if (user.themeName === 'purple-haze') user.themeNumber = 2;
    else if (user.themeName === 'sedona') user.themeNumber = 3;
  }
  return user;
};
export default Utils;
