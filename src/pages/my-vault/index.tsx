import EmtpyMessageData from 'components/EmtpyMessageData';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import TwoPanelLayout from 'layout/TwoPanelLayout';
import { ReactElement, useEffect } from 'react';
import { isDesktop } from 'react-device-detect';
import { resetVaultState } from 'store/reducer/vault';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import VaultMiddleMedia from './VaultMiddleMedia';
import VaultRightView from './VaultRightView';
import VaultRoomListing from './VaultRoomListing';

const Orders = ({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement => {
  const { userId } = parseQuery(location.search);
  const dispatch = useAppDispatch();

  const { showLeftView } = useControllTwopanelLayoutView();
  useEffect(() => {
    showLeftView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      dispatch(resetVaultState());
    };
  }, []);
  const RightView = () => {
    return (
      <>
        {userId ? (
          <>
            {' '}
            <VaultMiddleMedia />
            {isDesktop && <VaultRightView className="user-detail" />}
          </>
        ) : (
          <EmtpyMessageData text={'Please select a user.'} />
        )}
      </>
    );
  };
  return (
    <div className={className}>
      <TwoPanelLayout
        rightSubHeader={false}
        leftSubHeader={false}
        defaultBackButton={false}
        leftView={<VaultRoomListing />}
        rightView={<RightView />}
        classes={{
          rightView: `vault-right-view small-width ${
            !userId ? 'not-right-view' : ''
          }`,
          content: 'p-0',
          leftView: 'small-height small-width',
        }}
      />

      {/* <ThreePanelLayout
          LeftHeader={<BacktopComponent />}
          onDefaultBackclick={() => history.push(`/vault`)}
          leftView={<VaultRoomListing />}
          middleView={<RightView />}
          rightView={isDesktop && <VaultRightView className="user-detail" />}
          classes={{ rightView: 'vault-right-view' }}
        /> */}
    </div>
  );
};
export default styled(Orders)`
  .custom-scroll-bar {
    .rc-scollbar {
      width: 100%;
    }
  }

  .col-inner-content {
    @media (max-width: 767px) {
      min-height: inherit;
    }

    > div {
      @media (max-width: 767px) {
        min-height: inherit;
      }
    }

    .sublisting {
      @media (max-width: 767px) {
        min-height: inherit;
      }
    }

    .user-listing-scroll {
      @media (max-width: 767px) {
        min-height: 0;
        flex-grow: 1;
        flex-basis: 0;
      }
    }
  }

  .vault-right-view {
    .col-inner-content {
      display: flex;
      flex-wrap: wrap;
      height: 100%;
    }
  }
  .not-right-view {
    .col-inner-content {
      display: block;
    }
  }

  .user-detail {
    .scroll-wrap {
      padding: 0 16px;
    }

    .rc-scollbar {
      background: var(--pallete-background-default);
    }
  }
`;
