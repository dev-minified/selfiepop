import { SmileyFaceChat } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Modal from 'components/modal';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import Tagger from './Tagger';

type Props = {
  className?: string;
  isOpen: boolean;
  value?: SubTask;
  onClose?: () => void;
  onSubmit?: (values: SubTask) => Promise<void>;
};

const validationSchema = yup.object().shape({
  stepTitle: yup.string().required('Title is required'),
});

const SubTaskModal = (props: Props) => {
  const { className, isOpen, value, onClose, onSubmit } = props;

  const form = useFormik<SubTask>({
    initialValues: value || {
      stepTitle: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit?.(values);
      form.resetForm();
      onClose?.();
    },
  });

  const { values, errors, handleChange, handleSubmit } = form;

  useEffect(() => {
    if (isOpen && value) {
      form.setValues(value);
    }

    if (!isOpen) {
      form.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isOpen]);

  return (
    <Modal
      className={className}
      onOk={() => {
        handleSubmit();
      }}
      isOpen={isOpen}
      onClose={onClose}
      confirmLoading={false}
      title={
        <>
          <span className="img-title">
            <SmileyFaceChat />
          </span>{' '}
          ADD TASK STEP
        </>
      }
    >
      <div>
        <div className="heading-holder">
          <FocusInput
            materialDesign
            label="Task Step Title"
            name="stepTitle"
            onChange={handleChange}
            value={values.stepTitle}
            touched={true}
            error={errors.stepTitle}
          />
        </div>
        <div className="heading-holder">
          <FocusInput
            materialDesign
            label="Task Step Description"
            name="stepDescription"
            onChange={handleChange}
            type="textarea"
            rows={5}
            value={values.stepDescription}
            touched={true}
            error={errors.stepDescription}
          />
        </div>
        <div className="tags-wrap">
          <Tagger
            title="On task step completion, add tag(s):"
            name="stepTagsAddOnComplete"
            onChange={handleChange}
            value={values.stepTagsAddOnComplete || []}
          />
          <Tagger
            title="On task step completion, remove tag(s):"
            name="stepTagsRemoveOnComplete"
            onChange={handleChange}
            value={values.stepTagsRemoveOnComplete || []}
          />
        </div>
      </div>
    </Modal>
  );
};

export default styled(SubTaskModal)`
  .modal-content {
    padding: 20px 20px 8px;
  }

  .modal-header {
    padding: 0 0 20px;
    border: none;
  }

  .modal-body {
    padding: 10px 20px 0;
    margin: 0 -20px;
    max-height: calc(100vh - 200px);
    overflow: auto;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;

    .img-title {
      margin: 0 15px 0 0;
      width: 22px;
      display: inline-block;
      vertical-align: top;
      height: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;

        path {
          fill: var(--pallete-text-light-100);
        }
      }
    }
  }

  .tags-area {
    margin: 0 0 18px;

    .label-area {
      margin: 0 !important;
    }

    .tagslist {
      margin: 0 !important;
      border: 1px solid #e6ecf1;
      padding: 3px 30px 3px 3px;
      margin: 4px;
      position: relative;

      .button {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
        color: #e6dee8;

        &:hover {
          color: var(--pallete-text-main);
        }

        svg {
          width: 19px;
          height: 19px;
        }
      }

      .form-control {
        font-size: 15px;
        line-height: 22px;
        font-weight: 500;
        border-left-color: rgba(186, 163, 193, 0.36);
        min-width: 135px !important;
        margin: 4px !important;
        flex-grow: 1;
        flex-basis: 0;

        &::placeholder {
          color: #c3c4d2;
        }
      }

      .tag {
        background: var(--pallete-primary-main);
        margin: 3px 4px;
        font-size: 15px;
        line-height: 18px;
        font-weight: 400;
        text-transform: none;
        padding: 7px 44px 7px 16px;

        .icon-close {
          right: 9px;
          font-size: 18px;
          width: 19px;
          height: 19px;
          line-height: 1;

          &:before {
            display: none;
          }

          svg {
            width: 100%;
            height: auto;
            vertical-align: top;
          }
        }
      }
    }
  }

  .tags-wrap {
    background: var(--pallete-background-gray-secondary-light);
    padding: 15px;
    border: 1px solid #f5f7fb;
    border-radius: 4px;

    .label-title {
      color: var(--pallete-text-light-50);
      font-size: 13px;
      line-height: 16px;
      margin: 0 0 12px;
    }

    .tags-area {
      &:last-child {
        margin: 0;
      }
    }
  }

  .modal-content-holder {
    font-size: 16px;
    line-height: 1.375;
    font-weight: 400;
    color: var(--pallete-text-main-550);

    strong {
      font-weight: 500;
    }
  }
`;
