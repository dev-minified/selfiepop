import { Uploader } from 'assets/svgs';
import ProgressBar from 'components/ProgressBar';
import { RequestLoader } from 'components/SiteLoader';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { selectGroupBykey } from 'store/reducer/files';
import styled from 'styled-components';
type Props = {
  className?: string;
  completed?: any;
  folderId?: string;
};

const LibraryLoading = (props: Props) => {
  const { className, folderId = '' } = props;
  const uploadingGroup = useAppSelector((state) =>
    selectGroupBykey(state, folderId),
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show && uploadingGroup) {
      setShow(true);
    }
  }, [folderId, uploadingGroup]);
  const messages = uploadingGroup;

  return (
    <div className={className}>
      <RequestLoader
        isLoading={true}
        width="28px"
        height="28px"
        color="var(--pallete-primary-main)"
      />
      <div className="loading-info">
        <Uploader />
        Uploading media...
      </div>
      <ProgressBar completed={messages?.progress as number} />
    </div>
  );
};

export default styled(LibraryLoading)`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: center;
  flex-direction: column;

  .loading-info {
    margin: 0 0 5px;

    svg {
      margin: 0 5px 0 0;
    }
  }

  .loading-icon {
    width: 0;
    transition: all 0.4s ease;
  }

  .progress-bar-area {
    position: absolute;
    left: 5px;
    right: 5px;
    bottom: 0;

    .progress-bar-holder {
      border-radius: 0 !important;
      height: 4px !important;
    }

    .progress-bar-filled {
      height: 4px !important;
      background: var(--pallete-primary-main) !important;
    }
  }
`;
