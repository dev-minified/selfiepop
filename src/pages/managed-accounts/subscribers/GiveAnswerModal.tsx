import { QuestionBox } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Modal from 'components/modal';
import React, { useState } from 'react';
import styled from 'styled-components';

type Props = {
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (ans: string) => Promise<void>;
  question?: string;
};

const CreateFaqModal: React.FC<Props> = (props) => {
  const { className, isOpen, onClose, onSubmit, question } = props;
  const [answer, setAnswer] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Modal
      className={className}
      onOk={() => {
        if (answer) {
          setLoading(true);
          onSubmit?.(answer).finally(() => {
            setLoading(false);
          });
        } else {
          setError('Answer is required!');
        }
      }}
      isOpen={isOpen}
      confirmLoading={loading}
      onClose={onClose}
      title={
        <span>
          <QuestionBox /> Answer Question
        </span>
      }
    >
      <form>
        <h4>
          Question: <span className="question-text">{question}</span>
        </h4>

        <h4>Answer:</h4>
        <FocusInput
          onChange={(e) => setAnswer(e.target.value)}
          error={error}
          touched={true}
          rows={4}
          type="textarea"
          placeholder="Answer..."
        />
      </form>
    </Modal>
  );
};

export default styled(CreateFaqModal)`
  &.modal-dialog {
    max-width: 503px;

    .modal-header {
      border: none;
      padding: 20px 26px 10px;
    }

    .modal-title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      color: #252631;
      text-transform: uppercase;

      svg {
        margin: 0 10px 0 0;
      }
    }

    .modal-body {
      max-height: calc(100vh - 170px);
      padding: 0 23px;
      overflow: auto;
    }

    h4 {
      font-size: 15px;
      line-height: 20px;
      font-weight: 500;
      color: #255b87;
      margin: 0 0 9px;

      .question-text {
        color: #485260;
      }
    }

    .form-control {
      border-color: #e6ecf5;

      &::placeholder {
        color: rgba(73, 80, 87, 0.51);
      }

      &:focus {
        border-color: #255b87;
      }
    }

    .input-wrap {
      &.mb-30 {
        margin-bottom: 0 !important;
      }
    }
  }
`;
