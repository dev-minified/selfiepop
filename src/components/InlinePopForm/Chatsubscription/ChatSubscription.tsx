// import NewButton from 'components/NButton';
// import NewButton from 'components/NButton';
import { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import MemberShipPostPop from '../MemberShipPost/MemberShipPostPop';
import MemberShipSchedulePop from '../MemberShipSchedule/MemberShipSchedulePop';

interface Props {
  className?: string;
}

function ChatSubsPopType({ className }: Props): ReactElement {
  const location = useLocation();

  const st = parseQuery(location.search);

  const getComponents = () => {
    const { subType, slider } = st;
    if (subType === 'chat-subscription' && slider === 'Add_Post') {
      return <MemberShipPostPop />;
    }
    if (subType === 'chat-subscription' && slider === 'schedule') {
      return <MemberShipSchedulePop />;
    }

    return <></>;
  };
  return <div className={className}>{getComponents()}</div>;
}
export default styled(ChatSubsPopType)`
  .list-course-detail {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 18px;
    line-height: 22px;
    color: var(--pallete-text-main);
    font-weight: 400;

    li {
      border-bottom: 1px solid var(--pallete-colors-border);
    }

    .link-item {
      padding: 21px 75px 20px 85px;
      position: relative;
      cursor: pointer;

      @media (max-width: 767px) {
        padding: 21px 55px 20px 65px;
      }
    }

    .img-link {
      width: 40px;
      height: 40px;
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pallete-background-default);
      border-radius: 100%;

      @media (max-width: 767px) {
        left: 15px;
      }
    }

    .img-arrow {
      width: 26px;
      height: 26px;
      border: 1px solid #e7e7e8;
      border-radius: 100%;
      background: var(--pallete-background-default);
      color: var(--pallete-text-main);
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 767px) {
        right: 15px;
      }

      svg {
        width: 8px;
        height: 12px;
      }
    }
  }

  .card-header-box {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.2857;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 25px;

    .header-image {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-main);
      color: #e5e5e5;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-title {
      color: var(--pallete-text-main);
      font-size: 15px;
    }

    .header-text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 12px;
    }

    p {
      margin: 0;
    }
  }
  .sortable {
    margin: 0;
  }
  .couponlisting ul.sortable {
    margin-top: 20px;

    .card--price {
      white-space: nowrap;
    }

    .card--text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }

    .card--title {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .pop-card-alt {
    border: none;

    .card-dragable {
      background: var(--pallete-background-default);

      .sp_dark & {
        background: var(--pallete-background-primary-100);
      }

      &:after {
        border-color: #d9d2da;
      }
    }
  }
`;
