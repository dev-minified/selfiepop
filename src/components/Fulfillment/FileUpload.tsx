import { getPresignedUrl } from 'api/User';
import { upload } from 'api/Utils';
import {
  ImageThumbnail,
  UploadBold,
  UploadFile,
  VideoThumbnail,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import DragableItem from 'components/InlinePopForm/DragableItem';
import { toast } from 'components/toaster';
import { CLOUD_FRONT_S3, CLOUD_FRONT_THUMBNAI, VIDEOURL } from 'config';
import useSocket from 'hooks/useSocket';
import React, { useCallback, useEffect, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import 'styles/fileupload-toolbar.css';
import { v4 as uuid } from 'uuid';
import Button from '../NButton';
interface Props {
  className?: string;
  defaultFiles?: FileItem[];
  disableUpload?: boolean;
  onFilesChange?(files: FileItem[]): void;
}

export type FileItem = {
  name: string;
  url: string;
  size: number;
  type: string;
};

const getFileItemIcon = (type: string) => {
  return type.includes('video') ? <VideoThumbnail /> : <ImageThumbnail />;
};

const FileUpload: React.FC<Props> = (props) => {
  const {
    className,
    defaultFiles,
    onFilesChange,
    disableUpload = false,
  } = props;
  const { socket } = useSocket();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState<
    | { progress?: number; fileName?: string; status?: string; duration?: 0 }
    | undefined
  >(undefined);

  useEffect(() => {
    if (defaultFiles) setFiles(defaultFiles);
  }, [defaultFiles]);
  // eslint-disable-next-line
  const onDropRejected = useCallback((rejectFiles: FileRejection[]) => {
    // rejectFiles.forEach((error) => {
    //   if (error.errors[0].code === 'file-too-large') {
    //     toast.error('Max 100MB of file is allowed');
    //   } else if (error.errors[0].code === 'file-invalid-type') {
    //     toast.error('Please upload a video');
    //   } else {
    //     toast.error(error.errors[0].message);
    //   }
    // });
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // acceptedFiles[0] && onSaveHandler(acceptedFiles[0]);
    // eslint-disable-next-line
    let uploadedFiles = [];
    for (const file of acceptedFiles) {
      setUploading({
        progress: 0,
        fileName: file.name,
        status: 'uploading',
      });
      try {
        if (attrAccept({ name: file.name, type: file.type }, 'video/*')) {
          const requestData = new FormData();
          requestData.append('orderVideo', file);
          let extention: any = file.name.split('.');
          extention = extention[extention.length - 1];
          const id = uuid();
          const key = `${id}.${extention}`;
          const res = await getPresignedUrl(key, file.type).catch(() => {});
          if (res) {
            try {
              await upload(
                '',
                file,
                {
                  method: 'PUT',
                  headers: { 'Content-Type': file.type },
                  baseURL: res.signedUrl,
                  onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.floor(
                      (progressEvent.loaded * 100) /
                        (progressEvent?.total || 0),
                    );
                    setUploading({
                      fileName: file.name,
                      progress: percentCompleted,
                    });
                  },
                  params: { Key: key },
                },
                false,
              );
              const videoThumbnail = `${CLOUD_FRONT_THUMBNAI}/thumb-pops/order-videos/${id}.0000000.png`;
              const videoName = key;
              const videoPath = `${CLOUD_FRONT_S3}/vid-pops/order-videos/${id}.mp4`;
              socket?.on(`${VIDEOURL}${key}`, ({ status }: any) => {
                if (status === 'COMPLETE') {
                  uploadedFiles.push({
                    name: videoName,
                    url: videoPath,
                    size: file.size,
                    type: file.type,
                    thumbnail: videoThumbnail,
                    status: 'completed',
                  });
                } else if (status === 'ERROR') {
                  console.log('ERROR');
                  throw new Error('Error while encoding file');
                }
              });
            } catch (error) {
              toast.error('Sorry, Please try again');
            }
          }
        } else {
          const from = new FormData();
          from.append('file', file);
          from.append('folder', 'users/link-image');
          const res = await upload('/image/upload', from, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.floor(
                (progressEvent.loaded * 100) / (progressEvent?.total || 0),
              );
              setUploading({ fileName: file.name, progress: percentCompleted });
            },
          });
          const url = res?.imageURL;

          uploadedFiles.push({
            name: file.name,
            url: url,

            size: file.size,
            type: file.type,
          });
        }
      } catch (e) {
        uploadedFiles = [];
        break;
      }
    }
    setFiles(uploadedFiles);
    onFilesChange?.(uploadedFiles);
    setUploading(undefined);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    disabled: disableUpload ?? !!uploading,
    // accept:
    //   'video/mp4,video/x-m4v,video/*,image/*,application/pdf,application/msword,.zip,.rar',
    accept: {
      'video/*': [],
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [],
      'application/zip': [],
      'application/vnd.rar': [],
    },
    multiple: true,
    maxSize: 104857600,
  });

  return (
    <>
      <div {...getRootProps()} className={`${className} widget-fileupload`}>
        <input {...getInputProps()} />
        <div className="custom-fileupload round-style">
          <div>
            <span className="img">
              <UploadFile />
            </span>
            {!uploading ? (
              <>
                <h5>Drop Files Here</h5>

                <span className="text">
                  Standard Media Files Only
                  <br /> Archive File Formats: ZIP, RAR
                </span>
                <span className="or">or</span>
                <Button type="primary" shape="circle">
                  Upload Files{' '}
                  <span className="ml-5 mr-n5">
                    <UploadBold />
                  </span>
                </Button>
              </>
            ) : (
              <>
                <h5>Uploading Files...</h5>

                <div className="fileupload-toolbar subtitle">
                  <span className="text status">{`${uploading.fileName} (${uploading.progress}% Done)`}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {files.map((file) => {
        const url = file.url;
        <DragableItem
          dragHandle={false}
          key={url}
          icon={getFileItemIcon(file.type)}
          title={file.name}
          tag={
            file.size ? `${(file.size / 1000 / 1000).toFixed(3)} MB` : undefined
          }
          options={{ download: true }}
          downloadUrl={url}
        />;
      })}
    </>
  );
};

export default styled(FileUpload)`
  .custom-fileupload {
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    background: #f7f7f8;
    text-align: center;
    display: block;
    cursor: pointer;
    position: relative;
    padding: 38px 0;
    font-size: 14px;

    h5 {
      color: #202020;
      margin: 0 0 14px;
    }

    .img {
      max-width: 48px;
      display: block;
      margin: 5px auto 10px;
      color: var(--pallete-text-main-400);
      opacity: 0.5;

      svg,
      img {
        max-width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    input[type='file'] {
      opacity: 0;
      visibility: hidden;
      position: absolute;
    }

    .text {
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;
      display: block;
      color: rgba(63, 81, 181, 0.46);
      padding: 0 15px;
      margin: 0 0 12px;
    }

    .or {
      color: #202020;
      display: block;
      margin: 0 0 13px;
    }

    .button {
      pointer-events: none;
      min-width: 220px;
      padding: 10px 15px;
      text-transform: uppercase;

      svg {
        max-width: 18px;
        height: auto;
      }
    }
  }

  .custom-fileupload .custom-fileupload .subtitle {
    display: block;
    line-height: 20px;
    color: var(--pallete-text-main);
    font-weight: 500;
    margin: 0 0 5px;
    padding: 0 15px;
  }

  .custom-fileupload .uploaded-img {
    overflow: hidden;
    display: block;
  }

  .custom-fileupload .uploaded-img img {
    display: block;
    max-width: none;
    width: 100%;
    height: auto;
  }

  .widget-fileupload {
    .button-text {
      padding: 5px 0;
      color: #a199aa;
      min-width: inherit;
      border: none;
    }
  }

  .widget-video-holder {
    border-radius: 6px;
    overflow: hidden;

    video {
      display: block;
    }
  }

  .fileupload-toolbar {
    justify-content: center;
  }
`;
