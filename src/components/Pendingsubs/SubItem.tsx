import { chatUnsubscribe } from 'api/ChatSubscriptions';
import { InfoIcon, ProfleTickIcon } from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { ExpSub } from '.';
dayjs.extend(utc);

type Props = {
  className?: string;
  sub: ExpSub;
  isCardExpired?: boolean;
};
const commonCss = css`
  display: flex;
  justify-content: space-between;
`;
const TopSide = styled.div`
  ${commonCss};
  margin: 0 0 15px;
`;
const BottomSide = styled.div`
  ${commonCss}
`;
const UserDetails = styled.div`
  display: flex;
  align-items: center;

  .user-image {
    width: 36px;
    height: 36px;
  }
`;
const UserMetaDetails = styled.div`
  padding: 0 0 0 10px;

  .user-name {
    font-weight: 500;
    margin: 0;
    line-height: 19px;

    path {
      fill: currentColor;
    }
  }

  .name {
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    color: #72777d;
  }
`;
const PriceInfo = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
`;
const CardText = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 15px;
  font-weight: 400;
  color: #ff2020;

  svg {
    margin: 0 10px 0 0;
  }
`;
const CardInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: #72777d;

  .button {
    &.button-text {
      font-size: 13px;
      line-height: 20px;
      font-weight: 500;
      padding: 0;
      min-width: inherit;
      margin: 0 0 0 20px;
      border: none;

      &:hover {
        border: none;
      }
    }
  }
`;
const SubsInfo = styled.div``;

const RetryButton = styled(Button)`
  .sp_dark & {
    color: var(--pallete-primary-main);
  }
`;
const getTextInfo = (sub: ExpSub) => {
  const isBefore =
    dayjs.utc(sub?.periodEnd).local().diff(dayjs(), 'minutes') < 0;

  const updateInfo = 'UPDATE PAYMENT INFO';
  const cancelSub = 'Cancelled Subscription';
  const memerbShip = 'Membership does not exist!';
  const allowPurchase = "You don't have permission to purchase!";
  const stopselling = 'Seller stops sellings!';
  const deactivated = 'Seller is Deactivated!';

  if (!sub.buyerId.allowPurchases) {
    return allowPurchase;
  }
  if (!sub.memeberShip) {
    return memerbShip;
  }
  if (sub.sellerId.stopAllSelling) {
    return stopselling;
  }
  if (sub.sellerId.isDeactivate) {
    return deactivated;
  }
  if (isBefore) {
    return updateInfo;
  }
  if (sub.tryHit > 0 && sub.tryHit <= 5) {
    return updateInfo;
  }
  if (sub.tryHit >= 6 || !sub.isActive) {
    return cancelSub;
  }

  return updateInfo;
};
const renderButton = (sub: ExpSub) => {
  if (sub.sellerId?.stopAllSelling) {
    return false;
  }
  const isBefore =
    dayjs.utc(sub?.periodEnd).local().diff(dayjs(), 'minutes') < 0;
  if (
    sub.sellerId.isDeactivate ||
    !sub.buyerId.allowPurchases ||
    !sub.memeberShip
  ) {
    return false;
  }

  if (!isBefore) {
    return false;
  }

  return true;
  // return 'UPDATE PAYMENT INFO';
};
const SubItem = (props: Props) => {
  const { className, sub, isCardExpired } = props;
  const [loading, setLoading] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const user = sub.sellerId;
  const isUserVerified = user.idIsVerified;
  const onRetry = async () => {
    setLoading(true);
    return chatUnsubscribe(sub._id, { autoRenew: true })
      .then((data) => {
        if (data.message) {
          toast.success(data.message);
          setRenewed(true);
        } else {
          setRenewed(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        setRenewed(false);
        setLoading(false);
        if (e.message) {
          toast.error(e.message);
        }
        console.log({ e });
      });
  };
  const allowRetry = renderButton(sub) && !renewed && !sub.isNotAllowRetry;
  const inprogress = allowRetry && sub?.renewStatus === 'PENDING';
  return (
    <div className={className}>
      <TopSide>
        <UserDetails>
          <AvatarStatus
            className="user_img"
            imgSettings={{
              onlyMobile: true,
              imgix: {
                all: 'w=200&h=200',
              },
            }}
            src={user?.profileImage || '/assets/images/default-profile-img.svg'}
            fallbackUrl={'/assets/images/default-profile-img.svg'}
            isActive={false}
          />
          <UserMetaDetails>
            <strong className="user-name">
              {`${user?.pageTitle ?? 'Incognito User'}`}{' '}
              {isUserVerified ? (
                <ProfleTickIcon
                  width="13"
                  height="13"
                  fill="var(--pallete-primary-main)"
                />
              ) : null}
            </strong>
            <div className="name">@{user?.username}</div>
          </UserMetaDetails>
        </UserDetails>
        {sub.memeberShip && allowRetry ? (
          <SubsInfo>
            <PriceInfo>
              ${Number(sub.memeberShip.price).toFixed(2)} mo
            </PriceInfo>
          </SubsInfo>
        ) : null}
      </TopSide>
      <BottomSide>
        <CardText>
          <InfoIcon fill="currentColor" width={15} height={15} />
          {!renewed ? (
            <div className="card_text">
              {isCardExpired
                ? ' Credit card expired'
                : sub.cardStatusMessage || 'Card declined'}
            </div>
          ) : (
            'Subscription Active'
          )}
        </CardText>
        <CardInfo>
          {inprogress ? (
            'Renewal Inprogress'
          ) : (
            <>
              <div className="payment_info">
                {renewed ? 'Subscription Renewed' : getTextInfo(sub)}
              </div>
              {allowRetry ? (
                <RetryButton
                  size="x-small"
                  type="text"
                  className="retry_button"
                  onClick={onRetry}
                  disabled={loading}
                  isLoading={loading}
                >
                  RETRY
                </RetryButton>
              ) : null}
            </>
          )}
        </CardInfo>
      </BottomSide>
    </div>
  );
};

export default styled(SubItem)`
  background-color: var(--pallete-background-gray-lighter);
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 20px;
`;
