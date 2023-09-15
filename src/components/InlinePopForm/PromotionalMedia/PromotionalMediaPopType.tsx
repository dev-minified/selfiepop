// import NewButton from 'components/NButton';
import { ChevronRight, PlusFilled } from 'assets/svgs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { stringify } from 'querystring';
import { ReactElement } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { setHeaderTitle } from 'store/reducer/headerState';
import styled from 'styled-components';

import { parseQuery } from 'util/index';

interface Props {
  pushIntoValueArray?: (name: keyof IPop, value: any) => void;
  updateNestedArrayElement?: (name: keyof IPop, id: string, value: any) => void;
  additionalArtOnSuccess?: (file: any) => void;
  additionalArt?: IAdditionalArt[];
  onChangeHandlerandSave: Function;
  ShowPopUpAlert?: Function;
  isShow?: boolean;
  className?: string;
  value?: Record<string, any>;
}

function PromotionalMediaPopType({ className }: Props): ReactElement {
  const location = useLocation();
  const history = useHistory();
  const st = parseQuery(location.search);
  const dispatch = useAppDispatch();

  const { subType } = st;

  const handleClick = async (steps: Record<string, any>, title: string) => {
    delete st.step;

    history.push(
      `${location.pathname}/subType/${steps.pathStep}?${stringify({
        ...st,
        ...(steps.slider ? { slider: steps.slider } : {}),
        ...(steps.step ? { step: steps.step } : {}),
      })}`,
    );
    dispatch(
      setHeaderTitle({
        title: title,
      }),
    );
  };

  return (
    <>
      <div className={className}>
        <ul className="list-course-detail">
          <li
            onClick={() => {
              handleClick(
                {
                  pathStep: subType,
                  slider: 'PromotionalMedia',
                  step: 1,
                },
                'Add Promotional Media',
              );
            }}
          >
            <div className="link-item">
              <div className="img-link">
                <PlusFilled />
              </div>
              Add Promotional Media
              <span className="img-arrow">
                <ChevronRight />
              </span>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
export default styled(PromotionalMediaPopType)`
  .list-course-detail {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 18px;
    line-height: 22px;
    color: var(--pallete-text-main);
    font-weight: 400;
    background: var(--pallete-background-gray);

    li {
      border-bottom: 1px solid var(--pallete-colors-border);
    }

    .link-item {
      padding: 21px 75px 20px 85px;
      position: relative;
      cursor: pointer;
      transition: all 0.4s ease;

      @media (max-width: 767px) {
        padding: 21px 55px 20px 65px;
      }

      &:hover {
        background: var(--pallete-background-secondary);
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
