import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import AddMessage from 'pages/schedule-messaging/components/RightView/AddMessage';
import React, { useState } from 'react';
import { setMessage, setPrice } from 'store/reducer/chat';
interface Props {
  onCloseTabs(): void;
  customButton?: React.ReactElement;
  onSubmit(
    files: any[],
    message?: string,
    price?: number,
    messageKey?: string,
  ): void;
  defaultType?: 'pay-to-view' | 'standard';
  media?: ChatMessage['messageMedia'];
  managedAccountId?: string;
  hasPaid?: boolean;
  isSending?: boolean;
  files?: ChatMessage['messageMedia'];
  onFileChange?: (...args: any) => void;
  onComplete?: (...args: any) => void | Promise<any>;
  onChangeView?: (type: 'pay-to-view' | 'standard') => void;
}

const PaidMessageInput: React.FC<Props> = (props) => {
  const {
    hasPaid = true,
    onCloseTabs,
    onSubmit: onSubmitCb,
    media,
    files: defaultFiles,
    customButton,
    managedAccountId,
    onComplete,
    onFileChange,
    defaultType = 'standard',
    isSending,
    onChangeView,
  } = props;
  const [selectedMessageType, setselectedMessageType] = useState<
    'pay-to-view' | 'standard'
  >(defaultType);
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.chat.message);
  const price = useAppSelector((state) => state.chat.price || 0);
  return (
    <AddMessage
      showTemplate={false}
      customButton={customButton}
      onFileChange={onFileChange}
      hasPaid={hasPaid}
      className="sub-tabs-holder"
      selectedMessageType={selectedMessageType}
      setSelectedMessageType={(val: 'pay-to-view' | 'standard') => {
        onChangeView?.(val);
        setselectedMessageType(val);
      }}
      isSending={isSending}
      onSend={onComplete}
      showChooseTabsOptions={false}
      showClose
      onCloseTabs={onCloseTabs}
      onSubmitCb={onSubmitCb}
      price={price}
      message={message}
      media={media}
      validateFiles={(files) => {
        if (!message?.trim().length) {
          toast.error('Please enter a message');
          return false;
        }
        if (files.findIndex((i) => i.isPaidType) !== -1 && !files.length) {
          toast.error('Please add at least one media');
          return false;
        }
        if (files.findIndex((i) => i.isPaidType) !== -1 && price < 1) {
          toast.error('Price should be at least $1');
          return false;
        }

        return true;
      }}
      files={defaultFiles}
      preivewMessage={
        selectedMessageType === 'standard' ? 'Create Your Message' : undefined
      }
      preivewSubMessage={
        selectedMessageType === 'standard'
          ? 'You can attach multiple media your message.'
          : undefined
      }
      onPriceChange={(price) => dispatch(setPrice(price))}
      onMessageChange={(message: string) => dispatch(setMessage(message))}
      managedAccountId={managedAccountId}
    />
  );
};

export default PaidMessageInput;
