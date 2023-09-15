import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import { cloneElement, ReactElement } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
type ISelfiePopNotificatonAndHeaderWrapper = {
  children: ReactElement;
  className?: string;
  [key: string]: any;
};
const SelfiePopNotificatonAndHeaderWrapper = (
  props: ISelfiePopNotificatonAndHeaderWrapper,
) => {
  const { children, ...rest } = props;
  const history = useHistory();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { activeView } = useControllTwopanelLayoutView();
  const isThemeListing = matchPath(history.location.pathname, {
    path: '/my-profile/themes-listing',
    exact: true,
    strict: false,
  });
  const themePreviewMode = !!(
    pathname.startsWith('/theme-library/preview') ||
    (isMobileOnly && isThemeListing && activeView === 'right')
  );
  return !themePreviewMode ? cloneElement(children, { ...rest, user }) : null;
};

export default styled(SelfiePopNotificatonAndHeaderWrapper)`
  &.ntf_bar {
    .notification-bar {
      border-bottom: 1px solid var(--pallete-colors-border);
    }
  }
`;
