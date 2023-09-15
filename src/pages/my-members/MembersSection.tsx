// import NewButton from 'components/NButton';
import {
  ChevronRight,
  CrownIcon,
  FireIcon,
  FolderSvg,
  MembersMenuIcon,
  StarEmpty,
} from 'assets/svgs';
import LibraryModal from 'components/LibraryView';
import SliderTab from 'components/SliderTab';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

interface Props {
  className?: string;
}

function MemberSlider({ className }: Props): ReactElement {
  const history = useHistory();
  const { user } = useAuth();
  const [isNewListModelOpen, onNewListOpenModel, onNewListCloseModel] =
    useOpenClose();

  return (
    <>
      <div className={`${className} slider-links`}>
        <SliderTab
          className="tab-item-link"
          title="Members"
          ArrowIcon={<ChevronRight />}
          Icon={
            <MembersMenuIcon width={28} height={28} className="default-size" />
          }
          onClickTab={() => {
            history.push(`/my-members/subscriber`);
          }}
        />
        <SliderTab
          className="tab-item-link"
          title="Member Content"
          ArrowIcon={<ChevronRight />}
          Icon={<StarEmpty width={22} height={22} className="default-size" />}
          onClickTab={() => {
            history.push(`/my-members/members-content`);
          }}
        />
        <SliderTab
          className="tab-item-link"
          title="Membership Levels"
          ArrowIcon={<ChevronRight />}
          Icon={<FireIcon width={14} height={20} className="default-size" />}
          onClickTab={() => {
            history.push(`/my-members/member-level`);
          }}
        />
        {user?.enableTmSend && (
          <SliderTab
            className="tab-item-link"
            title="Manage Your Team"
            ArrowIcon={<ChevronRight />}
            Icon={<CrownIcon />}
            onClickTab={() => {
              history.push(`/my-members/team-members`);
            }}
          />
        )}
        <SliderTab
          className="tab-item-link edit-library"
          title="Edit Library"
          ArrowIcon={<ChevronRight />}
          Icon={<FolderSvg />}
          onClickTab={() => {
            onNewListOpenModel();
          }}
        />
        {isNewListModelOpen && (
          <LibraryModal
            showActionFooter={false}
            isOpen={isNewListModelOpen}
            onCancel={() => {
              onNewListCloseModel();
            }}
          />
        )}
      </div>
    </>
  );
}
export default styled(MemberSlider)`
  &.slider-links {
    /* padding: 20px 0 0; */
    background: var(--pallete-background-gray-secondary-light);
    /* border-top: 1px dashed #D9DCE0; */

    .tab-item-link {
      &:first-child {
        /* border-top: 1px dashed #D9DCE0; */
      }
    }

    .list-course-detail {
      background: var(--pallete-background-default);

      /* .link-item {
        padding: 20px 75px 20px 70px;
        min-height: 60px;
        display: flex;
        align-items: center;

        @media (max-width: 767px) {
          padding: 20px 45px 20px 65px;
          min-height: inherit;
        }
      } */

      /* .img-arrow {
        border: none;
        background: none;
        width: 10px;
        color: #727272;

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      } */

      .img-link {
        svg:not(.default-size) {
          width: 100%;
          height: 100%;
        }

        circle {
          fill: var(--pallete-primary-main);
        }

        .rect-circle {
          fill: var(--pallete-primary-main);
        }

        .img-calendar {
          rect {
            stroke: var(--pallete-primary-main);
          }
        }
      }
    }
  }

  .link-item-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .title-text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }

    .unread-msg {
      background: var(--pallete-background-gray-secondary-200);
      border-radius: 6px;
      padding: 7px 10px;
      color: var(--pallete-text-secondary);
      font-size: 18px;
      line-height: 21px;

      svg {
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px 0 0;
      }

      .number {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

  .icon-counter {
    font: 500 18px/1 'Roboto', sans-serif !important;
    width: 100%;
    height: 100%;
    color: #fff;
    background: var(--pallete-primary-main);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
