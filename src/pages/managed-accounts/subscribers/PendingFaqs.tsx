import { PlusFilled } from 'assets/svgs';
import Button from 'components/NButton';
import { FaqStatus } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import React, { useEffect, useState } from 'react';
import {
  createManagerFaq,
  deleteManagerFaq,
  updateManagerFaq,
} from 'store/reducer/manager-faqs';

import CreateFaqModal from './CreateFaqModal';
import FaqCard from './FaqCard';

type Props = {
  id: string;
  subscriberId: string;
  sub?: ChatSubsType | null;
};

const PendingFaqs: React.FC<Props> = (props) => {
  const { id, subscriberId, sub } = props;

  const dispatch = useAppDispatch();

  const [isPendingFaqModalOpen, openPendingFaqModal, closePendingFaqModal] =
    useOpenClose();

  const faqs = useAppSelector((state) => state.managerFaqs.list);

  const [pendingFaqs, setPendingFaqs] = useState<ManagerFAQ[]>([]);

  useEffect(() => {
    const pending = faqs.filter((faq) => faq.status === FaqStatus.Pending);
    setPendingFaqs(pending);
  }, [faqs]);

  const handleAddFaq = async (
    question: string,
    answer?: string,
    tags?: string[],
  ): Promise<any> => {
    return dispatch(
      createManagerFaq({
        data: {
          question,
          answer: answer || undefined,
          tags,
          status: answer ? FaqStatus.Complete : FaqStatus.Pending,
          sellerId: id,
          awaitingResponse: answer ? undefined : sub?.buyerId?._id,
          subscriptionId: subscriberId,
        },
      }),
    )
      .unwrap()
      .then(() => {
        closePendingFaqModal();
      });
  };

  const handleAddAnswer = async (
    faq: ManagerFAQ,
    ans: string,
  ): Promise<any> => {
    if (faq._id) {
      return dispatch(
        updateManagerFaq({
          id: faq._id,
          data: {
            answer: ans,
            status: FaqStatus.Complete,
          },
        }),
      ).unwrap();
    }
  };

  const handleDelete = async (faq: ManagerFAQ): Promise<any> => {
    if (faq._id) {
      return dispatch(deleteManagerFaq({ id: `${faq._id}` }));
    }
  };

  return (
    <div>
      <Button
        type="secondary"
        block
        icon={<PlusFilled />}
        className="btn-question"
        onClick={openPendingFaqModal}
      >
        Add Pending Question
      </Button>
      {pendingFaqs.map((faq) => (
        <FaqCard
          key={faq._id}
          faq={faq}
          onAnswer={handleAddAnswer}
          onDelete={handleDelete}
        />
      ))}
      <CreateFaqModal
        isOpen={isPendingFaqModalOpen}
        onClose={closePendingFaqModal}
        onSubmit={handleAddFaq}
        answerField={false}
      />
    </div>
  );
};

export default PendingFaqs;
