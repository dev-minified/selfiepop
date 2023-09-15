import { MemberLevel, PlusFilled } from 'assets/svgs';
import NewButton from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import { ServiceType } from 'enums';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { stringify } from 'querystring';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { setHeaderProps } from 'store/reducer/headerState';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import MemberLevelForm from './components/MemberLevelForm';
import MemberLevelListing from './components/MemberLevelListing';

const variants = {
  initial: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
  animate: {
    left: '0',
    opacity: 1,
    position: 'relative',
  },
  exit: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
};

type ActionTypes = {
  status?: boolean;
  delete?: boolean;
  close?: boolean;
  toggel?: boolean;
  edit?: boolean;
  view?: boolean;
};
interface Props {
  value?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  className?: string;
  options?: ActionTypes;
  questionActions?: ActionTypes;
  buttonTitle?: string;
  defaultMessage?: string;
  showFooterDisabled?: boolean;
  buttonPosition?: 'top' | 'bottom';
  showHeader?: boolean;
  showCheck?: boolean;
  showFooter?: boolean;
  onChange?: Function;
  managedAccountId?: string;
  user?: any;
}

const PriceVariationPop = ({
  className,
  showHeader = true,
  value,
  showFooter = true,
  managedAccountId,
}: Props) => {
  const history = useHistory();
  const location = useLocation();
  const st = parseQuery(history.location?.search);
  const { levelStep } = st;
  const { popLinksId } = value || { popLinksId: {} };

  const [priceVariations, setPriceVariation] = useState<PriceVariant[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (popLinksId) {
      setPriceVariation((v: any) => {
        return [...v, ...(popLinksId?.priceVariations || [])];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popLinksId?._id]);
  useEffect(() => {
    if (levelStep === '1') {
      dispatch(
        setHeaderProps({
          title: 'Membership Levels',
          backUrl: `/managed-accounts/${managedAccountId}/membership-levels`,
          showHeader: true,
        }),
      );
    } else {
      dispatch(
        setHeaderProps({
          title: 'Membership Levels',
          backUrl: `/managed-accounts/${managedAccountId}`,
          showHeader: true,
        }),
      );
    }
  }, [managedAccountId, levelStep, dispatch]);

  const addNewMemberLevel = (id?: string) => {
    const searchLocation = parseQuery(location?.search);
    const query: any = {
      ...searchLocation,
      levelStep: 1,
    };
    if (id) {
      query.variantId = id;
    }
    history.push({
      pathname: location?.pathname,
      search: stringify(query),
    });
  };

  const isChatSub =
    (st?.subType || popLinksId?.popType) === ServiceType.CHAT_SUBSCRIPTION;
  const getComponents = useCallback(() => {
    return (
      <AnimatePresence initial={false}>
        {levelStep === '1' ? (
          <motion.div
            key="right"
            custom={'right'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants as any}
            style={{ width: '100%', position: 'relative' }}
            transition={{ mass: 0.2, duration: 0.6 }}
            className="left-col"
          >
            {popLinksId?._id ? (
              <MemberLevelForm
                // levelValidationInfo={levelValidationInfo}
                setPriceVariation={setPriceVariation}
                variants={(priceVariations as PriceVariant[]).filter(
                  (p) => !p?.isDeleted,
                )}
                popLinksId={popLinksId}
                managedAccountId={managedAccountId}
              />
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="left"
            custom={'left'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants as any}
            style={{ width: '100%', position: 'relative' }}
            transition={{ mass: 0.2, duration: 0.6 }}
            className="left-col"
          >
            <Card className="pop-card-alt">
              {showHeader && (
                <Card.Header className="card-header-box align-items-start">
                  <div className="header-image">
                    <MemberLevel />
                  </div>
                  <div className="header-text">
                    <strong className="header-title">
                      {isChatSub ? 'Subscription Funnel' : 'Price Variation'}
                    </strong>
                    <p>
                      {isChatSub
                        ? 'Your funnel allows your fans a free subscription in exchange for their contact info. You can then promote your other services or invite them to upgrade their membership for a monthly fee.'
                        : 'Price variants  are an advanced option that allow you to charge different amounts depending on what you are providing to your fan'}
                    </p>
                  </div>
                </Card.Header>
              )}
              {priceVariations
                ?.filter((p) => !p?.isDeleted)
                ?.map((variation: PriceVariant, index: number) => (
                  <MemberLevelListing
                    key={index}
                    level={index + 1}
                    variation={variation}
                    EditView={(id: string) => {
                      addNewMemberLevel(id);
                    }}
                    isDefault={variation?.isDefault}
                    isArchive={variation?.isArchive}
                  />
                ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatSub, showHeader, levelStep, priceVariations, managedAccountId]);

  return (
    <div className={`${className} members-level-wrap`}>
      {getComponents()}
      {showFooter && levelStep !== '1' && (
        <div className="member-button">
          <NewButton
            onClick={() => addNewMemberLevel()}
            type="primary"
            icon={<PlusFilled />}
          >
            <span className="pl-10">Add Next Member Level</span>
          </NewButton>
        </div>
      )}
    </div>
  );
};

export default styled(PriceVariationPop)`
  overflow: hidden;

  &.members-level-wrap {
    .form {
      padding: 35px 25px 15px;
      background: var(--pallete-background-gray-secondary);

      .materialized-input.text-input {
        &.input-active {
          label {
            &:before {
              opacity: 1;
              visibility: visible;
            }
          }
        }
        label {
          background: none;
          z-index: 2;

          &:before {
            z-index: -1;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            content: '';
            background: #1a1a1a;
            height: 8px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
          }
        }
      }
    }

    .footer-links {
      padding: 25px 0;
      text-align: center;
    }

    .pop-card {
      border: none;
    }

    .scheduling-area {
      background: var(--pallete-background-default);

      @media (max-width: 767px) {
        padding: 15px 10px;
      }

      hr {
        display: none !important;
      }

      .rc-scollbar {
        width: 100%;
      }
    }

    .chat-input {
      .text-input {
        margin-bottom: 15px !important;
      }
      .input-wrap {
        margin-bottom: 9px;
      }
      .form-control {
        border: none;
        background: var(--pallete-background-gray-secondary-light);
        height: 60px;
        border-radius: 60px;
        padding: 10px 70px;
        font-weight: 400;
        font-size: 16px;
        &::placeholder {
          color: var(--pallete-primary-main);
          opacity: 0.63;
        }
      }
      .pre-fix {
        width: 22px;
        color: var(--pallete-primary-main);
        top: 50%;
        transform: translate(0, -50%);
        left: 18px;
        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }
      .icon {
        top: 50%;
        transform: translate(0, -50%);
        width: 42px;
        max-width: inherit;
        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }

      hr {
        margin: 0 -25px;
        border-color: var(--pallete-colors-border);
        @media (max-width: 767px) {
          margin: 0 -10px;
        }
      }
      .input-actions {
        padding: 11px 0;
        color: var(--pallete-primary-main);
        .sp_dark & {
          color: rgba(255, 255, 255, 0.8);
        }
        .input-actions__img {
          margin-right: 26px;
          cursor: pointer;
        }
        path {
          fill: currentColor;
        }
      }
    }

    .tab-close {
      position: absolute;
      right: -1px;
      top: 0;
      width: 32px;
      height: 32px;
      border: 1px solid var(--pallete-colors-border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--pallete-primary-main);
      z-index: 10;
      background: var(--pallete-background-default);
      @media (max-width: 767px) {
        border: none;
      }
      &.top-align {
        top: 0;
        right: -1px;
      }
    }

    .input-wrap {
      position: relative;
    }

    .pay-to-view-active {
      .react-emoji {
        .react-input-emoji--wrapper {
          padding-right: 210px;

          @media (max-width: 767px) {
            padding-right: 160px;
          }
        }
      }
    }

    .emoji-wrapper {
      position: relative;
      .icon {
        position: absolute;
        right: 8px;
        top: 8px;
        z-index: 3;
        cursor: pointer;
        transform: none;
      }
    }

    .react-emoji {
      display: block;
      position: relative;

      .react-input-emoji--container {
        margin: 0 !important;
        border: none;
        background: none;
      }

      .react-input-emoji--wrapper {
        background: var(--pallete-background-gray-secondary);
        border-radius: 30px;
        padding: 20px 70px 20px 54px;

        .sp_dark & {
          background: #262626;
        }
      }

      .react-input-emoji--placeholder {
        left: 54px;
        width: calc(100% - 60px);
        color: #bfbfbf;
      }

      .react-input-emoji--input {
        min-height: inherit;
        height: auto;
        margin: 0;
        padding: 0;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: var(--pallete-text-main-700);
        white-space: normal;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .react-input-emoji--button {
        position: absolute;
        left: 18px;
        bottom: 18px;
        color: var(--pallete-primary-main);
        z-index: 2;
        padding: 0;
        .sp_dark & {
          color: rgba(255, 255, 255, 0.8);
        }
        svg {
          fill: currentColor;
        }
      }

      .emoji-mart-search {
        margin-bottom: 6px;
      }

      .react-emoji-picker--wrapper {
        right: auto;
        left: 0;
        height: 215px;
      }

      .emoji-mart {
        width: auto !important;
      }

      .emoji-mart-scroll {
        height: 120px;
      }
    }
    .btn-send {
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 42px;
      cursor: pointer;
      z-index: 2;
      padding: 0;
      top: auto;
      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
    .cursorclick {
      cursor: pointer;
    }
  }

  .member-button {
    text-align: center;
    position: relative;
    padding: 0 0 30px;
  }

  .pop-card {
    overflow: hidden;
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

  .dashedLine {
    margin: 0 -20px;
    border: none;
    height: 1px;
    background: #e6ecf5;
  }

  .price-variation {
    border: 2px solid var(--pallete-primary-main);
    border-radius: 6px;
    margin: 0 0 30px;
    position: relative;

    &:before {
      position: absolute;
      left: 50%;
      width: 2px;
      height: 30px;
      margin: 0 0 0 -1px;
      content: '';
      border-left: 2px dashed var(--pallete-primary-main);
      top: 100%;
    }

    &:last-child {
      margin: 0 0 10px;
    }

    .variation-head {
      padding: 12px 17px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--pallete-primary-main);
      margin: -1px 0 0;

      .button {
        color: #fff;
        font-size: 12px;
        line-height: 15px;
        border: none;
        background: var(--pallete-background-default);
        min-width: 45px;
        padding: 6px;
        text-align: center;
      }
    }

    .heading-text {
      font-size: 15px;
      line-height: 21px;
      color: #fff;
      font-weight: 500;
    }
  }

  .variation-body {
    padding: 18px 18px 8px;

    ul {
      padding: 0;
      list-style: none;
    }
  }

  .subscription-description-list {
    margin: 0 0 7px;
    position: relative;
    overflow: hidden;
    color: var(--pallete-text-secondary-250);
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;

    li {
      margin: 0 0 10px;
    }

    strong {
      color: #414141;
      font-weight: 500;
    }

    .text-color {
      /* color: #000000; */
      color: var(--pallete-text-main);
    }
  }

  .subscription-features-list {
    margin: 0;
    position: relative;
    overflow: hidden;
    color: var(--pallete-text-secondary-250);
    font-weight: 400;
    font-size: 13px;
    line-height: 17px;

    li {
      margin: 0 0 15px;
      padding: 0 0 0 34px;
      position: relative;
    }

    .img {
      position: absolute;
      left: 5px;
      top: 0;
    }

    strong {
      font-weight: 500;
    }

    .text-color {
      color: #000000;
    }
  }
`;
