import classNames from 'classnames';
import { ServiceType } from 'enums';
import { AnimatePresence } from 'framer-motion';
import PageTransition from 'layout/page-transition';
import PublicLayout from 'layout/public';
import SubscriberRightSider from 'pages/my-members/Members/components';
import SellerWallWrapper from 'pages/my-members/Members/components/SellerWallWrapper';
import MembersSliders from 'pages/my-profile/RightSide/MembersSliders';
// import OrderDetail from 'pages/my-sales/[id]';
import Scrollbar from 'components/Scrollbar';
import PublicProfile from 'pages/[username]';
import PreviewServices from 'pages/[username]/[popslug]';
import { isMobileOnly } from 'react-device-detect';
import { Route, Switch, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import { RcRoute } from './components';
type Props = {
  className?: string;
};
const RightView: React.FC<Props> = (props) => {
  const { className, ...rest } = props;
  const location = useLocation();
  const { type, subType } = parseQuery(location.search);
  const notEnableRightView = [ServiceType.CHAT_SUBSCRIPTION];
  const notShowRightView = notEnableRightView.includes(subType as any);

  const isProfilelinks = type === 'service' && !notShowRightView;
  return (
    <div
      className={classNames(className, {
        'inner-scroll-content': isProfilelinks,
      })}
    >
      <AnimatePresence>
        <Switch>
          <Route path="/my-members/members-content" exact>
            <PageTransition {...rest}>
              <SellerWallWrapper className="rightwall" />
              {/* <MyWall
                createPost={false}
                backButton={true}
                className="rightwall"
                showAttachmentViwe={isMobileOnly}
              /> */}
            </PageTransition>
          </Route>
          <Route path="/my-members/subscriber" exact>
            <PageTransition {...rest}>
              <SubscriberRightSider />
            </PageTransition>
          </Route>
          <Route path="/my-members/sliders" exact>
            <PageTransition {...rest}>
              <MembersSliders
                // className="inner-scroll-content"
                showAttachmentViwe={isMobileOnly}
              />
            </PageTransition>
          </Route>
          <Route path="/my-members" exact>
            <PageTransition {...rest}>
              <SellerWallWrapper className="rightwall" />
              {/* <MyWall
                createPost={false}
                backButton={true}
                className="rightwall"
                showAttachmentViwe={isMobileOnly}
              /> */}
            </PageTransition>
          </Route>
          <Route path="/my-profile/subscriber" exact>
            <PageTransition {...rest}>
              <SubscriberRightSider />
            </PageTransition>
          </Route>
          <Route path="/my-profile/sliders" exact>
            <PageTransition {...rest}>
              <MembersSliders
                className="inner-scroll-content"
                showAttachmentViwe={isMobileOnly}
              />
            </PageTransition>
          </Route>

          {/* this is old one */}
          {/* <Route path="/my-profile/my-members" exact>
            <PageTransition {...rest}>
              <ChatWidget className="chat_widget_height" />
            </PageTransition>
          </Route> */}
          <RcRoute
            {...rest}
            path={['/my-profile/link', '/my-profile', '/my-members']}
          >
            <ProfileServicesView />
          </RcRoute>
        </Switch>
      </AnimatePresence>
    </div>
  );
};

const ProfileViewTypes = [
  'simpleLink',
  'content',
  'socialLinks',
  'sectionTitle',
  'youtubeLink',
];
const ServicesViewTypes = [ServiceType.CHAT_SUBSCRIPTION];
const ServicesView: React.FC<Record<string, any>> = (props) => {
  const computedUrl = props.computedMatch?.url;
  const location = useLocation();

  const { type, subType } = parseQuery(location?.search);
  const isPreivewServices =
    computedUrl === '/my-profile/link' &&
    !ServicesViewTypes.includes(subType as ServiceType) &&
    !ProfileViewTypes.includes(`${type}`);
  return (
    <div className={props.className}>
      <Scrollbar>
        {isPreivewServices ? (
          <PageTransition
            {...props}
            onAnimationEnd
            motionKey="services"
            className="previewServices"
          >
            <PreviewServices {...props} isPreivew={true} />
          </PageTransition>
        ) : (
          <PageTransition {...props} onAnimationEnd motionKey="profile">
            <ProfileRightView {...props} />
          </PageTransition>
        )}
      </Scrollbar>
    </div>
  );
};

const ProfileServicesView = styled(ServicesView)`
  height: 100%;
  /* max-width: 800px; */
  /* margin: 0 auto;
  padding: 15px 15px !important;

  @media (max-width: 767px) {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .chat_widget_height {
    height: calc(100vh - 114px);
    display: flex;
    flex-direction: column;
  } */
`;
const ProfileRightView: React.FC = (props) => {
  return (
    <PublicLayout
      {...props}
      showFooter={false}
      enableTheme={true}
      isPreview={true}
    >
      <PublicProfile />
    </PublicLayout>
  );
};
export default styled(RightView)`
  height: 100%;
  .previewServices {
    max-width: 800px;
    margin: 0px auto;
    padding: 15px !important;
    &.postSection {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
  }

  /* &.inner-scroll-content {
    max-width: 800px;
    margin: 0px auto;
    padding: 15px !important;
    &.postSection {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
  } */
`;
