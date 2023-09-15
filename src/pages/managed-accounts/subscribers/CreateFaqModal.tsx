import { QuestionBox } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Modal from 'components/modal';
import OutlineTagger from 'components/Tags/OutlineTagger';
import { DashedLine } from 'components/Typography';
import React, { useState } from 'react';
import styled from 'styled-components';

type Props = {
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (
    question: string,
    answer?: string,
    tags?: string[],
  ) => Promise<void>;
  answerField?: boolean;
};

type FAQ = {
  question: string;
  answer: string;
  tags: string[];
};

const CreateFaqModal: React.FC<Props> = (props) => {
  const { className, isOpen, onClose, onSubmit, answerField = true } = props;
  const [faq, setFaq] = useState<FAQ>({
    question: '',
    answer: '',
    tags: [],
  });

  const [error, setError] = useState<{ question: string; answer: string }>({
    question: '',
    answer: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  const validateFields = () => {
    let hasError = false;
    if (!faq.question) {
      hasError = true;
      setError((prev) => ({ ...prev, question: 'Question is required!' }));
    }
    if (answerField && !faq.answer) {
      hasError = true;
      setError((prev) => ({ ...prev, answer: 'Answer is required!' }));
    }

    return !hasError;
  };

  return (
    <Modal
      className={className}
      onOk={() => {
        if (validateFields()) {
          setLoading(true);
          onSubmit?.(faq.question, faq.answer, faq.tags).finally(() => {
            setLoading(false);
          });
        }
      }}
      isOpen={isOpen}
      onClose={onClose}
      confirmLoading={loading}
      title={
        <span>
          <QuestionBox /> Create FAQ
        </span>
      }
    >
      <form>
        <h4>Question:</h4>
        <FocusInput
          rows={3}
          type="textarea"
          placeholder="Question..."
          error={error.question}
          touched={true}
          onChange={(e) => {
            setFaq((prev) => ({ ...prev, question: e.target.value }));
            setError((prev) => ({ ...prev, question: '' }));
          }}
        />
        {answerField && (
          <>
            <h4>Answer:</h4>
            <FocusInput
              rows={3}
              type="textarea"
              placeholder="Answer..."
              error={error.answer}
              touched={true}
              onChange={(e) => {
                setFaq((prev) => ({ ...prev, answer: e.target.value }));
                setError((prev) => ({ ...prev, answer: '' }));
              }}
            />
          </>
        )}
        <DashedLine className="dashed" />
        <OutlineTagger
          defaultTags={[]}
          onChange={(tags) =>
            setFaq((prev) => ({ ...prev, tags: tags.split(',') }))
          }
          alwaysShowInput
          placeholder="Add Keywords"
          disableSelection
          selectionLimit={null}
        />
        <DashedLine className="dashed" />
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
      color: #000;
      margin: 0 0 9px;
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

    .icon {
      .button {
        width: 22px;
        height: 22px;
        color: #bbccda;

        &:hover {
          color: #255b87;
        }

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
          display: block;
        }
      }
    }

    .dashed {
      &:before {
        border-top-color: #dfe0e0;
      }
    }

    .tags-row {
      margin: 10px -5px;

      @media (max-width: 767px) {
        margin: 10px -3px;
      }
    }

    .tag {
      margin-top: 10px;

      input[type='checkbox']:checked {
        + .text {
          background: var(--pallete-background-blue-A300);

          &:hover {
            background: var(--pallete-primary-main);
          }
        }
      }

      svg {
        @media (min-width: 768px) {
          margin: -1px -10px 0 10px;
        }
      }
    }
  }
`;
