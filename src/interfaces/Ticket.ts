export interface ITicket {
  userId?: Pick<
    IUser,
    'firstName' | 'lastName' | 'email' | '_id' | 'username' | 'pageTitle'
  >;
  issueTitle?: string;
  issueDescription?: string;
  createdAt?: string;
  issueStatus?: 'open' | 'closed';
  updatedAt?: string;
  issueLastUpdated?: string;
  ticketNo?: string;
  _id?: string;
  issueComments?: ITicketMessage[];
  attachments?: any[];
}

export interface ITicketMessage {
  commentValue: string;
  dateTimeAdded: string;
  commentDirection: 'user' | 'pop';
  attachments?: any[];
  _id?: string;
}
