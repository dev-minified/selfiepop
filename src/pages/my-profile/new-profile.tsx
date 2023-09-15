import { InfoIcon, PlusFilled } from 'assets/svgs';
import NewButton from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import ToolTip from 'components/tooltip';
import { useAnimationEndHook } from 'hooks/useAnimationEndHook';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useQuery from 'hooks/useQuery';
import { stringify } from 'querystring';
import React, { Fragment, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { removePop } from 'store/reducer/popSlice';
import styled from 'styled-components';
import OldProfile from './index';

interface Props {
  className?: string;
  type: ProfileType;
  link: LINKTYPES;
  isAnimationComplete?: boolean;
  TooltipText?: string;
}

const getHeaderData = (type: ProfileType) => {
  switch (type) {
    case 'links':
      return {
        title: 'Manage Links',
        buttonText: 'New Link',
      };
    case 'services':
      return {
        title: 'Manage Services',
        buttonText: 'Create a New Product or Service',
      };
    default:
      return {
        title: '',
        buttonText: '',
      };
  }
};

const ProfileWrapper: React.FC<Props> = ({
  className,
  link,
  isAnimationComplete,
  TooltipText,
  type,
}) => {
  const { type: isEdit } = useParams<{ type: string }>();
  const { buttonText: serviceButtonText } = getHeaderData(type);
  const qs = useQuery();
  const { ...rest } = qs;
  const dispatch = useAppDispatch();

  const previewPopId = useAppSelector(
    (state) => state.popslice.previewPop?._id,
  );

  const { isAnimationEnd } = useAnimationEndHook({
    isAnimationEnd: isAnimationComplete,
    otherProps: { id: previewPopId },
  });
  useEffect(() => {
    if (previewPopId && isAnimationEnd) {
      dispatch(removePop());
    }
  }, [dispatch, isAnimationEnd, previewPopId]);
  const _CreateServiceOrProduct = useCallback(() => {
    return `/my-profile/pop-list?${stringify({
      type: type === 'services' ? 'service' : 'links',
      ...rest,
    })}`;
  }, [type, rest]);
  return (
    <div className={className}>
      <Scrollbar>
        <div className="innerProfileSection">
          <div className="block-head">
            {type === 'services' && (
              <p>
                Please choose which of your existing offerings you want to add
                to your Pop Page or create a new product or service.
              </p>
            )}
            {!isAnimationEnd
              ? type === 'services' && (
                  <RequestLoader
                    isLoading={true}
                    width="28px"
                    height="28px"
                    color="var(--pallete-primary-main)"
                  />
                )
              : type === 'services' && (
                  <Fragment>
                    <OldProfile
                      type={type}
                      link={link}
                      useDragHandle={false}
                      isMergeLinks={true}
                    />
                  </Fragment>
                )}
            <div className="links-head">
              <Link to={_CreateServiceOrProduct()}>
                <NewButton
                  type={'secondary'}
                  size="middle"
                  block
                  icon={<PlusFilled />}
                  id="add-new-pop"
                >
                  {serviceButtonText}
                </NewButton>
              </Link>
              {!isEdit && (
                <ToolTip overlay={TooltipText} placement="topRight">
                  <span className="link-info">
                    <InfoIcon />
                  </span>
                </ToolTip>
              )}
            </div>
          </div>
          {!isAnimationEnd
            ? type === 'links' && (
                <RequestLoader
                  isLoading={true}
                  width="28px"
                  height="28px"
                  color="var(--pallete-primary-main)"
                />
              )
            : type === 'links' && (
                <OldProfile
                  type={type}
                  link={link}
                  useDragHandle={!Boolean(isEdit)}
                  isMergeLinks={Boolean(isEdit)}
                />
              )}
        </div>
      </Scrollbar>
    </div>
  );
};

export default styled(ProfileWrapper)`
  height: 100%;
  .innerProfileSection {
    padding: 20px 18px;
    .button.button-secondary {
      background: var(--pallete-primary-main);
      &:hover {
        background: var(--colors-indigo-200);
      }
    }
    .links-head {
      display: flex;
      align-items: center;
      a {
        flex-grow: 1;
        flex-basis: 0;
        min-width: 0;
      }
      .link-info {
        width: 40px;
        height: 40px;
        border: 1px solid var(--pallete-primary-main);
        border-radius: 5px;
        min-width: 40px;
        margin: 0 0 0 20px;
        background: var(--pallete-background-default);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s ease;
        &:hover {
          border-color: var(--colors-indigo-200);
          background: var(--colors-indigo-200);
          svg {
            path {
              fill: #fff;
            }
          }
        }
        svg {
          width: 20px;
          height: auto;
          display: block;
          path {
            fill: var(--pallete-primary-main);
            fill-opacity: 1;
            transition: all 0.4s ease;
          }
        }
      }
    }
  }
`;
