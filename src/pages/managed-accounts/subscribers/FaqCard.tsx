import { Cancel } from 'assets/svgs';
import DeleteModal from 'components/DeleteModal';
import Button from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import Tag from 'components/Tag';
import ListItem from 'components/UserList/ListItem';
import { FaqStatus } from 'enums';
import useOpenClose from 'hooks/useOpenClose';
import React from 'react';
import styled from 'styled-components';
import GiveAnswerModal from './GiveAnswerModal';

type Props = {
  className?: string;
  onCopy?: (faq: ManagerFAQ) => void;
  onDelete?: (faq: ManagerFAQ) => Promise<void>;
  onApply?: (faq: ManagerFAQ) => void;
  onAnswer?: (faq: ManagerFAQ, ans: string) => Promise<void>;
  faq: ManagerFAQ;
};

const FaqCard: React.FC<Props> = (props) => {
  const { className, faq, onApply, onCopy, onDelete, onAnswer } = props;

  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useOpenClose();
  const [isAnswerModalOpen, openAnswerModal, closeAnswerModal] = useOpenClose();

  return (
    <div className={className}>
      <Card>
        <Card.Header>
          <div className="card-header-title">
            <span className="title">Question:</span>{' '}
            <span className="title-text">{faq.question || ''}</span>
            <Button
              type="text"
              icon={<Cancel />}
              shape="circle"
              onClick={openDeleteModal}
            />
          </div>
          {faq.status === FaqStatus.Pending && (
            <div className="btn-holder">
              <Button type="primary" shape="circle" onClick={openAnswerModal}>
                Give Answer
              </Button>
            </div>
          )}
        </Card.Header>
        <Card.Body>
          {faq.status === FaqStatus.Complete && (
            <p>
              <span className="title">Answer:</span>{' '}
              <span className="title-text">{faq.answer || ''}</span>
            </p>
          )}
          <div className="tags-row">
            {faq.tags?.map((tag, idx) => (
              <Tag
                key={idx}
                label={tag}
                closeAble={false}
                showCloseIcon={false}
              />
            ))}
          </div>
          {faq.status === FaqStatus.Complete && (
            <div className="btns-area">
              <Button
                type="default"
                shape="circle"
                onClick={() => {
                  onCopy?.(faq);
                }}
              >
                Copy Answer
              </Button>
              <Button
                type="primary"
                shape="circle"
                onClick={() => {
                  onApply?.(faq);
                }}
              >
                Apply Answer
              </Button>
            </div>
          )}
          {faq.awaitingResponse &&
            typeof faq.awaitingResponse !== 'string' &&
            faq.status === FaqStatus.Pending && (
              <>
                <p>Awaiting response:</p>
                <ListItem
                  title={`${
                    faq.awaitingResponse.pageTitle ?? 'Incognito User'
                  }`}
                  image={faq.awaitingResponse.profileImage}
                  isOnline
                />
              </>
            )}
        </Card.Body>
      </Card>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onOk={() => {
          return onDelete?.(faq);
        }}
        title="Delete Request"
        text="Are you sure you want to delete this request?"
      />
      <GiveAnswerModal
        isOpen={isAnswerModalOpen}
        onClose={closeAnswerModal}
        question={faq.question}
        onSubmit={(ans) => {
          return (onAnswer?.(faq, ans) as Promise<any>).then(() => {
            closeAnswerModal();
          });
        }}
      />
    </div>
  );
};

export default styled(FaqCard)``;
