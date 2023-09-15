import PageTransition from 'layout/page-transition';
import PublicLayout from 'layout/public';
import ThemeSelector from 'layout/ThemeSelector';
import TwoPanelLayout from 'layout/TwoPanelLayout';
// import OnBoardingInterest from 'pages/onboarding/interests-setup.styled';
import PrivatePopSetup from 'pages/onboarding/private-pop-setup';
// import OnBoardingProfilePhoto from 'pages/onboarding/profile-photo';
import PublicProfile from 'pages/[username]';
import OnBoardingSetPassword from 'pages/onboarding/set-password';
import OnBoardingThemeSelection from 'pages/onboarding/theme-selection';
import { ReactElement } from 'react';
import RcAnimatePresence from './components/RcAnimatePresence';
import RcRoute from './components/RcRoute';
import RcSwitch from './components/RcSwitch';

export const onBoardingTour: string[] = [
  '/onboarding',
  '/onboarding/profile-photo',
  '/onboarding/theme-selection',
  // '/onboarding/interests-setup',
  '/onboarding/set-password',
  '/onboarding/private-pop-setup',
  // '/onboarding/v2/profile-photo',
  // '/onboarding/v2/theme-selection',
  // '/onboarding/v2/interests-setup',
];

export default function Routes({
  className,
}: {
  className?: string;
}): ReactElement {
  return (
    <ThemeSelector isOnboarding>
      <TwoPanelLayout
        classes={{ leftView: 'bg-white' }}
        defaultBackButton={false}
        className={className}
      >
        <RcAnimatePresence>
          {/* Left Panel */}
          {/* <RcRoute path="/onboarding/profile-photo" exact>
            <PageTransition>
              <OnBoardingProfilePhoto title="Private Pop Page" />
            </PageTransition>
          </RcRoute> */}
          <RcRoute
            path="/onboarding/theme-selection"
            exact
            layoutProps={{ showHeader: false, showHeaderMenu: false }}
          >
            <PageTransition>
              <OnBoardingThemeSelection />
            </PageTransition>
          </RcRoute>
          {/* <RcRoute path="/onboarding/interests-setup" exact>
            <PageTransition>
              <OnBoardingInterest />
            </PageTransition>
          </RcRoute> */}
          <RcRoute
            path="/onboarding/set-password"
            exact
            layoutProps={{ showHeader: false, showHeaderMenu: false }}
          >
            <PageTransition>
              <OnBoardingSetPassword />
            </PageTransition>
          </RcRoute>
          {/* <RcRoute path="/onboarding/v2/profile-photo" exact>
            <PageTransition>
              <OnBoardingProfilePhoto title="Private Pop Page" />
            </PageTransition>
          </RcRoute> */}
          {/* <RcRoute path="/onboarding/v2/theme-selection" exact>
            <PageTransition>
              <OnBoardingThemeSelection />
            </PageTransition>
          </RcRoute> */}
          <RcRoute
            path="/onboarding/private-pop-setup"
            exact
            layoutProps={{ showHeader: false, showHeaderMenu: false }}
          >
            <PageTransition>
              <PrivatePopSetup />
            </PageTransition>
          </RcRoute>
        </RcAnimatePresence>
        {/* Right */}
        <RcSwitch>
          <RcRoute path="/onboarding">
            <PublicLayout
              showFooter={false}
              enableTheme={true}
              isPreview={true}
            >
              <PublicProfile />
            </PublicLayout>
          </RcRoute>
        </RcSwitch>
      </TwoPanelLayout>
    </ThemeSelector>
  );
}
