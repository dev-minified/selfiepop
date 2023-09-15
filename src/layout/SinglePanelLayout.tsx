import Loading from 'components/SiteLoader';
import React, { cloneElement, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  [key: string]: any;
}

const SinglePanelLayout: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <div className="container sm-container page-container mt-30 mb-30">
      <React.Suspense fallback={<Loading loading />}>
        {React.Children.toArray(children).map((child: any) => {
          return cloneElement(child, { Layout1: 'yes', ...rest });
        })}
      </React.Suspense>
    </div>
  );
};

export default SinglePanelLayout;
