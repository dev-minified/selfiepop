import { useAppDispatch } from 'hooks/useAppDispatch';
import { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, LIFECYCLE, Step } from 'react-joyride';
import { setWecomeModelState } from 'store/reducer/global';
import { removeLocalStorage, setLocalStorage } from 'util/index';

const stps: Step[] = [
  {
    target: '#profile_links',
    disableScrolling: false,
    spotlightClicks: true,
    disableBeacon: true,
    content: 'You can manage your services, links, themes and analytics here',
  },

  {
    target: '#my-public-profile-url',
    disableScrolling: false,
    content: 'Congratulations, your Pop Page is ready to use!',
  },
];

export const Index = () => {
  const [state, setState] = useState({
    run: false,
    sidebarOpen: false,
    stepIndex: 0,
    steps: [],
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    const el = document.querySelector('.rc-scollbar');
    console.log(el);
    if (el) {
      el.scrollTop = 500;
    }

    setState((s: any) => {
      return { ...s, run: true, steps: stps };
    });
  }, []);
  const setShowWelcomeModal = () => {
    removeLocalStorage('onBoardingTour');
    dispatch(setWecomeModelState(true));
    setLocalStorage('showWelcomeModal', 'true', false);
  };
  const handleJoyrideCallback = (data: any) => {
    const { index, action, lifecycle, type } = data;
    if (action === ACTIONS.CLOSE) {
      setState({ ...state, stepIndex: state.steps.length });
      setShowWelcomeModal();
      return;
    }
    let el: any;
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      if (index === 1 && action === ACTIONS.NEXT) {
        el = document.querySelector(`#theme-listing-nav > a`);
      }
      // Update state to advance the tour
      if (index === 2) {
        el = document.querySelector(`#links-nav > a`);
      }
      if (index === 3 && action === ACTIONS.PREV) {
        el = document.querySelector(
          `${(state.steps[index - 1] as any).target} > a`,
        );
      }
      el && el.click();
      if (index === 2 && action === ACTIONS.PREV) {
        setTimeout(() => {
          setState({
            ...state,
            stepIndex: index + (action === ACTIONS.PREV ? -1 : 1),
          });
        }, 1300);
      } else {
        setTimeout(() => {
          setState({
            ...state,
            stepIndex: index + (action === ACTIONS.PREV ? -1 : 1),
          });
        }, 500);
      }
    }
    if (
      action !== ACTIONS.PREV &&
      index === state.steps.length - 1 &&
      lifecycle === LIFECYCLE.COMPLETE
    ) {
      setShowWelcomeModal();
    }
    if (ACTIONS.SKIP === action) {
      setShowWelcomeModal();
    }
  };

  const { steps, run, stepIndex } = state;
  return (
    <div className="tout">
      <Joyride
        // debug
        steps={steps}
        stepIndex={stepIndex}
        continuous
        run={run}
        showProgress={true}
        showSkipButton={true}
        scrollToFirstStep={false}
        disableScrolling
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: 'var(--pallete-primary-main)',
          },
        }}
      />
    </div>
  );
};

export default Index;
