import { ReactElement } from 'react';

export interface IServiceProps {
  pop: any;
  onCreateOrder?: (
    order: IOrderType & {
      buyer: Record<string, any>;
      seller: Record<string, any>;
    },
  ) => void | Promise<any>;
  ownProfile: boolean;
  onStopPOPupOpen: Function;
  infoCard?: any;
  icon?: ReactElement;
  buttonTitle?: string;
  className?: string;
}
