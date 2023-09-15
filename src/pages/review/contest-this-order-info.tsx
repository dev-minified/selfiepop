import { getOrder, raiseDispute } from 'api/Order';
import Button from 'components/NButton';
import { RequestLoader } from 'components/SiteLoader';
import SelfiepopText from 'components/selfipopText';
import useQuery from 'hooks/useQuery';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
export default function MyProfile() {
  const history = useHistory();
  const { orderId } = useQuery();
  const [order, setOrder] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const { seller } = order || {};

  const { pageTitle } = seller || {};

  const onSubmit = async () => {
    setisSubmitting(true);
    try {
      await raiseDispute({ orderId: order._id });
      return history.push(`/my-purchases?order=${order._id}`);
    } catch (e) {}
    setisSubmitting(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getOrder(orderId as string)
      .then((res) => {
        setIsLoading(false);
        setOrder(res);
      })
      .catch((e: Error) => {
        setIsLoading(false);

        console.log(e);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);
  if (isLoading) {
    return <RequestLoader isLoading />;
  }
  if (!order._id) return null;
  return (
    <>
      <div className="content_component mb-80">
        <div className="profile--info mb-30">
          <h2 className="text-center">Contest This Order</h2>
        </div>
        <div>
          <p className="text-justify" style={{ fontSize: '20px' }}>
            If you believe that <strong>{pageTitle}</strong> did not give you
            the thing that they said they would, per our terms of service
            <SelfiepopText /> will review the work to see if the seller provided
            you what was promised.
            <br /> <br /> If they did not complete what was promised then the
            order will be canceled and you will be fully refunded. However
            please note that according to our terms of service, we can not be
            responsible for judging the quality of the work that has been
            provided.
            <br /> <br /> If you simply have not recieved what the seller
            advertised, please click the button below.
          </p>
        </div>
        <div className="d-flex justify-content-center mb-30 mt-30">
          <Button
            type="primary"
            size="x-large"
            block
            onClick={onSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            I DID NOT RECIEVE WHAT I ORDERED
          </Button>
        </div>
        <div>
          <p className="text-justify" style={{ fontSize: '20px' }}>
            If you did recieve what you ordered and are simply unhappy with it,
            you can submit a complaint to the seller when you rate them. Your
            seller may then choose to refund your order at their own discretion.
            <br /> <br />
            If you have not already submitted your rating,{' '}
            <Link to={`/review/rate-your-order?orderId=${order._id}`}>
              <u className="secondary-text">you can do so here</u>
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
