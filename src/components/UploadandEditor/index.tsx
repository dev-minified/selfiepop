// import 'cropperjs/dist/cropper.css';
import { getPresignedUrl } from 'api/User';
import { FILE_MIME_TYPE, MEDIA_UPLOAD_STATUSES } from 'appconstants';
import attrAccept from 'attr-accept';
import axios from 'axios';
import { CLOUD_FRONT_S3, CLOUD_FRONT_THUMBNAI, VIDEOURL } from 'config';
import useSocket from 'hooks/useSocket';
import React, { useState } from 'react';
import { Accept, DropzoneOptions, useDropzone } from 'react-dropzone';

import { upload } from 'api/Utils';
import useOpenClose from 'hooks/useOpenClose';
import { v4 as uuid } from 'uuid';
import {
  appendScreenSizesToId,
  dataURLtoFile,
  getAudioDuration,
  getChangeUrlsOnly,
  getDuration,
  getImageDimension,
  getImageURLDimentions,
} from '../../util';
import { toast } from '../toaster';
import CroperModal from './Croper';

const hidden = { display: 'none' };

export function readFile(file: any) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

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
  duration?: number;
  videoDuration?: string;
}

export interface IUploadAndEditor extends Partial<DropzoneOptions> {
  children?: JSX.Element;
  customRequest?: (file: File[]) => void;
  url?: string;
  title?: string;
  aspectRatio?: number;
  onCancel?: any;
  accept?: Accept;
  loading?: boolean;
  isText?: boolean;
  disabled?: boolean;
  cropper?: boolean;
  onBeforeDataUrl?: (isConverting?: boolean) => void;
  onStartUploading?: (file: IRcFile, cancelRequest?: () => void) => void;
  onFail?: (file: IRcFile, e?: ErrorEvent) => void;
  onSuccess?: (file: IRcFile) => void;
  validation?: {
    minHeight?: number;
    minWidth?: number;
    minSize?: number;
    maxSize?: number;
  };
  maxFiles?: number;
  onProgress?: (file: any) => void;
  imageSizes?: string[];
  showCancel?: boolean;
}

export const UploadandEditor = ({
  children,
  aspectRatio,
  url,
  title,
  customRequest,
  // accept = 'image/*',
  accept = { 'image/*': [] },
  onProgress,
  disabled = false,
  isText,
  onCancel,
  onSuccess,
  onFail,
  onStartUploading,
  validation = {},
  cropper = false,
  maxFiles,
  imageSizes = [],
  showCancel = false,
  ...rest
}: IUploadAndEditor) => {
  const { socket } = useSocket();
  const [open, onOpen, onClose] = useOpenClose();

  const [imageString, setImageString] = useState('');

  const [loading, setloading] = useState(false);
  const { minHeight, minWidth, minSize, maxSize } = validation;

  const { acceptedFiles, getRootProps, getInputProps, rootRef } = useDropzone({
    disabled,
    maxFiles: cropper ? 1 : maxFiles,
    multiple: !cropper,
    minSize,
    maxSize,
    accept,
    noDragEventsBubbling: true,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (isText) {
        return handleUpload(acceptedFiles);
      }
      const rejections = [...fileRejections];
      const promises: Promise<any>[] = [];
      for (let index = 0; index < acceptedFiles.length; index++) {
        const file = acceptedFiles[index];
        promises.push(getImageDimension(file));
      }
      const files: any[] = await Promise.all(promises);
      files.forEach((file) => {
        if (
          attrAccept({ name: file.name, type: file.type }, 'image/*') &&
          (minHeight || minWidth)
        ) {
          if (
            minHeight &&
            minWidth &&
            (minHeight > file.height || minWidth > file.width)
          ) {
            rejections.push({
              file,
              errors: [
                {
                  code: 'small-width',
                  message: `The image should be alteast ${minWidth}x${minHeight}`,
                },
              ],
            });
          }
        }
      });
      if (rejections.length > 0) {
        rejections.forEach((error) => {
          if (error.errors[0].code === 'file-too-large') {
            toast.error(
              `Max ${maxSize! / (1024 * 1024)}MB of file is allowed `,
            );
          } else if (error.errors[0].code === 'file-invalid-type') {
            toast.error(`Sorry invalid file type`);
          } else {
            toast.error(error.errors[0].message);
          }
        });
        return;
      }
      const { name, type } = files[0];
      if (cropper && attrAccept({ name, type }, 'image/*')) {
        const imageString = await readFile(files[0]);
        if (
          !(
            (imageString as string)?.includes('application/octet-stream;') ||
            FILE_MIME_TYPE.includes(type)
          )
        ) {
          setImageString(imageString as string);
          onOpen();
        } else {
          await handleUpload(files);
        }
      } else {
        handleUpload(files);
      }
    },
    ...rest,
  });

  const closeHandler = () => {
    onClose();
    if (onCancel) onCancel();
  };

  const handleProgress = (progressEvent: any, file: IRcFile) => {
    file.uploadingProgress = Math.floor(
      (progressEvent.loaded * 100) / progressEvent.total,
    );
    file.status = 'uploading';
    if (onProgress)
      onProgress({
        ...file,
        loaded: progressEvent.loaded,
        progressEvent: progressEvent,
      });
  };
  const handleEncoding = (files: any[], file: IRcFile) => {
    file.status = MEDIA_UPLOAD_STATUSES.ENCODING.toLowerCase() as any;
    const fls = [...files];
    const fil = fls?.findIndex((f) => f.id === file.id);
    if (fil > -1) {
      fls[fil] = { ...file };
      if (onProgress)
        onProgress({
          ...file,
        });
    }
  };

  const handleUpload = async (fls: File[]) => {
    if (customRequest) {
      customRequest(fls);
      return;
    }

    const files: any[] = [];

    for (let index = 0; index < fls.length; index++) {
      const file = fls[index];
      const isVideo = attrAccept({ type: file.type }, 'video/*');
      const width = (file as any).width || 0;
      const height = (file as any).height || 0;
      files.push({
        name: title ? title : file.name,
        type: isVideo ? 'video/mp4' : file.type,
        id: uuid(),
        size: file.size,
        orignalFile: file,
        duration: 0,
        videoDuration: '',
        thumbnail: '',
        width,
        height,
      });
    }

    setloading(true);
    if (!url) {
      throw new Error('Please Provide a Url to upload');
    }
    const promisses = [];
    for (const file of files) {
      if (attrAccept({ name: file.name, type: file.type }, 'video/*')) {
        let extention: any = file.name.split('.');
        extention = extention[extention.length - 1];
        const key = `${file.id}.${extention}`;
        promisses.push(
          getPresignedUrl(key, file.type)
            .then((res) => {
              const ourRequest = axios.CancelToken.source();
              onStartUploading &&
                onStartUploading(
                  { uploadingProgress: 0, loaded: 0, ...file },
                  ourRequest.cancel,
                );

              upload(
                '',
                file.orignalFile,
                {
                  method: 'PUT',
                  cancelToken: ourRequest.token,
                  headers: { 'Content-Type': file.type },
                  baseURL: res.signedUrl,
                  onUploadProgress: (PE) => handleProgress(PE, file),
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
                        handleEncoding?.(files, {
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
                          status: MEDIA_UPLOAD_STATUSES.ENCODING.toLowerCase(),
                          ...res,
                        });
                      } else if (status === 'PROGRESSING') {
                        onProgress?.({
                          ...file,
                          url: videoPath,
                          encoding: 'inprogress',
                          loaded: file.orignalFile.size,
                          progressEvent: 100,
                          percentCompleted: 100,
                          thumbnail: videoThumbnail,
                          ...res,
                        });
                        handleEncoding?.(files, {
                          ...file,
                          url: videoPath,
                          encoding: 'inprogress',

                          loaded: file.orignalFile.size,
                          progressEvent: 100,
                          percentCompleted: 100,
                          progress: 100,
                          thumbnail: videoThumbnail,
                          thumb: videoThumbnail,
                          uploadingProgress: 0,
                          status: MEDIA_UPLOAD_STATUSES.ENCODING.toLowerCase(),
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
                            console.log({ error, e: 'error' });
                          }
                        }
                        onSuccess?.({
                          ...file,
                          url: videoPath,
                          percentCompleted: 100,
                          encoding: 'completed',
                          loaded: file.size,
                          status: MEDIA_UPLOAD_STATUSES.COMPLETED.toLowerCase(),
                          thumbnail: videoThumbnail,
                          uploadingProgress: 100,
                          duration,
                          videoDuration,
                          ...res,
                        });
                      } else if (status === 'ERROR') {
                        if (onFail) onFail(file);
                        // throw new Error('Error while encoding file');
                        toast.error('Error while encoding file');
                      }
                    },
                  );
                })
                .catch((e) => {
                  console.log({ e: e.message });
                  toast.error('Sorry, Please try again');
                  if (onFail) onFail(file, e);
                });
            })
            .catch((e) => {
              toast.error('Sorry, Please try again');
              if (onFail) onFail(file, e);
            }),
        );
      } else if (attrAccept({ name: file.name, type: file.type }, 'image/*')) {
        const from = new FormData();
        from.append('file', file.orignalFile);
        from.append('folder', 'users/link-image');
        const updatedFile: any = file.orignalFile;
        const fileName =
          updatedFile?.fileName || `${file.id}${updatedFile.name}` || file?.id;
        let filename = fileName;
        if (imageSizes?.length) {
          const { file: newFile } = appendScreenSizesToId({
            id: file?.id,
            sizes: imageSizes,

            file: file.orignalFile,
          });
          filename = (newFile as any)?.fileName || file?.id;
        }
        from.append('fileName', filename);
        const ourRequest = axios.CancelToken.source();
        onStartUploading &&
          onStartUploading({ uploadingProgress: 0, loaded: 0, ...file }, () =>
            ourRequest.cancel(),
          );
        promisses.push(
          upload(url, from, {
            onUploadProgress: (PE) => handleProgress(PE, file),
            cancelToken: ourRequest.token,
          })
            .then(async (data) => {
              const url = data?.imageURL;
              let width = data.width || 0;
              let height = data.height || 0;
              if (!width || !height) {
                try {
                  const getUrl = getChangeUrlsOnly(url);
                  const widthHeight = await getImageURLDimentions(getUrl.url);
                  width = widthHeight.width;
                  height = widthHeight.height;
                } catch (error) {}
              }
              if (onSuccess)
                onSuccess({
                  ...file,
                  percentCompleted: 100,
                  loaded: file.size,
                  url: url,
                  imageString,
                  ...data,
                  width,
                  height,
                  type: `image/${data?.imageURL?.split('.')?.pop()}`,
                  imageURL: url,
                });
            })
            .catch((e) => {
              toast.error('Sorry, Please try again');
              if (onFail) onFail(file, e);
            }),
        );
      } else if (attrAccept({ name: file.name, type: file.type }, 'audio/*')) {
        let extention: any = file.name.split('.');
        extention = extention[extention.length - 1];
        const key = `audio/${file.id}.${extention}`;

        promisses.push(
          getPresignedUrl(key, file.type, false)
            .then((pres) => {
              const ourRequest = axios.CancelToken.source();
              onStartUploading &&
                onStartUploading(
                  { uploadingProgress: 0, loaded: 0, ...file },
                  () => ourRequest.cancel(),
                );
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
                  if (onSuccess)
                    onSuccess({
                      percentCompleted: 100,
                      encoding: 'completed',
                      loaded: file.size,
                      ...file,
                      duration,
                      videoDuration,
                      url: path,
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
            }),
        );
      } else {
        let extention: any = file.name.split('.');
        extention = extention[extention.length - 1];
        const key = `documents/${file.id}.${extention}`;

        promisses.push(
          getPresignedUrl(key, file.type, false)
            .then((pres) => {
              const ourRequest = axios.CancelToken.source();
              onStartUploading &&
                onStartUploading(
                  { uploadingProgress: 0, loaded: 0, ...file },
                  () => ourRequest.cancel(),
                );
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
                  if (onSuccess)
                    onSuccess({
                      percentCompleted: 100,
                      encoding: 'completed',
                      loaded: file.size,
                      ...file,
                      url: path,
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
            }),
        );
      }
    }
    Promise.all([...promisses])
      .then(() => {
        setloading(false);
      })
      .catch((_) => {
        console.log({ _ });
        setloading(false);
      });
  };

  async function saveHandler(data: string) {
    const files = [dataURLtoFile(data, acceptedFiles[0].name)];
    closeHandler();
    await handleUpload(files);
  }

  const handleReplace = () => {
    if (disabled) return;
    rootRef?.current?.click();
  };

  return (
    <>
      <span {...getRootProps()}>
        <input type="file" style={hidden} {...getInputProps()} />
        {React.cloneElement(children as any, {
          loading,
          isLoading: loading,
          files: acceptedFiles,
        })}
      </span>
      <CroperModal
        isOpen={open}
        onCancel={closeHandler}
        onReplace={handleReplace}
        showCancel={showCancel}
        showReplace={true}
        image={imageString}
        aspectRatio={aspectRatio}
        handlerSave={saveHandler}
        crop
      />
    </>
  );
};

export default UploadandEditor;
