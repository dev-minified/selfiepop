import SlideAnimation from 'animations/SlideAnimation';
import { getProfileOrdersList } from 'api/Order';
import { fetchUserByName } from 'api/User';
import { getMemberShipsByUserId } from 'api/sales';
import { RequestLoader } from 'components/SiteLoader';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { ReactElement, useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useHistory, useParams } from 'react-router-dom';
import {
  resetVisitorProfile,
  setActiveProfileMemberShip,
  setProfileSubscription,
  setVisitorProfile,
} from 'store/reducer/profileVisitor';
import styled from 'styled-components';
import ProfileVisitorLeftSide from './ProfileVisitorLeftSide';
import UserRightDetails from './UserRightDetails';
const PageLoaderWrapper = styled(RequestLoader)`
  position: fixed;
  /* left: 50%; */
  top: 50%;
  width: 100%;
`;
const NewFeed = ({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement => {
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { username = '' } = useParams<{ username: string }>();
  let controller: any;
  const fetchUserMemberShips = async (sellerId: string) => {
    try {
      const subs = await getMemberShipsByUserId(
        sellerId,
        {},
        {
          ignoreStatusCodes: [404],
        },
      );
      const activePremium = subs?.meberships?.find((member: any) => {
        if (member?.isActive && !!member?.price) {
          return true;
        }
        return false;
      });
      const defMembership = subs?.meberships?.find((member: any) => {
        return member?.isActive;
      });
      return activePremium ? activePremium : defMembership;
    } catch (error) {
      return null;
    }
  };

  const fetchUserSub = async (
    sellerId: string,
  ): Promise<{ error: boolean; data: any }> => {
    // setTimeout(() => controller.abort(), 500);
    try {
      const data = await getProfileOrdersList(
        {
          userId: sellerId,
          type: 'buyer',
          popType: 'chat-subscription',
        },
        { signal: controller.signal },
      );
      setPageLoading(false);
      if (!data?.cancelled) {
        if (!!data?.totalCount) {
          dispatch(setProfileSubscription(data.items[0]));
          return { error: false, data };
        }

        return { error: false, data: null };
      }

      return { error: true, data: null };
    } catch (error: any) {
      setPageLoading(false);
      console.log({ error: error?.message });
      return { error: true, data: null };
    }
  };
  const fetchProfileUserByName = async () => {
    dispatch(resetVisitorProfile());
    if (!!username) {
      setPageLoading(true);
      controller = new AbortController();

      fetchUserByName(
        username as string,
        {},
        {
          signal: controller.signal,
          errorConfig: { ignoreStatusCodes: [404] },
        },
      )
        .then(async (data) => {
          try {
            // if (data?.allowSelling === false) {
            //   throw new Error('Selling not allowed');
            // }
            if (data?._id) {
              dispatch(setVisitorProfile(data));
              const { error, data: d } = await fetchUserSub(data._id);
              if (!error && d === null) {
                const sub = await fetchUserMemberShips(data._id);
                console.log({ sub });
                dispatch(setActiveProfileMemberShip(sub));
              }
            }
          } catch (error: any) {
            toast.error(error.message);
            history.push('/new-feeds');
          }
        })
        .catch((e) => {
          if (e.message) {
            toast.error(e.message);
            return history.push('/new-feeds');
          } else {
            toast.error('Server Error!');
            return history.push('/new-feeds');
          }
        });
    }
  };

  useEffect(() => {
    // if (username === user?.username) {
    // toast.error('You cannot view your own profile');
    // history.push('/new-feeds');
    // return;
    // }
    fetchProfileUserByName();
    return () => {
      controller?.abort();
    };
  }, [username]);

  if (pageLoading) {
    return (
      <SlideAnimation type="left">
        <PageLoaderWrapper
          isLoading={true}
          className="mt-5"
          width={30}
          height={30}
          color="var(--pallete-primary-main)"
        />
      </SlideAnimation>
    );
  }

  return (
    <div className={className}>
      <SlideAnimation type="left">
        <div className="feeds-area">
          <ProfileVisitorLeftSide />
          {!isMobileOnly && <UserRightDetails />}
        </div>
      </SlideAnimation>
    </div>
  );
};
export default styled(NewFeed)`
  .feeds-area {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    width: 100%;

    @media (max-width: 767px) {
      height: calc(100vh - 120px);
    }
  }

  .all-subs-section {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }

  .left-block {
    height: 100%;

    .rc-tabs-nav {
      overflow: visible;
    }
  }

  .pop-card {
    overflow: hidden;
  }

  .all-subs-posts {
    height: 100%;
    margin-top: 0 !important;
  }

  .posts-wrap {
    height: 100%;
    border-right: 1px solid var(--pallete-colors-border);
  }

  .list-container {
    padding: 20px 0;
  }

  .all-subs-right-col {
    width: 320px;
    min-width: 320px;
  }
  .rc-scollbar {
    height: 100%;
  }
`;
