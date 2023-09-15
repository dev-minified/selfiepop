import { getManagedPendingRequests } from 'api/app';
import {
  ChevronRight,
  CrownIcon,
  Link,
  PersonIcon,
  ProductAndServicesIcon,
} from 'assets/svgs';
import SliderTab from 'components/SliderTab';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

interface Props {
  className?: string;
}

function ProfileSlider({ className }: Props): ReactElement {
  const history = useHistory();

  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);
  useEffect(() => {
    if (user?._id) {
      getManagedPendingRequests()
        .then((res: { pending: number; status: boolean }) => {
          setPendingCount(res.pending);
        })
        .catch(console.log);
    }
  }, [user?._id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return (
    <>
      <div className={`${className} slider-links`} id="profile_links">
        <SliderTab
          title="Edit Profile"
          ArrowIcon={<ChevronRight />}
          Icon={<PersonIcon />}
          onClickTab={() => {
            history.push('/my-profile/bio');
          }}
        />
        <SliderTab
          title="Links "
          ArrowIcon={<ChevronRight />}
          Icon={<Link />}
          onClickTab={() => {
            history.push('/my-profile/links');
          }}
        />
        <SliderTab
          title="Products & Services"
          ArrowIcon={<ChevronRight />}
          Icon={<ProductAndServicesIcon />}
          onClickTab={() => {
            history.push('/my-profile/services/edit');
          }}
        />
        <SliderTab
          title="Themes"
          ArrowIcon={<ChevronRight />}
          Icon={
            <img
              src="/assets/images/svg/theme-settings.svg"
              alt="/assets/images/svg/theme-settings.svg"
            />
          }
          onClickTab={() => {
            history.push('/my-profile/themes-listing');
          }}
        />
        <SliderTab
          title="Analytics"
          ArrowIcon={<ChevronRight />}
          Icon={
            <img
              src="/assets/images/svg/analytics.svg"
              alt="/assets/images/svg/analytics.svg"
            />
          }
          onClickTab={() => {
            history.push('/my-profile/analytics');
          }}
        />
        {user?.enableTmRecieve && (
          <SliderTab
            title="Managed Accounts"
            ArrowIcon={<ChevronRight />}
            extra={
              <span className="account-status">{pendingCount} PENDING</span>
            }
            Icon={<CrownIcon />}
            onClickTab={() => {
              history.push('/my-profile/managed-accounts');
            }}
          />
        )}
      </div>
    </>
  );
}
export default styled(ProfileSlider)`
  &.slider-links {
    /* border-top: 1px solid #d9dce0; */
  }

  .account-status {
    position: absolute;
    right: 50px;
    background: #7290a8;
    color: #fff;
    font-size: 12px;
    line-height: 14px;
    padding: 2px 7px;
    font-weight: 500;
    border-radius: 3px;
    top: 50%;
    transform: translate(0, -50%);

    .sp_dark & {
      background: #d63d87;
    }
  }
`;
