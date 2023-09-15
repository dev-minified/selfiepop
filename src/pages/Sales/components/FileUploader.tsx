// import 'cropperjs/dist/cropper.css';
import { getPresignedUrl } from 'api/User';
import { upload } from 'api/Utils';
import { FILE_MIME_TYPE } from 'appconstants';
import attrAccept from 'attr-accept';
import axios from 'axios';
import { toast } from 'components/toaster';
import CroperModal from 'components/UploadandEditor/Croper';
import { CLOUD_FRONT_S3, CLOUD_FRONT_THUMBNAI, VIDEOURL } from 'config';
import useOpenClose from 'hooks/useOpenClose';

import useSocket from 'hooks/useSocket';
import React, { useState } from 'react';
import { Accept, DropzoneOptions, useDropzone } from 'react-dropzone';
import {
  dataURLtoFile,
  getAudioDuration,
  getChangeUrlsOnly,
  getDuration,
  getFilemetaData,
  getImageDimension,
  getImageURLDimentions,
} from 'util/index';
import { v4 as uuid } from 'uuid';

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
  // accept?: string | string[];
  accept?: Accept;
  loading?: boolean;
  isText?: boolean;
  disabled?: boolean;
  cropper?: boolean;
  onStartUploading?: (file: IRcFile, cancelRequest?: () => void) => void;
  onFail?: (file: IRcFile, e: ErrorEvent) => void;
  onSuccess?: (file: IRcFile) => void;
  validation?: {
    minHeight?: number;
    minWidth?: number;
    minSize?: number;
    maxSize?: number;
  };
  maxFiles?: number;
  onProgress?: (file: any) => void;
  className?: string;
}

export const FileUploader = ({
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
  className,
  ...rest
}: IUploadAndEditor) => {
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
        handleUpload(acceptedFiles);
        return;
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

  const { socket } = useSocket();
  const [open, onOpen, onClose] = useOpenClose();

  const [imageString, setImageString] = useState('');

  const [loading, setloading] = useState(false);

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
    file.status = 'encoding' as any;
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
    const files: any[] = [];

    for (let index = 0; index < fls.length; index++) {
      const file: any = fls[index];
      const isImage = attrAccept(
        { name: file.name, type: file.type },
        'image/*',
      );
      const { duration, timeDuration, width, height } = await getFilemetaData(
        file,
      );
      let f: any = {
        name: title ? title : file.name,
        type: file.type,
        id: uuid(),
        size: file.size,
        orignalFile: file,
        updatedAt: (file as any)?.updatedAt || new Date().getTime() + '',
        width: width,
        height: height,
      };
      if (!isImage) {
        f = { ...f, duration, videoDuration: timeDuration, thumbnail: '' };
      }
      files.push(f);
    }
    if (customRequest) {
      customRequest(fls);
      return;
    }
    setloading(true);
    if (!url) {
      throw new Error('Please Provide a Url to upload');
    }
    for (const file of files) {
      if (attrAccept({ name: file.name, type: file.type }, 'video/*')) {
        let extention: any = file.name.split('.');
        extention = extention[extention.length - 1];
        const key = `${file.id}.${extention}`;
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
                      handleEncoding(files, {
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
                    } else if (status === 'PROGRESSING' && onProgress) {
                      onProgress({
                        ...file,
                        url: videoPath,
                        encoding: 'inprogress',
                        loaded: file.orignalFile.size,
                        progressEvent: 100,
                        percentCompleted: 100,
                        thumbnail: videoThumbnail,
                        ...res,
                      });
                      handleEncoding(files, {
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
                        status: 'encoding',
                        ...res,
                      });
                    } else if (status === 'COMPLETE' && onSuccess) {
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
                      onSuccess({
                        ...file,
                        url: videoPath,
                        percentCompleted: 100,
                        encoding: 'completed',
                        loaded: file.size,
                        status: 'completed',
                        thumbnail: videoThumbnail,
                        uploadingProgress: 100,
                        duration,
                        videoDuration,
                        ...res,
                      });
                    } else if (status === 'ERROR') {
                      throw new Error('Error while encoding file');
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

        const ourRequest = axios.CancelToken.source();
        onStartUploading &&
          onStartUploading({ uploadingProgress: 0, loaded: 0, ...file }, () =>
            ourRequest.cancel(),
          );
        upload(url, from, {
          onUploadProgress: (PE) => handleProgress(PE, file),
          cancelToken: ourRequest.token,
        })
          .then(async (data) => {
            let width = data.width || 0;
            let height = data.height || 0;
            if (!width || !height) {
              try {
                const getUrl = getChangeUrlsOnly(data.imageURL);
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
                url: data.imageURL,
                imageString,
                ...data,
                width,
                height,
                type: `image/${data?.imageURL?.split('.')?.pop()}`,
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
                    updatedAt: file.updatedAt || new Date().getTime() + '',
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
        let extention: any = file.name.split('.');
        extention = extention[extention.length - 1];
        const key = `documents/${file.id}.${extention}`;

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
          });
      }
    }
    setloading(false);
  };

  const saveHandler = async (data: string) => {
    const files = [dataURLtoFile(data, acceptedFiles[0].name)];
    closeHandler();
    await handleUpload(files);
  };

  const handleReplace = () => {
    if (disabled) return;
    rootRef?.current?.click();
  };

  return (
    <>
      <span {...getRootProps()} className={`uploader-parent ${className}`}>
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
        showCancel={true}
        showReplace={true}
        image={imageString}
        aspectRatio={aspectRatio}
        handlerSave={saveHandler}
        crop
      />
    </>
  );
};

export default FileUploader;
