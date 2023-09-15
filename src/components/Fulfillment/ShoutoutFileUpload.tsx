import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddVideo, ForwardArrow, Star } from 'assets/svgs';
import { Canceler } from 'axios';
import UploadandEditor, { IRcFile } from 'components/UploadandEditor';
import { OrderStatus } from 'enums';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import 'styles/fileupload-toolbar.css';
import 'styles/order-widget.css';
import Button from '../NButton';
import ProgressBar from '../ProgressBar';
import VideoPlay from '../VideoPlay';
interface Props {
  className?: string;
  status: string;
  videoName: string;
  videoLink: string;
  videoThumbnail: string;
  orderId: string;
  buyerId: string;
  disabled?: boolean;
  onUploadSuccess(
    videoPath?: string,
    videoName?: string,
    videoThumbnail?: string,
  ): void;
}

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

type IUpload = { videoName: string; videoPath: string; thumbnail: string };

const ShoutoutFileUpload: React.FC<Props> = (props) => {
  const {
    status,
    videoName,
    videoLink,
    videoThumbnail,
    onUploadSuccess,
    className,
    disabled,
  } = props;

  const [upload, setUpload] = useState<null | IUpload>(null);
  const [progress, setProgress] = useState<number>(0);
  const [encoding, setEncoding] = useState<IRcFile['encoding']>();
  const [fileDetails, setFileDetails] = useState<{
    name: String;
    size: String;
    uploaded: String;
  }>({ name: '', size: '0', uploaded: '0' });
  const [cancelRequest, setCancelRequest] = useState<Canceler | undefined>(
    undefined,
  );

  useEffect(() => {
    if (status !== OrderStatus.IN_PROGRESS) {
      setUpload({
        videoName: videoName || '',
        videoPath: videoLink || '',
        thumbnail: videoThumbnail || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoName, status, videoLink]);

  const onCancelUploading = () => {
    cancelRequest?.();
    setProgress(0);
    setEncoding(undefined);
    setFileDetails({ name: '', size: '0', uploaded: '0' });
  };

  const onStartUploading = (file: IRcFile, handleCancel?: Canceler) => {
    setProgress(file.uploadingProgress!);
    setEncoding(undefined);
    setCancelRequest(() => handleCancel);
  };

  const onProgress = (file: IRcFile) => {
    setFileDetails({
      name: file.name || '',
      size: ((file.size || 0) / 1000 / 1000).toFixed(1),
      uploaded: (parseFloat(`${file.loaded}`) / 1000 / 1000).toFixed(1),
    });

    file.encoding && setEncoding(file.encoding);
    if (file.encoding === 'inprogress') {
      setProgress(101);
    } else {
      setProgress(file.uploadingProgress || 1);
    }
  };

  const onSuccess = async ({
    url,
    name,
    encoding: enc,
    thumbnail,
  }: IRcFile) => {
    setFileDetails((prev) => {
      if (name === prev.name) {
        setUpload({ videoName: name!, videoPath: url!, thumbnail: thumbnail! });
        onUploadSuccess(url, name, thumbnail);
        setProgress(101);
        setEncoding(enc);
      }
      return prev;
    });
  };

  const onError = () => {
    setProgress(0);
  };

  return (
    <div className={`${className} mb-30 mb-md-50`}>
      {encoding === 'completed' || status === OrderStatus.COMPLETED ? (
        <>
          <div className="widget-fileupload">
            <div className="widget-video-holder">
              <VideoPlay
                url={upload?.videoPath}
                config={{
                  file: {
                    attributes: {
                      poster: upload?.thumbnail,
                      controlsList: 'nodownload',
                      onContextMenu: (e: any) => e?.preventDefault(),
                    },
                  },
                }}
              />
            </div>
            {status !== OrderStatus.COMPLETED &&
              status !== OrderStatus.DISPUTE && (
                <UploadandEditor
                  // accept={['video/*']}
                  accept={{ 'video/*': [] }}
                  disabled={disabled}
                  multiple={false}
                  onStartUploading={onStartUploading}
                  onProgress={onProgress}
                  onSuccess={onSuccess}
                  onFail={onError}
                  validation={{ maxSize: 104857600 }}
                  url={'/image/upload'}
                >
                  <div className="text-right">
                    <Button type="text" size="small">
                      Replace <ForwardArrow />
                    </Button>
                  </div>
                </UploadandEditor>
              )}
          </div>
        </>
      ) : (
        <UploadandEditor
          // accept={['video/*']}
          accept={{ 'video/*': [] }}
          multiple={false}
          onStartUploading={onStartUploading}
          onProgress={onProgress}
          onSuccess={onSuccess}
          onFail={onError}
          validation={{ maxSize: 1073741824 }}
          url={'/image/upload'}
          disabled={disabled}
        >
          <div
            className={
              !Boolean(progress)
                ? 'custom-fileupload round-style custom-fileuploadHover'
                : 'custom-fileupload round-style'
            }
            style={Boolean(progress) ? { height: 365 } : {}}
          >
            <div className={Boolean(progress) ? 'uploadProgress' : ''}>
              <span className="img">
                <AddVideo />
              </span>
              <h5>
                {Boolean(progress) && progress <= 100
                  ? 'Uploading Video'
                  : encoding === 'inprogress'
                  ? 'Video Encoding'
                  : 'Drop Video Here'}
              </h5>

              {Boolean(progress) && progress <= 100 ? (
                <FileUpload className="fileupload-toolbar subtitle">
                  <span className="text status">{`${progress}% Done`}</span>
                </FileUpload>
              ) : progress === 101 ? null : (
                <>
                  <span className="text">
                    File format: AVI, MP4, MOV, WMV
                    <br /> (recommneded 1920x1080, max 1024MB)
                  </span>
                  <span className="or">or</span>
                  <Button type="primary" shape="circle">
                    Upload Video{''}
                    <span className="ml-5 mr-n5">
                      <Star />
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </UploadandEditor>
      )}
      {encoding === 'completed' ||
        (status !== OrderStatus.COMPLETED && Boolean(progress) && (
          <>
            <div className="order-widget mb-35 uploadProgressWidget">
              <div className="img-holder">
                <FontAwesomeIcon
                  className="primary-text"
                  icon={faArrowAltCircleUp}
                />
              </div>
              <div className="wrap">
                <div className="title-wrap">
                  <strong className="title primary-text">
                    {fileDetails.name}
                  </strong>
                </div>
                <div className="text-wrap">
                  <span className="subtext">
                    {fileDetails.uploaded} MB of {fileDetails.size} MB
                  </span>
                </div>
                <ProgressBar completed={progress} />
              </div>
              <span className="close-btn" onClick={onCancelUploading}>
                <i className="icon icon-close"></i>
              </span>
            </div>
          </>
        ))}
    </div>
  );
};

export default styled(ShoutoutFileUpload)`
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
    height: 300px;
    .button-text {
      padding: 5px 0;
      color: #a199aa;
      min-width: inherit;
      text-transform: uppercase;
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

  .uploadProgressWidget {
    padding: 15px;
    display: flex;

    .title-wrap {
      .title {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 25px 0 0;
      }
    }
  }
`;
