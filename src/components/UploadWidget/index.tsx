import {
  faArrowAltCircleUp,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UploadandEditor from 'components/UploadandEditor';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import 'styles/button-fileupload.css';
import 'styles/fileupload-toolbar.css';
import 'styles/order-widget.css';
import { AttachmentBar } from '../Attachments';
import Button from '../NButton';
import ProgressBar from '../ProgressBar';
import GallaryViewUploadWidet from './GallaryViewUploadWidget';

const OrderWidget = styled.div`
  background: var(--colors-darkGrey-50);
  border: 1px solid var(--pallete-colors-border);
  overflow: hidden;
  border-radius: 5px;
  margin: 0 0 16px;
  display: block;

  .order-widget-wrap {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .order-widget-footer {
    background: var(--pallete-background-default);
    padding: 8px 15px 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e5e5e5;
  }

  .img-holder {
    width: 51px;
    height: 51px;
    min-width: 51px;
    overflow: hidden;
    border-radius: 100%;
    margin: 0 15px 0 2px;
  }

  .img-holder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
  }

  .wrap {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
  }

  .title {
    font-size: 20px;
    line-height: 1.4;
    font-weight: 400;
    margin: 0 0 2px;
  }

  .price {
    color: #fff;
    border-radius: 5px;
    font-size: 14px;
    line-height: 19px;
    padding: 3px 20px;
    font-weight: 700;
    margin: 0 0 4px;
  }

  .title-wrap,
  .text-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .subtext {
    display: block;
    font-size: 14px;
    color: var(--pallete-text-main);
    font-weight: 400;
  }

  .date,
  .status {
    color: #999;
    font-size: 14px;
    margin-right: 6px;
  }

  .date time,
  .date span,
  .status time,
  .status span {
    color: var(--pallete-text-main);
    font-weight: 500;
    font-size: 14px;
  }

  .status span {
    position: relative;
  }

  .status span:before {
    width: 10px;
    height: 10px;
    background: #99dbf3;
    border-radius: 100%;
    display: inline-block;
    margin: 0 5px 0 2px;
    content: '';
  }

  @media (max-width: 767px) {
    .title {
      font-size: 18px;
    }
  }
`;

const FileUpload = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;

  .status {
    font-weight: 500;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .status .icon-tick {
    width: 22px;
    height: 22px;
    font-size: 8px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 100%;
    margin: 0 15px 0 0;
    padding: 0 0 0 1px;
  }

  .status .icon-tick:before {
    color: #fff;
  }

  .status .icon-bars {
    width: 17px;
    height: 13px;
    border-bottom: 1px solid #aeb7c4;
    position: relative;
    margin: 0 24px 0 10px;
  }

  .status .icon-bars:before,
  .status .icon-bars:after {
    width: 17px;
    height: 1px;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background: #aeb7c4;
  }

  .status .icon-bars:after {
    top: 50%;
  }

  .buttons {
    margin-left: auto;
  }

  &.gray-bar {
    background-color: var(--pallete-background-gray-darker);
    padding: 10px 12px;
    margin: 0 0 14px;
  }

  &.white-bar {
    background: var(--pallete-background-default);
    padding: 10px 12px;
    margin: 0 0 14px;
  }

  @media (max-width: 767px) {
    .status {
      font-size: 14px;
      justify-content: center;
    }

    .status .icon-bars {
      margin: 0 10px 0 0;
    }

    &.gray-bar {
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
    }

    &.gray-bar .status {
      width: 100%;
      margin: 0 0 15px;
    }

    &.gray-bar .btn-round {
      min-width: inherit;
    }

    &.gray-bar .buttons {
      margin-left: 0;
      width: 100%;
      text-align: center;
    }

    &.white-bar {
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
    }

    &.white-bar .status {
      width: 100%;
      margin: 0 0 15px;
    }

    &.white-bar .buttons {
      margin-left: 0;
      width: 100%;
      text-align: center;
    }
  }
`;

export const AttachmentBarWithProgress = ({
  fileDetails,
  onCancelUploading,
  onReplace,
  onDelete,
  options = { delete: true, replace: true },
}: any) => {
  const progresss = fileDetails?.progress;
  const loaded = fileDetails?.uploaded;
  return (
    <>
      {progresss <= 100 ? (
        <OrderWidget className="order-widget mb-35 uploadProgressWidget">
          <div className="img-holder">
            <FontAwesomeIcon
              className="primary-text"
              icon={progresss <= 100 ? faArrowAltCircleUp : faCheckCircle}
            />
          </div>
          <div className="wrap">
            <div className="title-wrap">
              <strong className="title primary-text">
                {fileDetails?.name}
              </strong>
            </div>
            <div className="text-wrap">
              <span className="subtext">
                {loaded} MB of {fileDetails?.size} MB
              </span>
            </div>
            {progresss <= 100 && <ProgressBar completed={progresss} />}
          </div>
          <span
            className="close-btn"
            onClick={() => onCancelUploading?.(fileDetails?.name)}
          >
            <i className="icon icon-close"></i>
          </span>
        </OrderWidget>
      ) : (
        <FileUpload className="fileupload-toolbar white-bar">
          <div className="status">
            <span className="icon-tick"></span> {fileDetails?.name}
          </div>
          <div className="buttons">
            {options.replace && (
              <Button
                className="btn btn-round"
                size="small"
                shape="round"
                onClick={onReplace}
              >
                Replace
              </Button>
            )}
            {options.delete && (
              <Button
                className="btn btn-round"
                size="small"
                shape="round"
                onClick={() => onDelete?.(fileDetails?.name)}
              >
                DELETE
              </Button>
            )}
          </div>
        </FileUpload>
      )}
    </>
  );
};

export default function UploadWidget({
  value,
  showButton = true,
  onChange,
  limit,
  accept = { 'image/*': [] },
  withProgress = false,
  title = 'Upload File',
  imageSizes = [],
  options = { delete: true, replace: false },
  onProgress,
  onStartUploading,
  ...rest
}: any): ReactElement {
  const [files, setFiles] = useState<any[]>(value);

  useEffect(() => {
    if (value) setFiles(value);
  }, []);

  useEffect(() => {
    onChange && onChange(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const handleSuccess = (file: any) => {
    addFile({ ...file, name: file?.orignalFile?.name });
  };
  const onProgressHander = (file: any) => {
    onProgress?.({ ...file, name: file?.orignalFile?.name });
  };
  const onhandleStartUploading = (file: any) => {
    onStartUploading?.({ ...file, name: file?.orignalFile?.name });
  };

  const removeFile = (name: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
  };

  const addFile = (file: any) => {
    setFiles((prevFiles) => {
      if (!!prevFiles.find((f) => f.name === file.name)) {
        return prevFiles.map((f) =>
          f.name === file.name ? { ...f, ...file } : f,
        );
      }

      return [...prevFiles, file];
    });
  };

  const onCancelUpload = (name: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => {
        if (file.name !== name) {
          return true;
        }

        file.cancelToken?.cancel();
        return false;
      }),
    );
  };

  return (
    <div className="widget-fileupload sm mb-70">
      {showButton && (
        <UploadandEditor
          onStartUploading={onhandleStartUploading}
          imageSizes={imageSizes}
          onSuccess={handleSuccess}
          onProgress={onProgressHander}
          disabled={files?.length >= limit}
          cropper={false}
          accept={accept}
          {...rest}
        >
          <label className={`button-fileupload`}>
            <span className="img">
              <img
                src="/assets/images/svg/icon-upload.svg"
                alt=" description"
              />
              <img
                className="img-white"
                src="/assets/images/svg/icon-upload-w.svg"
                alt=" description"
              />
            </span>
            <span className="text">{title}</span>
          </label>
        </UploadandEditor>
      )}
      {files?.map((file, index: number) => {
        return withProgress ? (
          <AttachmentBarWithProgress
            fileDetails={file}
            key={index}
            onCancelUploading={onCancelUpload}
            options={{ replace: false, delete: true, ...options }}
            onDelete={removeFile}
          />
        ) : (
          <div key={index} className="mb-15">
            <AttachmentBar
              title={file.name}
              options={{ replace: false, delete: true, ...options }}
              onDelete={removeFile}
            />
          </div>
        );
      })}
    </div>
  );
}

export { GallaryViewUploadWidet };
