import { update } from 'api/User';
import { createTheme, updateTheme } from 'api/theme';
import { RedirectLinkIcon, ShareIconBlank } from 'assets/svgs';
import classNames from 'classnames';
import ApplyThemeModal from 'components/ApplyThemeModal';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import React, { useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { Link, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { setApplyThemeModal } from 'store/reducer/global';
import { toggleModal } from 'store/reducer/headerState';
import { setCurrentTheme, setThemes } from 'store/reducer/theme';
import styled from 'styled-components';
import 'styles/dropdown.css';
import 'styles/navigation.css';
import { parseQuery } from 'util/index';
import QRmodel from './components/model/QRmodel';
const HeaderLinkArea = styled.div`
  background: var(--pallete-background-default);
  border-bottom: 1px solid var(--pallete-colors-border);
  padding: 8px 15px 8px;
  margin-bottom: 0;
  position: absolute;
  min-height: 50px;
  /* width: calc(100% - 600px); */
  width: calc(100% - 668px);
  right: 0;
  top: 0;
  z-index: 3;

  br {
    display: none;
  }

  &.mobile-menu {
    display: block;
    position: relative;
    width: 100%;
    padding: 8px 15px;

    br {
      display: block;
    }

    .hidden-mobile {
      display: none;
    }
  }

  @media (max-width: 1023px) {
    display: none;
  }

  @media (max-width: 767px) {
    bottom: 0;
  }
  .min-33 {
    min-height: 33px;
  }

  .left-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 0;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0 5px 0 0;

    .button {
      min-width: 54px;
      margin: 0 15px 0 0;
      background: var(--pallete-primary-dark);
      color: #fff;
      border-color: var(--pallete-primary-dark);

      &:hover {
        background: none;
        color: var(--pallete-primary-dark);
        border-color: var(--pallete-primary-dark);
      }
    }
  }

  .button {
    text-transform: capitalize;
  }

  .header-link-area .btn-round {
    border-radius: 4px;
    font-size: 12px;
    line-height: 15px;
    min-width: 58px;
    padding: 4px 6px 3px;
  }
  .header-link-area__link-holder {
    font-size: 14px;
    line-height: 15px;
    font-weight: 500;
    color: var(--pallete-text-main-50);
    position: relative;
    padding: 0 0 0 30px;
    min-width: 0;
    flex-grow: 1;
    flex-basis: 0;
    text-align: left;
  }
  .header-link-area__link-holder .icon-star1 {
    position: absolute;
    left: 0;
    top: -2px;
    font-size: 20px;
  }
  .header-link-area__link {
    color: var(--pallete-primary-main);
    display: inline-block;
    vertical-align: top;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .sp_dark & {
      color: var(--pallete-text-main);
    }

    .user-link__prefix {
      opacity: 0.6;
      font-weight: 400;
    }
  }
  @media (max-width: 991px) {
    .header-link-area__link-holder {
      margin: 0 -10px;
    }
  }

  @media (max-width: 767px) {
    padding-top: 15px;
    padding-bottom: 15px;
    .header-link-area__link-holder {
      font-size: 14px;
      margin: 0 -5px;
      padding: 0 0 0 20px;
    }
    .header-link-area__link-holder .icon-star1 {
      font-size: 14px;
      top: 1px;
    }
    .header-link-area .btn.btn-round {
      min-width: 58px;
      font-size: 12px;
      text-transform: capitalize;
      margin-right: -5px;
    }
  }
  .link_copied {
    background: var(--pallete-primary-main) !important;
    color: white !important;
  }
`;

const RightSideBarSubHeader: React.FC<{ user: any }> = ({ user }) => {
  const { user: loggedUser, setUser } = useAuth();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const { showLeftView } = useControllTwopanelLayoutView();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { themeId, systemThemeCreate: isSystemThemeCreate } = parseQuery(
    location.search,
  );
  const applyThemeModal = useAppSelector(
    (state) => state.global?.applyThemeModal,
  );
  const shareModal = useAppSelector((state) => state.header.shareModal);
  const link = `${window.location.host}/${user?.username}`.replace('www.', '');
  const publicProfileLink = user.username;

  const userThemes = useAppSelector((state) => state.theme.allthemes);
  const current = useAppSelector((state) => state.theme.current);

  const applyTheme = async () => {
    setIsApplying(true);
    const { category, ...selectedTheme } = { ...current };
    const profileImage = selectedTheme?.profile?.profileImage;
    //Delete extra keys before sending
    delete selectedTheme?.profile?.profileImage;
    let res: any;
    if (selectedTheme?._id) {
      res = await updateTheme(selectedTheme._id, {
        ...selectedTheme,
        isActive: true,
        baseURL: `${window.location.host}/${loggedUser.username}`,
        categoryId: category?.value,
      }).catch(console.log);
    } else {
      res = await createTheme({
        ...selectedTheme,
        isSystemTheme:
          isSystemThemeCreate === 'true' &&
          !!loggedUser?.enableSystemThemeAccess,
        baseURL: `${window.location.host}/${loggedUser.username}`,
        isActive: true,
        categoryId: category?.value || '',
      });
    }

    dispatch(
      setThemes(
        userThemes.map((item) =>
          item._id === res?.theme?._id
            ? res.theme
            : { ...item, isActive: false },
        ),
      ),
    );
    let updatedUser = loggedUser;
    updatedUser = await update({ profileImage }).then(({ data }) => data);
    if (res?.theme) {
      setUser({ ...loggedUser, ...updatedUser, userThemeId: res.theme });
    }
    dispatch(
      setApplyThemeModal({
        active: false,
        edit: false,
      }),
    );
    if (applyThemeModal?.edit) {
      history.push(
        isSystemThemeCreate === 'true'
          ? '/theme-library'
          : '/my-profile/themes-listing',
      );
    }
    setIsApplying(false);
    showLeftView();
  };
  return (
    <Switch>
      <Route path={['*']}>
        <QRmodel
          isOpen={shareModal || false}
          onClose={() => {
            dispatch(toggleModal());
          }}
          link={link}
          userProfileLink={publicProfileLink}
        />
        <HeaderLinkArea
          className={classNames('header-link-area', {
            'mobile-menu d-md-none': !isDesktop,
          })}
        >
          {applyThemeModal?.active && current?._id ? (
            <ApplyThemeModal
              selectedTheme={current}
              isThemeApplying={isApplying}
              compact
              edit={applyThemeModal?.edit}
              onRevertTheme={() => {
                dispatch(
                  setCurrentTheme(userThemes.find((theme) => theme.isActive)),
                );
                dispatch(
                  setApplyThemeModal({
                    active: false,
                    edit: false,
                  }),
                );

                if (applyThemeModal?.edit) {
                  history.push(
                    isSystemThemeCreate === 'true'
                      ? '/theme-library'
                      : '/my-profile/themes-listing',
                  );
                }
                showLeftView();
              }}
              onApplyTheme={applyTheme}
            />
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <div className="left-area">
                <div
                  className="header-link-area__link-holder"
                  id="my-public-profile-url"
                >
                  {/* <i className="icon-star1"></i>My Selfie Pop */}
                  {/* <span className="hidden-mobile">: </span> */}
                  {/* <i className="icon-star1"></i> */}
                  {/* <span className="hidden-mobile">: </span> */}
                  <br />
                  <Link
                    to={`/${user.username}`}
                    className="header-link-area__link"
                    target="_blank"
                  >
                    {/* {link} */}
                    <span className="user-link">
                      <span className="user-link__prefix">
                        {window.location.host.replace('www.', '')}/
                      </span>
                      {user?.username}
                    </span>
                  </Link>
                </div>
              </div>
              {/* <NewButton
                onClick={() => {
                  dispatch(toggleModal());
                }}
                type="primary"
                color="primary"
                outline
                size="small"
                shape="round"
              >
                Share
              </NewButton> */}
              <div className="haader_nav_right_area">
                <div className="haader_nav_right_area__icon">
                  <ShareIconBlank
                    width={20}
                    height={20}
                    onClick={() => {
                      dispatch(toggleModal());
                    }}
                  />
                </div>
                <div className="haader_nav_right_area__icon">
                  <RedirectLinkIcon
                    width={30}
                    height={30}
                    onClick={() => {
                      window.open(`/${publicProfileLink}`, '_blank');
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </HeaderLinkArea>
      </Route>
    </Switch>
  );
};
export default RightSideBarSubHeader;
