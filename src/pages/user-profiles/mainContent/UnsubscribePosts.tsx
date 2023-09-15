import { ProfleTickIcon } from 'assets/svgs';
import { Card } from 'components/PrivatePageComponents';
import PostBuySection from 'components/PrivatePageComponents/PostBuySection';
import PostCaption from 'components/PrivatePageComponents/PostCaption';
import PrivatePost from 'components/PrivatePageComponents/PrivatePost';
import useUpgradePermission from 'hooks/useUpgradePermission';
import { forwardRef } from 'react';
import styled from 'styled-components';
type IPostType = {
  className?: string;
  onPostUserNameClick?: (...args: any[]) => void | Promise<any>;
  postItem: IPost;
  isSeller?: boolean;
  subSeller?: IUser;
  onSubscribe?: () => Promise<any>;
};
const Post = forwardRef((props: IPostType, ref) => {
  const {
    className,
    postItem,
    isSeller = false,
    subSeller,
    onPostUserNameClick,
    onSubscribe,
  } = props;

  const sellerUser = subSeller;
  const isUserVerified =
    sellerUser?.isEmailVerified && sellerUser?.idIsVerified;
  const item: any = { ...postItem };
  const { ispostText, isMedia, isPaid, timestamp } = useUpgradePermission(
    item,
    isSeller,
  );

  return (
    <div className="pb-20">
      <Card cardClass={`post-card ${className}`} ref={ref}>
        <Card.Header
          ontitleClick={() => {
            if (onPostUserNameClick) {
              onPostUserNameClick?.(item);
            } else {
              window.open(
                `/${sellerUser?.username}`,

                '_blank',
              );
            }
          }}
          img={sellerUser?.profileImage}
          fallbackUrl={'/assets/images/default-profile-img.svg'}
          title={
            <span>
              {sellerUser?.pageTitle ?? 'Incognito User'}
              {isUserVerified ? (
                <ProfleTickIcon
                  width="12"
                  height="12"
                  fill="var(--pallete-primary-main)"
                />
              ) : null}
            </span>
          }
          subTitle={timestamp}
          showRightView={false}
          className="card-header_name"
        />
        {(ispostText || isMedia) && (
          <Card.Body
            caption={ispostText ? <PostCaption postText={item.postText} /> : ''}
          >
            <>
              <BuySections
                item={item}
                isPaid={isPaid}
                user={sellerUser}
                onSubscribe={onSubscribe}
              />
            </>
          </Card.Body>
        )}
      </Card>
    </div>
  );
});
const BuySections = ({
  isPaid,
  item,
  user,
  onSubscribe,
}: {
  isPaid: boolean;
  user?: any;
  item: IPost;
  onSubscribe?: () => Promise<any> | void;
}) => {
  return (
    <>
      <div className="card-private-area">
        <PrivatePost
          title={
            isPaid
              ? 'Unlock to access this content'
              : 'Upgrade to access this content'
          }
          subTitle={isPaid ? 'Pay to access this content' : ''}
        />
        <PostBuySection
          modalHandler={onSubscribe}
          media={item.media}
          buttonTitle={`Subscribe to see ${
            user ? `${user?.pageTitle ?? 'Incognito User'}'s` : ''
          } Posts`}
        />
      </div>
    </>
  );
};
export default styled(Post)``;
