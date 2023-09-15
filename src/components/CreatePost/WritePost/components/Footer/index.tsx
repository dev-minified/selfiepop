// import { ExpiratinIcon, GalleryPlus, PublishArrow } from 'assets/svgs';
import { GalleryPlus, PostTemplateIcon, PublishArrow } from 'assets/svgs';
import Button from 'components/NButton';
import ToolTip from 'components/tooltip';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import ExpirationModal from 'pages/Sales/components/Model/expirationModal';
import React from 'react';
import { onRemoveGroup, selectGroupBykey } from 'store/reducer/files';
import { removeSelectedPost, toggleEditPost } from 'store/reducer/member-post';
import { removeFromPendingMessage } from 'store/reducer/salesState';
// import { onToggleModal } from 'store/reducer/statisticsModelState';
import styled from 'styled-components';
import PostTemplateModalWrapper from '../PostTemplateWrapper';

interface Props {
  className?: string;
  isPaid?: boolean;
  hasTemplate?: boolean;
  changeSubmitLabel?: string;
  form?: any;
  onNewListOpenModel?: () => void;
  actions?: boolean;
  setShowPoll?: Function;

  onPublish: () => void;
  onFileChanges?: (files: any[], type: string) => void;

  messageKey?: string;
  managedAccountId?: string;
}

const Footer: React.FC<Props> = ({
  className,
  onPublish,
  changeSubmitLabel = undefined,
  form,
  onFileChanges,
  messageKey = '',
  onNewListOpenModel,
  actions = true,
  hasTemplate = true,
  managedAccountId,
}) => {
  const [isOpen, onOpen, onClose] = useOpenClose();
  const dispatch = useAppDispatch();

  const uploadingGroup = useAppSelector((state) =>
    selectGroupBykey(state, messageKey),
  );
  const showEditPost = useAppSelector((state) => state.memberPost.showEditPost);
  const {
    isSubmitting,
    values,

    resetForm,
    setFieldValue,
  } = form || {};
  return (
    <div className={`btns-actions-area ${className}`}>
      <PostTemplateModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        managedAccountId={managedAccountId}
      />
      <div className="icons-actions">
        <div className="icon-holder">
          <ToolTip overlay={'Add media'}>
            <span onClick={onNewListOpenModel}>
              {' '}
              <GalleryPlus />
            </span>
          </ToolTip>
        </div>
        {hasTemplate && (
          <div onClick={onOpen} className="icon-holder">
            <ToolTip overlay={'Template'}>
              <PostTemplateIcon />
            </ToolTip>
          </div>
        )}
      </div>
      {actions && (
        <div className="right-area">
          <Button
            onClick={() => {
              dispatch(removeSelectedPost());
              if (messageKey && isSubmitting) {
                const group = uploadingGroup;
                if (group?.files?.length) {
                  group.files.forEach((f) => {
                    f.requestToken.cancel('file uploading cancelled');
                  });
                }
                dispatch(
                  removeFromPendingMessage({
                    groupId: messageKey,
                  }),
                );
                dispatch(
                  onRemoveGroup({
                    groupId: messageKey,
                  }),
                );
              }
              resetForm();
              onFileChanges?.([], 'standard');
              showEditPost && dispatch(toggleEditPost({ isOpen: false }));
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={onPublish}
          >
            <span className="btn-text mr-5">
              {changeSubmitLabel ?? 'Publish'}
            </span>{' '}
            <PublishArrow />
          </Button>
        </div>
      )}
      <ExpirationModal
        expireTime={values?.expireAt}
        expireDays={values?.expireDays}
        onSave={(time, dayjs) => {
          setFieldValue('expireAt', time);
          setFieldValue('expireDays', dayjs);
        }}
      />
    </div>
  );
};

export default styled(Footer)`
  padding: 15px 20px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 0 -20px;
  border-top: 1px solid var(--pallete-colors-border);

  .modal-content & {
    border-top-color: #e6ebf5;
  }

  @media (max-width: 479px) {
    margin: 0 -15px;
    padding: 15px 12px 0;
  }

  .icons-actions {
    display: flex;
    align-items: center;
    color: #a3a5ba;

    .icon-holder {
      transition: all 0.4s ease;
      cursor: pointer;
      margin: 0 20px 0 0;

      @media (max-width: 479px) {
        margin: 0 10px 0 0;
      }

      &:hover {
        color: var(--pallete-secondary-darker);
      }
    }

    .link-expiration {
      width: 24px;
      color: #a3b9cc;
      transition: all 0.4s ease;

      &:hover {
        color: var(--pallete-secondary-darker);
      }

      svg {
        width: 100%;
        height: auto;
      }
    }
  }

  .right-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .price-detail {
      margin: 0 15px 0 0;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      color: #a3a5ba;

      @media (max-width: 479px) {
        margin: 0 10px 0 0;
      }

      .img-close {
        display: inline-block;
        vertical-align: top;
        margin: 0 10px 0 0;
        width: 20px;

        @media (max-width: 479px) {
          margin: 0 5px 0 0;
        }

        svg {
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      }

      .amount {
        color: var(--pallete-text-light-100);
      }
    }

    .button {
      min-width: 113px;

      svg {
        margin-right: 0;
      }
    }
  }
`;
