import SpFrontEndErrors from 'components/SpFrontEndErrors';
import 'polyfills/intersaction-observer';
import 'polyfills/replaceAll';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
// import { DndProvider } from 'react-dnd';
import { StrictMode } from 'react';
import {
  DndProvider,
  MouseTransition,
  TouchTransition,
} from 'react-dnd-multi-backend';
import { AnalyticsProvider } from 'use-analytics';
import analytics from 'util/analytics';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { persistor, store } from './store/store';

export const HTML5toTouchbackend = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
      preview: true,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true, delayTouchStart: 500, delay: 500 },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    {/* <DndProvider backend={MultiBackend} options={HTML5toTouch}> */}
    <DndProvider options={HTML5toTouchbackend}>
      <AnalyticsProvider instance={analytics}>
        <SpFrontEndErrors />
        <Router
          getUserConfirmation={() => {
            /* Empty callback to block the default browser prompt */
          }}
        >
          <Provider store={store}>
            <PersistGate loading={false} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </Router>
      </AnalyticsProvider>
    </DndProvider>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
