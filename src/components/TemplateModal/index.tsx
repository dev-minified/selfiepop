import { PostTemplateIcon, Spinner } from 'assets/svgs';
import AttachmentContainer from 'components/AttachmentContainer';
import EmptydataMessage from 'components/EmtpyMessageData';
import Scrollbar from 'components/Scrollbar';
import Modal from 'components/modal';
import React, { useCallback } from 'react';
import { positionValues } from 'react-custom-scrollbars-2';
import styled from 'styled-components';

interface ITemplateModal {
  className?: string;
  title?: string;
  isOpen: boolean;
  isLoading?: boolean;
  checked: string;
  mediaKey: string;
  sumbitTitle?: string;
  templates: IPost[];
  onClose: () => void;
  loadMore: () => void;
  oK: () => void;
  onClick?: (item?: IPost | ChatMessage) => void;
}

const PostTemplateModal: React.FC<ITemplateModal> = ({
  className,
  isOpen = false,
  isLoading = false,
  onClose,
  oK,
  mediaKey,
  sumbitTitle = 'USE THIS POST',
  title = '',
  onClick,
  checked,
  templates,
  loadMore,
}) => {
  const handleUpdate = useCallback(
    (values: positionValues) => {
      if (isLoading || !templates?.length) return;

      const { scrollTop, scrollHeight, clientHeight } = values;
      const pad = 300; // 50px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1) loadMore?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [templates?.length, isLoading],
  );

  return (
    <Modal
      onOk={oK}
      showHeader={true}
      showFooter={true}
      sumbitTitle={sumbitTitle}
      title={
        <React.Fragment>
          <PostTemplateIcon />
          {title}
        </React.Fragment>
      }
      isOpen={isOpen}
      onClose={onClose}
      className={`${className} modal-templates`}
    >
      <Scrollbar
        autoHeight={true}
        autoHeightMax={'calc(100vh - 170px)'}
        style={{ overflow: 'hidden' }}
        onUpdate={handleUpdate}
      >
        <div className="gallery-holder">
          <div className="lg-react-element">
            {templates?.map((item: any) => {
              return (
                <AttachmentContainer
                  key={item._id}
                  createdAt={item.createdAt}
                  checked={item._id === checked}
                  onClick={() => onClick?.(item)}
                  media={item?.[mediaKey]?.[0]}
                  ImageSizesProps={{
                    onlyMobile: true,
                  }}
                  showOptions={{
                    timeStampText: true,
                    video: true,
                    play: true,
                    edit: false,
                    closeIcon: false,
                    selectable: true,
                    showprogress: false,
                    mutipleSelect: false,
                  }}
                />
              );
            })}
          </div>
          {isLoading && (
            <LoaderWrapper>
              <Spinner
                width="28px"
                height="28px"
                color="var(--pallete-text-secondary-50)"
              />
            </LoaderWrapper>
          )}

          {!templates?.length && !isLoading && (
            <EmptydataMessage text=" You don't have any template." />
          )}
        </div>
      </Scrollbar>
    </Modal>
  );
};

export default styled(PostTemplateModal)`
  &.modal-dialog {
    max-width: 697px;

    .modal-title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;

      svg {
        display: inline-block;
        vertical-align: bottom;
        margin: 0 10px 0 0;
      }

      path {
        fill: #000;
      }
    }

    .modal-body {
      padding: 3px 1px;

      .button-default {
        margin: 10px 5px !important;
        width: calc(100% - 10px);
      }
    }

    .media {
      padding: 0;
    }

    .audio_thumbnail {
      position: absolute;
    }

    .user-detail {
      padding: 0;
    }

    .lg-react-element {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .gallery-item,
      .img-container {
        width: calc(20% - 2px);
        margin: 0 1px 2px;
        padding-top: calc(20% - 2px);

        @media (max-width: 767px) {
          width: calc(33.333% - 2px);
          padding-top: calc(33.333% - 2px);
        }

        @media (max-width: 479px) {
          width: calc(50% - 2px);
          padding-top: calc(50% - 2px);
        }

        .image-comp {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
    }

    .timestamp {
      position: absolute;
      left: 10px;
      top: 10px;
      min-width: 50px;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      font-size: 13px;
      line-height: 15px;
      color: rgba(255, 255, 255, 1);
      font-weight: 500;
      border-radius: 4px;
      padding: 4px 5px;
      z-index: 2;
    }

    .video-length {
      position: absolute;
      left: 10px;
      bottom: 10px;
      min-width: 50px;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      font-size: 13px;
      line-height: 15px;
      color: rgba(255, 255, 255, 1);
      font-weight: 500;
      border-radius: 4px;
      padding: 4px 5px;
      z-index: 2;

      svg {
        width: 18px;
        height: 16px;
      }
    }

    .checkbox {
      pointer-events: none;
      position: absolute;
      right: 9px;
      top: 9px;
      width: 26px;
      height: 26px;
      z-index: 2;

      label {
        padding: 0;
      }

      input[type='checkbox']:checked + .custom-input-holder .custom-input {
        background: var(--pallete-primary-main);
        border-color: var(--pallete-primary-main);
      }

      .custom-input {
        margin: 0;
        width: 24px;
        height: 24px;
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 100%;
        background: none;

        &:after {
          display: none;
        }

        &:before {
          color: #fff !important;
          font-size: 9px !important;
        }
      }
    }
  }
`;
const LoaderWrapper = styled.div`
  z-index: 9;
  display: flex;
  padding-bottom: 1rem;
  padding-top: 1rem;
  justify-content: center;

  -moz-user-select: none;
  -webkit-user-select: none;
`;
