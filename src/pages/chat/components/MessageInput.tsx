import { SendMessage, Spinner } from 'assets/svgs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAppTheme from 'hooks/useAppTheme';
import React, { useEffect, useState } from 'react';
import InputEmoji from 'react-input-emoji';
import { setMessage } from 'store/reducer/chat';

interface Props {
  handleSendMessage(message: string): void;
  mode?: string;
}

const MessageInput: React.FC<Props> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const isSendingMessage = useAppSelector(
    (state) => state.chat.isSendingMessage,
  );
  const { mode } = useAppTheme();
  const message = useAppSelector((state) => state.chat.message);
  useEffect(() => {
    message && setInputValue(message);
    return () => {
      // dispatch(setMessage(''));
    };
  }, [message]);
  const dispatch = useAppDispatch();
  const { handleSendMessage } = props;
  const handleSend = () => {
    if (inputValue && !isSendingMessage) {
      handleSendMessage(inputValue);
      setInputValue('');
      dispatch(setMessage(''));
    }
  };

  return (
    <>
      <InputEmoji
        disabled={true}
        value={inputValue}
        onChange={(value: string) => {
          if (!!value.length) {
            dispatch(setMessage(value));
          }
        }}
        theme={mode}
        keepOpenend={true}
        cleanOnEnter={false}
        onEnter={handleSend}
        placeholder={!!!message?.length ? 'Type a message' : ''}
      />
      {!isSendingMessage ? (
        <div onClick={handleSend} className="btn-send">
          <SendMessage />
        </div>
      ) : (
        <div className="send-spinner">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default MessageInput;
