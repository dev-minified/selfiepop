type SPEvent = {
  eventSlug: string;
  userId: string;
  anonymousId: string;
  metadata: record<string, any>;
};
type SPLogsEvent = PublicPageViewEvent &
  RegisterAccountEvent &
  PurchaseEvent &
  CreditCardEvent &
  SubscriptionEvent &
  ManagerAddRemoveEvent &
  ModifyAccountEvent &
  Parial<{
    [key: string]: string;
  }>;

type PublicPageViewEvent = {
  userProfileViewed?: string; // UUID OF THE USER WHOS PAGE THEY VIEWED
  referrer?: string; //URL THEY CAME FROM
  ipAddress?: string; // IP OF USER
};
type RegisterAccountEvent = {
  onboardingFlowTypeId?: string; // onboardingTypeId OF THE USER WHOS PAGE THEY VIEWED
  flowVersion?: string; //version of this onboarding flow, we will need to update when we iterate
};
type CreditCardEvent = {
  cardId?: string; // non sensitive id (last 4? id in our system ? )
};
type PurchaseEvent = {
  purchasedFrom?: string; // uuid of who they purchased from
  purchaseTypeSlug?: string; // slug representing type of purchase (poplive, message_unlock, tip etc)
  purchaseAmount?: number;
  itemId?: string; // (POP ID IF POP, POST IF POST, ETC)
};
type SubscriptionEvent = {
  purchasedFrom?: string; // uuid of who they purchased from
  memberLevelId?: string; // slug representing type of purchase (poplive, message_unlock, tip etc)
};
type ManagerAddRemoveEvent = {
  managerAdded?: string; // uuid of who they add or remove;
};
type ModifyAccountEvent = {};
