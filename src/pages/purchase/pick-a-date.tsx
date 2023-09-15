import { fetchCards } from 'api/billing';
import { updateOrder } from 'api/Order';
import { getPopLiveAvailability } from 'api/Pop';
import DateRangeSelector from 'components/DateSelector';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { parseQuery } from 'util/index';
export default function MyProfile() {
  const order = useAppSelector((state) => state.checkout?.order);
  const buyer = {
    pageTitle: order?.seller?.pageTitle || '',
  };
  const history = useHistory();
  const location = useLocation();
  const { order: orderId, type } = parseQuery(location.search);
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (order?.pop?._id) {
      getPopLiveAvailability(order.popId._id)
        .then((res) => {
          if (res?.availableSlotsToBook) {
            setAvailability(res.availableSlotsToBook);
          }
        })
        .catch((e: Error) => console.log(e));
    }
  }, [order]);

  const onNext = async (popLiveDateTime: Date) => {
    if (user) {
      const body = {
        popLiveDateTime,
        buyer: user._id,
        chimeAction: 'addEvent',
      };
      await updateOrder(orderId as string, body).catch(() => {});
      const StripeId = user?.stripe?.customerId;

      if (StripeId) {
        const response = await fetchCards();
        if (response.sources?.length > 0) {
          return history.push(
            `/${username}/purchase/add-a-card-and-checkout?order=${orderId}&type=${type}`,
          );
        }
      }
      return history.push(
        `/${username}/purchase/add-a-card-and-checkout?order=${orderId}&type=${type}`,
      );
    }
  };
  return (
    <>
      <div className="profile--info mb-30 mb-md-50">
        <h1 className="text-center">
          Great&nbsp;
          <span className="primary-text">
            {`${user?.pageTitle ?? 'Incognito User'}`}
          </span>
        </h1>
        <h3 className="text-center">
          When would you like to schedule your appointment with
          <span className="primary-text">
            &nbsp;{buyer?.pageTitle ?? 'Incognito User'}&nbsp;?
          </span>
        </h3>
      </div>

      <div className="mb-30">
        <DateRangeSelector availability={availability} onSelect={onNext} />

        {/* <div className="d-flex justify-content-center mt-50 mb-15">
          <Button isLoading={loading} onClick={onNext}>
            NEXT
          </Button>
        </div> */}
      </div>
    </>
  );
}
