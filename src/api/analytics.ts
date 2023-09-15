import axios from 'axios';
import { ANALYTICS_URL } from 'config';
import { ParsedUrlQueryInput, stringify } from 'querystring';

const baseURL = ANALYTICS_URL;

export const postEvent = async (data?: Partial<SPEvent>) => {
  return axios(`${baseURL}/event`, {
    method: 'POST',
    data,
  }).catch((e) => {
    console.error(e);
  });
};
export const getEvents = async (
  userId: string,
  params?: ParsedUrlQueryInput,
) => {
  return axios(`${baseURL}/analytics/${userId}?${stringify(params)}`, {
    method: 'GET',
  }).catch((e) => {
    console.error(e);
  });
};
