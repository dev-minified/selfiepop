/* eslint-disable @typescript-eslint/no-unused-vars */
import { update } from 'api/User';
import { PurchsessSectionIcon, RequestIcon } from 'assets/svgs';
import ComponentsHeader from 'components/ComponentsHeader';
// import HeaderWithOption from 'components/partials/components/profileBack';
import { ServiceType, Slider } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useQuery from 'hooks/useQuery';
import { stringify } from 'querystring';
import React, { Fragment, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  withRouter,
} from 'react-router-dom';
import { removeSelectedPost } from 'store/reducer/member-post';
import { setSelectedView } from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';
import 'styles/dropdown.css';
import 'styles/navigation.css';
import { onboardingSequency, parseQuery } from 'util/index';

const noSubHeader = [
  '/my-sales',
  '/my-purchases',
  '/my-subscriptions',
  '/support',
  '/theme-library',
  '/theme-library/preview',
  '/schedule-messaging',
  '/managed-accounts',
];

export const Header = styled.header<any>`
  width: 100%;
  padding: 15px 3px;
  background: #000;
  position: relative;
  z-index: 4;
  border-bottom: 1px solid var(--pallete-colors-border);

  .counter {
    display: inline-block;
    vertical-align: middle;
    min-width: 21px;
    text-align: center;
    color: #fff;
    background: #7ccf78;
    border-radius: 4px;
    font-size: 14px;
    line-height: 17px;
    padding: 2px 3px;
    margin: 0 0 0 5px;
    display: none;

    @media (max-width: 1023px) {
      font-size: 10px;
      line-height: 12px;
      padding: 2px;
    }

    &.bg-blue {
      background: var(--pallete-primary-main);
    }
  }
  .counter.show {
    display: inline-block;
  }
  .dropdown-menu {
    right: 0px;
    left: auto;
  }

  @media (max-width: 767px) {
    padding: 15px 0;
    z-index: 9;
    margin: 0;
  }

  .logo {
    width: 143px;

    @media (max-width: 1199px) {
      width: 100px;
    }

    @media (max-width: 1023px) {
      width: 80px;
    }

    a {
      display: flex;
      align-items: center;
      font-size: 11px;
      line-height: 14px;
      font-weight: 400;
      color: var(--pallete-primary-main);

      svg {
        width: 143px;
      }
    }

    .text-beta {
      margin: 2px 0 0 -2px;
    }
  }
`;

const RemoveSubHeader: React.FC = () => {
  useEffect(() => {
    const rootelem: any = document.getElementById('root');
    if (!rootelem?.classList.contains('isactive-sub_menu')) {
      rootelem.classList.add('isactive-sub_menu');
    }

    return () => {
      if (rootelem?.classList.contains('isactive-sub_menu')) {
        rootelem.classList.remove('isactive-sub_menu');
      }
    };
  }, []);

  return null;
};

const getPopURL = (qs: Record<string, any>, pathname: string) => {
  const { type, mode } = qs;
  if (mode === 'add') {
    const { step, ...rest } = qs;
    if (step === '1') {
      return {
        URL: `/my-profile/link?${stringify({ ...rest })}`,
        headerTitle: 'Collection',
      };
    }
    if (step) {
      return {
        URL: `/my-profile/link?${stringify({ ...rest })}`,
        headerTitle: 'Edit Collection',
      };
    }
    return {
      URL: `/my-profile/pop-list?type=${type === 'service' ? 'services' : ''}`,
      headerTitle: 'Add a New Pop',
    };
  }
  if (mode === 'edit') {
    const { step, slider, date, levelStep, variantId, view, ...rest } = qs;
    if (levelStep === '1') {
      return {
        URL: `${pathname}?${stringify({
          ...rest,
          step: 1,
          slider: slider,
        })}`,
        headerTitle: 'Edit Lesson',
      };
    }
    if (step === '1') {
      return {
        URL: `/my-profile/link/${pathname.split('/')[3]}?${stringify({
          ...rest,
        })}`,
        headerTitle: 'Edit Collection',
      };
    }
    if (step === '2') {
      return {
        URL: `${pathname}?${stringify({
          ...rest,
          slider: 'schedule',
          step: 1,
        })}`,
        headerTitle: 'Edit Lesson',
      };
    }
    return { URL: `/my-profile`, headerTitle: 'Add a New Pop' };
  }
  return { URL: `/my-profile`, headerTitle: 'Add a New Pop' };
};
function getUrl(qss: Record<string, any>, pathname: string) {
  const { subType } = qss;
  const { newPop, ...qs } = qss;

  if (
    subType === 'shoutout' ||
    subType === 'payma' ||
    subType === 'chat-subscription' ||
    subType === 'poplive' ||
    subType === 'advertise' ||
    subType === 'additional-services' ||
    subType === 'digital-download'
  ) {
    return getPopURL(qs, pathname);
  }

  return { URL: `/my-profile`, headerTitle: 'Add a New Pop' };
}

const LeftSideBarSubHeader = (props: any) => {
  const { showHeaderMenu = true } = props;
  const [show, setshow] = useState<boolean>(false);
  const { activeView, showLeftView } = useControllTwopanelLayoutView();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { user, setUser } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const {
    type,
    subType: SubType,
    mode,
    id,
    edit,
    ...rest
  } = parseQuery(history.location.search);
  const title = useAppSelector((state) => state.header?.title);
  const backUrl = useAppSelector((state) => state.header.backUrl);
  const showHeader = useAppSelector((state) => state.header.showHeader);

  const qs = useQuery();
  const {
    themeId,
    subType,
    slider,
    section,
    step,
    levelStep,
    variantId,
    temp,
  } = qs;

  useEffect(() => {
    window.onresize = () => {
      if (window.screen.width < 767) {
        if (!show) return;
        return setshow(true);
      }
      return setshow(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { URL } = getUrl(qs, pathname);
  const getHeaderTitle = (type: string, subType: string, slider?: string) => {
    const chatMemberTypeTitle =
      subType === 'chat-subscription' && slider === 'PriceVariation';
    if (!slider && type === 'service') {
      switch (subType) {
        case ServiceType.ADDITIONAL_SERVICES:
          return 'Additional Services';
        case ServiceType.CHAT_SUBSCRIPTION:
          return 'Chat subscription';
        case ServiceType.ADVERTISE:
          return 'Promotional Shoutouts';
        case ServiceType.DIGITAL_DOWNLOADS:
          return 'Digital downloads';
        case ServiceType.PAYMA:
          return 'Paid Q&A';
        case ServiceType.POPLIVE:
          return 'Poplive';
        case ServiceType.SHOUTOUT:
          return 'Custom Video';
      }
    } else {
      switch (slider) {
        case Slider.Add_Post:
          return 'Add Post';
        case Slider.Price_Variation:
          return chatMemberTypeTitle ? 'Membership Types' : 'Price Variation';
        case Slider.Promotional_Media:
          return 'Promotional Media';
        case Slider.Promotional_Shoutout:
          return 'Promotional Shoutout';
        case Slider.DigitalDownloadFile:
          return 'Digital Downloads';
        case Slider.Questions:
          return 'Questions';
        case Slider.Schedule:
          return 'Scheduled Posts / Messages';
      }
    }
  };
  const getSliderBackLink = () => {
    if (slider === 'schedule') {
      if (step === '1') {
        return {
          URL: '/my-members/members-content',
          HEADER: 'Scheduled Messages',
        };
      } else if (step === '2') {
        return {
          URL: 'my-members/sliders?slider=schedule&step=1',
          HEADER: 'Scheduled Messages',
        };
      }

      if (activeView === 'left' || !isMobile) {
        return {
          URL: '/my-members/members-content',
          HEADER: 'Scheduled Posts / Messages',
        };
      } else if (activeView === 'right') {
        return {
          URL: '/my-members/sliders?slider=schedule',
          HEADER: 'Scheduled Messages',
        };
      }
    } else if (slider === 'Membership-Type') {
      return { URL: '/my-members', HEADER: 'Membership Options' };
    } else if (slider === 'subscriber') {
      return { URL: '/my-members', HEADER: 'Subscribers' };
    }
  };
  const OnBoardPush = () => {
    const onBoardRoute = onboardingSequency;
    let stepStatus = user.userSetupStatus || 0;
    if (!user?.isCreator && stepStatus > 1) {
      stepStatus = stepStatus - 1;
    }
    setUser({
      ...user,
      userSetupStatus: stepStatus - 1,
    });
    history.push(onBoardRoute?.[stepStatus - 1]);
    update({
      userSetupStatus: stepStatus - 1,
    }).catch(() => {
      history.push(onBoardRoute?.[stepStatus + 1]);
    });
  };
  const userLinks = user.links || [];
  // let onboardingstep = user?.userSetupStatus + 1;
  // if (!user?.isCreator && onboardingstep > 2) {
  //   onboardingstep = onboardingstep - 1;
  // }
  const HeaderSubMenu = () => (
    <Fragment>
      <Switch>
        {!levelStep && (
          <Route
            exact
            path="/my-members/member-level"
            render={() => (
              <ComponentsHeader
                centertitle
                backUrl={'/my-members'}
                title={`Membership Levels`}
              />
            )}
          />
        )}
        {levelStep && (
          <Route
            path="/my-members/member-level"
            render={() => (
              <ComponentsHeader
                centertitle
                backUrl={'/my-members/member-level'}
                title={`Level ${
                  variantId
                    ? (userLinks
                        ?.find(
                          (l) =>
                            l?.popLinksId?.popType ===
                            ServiceType.CHAT_SUBSCRIPTION,
                        )
                        ?.popLinksId?.priceVariations?.findIndex(
                          (f: PriceVariant) => f?._id === variantId,
                        ) || 0) + 1
                    : (userLinks?.find(
                        (l) =>
                          l?.popLinksId?.popType ===
                          ServiceType.CHAT_SUBSCRIPTION,
                      )?.popLinksId?.priceVariations?.length || 0) + 1
                }: Membership`}
              />
            )}
          />
        )}
        {slider !== 'subscriber' && (
          <Route
            path="/my-members/sliders"
            render={() => (
              <ComponentsHeader
                centertitle
                onClick={(e) => {
                  if (slider === 'schedule' && isMobile) {
                    e.preventDefault();
                    showLeftView();
                    const url = getSliderBackLink()?.URL;
                    dispatch(setSelectedView());
                    dispatch(removeSelectedPost());
                    url && history.push(url);
                  }
                }}
                backUrl={getSliderBackLink()?.URL}
                title={getSliderBackLink()?.HEADER}
              />
            )}
          />
        )}
        <Route
          path="/onboarding"
          render={() => (
            <ComponentsHeader
              backUrl={onboardingSequency?.[user?.userSetupStatus - 1]}
              onClick={OnBoardPush}
              title="Back"
              altArrow
            />
          )}
        />
        <Route
          path="/my-profile"
          render={() => <ComponentsHeader title="DASHBOARD" />}
          exact
        />
        <Route
          path="/my-profile/services/:type"
          render={() => (
            <ComponentsHeader
              centertitle
              backUrl="/my-profile"
              title="EDIT YOUR PRODUCTS AND SERVICES"
            />
          )}
          exact
        />
        <Route
          path="/my-profile/links"
          render={() => (
            <ComponentsHeader centertitle backUrl="/my-profile" title="LINKS" />
          )}
          exact
        />
        <Route
          path="/my-profile/services"
          render={() => (
            <ComponentsHeader
              centertitle
              backUrl={'/my-profile/pop-list?type=links'}
              title="ADD A PRODUCT OR SERVICE LINK"
            />
          )}
        />
        <Route
          path="/my-profile/managed-accounts"
          exact
          render={() => (
            <ComponentsHeader
              backUrl={'/my-profile'}
              title={'MANAGED ACCOUNT'}
              centertitle
              // icon={
              //   <div>
              //     <strong className="title centertitle">
              //       MANAGED ACCOUNT{' '}
              //     </strong>
              //     <MyProfileIcon />
              //   </div>
              // }
            />
          )}
        />
        <Route
          path="/my-profile/managed-accounts/:id"
          exact
          render={() => (
            <ComponentsHeader
              backUrl={'/my-profile/managed-accounts'}
              title={'MANAGED ACCOUNT'}
              centertitle
              // icon={
              //   <div>
              //     <strong className="title centertitle">
              //       MANAGED ACCOUNT{' '}
              //     </strong>
              //     <MyProfileIcon />
              //   </div>
              // }
            />
          )}
        />
        <Route
          path={`/my-profile/managed-accounts-decline/:id`}
          exact
          render={() => (
            <ComponentsHeader
              title={'DECLINE OFFER'}
              centertitle
              backUrl={`/my-profile/managed-accounts/${
                location.pathname.split('/')[3]
              }`}
              // icon={
              //   <div>
              //     <strong className="title centertitle">DECLINE OFFER </strong>
              //     <MyProfileIcon />
              //   </div>
              // }
            />
          )}
        />
        <Route path="/my-profile/pop-list" exact>
          <ComponentsHeader
            centertitle
            backUrl={
              type === 'links'
                ? '/my-profile/links'
                : section === 'links'
                ? '/my-profile/services'
                : '/my-profile/services/edit'
            }
            title={
              type === 'links'
                ? 'ADD NEW LINK'
                : 'CREATE NEW PRODUCT OR SERVICE'
            }
          />
        </Route>
        <Route path="/my-profile/link" exact>
          <ComponentsHeader
            centertitle
            backUrl={`/my-profile/pop-list?${stringify({
              type: type === 'service' ? 'service' : 'links',
              ...rest,
            })}`}
            title={getHeaderTitle(type as string, subType as string)}
          />
        </Route>
        <Route path="/my-profile/link/subType/:section" exact>
          <ComponentsHeader
            backUrl={URL}
            title={getHeaderTitle(
              type as string,
              subType as string,
              slider as string,
            )}
          />
        </Route>
        {(subType === ServiceType.ADDITIONAL_SERVICES ||
          subType === ServiceType.ADVERTISE ||
          subType === ServiceType.DIGITAL_DOWNLOADS ||
          subType === ServiceType.PAYMA ||
          subType === ServiceType.POPLIVE ||
          subType === ServiceType.SHOUTOUT ||
          subType === ServiceType.CHAT_SUBSCRIPTION ||
          section === 'links') && (
          <Route path="/my-profile/link/:id" exact>
            <ComponentsHeader
              centertitle
              backUrl={
                section === 'links'
                  ? '/my-profile/links'
                  : temp
                  ? '/my-profile/services/edit'
                  : '/my-profile/links'
              }
              title={
                section
                  ? 'Link'
                  : getHeaderTitle(type as string, subType as string)
              }
            />
          </Route>
        )}
        <Route path="/my-profile/link/:id/subType/:section" exact>
          <ComponentsHeader
            centertitle
            backUrl={URL}
            title={getHeaderTitle(
              type as string,
              subType as string,
              slider as string,
            )}
          />
        </Route>

        <Route path="/my-profile/theme-editor" exact>
          <ComponentsHeader
            centertitle
            backUrl="/my-profile/themes-listing"
            title={themeId ? 'EDIT THEME' : 'ADD THEME'}
          />
        </Route>
        <Route path="/my-profile/themes-listing" exact>
          <ComponentsHeader centertitle backUrl="/my-profile" title="THEMES" />
        </Route>
        <Route path="/my-profile/analytics" exact>
          <ComponentsHeader
            centertitle
            backUrl={'/my-profile'}
            title={`ANALYTICS`}
          />
        </Route>
        <Route path="/my-profile/bio" exact>
          <ComponentsHeader
            backUrl="/my-profile"
            title="EDIT PROFILE"
            centertitle
          />
        </Route>
        <Route path="/my-purchases" exact>
          <ComponentsHeader title="UNLOCKS" icon={<PurchsessSectionIcon />} />
        </Route>
        <Route path="/my-sales" exact>
          <ComponentsHeader title="REQUEST" icon={<RequestIcon />} />
        </Route>

        <Route path="/my-members" exact>
          <ComponentsHeader title="CREATOR" />
        </Route>

        <Route path="/my-members/subscriber">
          <ComponentsHeader
            centertitle
            backUrl={'/my-members'}
            title={'Members'}
          />
        </Route>

        <Route path="/my-members/members-content" exact>
          <ComponentsHeader
            centertitle
            backUrl={'/my-members'}
            title={'Members Only Content'}
          />
        </Route>
        <Route path="/my-members/add-team-member" exact>
          <ComponentsHeader
            centertitle
            // title={'ADD NEW TEAM MEMBER'}
            backUrl={'/my-members/team-members'}
            icon={
              <div>
                <strong className="title centertitle">
                  ADD NEW TEAM MEMBER {' / '}
                </strong>
                <span className="slide-header-text">STEP 1 of 3</span>
              </div>
            }
          />
        </Route>
        <Route path="/my-members/add-team-member/:username" exact>
          <ComponentsHeader
            centertitle
            // title={'CONFIRM TEAM MEMBER'}
            backUrl={'/my-members/add-team-member'}
            icon={
              <div>
                <strong className="title centertitle">
                  CONFIRM TEAM MEMBER {' / '}
                </strong>

                <span className="slide-header-text">STEP 2 of 3</span>
              </div>
            }
          />
        </Route>
        <Route path="/my-members/add-team-member/:username/settings/edit" exact>
          <ComponentsHeader
            centertitle
            title={'EDIT TEAM MEMBER'}
            backUrl={'/my-members/team-members'}
            // icon={
            //   <div>
            //     <strong className="title centertitle">EDIT TEAM MEMBER </strong>
            //     <MemberIcon />
            //   </div>
            // }
          />
        </Route>
        <Route path="/my-members/add-team-member/:username/settings" exact>
          <ComponentsHeader
            centertitle
            // title={'CONFIRM TEAM MEMBER'}
            backUrl={`/my-members/add-team-member/${
              location.pathname.split('/')[3]
            }`}
            icon={
              <div>
                <strong className="title centertitle">
                  CONFIRM TEAM MEMBER {' / '}
                </strong>
                <span className="slide-header-text">STEP 3 of 3</span>
              </div>
            }
          />
        </Route>

        <Route path="/my-members/team-members" exact>
          <ComponentsHeader
            centertitle
            title="TEAM MANAGER"
            backUrl={`/my-members`}
            // icon={
            //   <div>
            //     <strong className="title centertitle">TEAM MANAGER </strong>
            //     <MemberIcon />
            //   </div>
            // }
          />
        </Route>
        {user?.isAcctManager && (
          <Fragment>
            <Route path="/managed-accounts/:id/rules/:ruleId">
              <RemoveSubHeader />
            </Route>
            {showHeader && (
              <Route path="/managed-accounts/:id">
                <ComponentsHeader centertitle backUrl={backUrl} title={title} />
              </Route>
            )}
          </Fragment>
        )}
      </Switch>
    </Fragment>
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const rootelem: any = document.getElementById('root');
    if (noSubHeader.includes(pathname) || !showHeaderMenu) {
      if (!rootelem?.classList.contains('isactive-sub_menu')) {
        rootelem.classList.add('isactive-sub_menu');
      }
    } else {
      if (rootelem?.classList.contains('isactive-sub_menu')) {
        rootelem.classList.remove('isactive-sub_menu');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return <HeaderSubMenu />;
};
export default withRouter(LeftSideBarSubHeader);
