import { ITicket } from 'interfaces/Ticket';
import { stringify } from 'querystring';
import request from '../util/request';

export const getTickets = async (
  params: any,
  isSupportAgent: boolean = false,
) => {
  return request(
    `/tickets${isSupportAgent ? '/admin' : ''}?${stringify(params)}`,
    { method: 'GET' },
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const getTicket = async (ticketId: string) => {
  return request(`/tickets/${ticketId}`, { method: 'GET' }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const updateTicket = async (ticketId: string, data: ITicket) => {
  return request(`/tickets/${ticketId}`, { method: 'POST', data }).then(
    (res: any) => {
      if (!res || !res.success) {
        throw new Error(res?.data?.message || '');
      }
      return res;
    },
  );
};

export const createTicket = async (data: ITicket) => {
  return request(`/tickets`, { method: 'POST', data }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const sendTicketMessage = async (
  message: string,
  ticketId: string,
  isSupportAgent: boolean = false,
  attachments: any[] = [],
) => {
  return request(
    `/tickets/message${isSupportAgent ? '/admin' : ''}/${ticketId}`,
    {
      method: 'PUT',
      data: { message, attachments },
    },
  ).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
export const getSupportTicketsCount = async () => {
  return request(`/tickets/count`, {
    method: 'GET',
  }).then((res: any) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};
