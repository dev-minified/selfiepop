import { ChatUnsubscribeSVG } from 'assets/svgs';
import Button from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import PurchaseHistory from 'pages/my-members/components/PurchaseHistory';
import { ReactElement, useState } from 'react';
import { chatUnsubscribeToggler } from 'store/reducer/chat';
import styled from 'styled-components';
import UnSubscribeMode from './Models/UnSubscribeMode';
import NotesView from './NotesView';
import RecipientInfo from './RecipientInfo';
import TagView from './TagView';
interface Props {
  className?: string;
  user?: Record<string, any>;
  purchaseWallet?: Record<string, any>;

  showautoRenowelbutton?: boolean;
  showPurchaseMenu?: boolean;
  managedAccountId?: string;
  onUserNameClick?: (...args: []) => void;
}

function RoomDetail({
  className,
  user: OrderUser,
  purchaseWallet,
  showautoRenowelbutton = true,
  showPurchaseMenu = true,
  managedAccountId,
  onUserNameClick,
}: Props): ReactElement {
  const sub = useAppSelector((state) => state.chat.selectedSubscription);
  const { user } = useAuth();
  let isBuyer = false;
  let subUser: any = {};
  if (!sub?._id) {
    subUser = OrderUser?.buyerId;
  } else {
    isBuyer =
      user?._id !== sub?.sellerId._id ? true && showautoRenowelbutton : false;
    subUser = isBuyer ? sub?.sellerId : sub?.buyerId;
  }
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModel, onOpenModel, onCloseModel] = useOpenClose();

  const dispatch = useAppDispatch();

  const handleSubscriptionToggler = async () => {
    onCloseModel();
    setIsLoading(true);
    if (sub?._id) {
      dispatch(
        chatUnsubscribeToggler({
          subscriptionId: sub._id,
          data: { autoRenew: !sub.autoRenew },
          callback: () => {},
          dispatch,
        }),
      );
    }
    setIsLoading(false);
  };
  console.log({ sub });
  return (
    <div className={className}>
      <Scrollbar className="roomDetails">
        <div className="scroll-wrap">
          {subUser && (
            <RecipientInfo
              sub={sub!}
              isBuyer={isBuyer}
              user={subUser}
              onClick={onUserNameClick}
              className="mb-20 widget-box"
              managedAccountId={managedAccountId}
            />
          )}

          {sub?.isActive && (
            <TagView
              sub={sub!}
              isBuyer={isBuyer}
              user={subUser}
              className="mb-20 widget-box"
              managedAccountId={managedAccountId}
            />
          )}
          {!isBuyer && sub?.isActive && (
            <NotesView
              sub={sub!}
              isBuyer={isBuyer}
              user={subUser}
              className="widget-box"
              managedAccountId={managedAccountId}
            />
          )}

          {sub?._id && isBuyer && (
            <div className="mt-10 mb-10 d-flex justify-content-center">
              <Button
                isLoading={isLoading}
                disabled={isLoading}
                icon={<ChatUnsubscribeSVG />}
                size="small"
                shape="circle"
                onClick={() => onOpenModel()}
              >
                {sub?.autoRenew ? (
                  <>
                    Cancel <span className="text-offwhite">Auto-renewal</span>{' '}
                    subscription
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </Button>
            </div>
          )}
          {showPurchaseMenu && (
            <div className="mt-20">
              <PurchaseHistory purchaseWallet={purchaseWallet} />
            </div>
          )}
        </div>
      </Scrollbar>
      <UnSubscribeMode
        isOpen={isOpenModel}
        isSubscribed={sub?.autoRenew}
        onCancel={() => onCloseModel()}
        onUnsubscribe={handleSubscriptionToggler}
      />
    </div>
  );
}

export default styled(RoomDetail)`
  background: var(--pallete-background-gray-secondary-light);
  height: 100%;
`;
