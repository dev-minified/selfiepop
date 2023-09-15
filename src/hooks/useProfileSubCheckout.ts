import { orderCreate } from 'api/Order';
import { chargeUser } from 'api/billing';
import { USERCHARGEBACKMESSAGE } from 'appconstants';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import { useHistory } from 'react-router-dom';
import { useAnalytics } from 'use-analytics';
import useAuth from './useAuth';

// Hook
const useProfileSubCheckout = () => {
  const analytics = useAnalytics();
  const history = useHistory();
  const user = useAuth()?.user;

  const checkout = async (order: any) => {
    try {
      const res = await chargeUser(
        {
          orderId: order?._id,
          isCreatingIntent: !!order?.price,
          checkCards: false,
        },
        null,
      );
      // if (user?.stripe?.customerId) {

      if (!res?.success) {
        throw Error(res?.data?.message);
      }

      analytics.track('new_subscription', {
        purchasedFrom: order?.seller?._id,
        member_level_id: ServiceType.CHAT_SUBSCRIPTION,
        purchaseAmount: 0,
      });

      analytics.track('purchase_end', {
        purchasedFrom: order?.seller?._id,
        purchaseTypeSlug: order?.popId?.popType,
        purchaseAmount: order?.price,
        itemId: order?.popId?._id,
      });
      return res;
    } catch (error: any) {
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong please try again!');
      }
    }
  };
  const onSubscribeForChat = async (pop: IPop, selectedV: any) => {
    try {
      if (!user?.allowPurchases) {
        toast.error(USERCHARGEBACKMESSAGE);

        history.replace('/my-profile');
        return;
      }
      const selected = selectedV;

      const requestData: any = {
        questions: [],
        popId: pop?._id,
        vpopId: selected?._id,
        buyer: user?._id,
      };
      const response = await orderCreate(requestData);
      const { order } = response;

      analytics.track('purchase_step_1', {
        purchasedFrom: order.seller._id,
        purchaseTypeSlug: pop.popType,
        purchaseAmount: order?.price,
        itemId: pop?._id,
      });

      return order;
    } catch (error) {
      return error;
    }
  };

  return { onSubscribeForChat, checkout };
};

export default useProfileSubCheckout;
