import { StatisticsIcon } from 'assets/svgs';
import { RequestLoader } from 'components/SiteLoader';
import Modal from 'components/modal';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect } from 'react';
import {
  getPostStatistics,
  onToggleModal,
} from 'store/reducer/statisticsModelState';
import styled from 'styled-components';
type DeleteModelProps = {
  onClick?: (...args: any[]) => void;
  title?: string;
  subTitle?: string;
  className?: string;
  onClose?: (...args: any[]) => void;
  isOpen?: boolean;
  managedAccountId?: string;
};
export const LineChartData = [
  {
    month: dayjs('2021-03-09').format('DD MMM'),
    price: 0,
  },
  {
    month: dayjs('2021-03-10').format('DD MMM'),
    price: 3000,
  },
  {
    month: dayjs('2021-03-11').format('DD MMM'),
    price: 2000,
  },
  {
    month: dayjs('2021-03-15').format('DD MMM'),
    price: 3490,
  },
];
const GalleryLoader = styled(RequestLoader)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
function StatisTicsModal({ className, managedAccountId }: DeleteModelProps) {
  const isOpen = useAppSelector((state) => state.stateModal.isOpen);
  const post = useAppSelector((state) => state.stateModal.post);
  const fetchingPostStatistics = useAppSelector(
    (state) => state.stateModal.fetchingPostStatistics,
  );
  const postStatistics = useAppSelector(
    (state) => state.stateModal.postStatistics,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    isOpen &&
      post?._id &&
      dispatch(
        getPostStatistics({
          postId: post?._id || '',
          params: {
            sellerId: managedAccountId,
          },
        }),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const handleClose = () => {
    dispatch(onToggleModal({ isOpen: false, post: {}, postStatistics: {} }));
  };

  return (
    <div>
      {isOpen && (
        <Modal
          isOpen={!!isOpen}
          onClose={handleClose}
          showFooter={false}
          className={`${className}`}
          title={
            <>
              <span className="img-title img-delete">
                <StatisticsIcon />
              </span>{' '}
              POST STATISTICS
            </>
          }
        >
          <div className="modal-content-holder">
            <p>Some stats may be delayed or approximated.</p>

            {fetchingPostStatistics ? (
              <GalleryLoader isLoading color="var(--pallete-primary-main)" />
            ) : (
              <>
                <ul className="list-post-stats">
                  <li>
                    <span className="title">PURCHASES</span>{' '}
                    <span className="circle"></span>{' '}
                    <span className="value">
                      $
                      {postStatistics?.payToView
                        ? postStatistics.payToView.toFixed(2)
                        : '00.00'}
                    </span>
                  </li>

                  <li>
                    <span className="title">LIKES</span>{' '}
                    <span className="circle grey"></span>
                    <span className="value">
                      {postStatistics?.totalLikes || 0}
                    </span>
                  </li>
                  <li>
                    <span className="title">COMMENTS</span>{' '}
                    <span className="circle blue"></span>
                    <span className="value">
                      {postStatistics?.totalComments || 0}
                    </span>
                  </li>
                  <li>
                    <span className="title">TIPS </span>
                    <span className="circle brown"></span>
                    <span className="value">
                      ${postStatistics?.totalTips || '00.00'}
                    </span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
export default styled(StatisTicsModal)`
  max-width: 375px;
  margin: 0.5rem auto;
  padding: 0 0.5rem;

  .modal-content {
    padding: 25px 20px;
  }

  .modal-header {
    padding: 0 0 12px;
    border: none;
  }

  .modal-body {
    padding: 10px 20px 0;
    margin: 0 -20px;
    max-height: calc(100vh - 130px);
    overflow: auto;

    p {
      margin: 0 0 11px;
    }
  }

  .recharts-responsive-container {
    margin: 0 0 10px;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;

    .img-title {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .modal-content-holder {
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    color: #495057;
  }

  .list-post-stats {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
    line-height: 17px;
    color: #000;
    font-weight: 400;

    li {
      border-bottom: 1px solid #f4f3f3;
      padding: 9px 0 9px 14px;
      position: relative;
      display: flex;
      justify-content: space-between;

      &:last-child {
        border: none;
      }

      &:hover {
        .title {
          color: #000;
        }
      }
    }

    .title {
      font-weight: 500;
      color: #a6a7b0;
      text-transform: uppercase;
      transition: all 0.4s ease;
    }

    .circle {
      position: absolute;
      left: 0;
      top: 50%;
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: #eed7a9;
      transform: translate(0, -50%);

      &.sky-blue {
        background: #90caf8;
      }

      &.orange {
        background: #f9d089;
      }

      &.grey {
        background: #a6a7b0;
      }

      &.blue {
        background: #2c99c2;
      }

      &.brown {
        background: #9f8146;
      }

      &.light-grey {
        background: #c4c4c4;
      }
    }
  }
`;
