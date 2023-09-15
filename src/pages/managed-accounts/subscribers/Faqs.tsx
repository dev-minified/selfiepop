import { PlusFilled, Search } from 'assets/svgs';
import Input from 'components/focus-input';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import { FaqStatus } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useCopyToClipBoard from 'hooks/useCopyToClipBoard';
import useOpenClose from 'hooks/useOpenClose';
import React, { useEffect, useState } from 'react';
import { setMessage } from 'store/reducer/chat';
import { createManagerFaq, deleteManagerFaq } from 'store/reducer/manager-faqs';

import CreateFaqModal from './CreateFaqModal';
import FaqCard from './FaqCard';

type Props = {
  id: string;
  subscriberId: string;
  sub?: ChatSubsType | null;
};

const Faqs: React.FC<Props> = (props) => {
  const { id, subscriberId, sub } = props;

  const dispatch = useAppDispatch();

  const [, copy] = useCopyToClipBoard();
  const [isFaqModalOpen, openFaqModal, closeFaqModal] = useOpenClose();

  const faqs = useAppSelector((state) => state.managerFaqs.list);

  const [search, setSearch] = useState<string>('');
  const [completedFaqs, setCompletedFaqs] = useState<ManagerFAQ[]>([]);

  useEffect(() => {
    let faqList = faqs.filter((faq) => faq.status === FaqStatus.Complete);
    if (search) {
      faqList = faqList.filter((faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()),
      );
    }
    setCompletedFaqs(faqList);
  }, [faqs, search]);

  const handleApply = (faq: ManagerFAQ) => {
    dispatch(setMessage(faq.answer));
  };

  const handleCopy = (faq: ManagerFAQ) => {
    copy(faq.answer);
    toast.success('Copied to clipboard');
  };

  const handleDelete = async (faq: ManagerFAQ): Promise<any> => {
    if (faq._id) {
      return dispatch(deleteManagerFaq({ id: `${faq._id}` }));
    }
  };

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
        closeFaqModal();
      });
  };

  return (
    <div>
      <Input
        placeholder="Search Questions"
        type="text"
        class="form-control-search"
        hasIcon
        icon={<Search />}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      {completedFaqs.map((faq) => (
        <FaqCard
          key={faq._id}
          faq={faq}
          onApply={handleApply}
          onDelete={handleDelete}
          onCopy={handleCopy}
        />
      ))}
      <Button
        type="primary"
        block
        icon={<PlusFilled />}
        className="btn-faq"
        onClick={openFaqModal}
      >
        Add FAQ
      </Button>
      <CreateFaqModal
        isOpen={isFaqModalOpen}
        onClose={closeFaqModal}
        onSubmit={handleAddFaq}
      />
    </div>
  );
};

export default Faqs;
