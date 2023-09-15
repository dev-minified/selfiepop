type FaqStatus = 'pending' | 'complete' | 'deleted';
type ManagerFAQ = {
  sellerId: string;
  question: string;
  answer?: string;
  tags?: string[];
  status: FaqStatus;
  awaitingResponse?:
    | string
    | {
        profileImage: string;
        username: string;
        _id: string;
        firstName: string;
        pageTitle: string;
        lastName: string;
      };
  _id?: string;
  subscriptionId?: string;
};

type TeamMember = {
  createdAt?: string;
  _id?: string;
  status?: 'pending' | 'active' | 'canceled' | 'declined';
  allowMessage?: boolean;
  allowContent?: boolean;
  allowOrders?: boolean;
  allowCommissions?: boolean;
  commissionValue?: number;
  userId?: {
    isOnline?: boolean;
    _id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    pageTitle?: string;
  };
};
