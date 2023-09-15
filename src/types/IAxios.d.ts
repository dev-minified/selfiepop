import { AxiosRequestConfig } from 'axios';

type IAxiosConfig = AxiosRequestConfig & {
  errorConfig?: {
    ignoreStatusCodes?: number[];
  };
  sendlogs?: boolean;
};
