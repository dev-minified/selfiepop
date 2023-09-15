import PrivateLayout from 'layout/PrivateLayout';
import SelfiePopLayout from 'layout/selfie-pop';
import React, { cloneElement } from 'react';
import { SwitchProps } from 'react-router';
import { Switch } from 'react-router-dom';

const RcSwitch: React.FC<
  {
    privateFC?: boolean;
    layoutProps?: any;
    key?: string | number;
  } & SwitchProps
> = ({ privateFC, layoutProps, children, ...rest }) => {
  if (privateFC)
    return (
      <Switch>
        <PrivateLayout {...layoutProps}>
          <SelfiePopLayout {...layoutProps}>
            {React.Children.toArray(children).map((child) => {
              return cloneElement(child as any, { RcSwitch: 'yes', ...rest });
            })}
          </SelfiePopLayout>
        </PrivateLayout>
      </Switch>
    );
  return (
    <Switch>
      {React.Children.toArray(children).map((child) => {
        return cloneElement(child as any, { RcSwitch: 'yes', ...rest });
      })}
    </Switch>
  );
};

export default RcSwitch;
