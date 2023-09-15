import { orderQuestionAnswer } from 'api/Order';
import { Check } from 'assets/svgs';
import { OrderStatus } from 'enums';
import React, { useState } from 'react';
import FocusInput from './focus-input';
import MessageBox from './MessageBox';
import Button from './NButton';

interface Props {
  order: any;
  type: 'sale' | 'purchase';
  onSubmitSuccess: (orderId: string) => Promise<void>;
}

const ShoutoutChat: React.FC<Props> = (props) => {
  const { order, type, onSubmitSuccess } = props;
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitQuestion = async () => {
    if (!message) {
      return;
    }
    setIsSubmitting(true);
    const res = await orderQuestionAnswer(order?._id, message).catch(
      console.log,
    );
    if (res) {
      await onSubmitSuccess(order._id);
      setMessage('');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {order?.questionsAndAnswers?.length > 0 && <hr />}
      {order?.questionsAndAnswers?.map((qa: any, index: number) => (
        <MessageBox
          key={index}
          title={`${qa.isQuestion ? 'Question for' : 'Answer from'} ${
            order?.buyer?.pageTitle ?? 'Incognito User'
          }`}
          timestamp={qa.dateSubmitted}
          message={qa.value}
        />
      ))}
      {(type === 'sale' ||
        (order?.questionsAndAnswers?.length > 0 &&
          order.questionsAndAnswers[order.questionsAndAnswers.length - 1]
            .hasOpenQuestion)) &&
      order?.orderStatus === OrderStatus.IN_PROGRESS ? (
        <>
          <hr className="mt-0 mb-20" />
          {type === 'sale' && (
            <p className="label-text mb-n10">
              Do you have a question for{' '}
              <span className="text-black font-bold">
                {order?.buyer?.pageTitle ?? 'Incognito User'}?
              </span>
            </p>
          )}
          <div className="mt-30">
            <FocusInput
              type="textarea"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              materialDesign
              label={`Submit ${type === 'sale' ? 'Question' : 'Answer'}`}
            />
            <div className="text-center mb-20">
              <Button
                shape="circle"
                size="large"
                type="primary"
                className="text-uppercase"
                onClick={submitQuestion}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit {type === 'sale' ? 'Question' : 'Answer'}
                <span className="ml-5 mr-n5 btn-icon">
                  <Check />
                </span>
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ShoutoutChat;
