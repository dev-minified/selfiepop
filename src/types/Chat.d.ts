type OfferStatus = 'accepted' | 'declined' | 'withdrawn' | 'open';
type Offer = {
  _id?: string;
  price: number;
  details: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  status?: OfferStatus;
};

type Message = {
  _id?: string;
  message: string;
  from: 'buyer' | 'seller';
  image?: string;
  messageType?: 'message' | 'offer';
  offer?: Offer;
  createdAt?: string;
  updatedAt?: string;
};
