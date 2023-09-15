import { CloseCircle } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import QuillEditor from 'components/QuillEditor';
import { useFormik } from 'formik';
import { useRef } from 'react';
import styled from 'styled-components';
interface ICardAddComments {
  className?: string;
  id?: string;
  onSubmit?: (...args: any) => void;
  cardClass?: string;
  user?: Record<string, any>;
  defaultMention?: { id: string; value: string; denotationChar?: '@' | '#' };
}

const CardAddComments: React.FunctionComponent<ICardAddComments> = ({
  className,
  id,
  onSubmit: onSubmitCallback,
  cardClass,
  user,
  defaultMention = null,
}) => {
  const reactQuill = useRef<any>(null);
  const { isSubmitting, setFieldValue, handleSubmit, values, resetForm } =
    useFormik({
      initialValues: {
        comment: '',
      },
      onSubmit: async (values) => {
        const match =
          /^<p><br><\/p>$/.test(values?.comment) ||
          values?.comment?.trim() === '';
        console.log(match);
        if (id && !match) {
          await onSubmitCallback?.(id, values);
          reactQuill?.current?.editor?.setContents([]);
          reactQuill?.current?.editor?.setText('');
          resetForm();
        }
      },
    });
  const match =
    /^<p><br><\/p>$/.test(values?.comment) || values?.comment === '';
  const bindings = {
    keyboard: {
      bindings: {
        'shift enter': {
          key: 13,
          shiftKey: true,
          handler: (range: any) => {
            reactQuill.current.editor.insertText(range.index, '\n');
          },
        },
        enter: {
          key: 13,
          shiftKey: false,
          handler: () => {
            handleSubmit();
          },
        },
      },
    },
  };

  return (
    <div className={`${className} ${cardClass}`}>
      <div className="add_comment_profile">
        <ImageModifications
          fallbackUrl={'/assets/images/default-profile-img.svg'}
          imgeSizesProps={{
            onlyMobile: true,

            imgix: { all: 'w=163&h=163' },
          }}
          src={user?.profileImage}
          alt="img description"
        />
      </div>
      <div className="add_comment_content">
        <QuillEditor
          toolbar={false}
          mention={true}
          DraftData={(e: any) => setFieldValue('comment', e?.editorState)}
          value={''}
          defaultMention={defaultMention || undefined}
          bindings={bindings}
          ref={reactQuill}
        />
        <div className="buttons-holder">
          {!match && (
            <span
              onClick={() => reactQuill?.current?.editor?.setText('')}
              className="cancel-comment"
            >
              <CloseCircle />
            </span>
          )}

          <Button
            type="primary"
            isLoading={isSubmitting}
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
            size="small"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default styled(CardAddComments)`
  display: flex;
  margin: 20px -20px 0;
  padding: 20px;
  /* border-top: 7px solid var(--pallete-colors-border); */
  border-bottom: 1px solid var(--pallete-colors-border);

  .ql-container {
    font-size: 14px;
  }

  .mention {
    background: none;
    color: #8dc63f;
  }

  .ql-editor {
    min-height: 34px;
    resize: none;
    padding: 7px 110px 6px 10px;
  }

  @media (max-width: 479px) {
    margin: 15px -15px 0;
    padding: 15px;
  }

  .add_comment_profile {
    width: 38px;
    height: 38px;
    border-radius: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .add_comment_content {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 0 0 0 20px;
    position: relative;

    @media (max-width: 479px) {
      padding: 0 0 0 15px;
    }

    .pop-card {
      margin: 0 0 10px !important;
      padding: 0 !important;
    }

    .buttons-holder {
      position: absolute;
      right: 8px;
      bottom: 16px;
      display: flex;
      align-items: center;

      .button {
        min-width: 60px;
      }

      .cancel-comment {
        margin: 0 10px 0 0;
        cursor: pointer;
        width: 20px;
        line-height: 1;

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }

        &:hover {
          circle {
            fill-opacity: 1;

            .sp_dark & {
              fill-opacity: 0.4;
            }
          }
        }
      }

      circle {
        stroke-width: 0;
        transition: all 0.4s ease;
      }
    }

    .ql-container {
      background: var(--pallete-background-gray-primary);
      border-radius: 8px;
      border: none;
    }

    .text-input {
      margin-bottom: 0 !important;

      .icon {
        width: auto;
        max-width: inherit;
        right: 5px;
      }

      .form-control {
        padding-right: 75px !important;
      }

      .button {
        min-width: 60px;
        /* background: var(--pallete-primary-light) !important;
        border-color: var(--pallete-primary-light) !important; */
      }
    }
  }
`;
