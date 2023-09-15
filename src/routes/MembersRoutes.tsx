import useAuth from 'hooks/useAuth';
import ThemeSelector from 'layout/ThemeSelector';
import PageTransition from 'layout/page-transition';
import Members from 'pages/my-members';
import Subscriber from 'pages/my-members/Members';
import MyMembersEction from 'pages/my-members/MembersSection';
import MemberLevels from 'pages/my-members/components/MemberLevels';
import Slider from 'pages/my-members/components/Slider';
import ConfirmMember from 'pages/my-members/components/TeamModule/components/ConfirmAddMember';
import AddTeamMember from 'pages/my-members/components/TeamModule/components/CreateMember';
import MemberSettings from 'pages/my-members/components/TeamModule/components/MemberSettings';
import MemberRoutesWrapper from 'pages/my-members/components/TeamModule/membersRouteWapper';
import TeamuserWrapper from 'pages/my-members/teamuser-wrapper';
import { ReactElement, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import RcAnimatePresence from './components/RcAnimatePresence';

import ScrollBarWrapper from 'components/ScrollBarWrapper';
import TwoPanelLayoutWithouScroll from 'layout/TwoPanelLayoutWithouScroll';
import RightView from './profileEditorRoutesRightSide';
export const MyMemberRouter: string[] = [
  '/my-members',
  '/my-members/members-content',
  '/my-members/subscriber',
  '/my-members/member-level',
  '/my-members/sliders',
  '/my-members/team-members',
  '/my-members/add-team-member',
  '/my-members/add-team-member/:username',
  '/my-members/add-team-member/:username/settings/edit',
  '/my-members/add-team-member/:username/settings',
];
type IMemberRouteProps = {
  className?: string;
};
export default function RoutesWrapper(props: IMemberRouteProps) {
  const enableMembershipFunctionality =
    useAuth()?.user?.enableMembershipFunctionality;
  const skipOnBoarding = useAuth()?.user?.skipOnBoarding;
  const id = useAuth()?.user?._id;
  const history = useHistory();
  useEffect(() => {
    const isAllowToVisit = enableMembershipFunctionality && !skipOnBoarding;
    if (!isAllowToVisit) {
      history.push('/');
    }
  }, [id]);
  return <Routes {...props} />;
}
function Routes({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement {
  return (
    <ThemeSelector>
      <TwoPanelLayoutWithouScroll
        classes={{ content: 'p-0', leftView: 'small-width' }}
        defaultBackButton={false}
        className={className}
      >
        <RcAnimatePresence>
          <Route path="/my-members/team-members" exact>
            <PageTransition>
              <TeamuserWrapper />
            </PageTransition>
          </Route>
          <Route path="/my-members/add-team-member" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <MemberRoutesWrapper>
                  <AddTeamMember />
                </MemberRoutesWrapper>
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-members/add-team-member/:username" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <MemberRoutesWrapper>
                  <ConfirmMember />
                </MemberRoutesWrapper>
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route
            path="/my-members/add-team-member/:username/settings/edit"
            exact
          >
            <PageTransition>
              <ScrollBarWrapper>
                <MemberSettings edit={true} />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
          <Route path="/my-members/add-team-member/:username/settings" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <MemberRoutesWrapper>
                  <MemberSettings />
                </MemberRoutesWrapper>
              </ScrollBarWrapper>
            </PageTransition>
          </Route>

          <Route path="/my-members/sliders" exact>
            <PageTransition>
              <Slider />
            </PageTransition>
          </Route>

          <Route path="/my-members/members-content" exact>
            <PageTransition>
              <Members />
            </PageTransition>
          </Route>
          <Route path="/my-members/subscriber" exact>
            <PageTransition>
              <Subscriber />
            </PageTransition>
          </Route>
          <Route path="/my-members/member-level" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <MemberLevels />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>

          <Route path="/my-members" exact>
            <PageTransition>
              <ScrollBarWrapper>
                <MyMembersEction />
              </ScrollBarWrapper>
            </PageTransition>
          </Route>
        </RcAnimatePresence>
        {/* Right */}

        <RightView />
      </TwoPanelLayoutWithouScroll>
    </ThemeSelector>
  );
}
