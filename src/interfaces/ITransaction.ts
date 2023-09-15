type IWalletUser = {
  pageTitle?: string;
  _id?: string;
  profileImage?: string;
  username?: string;
};
type IWalletOrderId = {
  _id?: string;
  popType?: string;
};
export interface ITransactionEvent {
  associatedID: string;
  eventDate: string;
  eventDescription: string;
  eventPrice: number;
  eventType: string;
  orderId: string | IWalletOrderId;
  transferStatus: string;
  memberOrderId: string;
  subscriptionId?: string;
  metadata: Record<string, any>;
  buyerId?: string | IWalletUser;
}

export interface ITransaction {
  _id?: string;
  event: ITransactionEvent;
}
