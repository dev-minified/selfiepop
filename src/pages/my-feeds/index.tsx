import { useAppSelector } from 'hooks/useAppSelector';
import { ReactElement, useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';
import { getOperatingSystem } from 'util/index';
import NewFeedLeftView from './NewFeedLeftView';
import NewFeedRightView from './NewFeedRightView';

const calaculateFeedHeight = () => {
  setTimeout(() => {
    const ops = getOperatingSystem();
    const homeFeeds = document.querySelector('.home_feeds') as HTMLDivElement;
    let height = ops.isMac && isMobileOnly ? 70 : 0;

    const bottomnav = document.querySelector('.appmobileView .site_main_nav');
    if (bottomnav) {
      height += bottomnav.getBoundingClientRect().height;
    }
    if (homeFeeds) {
      const hdetals = homeFeeds.getBoundingClientRect();
      homeFeeds.style.height = `calc(100vh - ${hdetals?.top + height}px)`;
    }
  }, 100);
};
const NewFeed = ({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement => {
  const isNotificationBarClosed = useAppSelector(
    (state) => state.global.emailNotificationClosedByUser,
  );
  useEffect(() => {
    calaculateFeedHeight();
    return () => {};
  }, [isNotificationBarClosed]);

  return (
    <div className={className}>
      <div className="feeds-area home_feeds">
        <NewFeedLeftView />
        {!isMobileOnly && <NewFeedRightView />}
      </div>

      {/* <TwoPanelLayout
          rightSubHeader={false}
          leftSubHeader={false}
          defaultBackButton={false}
          leftView={<NewFeedLeftView />}
          rightView={<NewFeedRightView />}
          classes={{
            rightView: `vault-right-view ${!userId ? 'not-right-view' : ''}`,
            content: 'p-0',
            leftView: 'small-height large-width',
          }}
        /> */}
    </div>
  );
};
export default styled(NewFeed)`
  .feeds-area {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    width: 100%;
    /* overflow: scroll; */
    @media (max-width: 767px) {
      /* height: calc(100vh - 120px); */
    }
  }

  .all-subs-section {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    height: 100%;
  }

  .all-subs-posts {
    height: 100%;
    margin-top: 0 !important;
  }

  .posts-wrap {
    height: 100%;
    border-right: 1px solid var(--pallete-colors-border);

    .virtual-item {
      position: relative;

      &:after {
        position: absolute;
        left: 32px;
        right: 32px;
        bottom: 0;
        content: '';
        background: var(--pallete-primary-main);
        height: 2px;
      }
    }

    .pop-card {
      padding: 20px 12px 0;
      border: none;
    }

    .card-footer-area {
      border: none;
      margin: 0;
    }
  }

  .list-container {
    padding: 20px 0;
    max-width: 848px;
    margin: 0 auto;
  }

  .all-subs-right-col {
    width: 390px;
    min-width: 390px;
  }
`;
