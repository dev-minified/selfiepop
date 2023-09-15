import { getPresignedUrl } from 'api/User';
import { upload } from 'api/Utils';
import { FileAttachmentSVG, PlusFilled } from 'assets/svgs';
import attrAccept from 'attr-accept';
import axios from 'axios';
import UploadandEditor, { IUploadAndEditor } from 'components/UploadandEditor';
import Modal from 'components/modal';
import { CLOUD_FRONT_S3, CLOUD_FRONT_THUMBNAI, VIDEOURL } from 'config';
import useSocket from 'hooks/useSocket';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getAudioDuration,
  getAudioFileDuration,
  getDuration,
  getVideoCover,
} from 'util/index';
import { v4 as uuid } from 'uuid';
import AdditionalArt from './InlinePopForm/AdditionalArt';
import FocusInput from './focus-input';
import { toast } from './toaster';

export interface IRcFile {
  id: any;
  url?: string;
  name?: string;
  type?: string;
  size?: number;
  key?: string;
  loaded?: number | string;
  uploadingProgress?: number;
  status?: 'start' | 'uploading' | 'completed' | 'error';
  orignalFile: File;
  encoding?: 'completed' | 'inprogress';
  thumbnail?: string;
  imageString?: string;
  videoDuration?: string;
  duration?: number;
}
interface Props {
  showButton?: boolean;
  onChange?: (files: MediaType[]) => void;
  limit?: number;
  value?: any;
  viewModal?: boolean;

  className?: string;
  showCloseImage?: boolean;
  onEncoding?: (file: any) => void;
  onAttachmentClick?: (files: MediaType[], file: MediaType) => void;
  customrequest?: boolean;
  UploadButton?: ReactNode;
  onSend?: Function;
  multiple?: boolean;
  imageSizes?: string[];
}
function FileContainer({
  value,
  showButton = true,
  multiple = true,
  limit = 10000,
  className,
  viewModal = false,
  UploadButton,
  customrequest = true,
  imageSizes = [],
  ...rest
}: IUploadAndEditor & Props): ReactElement {
  const {
    onProgress,
    onStartUploading,
    onSuccess,
    onFail,
    cropper = false,
    url = '/image/upload',
    accept = { 'image/*': [], 'video/*': [] },

    isText = true,
  } = rest;
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [filesToUpload, setFilesToUpload] = useState<any>([]);
  const [title, setTitle] = useState<string>();
  useEffect(() => {
    if (value) setFiles(value);
  }, [value]);
  useEffect(() => {
    if (files?.length === 1) setIsOpen(true);
    else if (files?.length > 1) handleUploadFiles();
    else setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

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
            duration = payload.timeDuration;
            duratonInSeconds = payload.duration;
            thumb = URL.createObjectURL(payload.blob);
          })
          .catch(console.log);
      } else if (attrAccept(file, 'image/*')) {
        url = URL.createObjectURL(file);
      } else if (attrAccept(file, 'audio/*')) {
        await getAudioFileDuration(file)
          .then((payload: any) => {
            duration = payload.timeDuration;
            duratonInSeconds = payload.duration;
          })
          .catch(console.log);
      }
      newFiles.push({
        ...file,
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

    // onChange?.(f);
  };
  const onChangeHander = (name: string, value: any) => {
    setFiles(value);
  };
  const onFileUploadChangeHander = (name: string, value: any) => {
    setFilesToUpload(value);
  };
  const handleProgress = (progressEvent: any, file: IRcFile) => {
    file.uploadingProgress = Math.floor(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    file.status = 'uploading';
    onProgress?.({
      ...file,
      loaded: progressEvent.loaded,
      progressEvent: progressEvent,
    });
    setFilesToUpload((files: IRcFile[]) => {
      const oldarray: any = files;
      const indexof: any = oldarray.findIndex((el: any) => el.id === file.id);
      if (indexof === -1) return files;
      oldarray[indexof] = {
        ...oldarray[indexof],
        ...file,
        loaded: progressEvent.loaded,
        progressEvent: progressEvent,
        showProgressBar: true,
      };
      return [...oldarray];
    });
  };
  const handleFileUpdates = (file: IRcFile) => {
    setFilesToUpload((files: IRcFile[]) => {
      onProgress?.({
        ...file,
      });
      const fls = [...files];
      const fil = fls?.findIndex((f) => f.id === file?.id);
      if (fil > -1) {
        fls[fil] = { ...file };
        return [...fls];
      }
      return fls;
    });
  };
  const handleUploadSuccess = (file: IRcFile) => {
    onSuccess?.({
      ...file,
      status: 'completed',
    });
    setFilesToUpload((files: IRcFile[]) => {
      const fls = [...files];
      const fil = fls?.findIndex((f) => f.id === file?.id);
      if (fil > -1) {
        fls.splice(fil, 1);
        return [...fls];
      }
      return fls;
    });
  };
  const handleStartProgress = (file: IRcFile) => {
    onStartUploading?.({ ...file });
    const fls = [...filesToUpload];
    const fil = fls?.findIndex((f) => f.id === file?.id);
    if (fil > -1) {
      fls[fil] = { ...file };
      setFilesToUpload(() => [...fls]);
    }
  };
  const handleUploadFiles = () => {
    // e?.preventDefault();
    const filesTraverse = [...files];
    setFiles(() => []);
    setFilesToUpload((fls: IRcFile[]) => [...fls, ...filesTraverse]);
    const fileTitle = title;
    setTitle('');
    for (const f of filesTraverse) {
      const ourRequest = axios.CancelToken.source();
      const file = {
        uploadingProgress: 0,
        loaded: 0,
        ...f,
        cbOnCancel: ourRequest.cancel,
      };
      file.title = !!title
        ? fileTitle
        : file.name?.split('.')?.slice(0, -1)?.join('.');
      if (attrAccept({ name: file.name, type: file.type }, 'video/*')) {
        let extention: any = file?.name?.split('.');
        extention = extention[extention.length - 1];
        const key = `${file.id}.${extention}`;
        getPresignedUrl(key, file.type)
          .then((res) => {
            handleStartProgress(file);
            upload(
              '',
              file.orignalFile,
              {
                method: 'PUT',
                cancelToken: ourRequest.token,
                headers: { 'Content-Type': file.type },
                baseURL: res.signedUrl,
                onUploadProgress: (PE) => handleProgress?.(PE, file),
              },
              false,
            )
              .then((res) => {
                const videoThumbnail = `${CLOUD_FRONT_THUMBNAI}/thumb-pops/order-videos/${file.id}.0000000.png`;
                const videoPath = `${CLOUD_FRONT_S3}/vid-pops/order-videos/${file.id}.mp4`;
                socket?.on(
                  `${VIDEOURL}${key}`,
                  async ({ status, jobProgress }: any) => {
                    if (status === 'STATUS_UPDATE') {
                      handleFileUpdates({
                        ...file,
                        url: videoPath,
                        encoding: 'inprogress',
                        uploadingProgress: jobProgress?.jobPercentComplete,
                        loaded: file.orignalFile.size,
                        progressEvent: 100,
                        percentCompleted: 100,
                        progress: 100,
                        thumbnail: videoThumbnail,
                        thumb: videoThumbnail,
                        status: 'encoding',
                        ...res,
                      });
                    } else if (status === 'PROGRESSING') {
                      handleFileUpdates({
                        ...file,
                        url: videoPath,
                        encoding: 'inprogress',
                        loaded: file.orignalFile.size,
                        progressEvent: 100,
                        percentCompleted: 100,
                        progress: 100,
                        uploadingProgress: 0,
                        thumbnail: videoThumbnail,
                        thumb: videoThumbnail,
                        status: 'encoding',
                        ...res,
                      });
                    } else if (status === 'COMPLETE') {
                      let duration = file?.duration;
                      let videoDuration = file?.videoDuration;
                      if (!duration) {
                        try {
                          const data: any = await getDuration({
                            ...file,
                            url: videoPath,
                          } as any);
                          duration = data.duration || undefined;
                          videoDuration = data.timeDuration || undefined;
                        } catch (error) {
                          console.log({ error });
                        }
                      }
                      handleUploadSuccess({
                        ...file,
                        url: videoPath,
                        percentCompleted: 100,
                        encoding: 'completed',
                        loaded: file.size,
                        status: 'completed',
                        title: !!title
                          ? title
                          : file?.name?.split('.')?.slice(0, -1)?.join('.'),
                        thumbnail: videoThumbnail,
                        thumb: videoThumbnail,
                        uploadingProgress: 100,
                        duration,
                        videoDuration,
                        ...res,
                      });
                    } else if (status === 'ERROR') {
                      toast.error('Error while encoding file');
                      if (onFail) onFail(file);
                      // if (onFail) onFail(file);
                      // throw new Error('Error while encoding file');
                    }
                  },
                );
              })
              .catch((e) => {
                toast.error('Sorry, Please try again');
                if (onFail) onFail(file, e);
              });
          })
          .catch((e) => {
            toast.error('Sorry, Please try again');
            if (onFail) onFail(file, e);
          });
      } else if (attrAccept({ name: file.name, type: file.type }, 'image/*')) {
        const from = new FormData();
        from.append('file', file.orignalFile);
        from.append('folder', 'users/link-image');
        handleStartProgress(file);
        upload('/image/upload', from, {
          onUploadProgress: (PE) => handleProgress(PE, file),
          cancelToken: ourRequest.token,
        })
          .then((data) => {
            const url = data?.imageURL;

            handleUploadSuccess({
              ...file,
              percentCompleted: 100,
              loaded: file.size,
              url: url,
              status: 'completed',
              ...data,
              type: `image/${url?.split('.')?.pop()}`,
            });
          })
          .catch((e) => {
            toast.error('Sorry, Please try again');
            if (onFail) onFail(file, e);
          });
      } else if (attrAccept({ name: file.name, type: file.type }, 'audio/*')) {
        let extention: any = file.name.split('.');
        extention = extention[extention.length - 1];
        const key = `audio/${file.id}.${extention}`;
        getPresignedUrl(key, file.type, false)
          .then((pres) => {
            handleStartProgress(file);
            upload(
              '',
              file.orignalFile,
              {
                method: 'PUT',
                cancelToken: ourRequest.token,
                headers: { 'Content-Type': file.type },
                baseURL: pres.signedUrl,
                onUploadProgress: (PE) => handleProgress(PE, file),
              },
              false,
            )
              .then(async (res) => {
                const path = pres.signedUrl?.split('?')[0];
                let duration = file?.duration;
                let videoDuration = file?.videoDuration;
                if (!duration) {
                  try {
                    const data: any = await getAudioDuration({
                      ...file,
                      url: path,
                    } as any);
                    duration = data.duration || undefined;
                    videoDuration = data.timeDuration || undefined;
                  } catch (error) {
                    console.log({ error });
                  }
                }
                handleUploadSuccess({
                  ...file,
                  percentCompleted: 100,
                  encoding: 'completed',
                  loaded: file.size,
                  url: path,
                  duration,
                  videoDuration,
                  status: 'completed',
                  ...res,
                });
              })
              .catch((e) => {
                toast.error('Sorry, Please try again');
                if (onFail) onFail(file, e);
              });
          })
          .catch((e) => {
            toast.error('Sorry, Please try again');
            if (onFail) onFail(file, e);
          });
      } else {
        let extention: any = file?.name?.split('.');
        extention = extention[extention.length - 1];
        const key = `documents/${file.id}.${extention}`;
        getPresignedUrl(key, file.type, false)
          .then((pres) => {
            handleStartProgress(file);
            upload(
              '',
              file.orignalFile,
              {
                method: 'PUT',
                cancelToken: ourRequest.token,
                headers: { 'Content-Type': file.type },
                baseURL: pres.signedUrl,
                onUploadProgress: (PE) => handleProgress(PE, file),
              },
              false,
            )
              .then((res) => {
                const path = pres.signedUrl?.split('?')[0];
                handleUploadSuccess({
                  ...file,
                  percentCompleted: 100,
                  encoding: 'completed',
                  loaded: file.size,
                  url: path,
                  status: 'completed',
                  ...res,
                });
              })
              .catch((e) => {
                toast.error('Sorry, Please try again');
                if (onFail) onFail(file, e);
              });
          })
          .catch((e) => {
            toast.error('Sorry, Please try again');
            if (onFail) onFail(file, e);
          });
      }
    }
  };
  const getAdditionalComp = (files: IRcFile[], fileChangeHandler: Function) => {
    return !!files?.length ? (
      <AdditionalArt
        value={files?.map((f: any) => {
          return {
            ...f,
            showProgressBar: true,
            cbOnCancel: f?.cbOnCancel,
            tag: `${f.size ? (f.size / (1024 * 1024)).toFixed(2) : 0}MB`,
          };
        })}
        binding={{
          name: 'name',
          path: 'thumbnail',
          type: 'type',
        }}
        onChange={fileChangeHandler}
      />
    ) : null;
  };
  const handleClose = () => {
    handleUploadFiles();
    setIsOpen(false);
  };
  return (
    <div className={className}>
      <div className={`${files.length > 0 ? 'imag_media' : ''}`}>
        {getAdditionalComp(
          filesToUpload,
          onFileUploadChangeHander.bind(undefined, 'lessonMedia'),
        )}
        {getAdditionalComp(
          files,
          onChangeHander.bind(undefined, 'lessonMedia'),
        )}
        {showButton && (
          <UploadandEditor
            imageSizes={imageSizes}
            multiple={multiple}
            customRequest={customrequest ? handleSuccess : undefined}
            disabled={files?.length >= limit}
            cropper={cropper}
            accept={accept}
            isText={isText}
            url={url}
            {...rest}
          >
            {files?.length > 0 ? (
              <>
                <div className="upload_placeholder">
                  <PlusFilled />
                </div>
              </>
            ) : UploadButton ? (
              <span>{UploadButton}</span>
            ) : (
              <span className="file-uploader">
                <FileAttachmentSVG width="14px" height="15px" />
                ATTACH FILE
              </span>
            )}
          </UploadandEditor>
        )}
      </div>
      {files?.length === 1 && viewModal && (
        <>
          <Modal
            title={'Associated Media File Name'}
            isOpen={isOpen}
            onClose={handleClose}
            onOk={handleUploadFiles}
            className={className}
          >
            <div className="mb-5">Please Enter Name of a file</div>
            <FocusInput
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              inputClasses="mb-25"
              name="file"
              value={title}
              materialDesign
              limit={80}
            />
          </Modal>
        </>
      )}
      {files?.length > 0 && !viewModal && (
        <>
          <div className="file-name-holder">
            <FocusInput
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              icon={
                <span className="btn-uploader" onClick={handleUploadFiles}>
                  Upload Media
                </span>
              }
              label="Enter Title"
              inputClasses="mb-25"
              name="file"
              value={title}
              materialDesign
              limit={80}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default styled(FileContainer)`
  padding: 1px 0 0;

  .upload_placeholder {
    width: 100%;
    padding: 10px;
    background: #e1e4eb;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;

    svg {
      width: 24px;
      height: 24px;
      color: var(--pallete-primary-main);
    }
  }
  .imag_media {
    margin: 20px 0;
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
  .file-name-holder {
    .materialized-input.text-input.ico-input {
      .form-control {
        padding-right: 110px !important;
      }
      .icon {
        margin: 0;
        max-width: inherit;
        width: auto;
      }
      .btn-uploader {
        background: var(--pallete-primary-main);
        color: #fff;
        font-size: 12px;
        line-height: 15px;
        padding: 5px 10px;
        border-radius: 4px;
        display: inline-block;
        vertical-align: top;
        transition: all 0.4s ease;
        &:hover {
          background: var(--colors-indigo-200);
        }
      }
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

  .modal-content {
    padding: 25px 20px;
  }

  .modal-header {
    padding: 0 0 12px;
    border: none;
  }

  .modal-body {
    padding: 0;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: var(--pallete-text-light-100);
    font-weight: 500;

    .img-title {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .modal-content-holder {
    font-size: 16px;
    line-height: 1.375;
    font-weight: 400;
    color: var(--pallete-text-main-550);
  }

  .modal-footer {
    padding: 0;
  }
`;
