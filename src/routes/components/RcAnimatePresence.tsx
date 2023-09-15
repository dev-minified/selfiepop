import Loading from 'components/SiteLoader';
import { AnimatePresence } from 'framer-motion';
import React, { cloneElement } from 'react';
import { Switch, useLocation } from 'react-router-dom';
const RcAnimatePresence: React.FC<any> = ({ children, ...rest }) => {
  const location = useLocation();
  return (
    <React.Suspense fallback={<Loading loading />}>
      <AnimatePresence initial={false}>
        <Switch location={location} key={location.pathname}>
          {React.Children.toArray(children).map((child) => {
            return cloneElement(child as any, {
              AnimatePresence: 'yes',
              ...rest,
            });
          })}
        </Switch>
      </AnimatePresence>
    </React.Suspense>
  );
};

export default RcAnimatePresence;
