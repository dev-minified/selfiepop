import { LockIcon } from 'assets/svgs';
import attrAccept from 'attr-accept';
import AttachmentContainer from 'components/AttachmentContainer';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { selectGroupBykey } from 'store/reducer/files';
import styled from 'styled-components';
type Props = {
  messageKey: string;
  className?: string;
};

const UploadAttachmentContainer = (props: Props) => {
  const { messageKey = '', className } = props;
  const uploadingGroup = useAppSelector((state) =>
    selectGroupBykey(state, messageKey),
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show && uploadingGroup) {
      setShow(true);
    }
  }, [messageKey, uploadingGroup]);
  const messages = uploadingGroup;
  const onRemoveFile = (id: string) => {
    if (messages?.files) {
      const file: any = messages?.files?.find((f) => f.id === id);
      file?.onUploadingFileCancelled(file);
    }
  };
  return show ? (
    <div className={`galleryMediaUploadinig ${className}`}>
      {messages?.files?.map((m: any) => {
        return (
          <AttachmentContainer
            key={m.id || m._id}
            media={m}
            ImageSizesProps={{
              onlyMobile: true,
            }}
            showOptions={{
              closeIcon: true,
              edit: false,
              play: attrAccept({ type: m.type }, 'video/*'),
              video: attrAccept({ type: m.type }, 'video/*'),
              timeStampText: false,
              showprogress: true,
            }}
            filekey={'id'}
            onClose={onRemoveFile}
            icon={m.islocK ? <LockIcon /> : undefined}
          />
        );
      })}
    </div>
  ) : null;
};

export default styled(UploadAttachmentContainer)`
  .img-box {
    position: absolute;
    top: 0;
  }
`;
