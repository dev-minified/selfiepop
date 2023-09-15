import { update } from 'api/User';
import { ArrowRightFilled } from 'assets/svgs';
import Button from 'components/NButton';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import ThemeLibrary from 'pages/theme-library';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import { getUserSetupUri, setLocalStorage } from 'util/index';

const InterestSetup = styled.div`
  padding: 0 20px 110px;
  @media (max-width: 767px) {
    padding: 0 0 150px;
  }
  .profile--info {
    .description-text {
      font-weight: 500;
    }
  }
  .interests-wrap {
    .header {
      position: relative;
      padding: 0;
      align-items: flex-start;
    }
    .body {
      padding: 15px 0 0;
      border-bottom: none;
    }
    .row-holder {
      align-items: center;
    }
    .checkbox {
      .label-text {
        font-size: 14px;
        line-height: 18px;
        font-weight: 500;
        color: var(--pallete-text-main);
      }
    }
    .dashed {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .icon {
      overflow: hidden;
      border: none;
    }
    .caption {
      color: var(--pallete-text-main-300);
      font-size: 14px;
      line-height: 19px;
    }
    .text-input.mb-25 {
      margin-bottom: 0 !important;
    }
    .text-input.mb-20 {
      margin-bottom: 10px !important;
    }
  }
  .button-holder {
    border-top: 1px solid var(--pallete-colors-border);
    padding: 30px 30px 30px 40px;
    position: fixed;
    left: 0;
    width: 599px;
    bottom: 0;
    background: var(--pallete-background-default);
    z-index: 11;
    .img {
      margin: 0 0 0 8px;
    }
    @media (max-width: 1023px) {
      width: auto;
      right: 0;
    }
    @media (max-width: 767px) {
      padding: 15px 20px;
    }
  }
  .description {
    color: var(--pallete-text-main-450);
    font-size: 15px;
    margin: 0 0 25px;
  }
  .pop-top-content {
    position: relative;
  }
  .checkbox {
    label {
      padding: 0;
    }
  }
  .logo-holder {
    width: 152px;
    margin: 0 0 36px;
    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }
  .sp__card {
    position: relative;
    padding: 15px;
    background: none;
    margin: 0 0 20px;
    border-radius: 5px;
    border: 1px solid var(--pallete-background-pink);
    &.isActive {
      border-color: transparent;
      &:before {
        opacity: 1;
        visibility: visible;
      }
    }
    &:before {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border: 2px solid var(--pallete-text-secondary-50);
      border-radius: 5px;
      content: '';
      opacity: 0;
      visibility: hidden;
    }
    .dashed {
      display: none;
    }
  }
  .steps-detail {
    font-size: 18px;
    line-height: 21px;
    font-weight: 500;
    margin: 0 0 33px;
  }
  .profile--info {
    position: relative;
  }
  h3 {
    font-weight: 500;
    margin: 0 0 24px;
    .option_text {
      display: inline-block;
      vertical-align: middle;
      padding-left: 5px;
      font-size: 15px;
      line-height: 18px;
      font-weight: 400;
    }
  }
  h4 {
    font-size: 15px;
    margin: 0;
  }
  h6 {
    font-size: 15px;
    line-height: 18px;
    margin: 0 0 20px;
    font-weight: 500;
  }
  .label-area {
    margin: 0 0 24px;
  }
  .label {
    display: block;
    margin: 0 0 8px;
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
  }
  .description-text {
    display: block;
    color: var(--pallete-text-main-300);
    font-size: 14px;
    line-height: 18px;
  }
  .schedule-block {
    .dashed {
      display: none;
    }
  }
  .subtext {
    font-weight: 600;
    margin-bottom: 15px;
  }
  .card-box {
    border: 2px solid var(--pallete-colors-border);
    border-radius: 8px;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 767px) {
      padding: 15px;
    }
    .image-comp {
      width: 77px;
      @media (max-width: 767px) {
        width: 60px;
      }
    }
  }
  .dollar-input {
    width: 198px;
    @media (max-width: 767px) {
      width: 160px;
    }
    .icon {
      width: 40px;
      height: 40px;
      display: flex;
      background: var(--pallete-primary-main);
      align-items: center;
      justify-content: center;
      font-size: inherit;
      color: #fff;
      border-radius: 4px;
      left: 9px;
    }
    .form-control {
      font-size: 20px;
      line-height: 24px;
      font-weight: 500;
      color: var(--pallete-text-main);
      padding-left: 60px;
      &:focus {
        padding-left: 60px;
      }
    }
  }
`;

const ThemeSelection: React.FC<any> = ({
  // eslint-disable-next-line
  selectedTheme,
  setSelectedTheme,
  onApplyTheme,
  refobj,
  ...props
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useAuth();
  const history = useHistory();

  const { showRightView, showLeftView } = useControllTwopanelLayoutView();
  const analytics = useAnalytics();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!user?.isPasswordSet) {
      setLocalStorage('setPasswordOnOnboarding', 'yes', false);
      try {
        await onApplyTheme?.();

        await update({
          userSetupStatus: 3,
        });
        setUser({
          ...user,
          userSetupStatus: 3,
        });
        return history.replace(getUserSetupUri(3));
      } catch (error) {}
    }
    await onApplyTheme?.();
    setIsSubmitting(false);
    setLocalStorage('onBoardingTour', 'true', false);
    analytics.track('new_reg_complete', {
      url: window.location.href,
      onboardingFlowTypeId: user.onboardingTypeId,
      flowVersion: 1,
    });
  };

  useEffect(() => {
    if (user?.userSetupStatus !== 2 && user?.userSetupStatus < 9) {
      setUser({
        ...user,
        userSetupStatus: 2,
      });
      update({
        userSetupStatus: 2,
      });
    }
    showLeftView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <InterestSetup>
      <div className="profile--info mb-30">
        <h3>
          Choose your Theme <span className="option_text">(optional)</span>
        </h3>
        <span className="description-text">
          Pick a theme. You’ll have the option to edit, customize and create
          your own theme after set up is complete.
        </span>
      </div>

      <div className="interests-wrap">
        <ThemeLibrary
          refobj={refobj}
          isOnboarding
          onCardClick={(theme) => {
            setSelectedTheme?.(theme);
            showRightView();
            props.setIsApplyModalOpen?.(true);
          }}
        />
        <div className="text-center button-holder">
          <Button
            onClick={handleSubmit as any}
            isLoading={isSubmitting}
            type="primary"
            size="large"
            block
          >
            Next Step{' '}
            <span className="img">
              <ArrowRightFilled />
            </span>
          </Button>
        </div>
      </div>
    </InterestSetup>
  );
};

export default ThemeSelection;
