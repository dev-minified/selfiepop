import useQuery from 'hooks/useQuery';
import { Link } from 'react-router-dom';
import Button from '../../components/NButton';

export default function MyProfile() {
  const { orderId } = useQuery();

  return (
    <>
      <div className="content_component mb-80">
        <div className="profile--info mb-30">
          <h2 className="text-center">Contest This Order</h2>
          <h3 className="text-center warrper sm">
            Please select which of these options best represents your issue:
          </h3>
        </div>

        <div className="d-flex justify-content-center mb-30">
          <Link
            className="w-100"
            to={`/review/contest-this-order-info?orderId=${orderId}`}
          >
            <Button type="primary" size="x-large" block>
              WHAT I RECEIVED WAS OF A BAD QUALITY
            </Button>
          </Link>
        </div>
        <div className="d-flex justify-content-center ">
          <Link
            className="w-100"
            to={`/review/contest-this-order-info?orderId=${orderId}`}
          >
            <Button type="primary" size="x-large" block>
              I DID NOT RECEIVE WHAT I ORDERED
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
