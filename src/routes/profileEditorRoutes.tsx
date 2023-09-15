import ThemeSelector from 'layout/ThemeSelector';
import PageTransition from 'layout/page-transition';
import Analytics from 'pages/analytics';
import Slider from 'pages/my-members/components/Slider';
import ManageduserWrapper from 'pages/my-members/manageduser-wrapper';
import AddPop from 'pages/my-profile/AddPop';
import DeclineOffer from 'pages/my-profile/ManagedAccounts/components/DeclineOffer';
import ProfileManagerPermissions from 'pages/my-profile/ManagedAccounts/components/ManagedAccountSetting';
import PopTypesList from 'pages/my-profile/PopList';
import Profile from 'pages/my-profile/Profile';
import BioEditor from 'pages/my-profile/bio-editor';
import PopCreate from 'pages/my-profile/createPop';
import NewProfilePage from 'pages/my-profile/new-profile';
import EditPop from 'pages/my-profile/pop-editor';
import ThemeEditor from 'pages/my-profile/theme-editor';
import ThemeListing from 'pages/my-profile/themes-listing';
import { ReactElement } from 'react';
import RcAnimatePresence from './components/RcAnimatePresence';

import ScrollBarWrapper from 'components/ScrollBarWrapper';
import TwoPanelLayoutWithouScroll from 'layout/TwoPanelLayoutWithouScroll';
import { Route } from 'react-router-dom';
import RightView from './profileEditorRoutesRightSide';
export const MyProfileRoutes: string[] = [
  '/my-profile',
  '/my-profile/themes-listing',
  '/my-profile/services',
  '/my-profile/managed-accounts',
  '/my-profile/managed-accounts/:id',
  '/my-profile/managed-accounts-decline/:id',
  '/my-profile/managed-accounts-accepted',
  '/my-profile/Links',
  '/my-profile/theme-editor',
  '/my-profile/bio',
  '/my-profile/analytics',
  '/my-profile/link/subType/:section',
  '/my-profile/link/:id/subType/:section',
  '/my-profile/link/:id',
  '/my-profile/services/:type',
  '/my-profile/links',
  '/my-profile/pop-list',
  '/my-profile/link',
];
export default function Routes({
  className,
}: {
  className?: string;
}): ReactElement {
  return (
    <ThemeSelector>
      <TwoPanelLayoutWithouScroll
        classes={{ content: 'p-0' }}
        defaultBackButton={false}
        className={className}
      >
        <RcAnimatePresence>
          <Route path="/my-profile/sliders" exact>
            <PageTransition>
              <Slider />
            </PageTransition>
          </Route>

          <Route path="/my-profile/themes-listing" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <ThemeListing />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>

          <Route path="/my-profile/managed-accounts" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <ManageduserWrapper />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/managed-accounts/:id" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <ProfileManagerPermissions />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/managed-accounts-accepted" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <ProfileManagerPermissions type="accepted" />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/managed-accounts-decline/:id" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <DeclineOffer />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/services" exact>
            <PageTransition onAnimationEnd>
              <NewProfilePage
                type="services"
                link="links"
                TooltipText="Create a new product or service to share on your link page or with your members"
              />
            </PageTransition>
          </Route>
          <Route path="/my-profile/services/:type" exact>
            <PageTransition onAnimationEnd>
              <NewProfilePage
                type="services"
                link="links"
                TooltipText="Create a new product or service to share on your link page or with your members"
              />
            </PageTransition>
          </Route>
          <Route path="/my-profile/links" exact>
            <PageTransition>
              <NewProfilePage
                type="links"
                link="links"
                TooltipText="Add a new link or offering to your Pop Page."
              />
            </PageTransition>
          </Route>
          <Route path="/my-profile" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <Profile />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/bio" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <BioEditor />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/theme-editor" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <ThemeEditor />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/analytics" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <Analytics />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-profile/link/subType/:section" exact>
            <PageTransition>
              <AddPop />
            </PageTransition>
          </Route>
          <Route path="/my-profile/link/:id/subType/:section" exact>
            <PageTransition>
              <AddPop />
            </PageTransition>
          </Route>
          <Route path="/my-profile/link/:id" exact>
            <PageTransition onAnimationEnd>
              <EditPop />
            </PageTransition>
          </Route>
          <Route path="/my-profile/pop-list" exact>
            <PageTransition>
              <PopTypesList />
            </PageTransition>
          </Route>
          <Route path="/my-profile/link" exact>
            <PageTransition>
              <PopCreate />
            </PageTransition>
          </Route>
        </RcAnimatePresence>
        {/* Right */}

        <RightView />
      </TwoPanelLayoutWithouScroll>
    </ThemeSelector>
  );
}
