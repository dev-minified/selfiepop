import Loader from 'components/SiteLoader';
import AuthProvider from 'context/Auth';
import TwoPanelLayoutProvider from 'context/TwoPanelLayout';
import WebSocketProvider from 'context/WebSocket';
// import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';
// import { DndProvider } from 'react-dnd-multi-backend';
// import { DndProvider } from 'react-dnd';
import ToastContainer from 'components/toaster';
import { useLocation } from 'react-router-dom';
import AppRoutes from 'routes';
import GlobalStyle from 'theme/indexbackup';
import { useAnalytics } from 'use-analytics';
import { setAppTheme } from 'util/index';
const Routes = () => {
  return <AppRoutes />;
};

function App() {
  const location = useLocation();
  const analytics = useAnalytics();

  useEffect(() => {
    // send page view on route change
    analytics.page({
      url: location.pathname + location.search,
    });
  }, [location]);
  useEffect(() => {
    setAppTheme();
  }, []);

  return (
    <>
      <WebSocketProvider>
        <CookiesProvider>
          {/* <StyledLayoutWrapper> */}
          <GlobalStyle />
          <AuthProvider>
            <TwoPanelLayoutProvider>
              <Routes />
              <Loader />
            </TwoPanelLayoutProvider>
          </AuthProvider>
          {/* </StyledLayoutWrapper> */}
        </CookiesProvider>
      </WebSocketProvider>

      <ToastContainer />
    </>
  );
}

export default App;
