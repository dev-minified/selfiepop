import { getOrderVideo, getSellerDetails } from 'api/Order';
import { LogoUpdated } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import { RequestLoader } from 'components/SiteLoader';
import Footer from 'components/partials/footer';
import { toast } from 'components/toaster';
import useAuth from 'hooks/useAuth';
import ShoutoutVideoRegisterView from 'pages/account/components/ShoutoutVideoRegisterView';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import SinglePanelLayout from './SinglePanelLayout';

const PublicVideoLayout: React.FC<{
  className?: string;
  children?: ReactNode;
}> = ({ children, className }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const { loggedIn, user } = useAuth();
  const [order, setOrder] = useState<any>();
  const [orderDetails, setOrderDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useHistory();
  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      getOrderVideo(orderId)
        .then((res) => {
          setOrder(res);
          if (res.sharedUser && res.sharedUser?._id !== user._id) {
            history.push('/');
          }
        })
        .catch((err) => {
          if (err.response?.data?.message === 'Order not Found') {
            toast.error(err.response?.data?.message);
            history.push('/');
          }
        });
      getSellerDetails(orderId)
        .then((res) => setOrderDetails(res))
        .catch(console.log)
        .finally(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className={className}>
      <header className="shoutout-head">
        <strong className="logo-image">
          <LogoUpdated />
        </strong>
        {loggedIn && order && (
          <div className="user-info">
            <span className="name">
              {order ? `${order?.pageTitle ?? 'Incognito User'}` : ''}
            </span>
            <span className="img">
              {order?.profileImage && (
                <ImageModifications
                  imgeSizesProps={{
                    onlyDesktop: true,

                    imgix: { all: 'w=163&h=163' },
                  }}
                  src={order?.profileImage}
                  fallbackUrl={'/assets/images/default-profile-img.svg'}
                  alt="user"
                />
              )}
            </span>
          </div>
        )}
      </header>
      {isLoading ? (
        <RequestLoader isLoading />
      ) : (
        <>
          {loggedIn ? (
            React.cloneElement(children as ReactElement, {
              order: { ...order, pageTitle: orderDetails?.sellerPageTitle },
              orderDetails,
            })
          ) : (
            <SinglePanelLayout>
              <ShoutoutVideoRegisterView order={orderDetails} />
            </SinglePanelLayout>
          )}
        </>
      )}

      <Footer hideTopFooter />
    </div>
  );
};

export default styled(PublicVideoLayout)`
  .shoutout-head {
    background: #000;
    padding: 11px 15px 14px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    margin: 0 0 46px;
    align-items: center;

    @media (max-width: 640px) {
      margin: 0 0 30px;
    }

    .user-info {
      font-weight: 500;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 18px;
      line-height: 22px;

      @media (max-width: 640px) {
        font-size: 16px;
        line-height: 20px;
      }
    }

    .name {
      display: block;
      margin: 0 10px 0 0;

      @media (max-width: 640px) {
        margin: 0 5px 0 0;
      }
    }

    .img {
      display: block;
      width: 44px;
      height: 44px;
      border-radius: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .logo-image {
      width: 154px;
      display: block;

      @media (max-width: 640px) {
        width: 120px;
      }

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }

      path {
        opacity: 1 !important;
      }
    }
  }
`;
