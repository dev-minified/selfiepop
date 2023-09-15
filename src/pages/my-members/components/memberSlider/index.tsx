// import NewButton from 'components/NButton';
import { ChevronRight, SliderScheduledMessageIcon } from 'assets/svgs';
import SliderTab from 'components/SliderTab';
import useAuth from 'hooks/useAuth';
import { stringify } from 'querystring';
import { ReactElement } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

interface Props {
  className?: string;
}

function MemberSlider({ className }: Props): ReactElement {
  const history = useHistory();

  const { user } = useAuth();

  return (
    <>
      <div className={`${className} slider-links`}>
        <SliderTab
          className="tab-item-link"
          title="Schedule a Post / Message"
          ArrowIcon={<ChevronRight />}
          Icon={<SliderScheduledMessageIcon />}
          onClickTab={() => {
            history.push(
              `/my-members/sliders?${stringify({
                slider: 'schedule',
                step: 1,
              })}`,
            );
          }}
        />
        {user?.rulesActive && (
          <SliderTab
            className="tab-item-link"
            title="Rules Management"
            ArrowIcon={<ChevronRight />}
            Icon={<SliderScheduledMessageIcon />}
            onClickTab={() => {
              history.push(`/my-members/members-content/rules`);
            }}
          />
        )}
        {/* <SliderTab
          className="tab-item-link"
          title="Your Subscribers"
          ArrowIcon={<ChevronRight />}
          Icon={<span className="icon-counter">{member}</span>}
          showUnRead={true}
          UnReadCount={unreadMessage as number}
          onClickTab={() => {
            history.push(
              `/my-profile/sliders?${stringify({
                slider: 'subscriber',
              })}`,
            );
          }}
        /> */}
        {/* <SliderTab
          className="tab-item-link"
          title="Manage Your Galleries"
          ArrowIcon={<ChevronRight />}
          Icon={<SliderScheduledMessageIcon />}
          onClickTab={() => {
            history.push(
              `/my-profile/sliders?${stringify({
                slider: 'galleries',
              })}`,
            );
          }}
        /> */}
      </div>
    </>
  );
}
export default styled(MemberSlider)`
  &.slider-links {
    padding: 20px 0 0;
    background: var(--pallete-background-gray-secondary-light);
    border-top: 1px dashed #d9dce0;

    .tab-item-link {
      &:first-child {
        border-top: 1px dashed #d9dce0;

        .sp_dark & {
          border-top-style: solid;
          border-top-color: var(--pallete-colors-border);
        }
      }
    }

    .list-course-detail {
      background: var(--pallete-background-default);
      font-size: 20px;
      line-height: 24px;

      @media (max-width: 767px) {
        font-size: 18px;
      }

      li {
        border-bottom: 1px dashed #d9dce0;

        .sp_dark & {
          border-bottom: 1px solid var(--pallete-colors-border);
        }
      }

      .link-item {
        padding: 20px 75px 20px 85px;
        min-height: 84px;
        display: flex;
        align-items: center;

        @media (max-width: 767px) {
          padding: 20px 45px 20px 65px;
          min-height: inherit;
        }
      }

      .img-arrow {
        border: none;
        background: none;
        width: 10px;
        color: #727272;

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }

      .img-link {
        svg {
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
