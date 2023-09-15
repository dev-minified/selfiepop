import { FileAttachmentSVG, LockIcon, PlusFilled } from 'assets/svgs';
import attrAccept from 'attr-accept';
import AttachmentContainer from 'components/AttachmentContainer';
import UploadandEditor from 'components/UploadandEditor';
import { ReactElement, useEffect, useState } from 'react';
import { Accept } from 'react-dropzone';
import styled from 'styled-components';
import { getVideoCover } from 'util/index';
import { v4 as uuid } from 'uuid';
interface Props {
  showButton?: boolean;
  onChange?: (files: MediaType[]) => void;
  limit?: number;
  // accept?: string[] | string;
  accept?: Accept;
  value?: MediaType[];
  className?: string;
  showCloseImage?: boolean;
  onAttachmentClick?: (files: MediaType[], file: MediaType) => void;
  imageSizes?: string[];
}
function SupportFileContainer({
  value,
  showButton = true,
  onChange,
  limit = 10000,
  // accept = ['image/*', 'video/*'],
  accept = { 'image/*': [], 'video/*': [] },
  className,
  showCloseImage = true,
  onAttachmentClick,
  imageSizes = [],
  ...rest
}: Props): ReactElement {
  const [files, setFiles] = useState<MediaType[]>([]);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (value) setFiles(value);
  }, [value]);

  const handleSuccess = async (fls: any) => {
    const newFiles: MediaType[] = [];
    for (let index = 0; index < fls.length; index++) {
      const file = fls[index];
      let url = undefined;
      let thumb = undefined;
      let duration = '';
      let duratonInSeconds = 0;
      if (attrAccept(file, 'video/*')) {
        await getVideoCover(file)
          .then((payload: any) => {
            thumb = URL.createObjectURL(payload);
            duration = payload.timeDuration;
            duratonInSeconds = payload.duration;
          })
          .catch((e) => {
            console.log(e, 'error');
          });
      } else if (attrAccept(file, 'image/*')) {
        url = URL.createObjectURL(file);
      }
      newFiles.push({
        name: file.name,
        type: file.type,
        id: uuid(),
        size: file.size,
        orignalFile: file,
        path: url,
        thumbnail: thumb,
        videoDuration: duration,
        duration: duratonInSeconds,
      });
    }

    const f = files.concat(newFiles);
    setFiles(f);
    onChange?.(f);
  };

  const removeFile = (id: string) => {
    const f = files.filter((file) => file.id !== id);
    setFiles(f);
    onChange?.(f);
  };
  return (
    <div className={className}>
      <div className={`${files.length > 0 ? 'imag_media d-flex' : ''}`}>
        {files.length > 0
          ? files?.map((m: any) => {
              return (
                <div key={m.id || m._id} className="parent">
                  <AttachmentContainer
                    onClick={(media: any) => onAttachmentClick?.(files, media)}
                    media={m}
                    showOptions={{
                      closeIcon: showCloseImage,
                      edit: false,
                      play: attrAccept({ type: m.type }, 'vidoe/*'),
                      video: attrAccept({ type: m.type }, 'vidoe/*'),
                      timeStampText: false,
                    }}
                    filekey={'id'}
                    onClose={removeFile}
                    icon={m.islocK ? <LockIcon /> : undefined}
                  />
                </div>
              );
            })
          : null}
        {showButton && (
          <UploadandEditor
            imageSizes={imageSizes}
            customRequest={handleSuccess}
            disabled={files?.length >= limit}
            cropper={false}
            accept={accept}
            // maxFiles={maxFiles}
            {...rest}
          >
            {files?.length > 0 ? (
              <div className="upload_placeholder">
                <PlusFilled />
              </div>
            ) : (
              <span className="file-uploader">
                <FileAttachmentSVG width="14px" height="15px" />
                ATTACH FILE
              </span>
            )}
          </UploadandEditor>
        )}
      </div>
    </div>
  );
}

export default styled(SupportFileContainer)`
  padding: 1px 0 0;

  .upload_placeholder {
    width: 106px;
    min-width: 106px;
    height: 136px;
    background: #e1e4eb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @media (max-width: 767px) {
      height: 77px;
      width: 77px;
      min-width: 77px;
    }

    svg {
      width: 46px;
      height: 46px;
      color: var(--pallete-primary-main);

      @media (max-width: 767px) {
        width: 30px;
        height: 30px;
      }
    }
  }

  .imag_media {
    margin: 20px -5px 10px;
    overflow: auto;
  }

  .img-container {
    width: 136px;
    min-width: 136px;
    height: 136px;
    padding: 0;
    margin: 0 10px 10px 5px;
    display: inline-block;
    vertical-align: top;

    @media (max-width: 767px) {
      height: 77px;
      width: 77px;
      min-width: 77px;
    }

    img {
      position: static;
    }
  }

  .file-uploader {
    display: inline-block;
    vertical-align: top;
    font-size: 13px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.5);
    font-weight: 500;
    cursor: pointer;

    &:hover {
      color: rgba(0, 0, 0, 0.8);

      path {
        fill: rgba(0, 0, 0, 0.8);
      }
    }

    svg {
      margin: 0 5px 0 0;
    }

    path {
      fill: rgba(0, 0, 0, 0.5);
    }
  }
`;
