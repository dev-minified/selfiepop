import classNames from 'classnames';
import NButton from 'components/NButton';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useState } from 'react';
import Cropper, { CropperProps } from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';
import Modal from 'react-modal';
import styled from 'styled-components';
import getCroppedImg from './cropImage';

Modal.setAppElement('#root');

const defaultRatio = 16 / 9;

export interface ICroperModal
  extends Partial<Omit<CropperProps, 'image' | 'crop'>> {
  isOpen: boolean;
  loading?: boolean;
  image: string;
  handlerSave: (croppedImage: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  showReplace?: boolean;
  aspectRatio?: number;
  onReplace?: any;
  showCancel?: boolean;
  showDelete?: boolean;
  crop: boolean;
  className?: string;
  saveBtnTitle?: string;
  changeBtnTitle?: string;
}

const CroperModal: React.FC<ICroperModal> = ({
  isOpen,
  image,
  handlerSave,
  aspectRatio,
  onReplace,
  showReplace,
  onCancel,
  showCancel = false,
  className,
  saveBtnTitle = 'Save Image',
  changeBtnTitle = 'Choose a Different Image',
}) => {
  const [loading, setLoading] = useState(false);
  const [cropper, setCropper] = useState<{
    crop: Point;
    zoom: number;
    aspect: number;
    croppedAreaPixels?: Area;
  }>({
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: aspectRatio || defaultRatio,
    croppedAreaPixels: undefined,
  });

  const onCropChange = (crop: any) => {
    setCropper((state) => {
      return {
        ...state,
        crop,
      };
    });
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCropper((state) => {
      return {
        ...state,
        croppedAreaPixels,
      };
    });
  };

  const onZoomChange = (zoom: any) => {
    setCropper((state) => {
      return {
        ...state,
        zoom,
      };
    });
  };

  const getCropData = async () => {
    setLoading(true);
    try {
      if (cropper?.croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          cropper.croppedAreaPixels,
          0,
        );

        setCropper((state: any) => {
          return {
            ...state,
            croppedImage,
          };
        });
        if (handlerSave) handlerSave(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handlCancel = () => {
    if (onCancel) {
      setLoading(false);
      onCancel();
    }
  };
  const handleReplace = () => {
    if (onReplace) onReplace();
  };
  return (
    <Modal
      isOpen={isOpen}
      // onAfterOpen={afterOpenModal}
      shouldCloseOnOverlayClick={true}
      onRequestClose={handlCancel}
      id="croppingModal"
      className={classNames('modal', className)}
      overlayClassName="Overlay"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Adjust your image by sliding it into the window frame.
            </h5>

            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handlCancel}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="upload-demo-wrap">
              <div id="upload-demo" style={{ height: '300px' }}>
                <Cropper
                  style={{ containerStyle: { height: '300px' } }}
                  image={image as string}
                  crop={cropper.crop}
                  showGrid={false}
                  zoom={cropper.zoom}
                  aspect={cropper.aspect}
                  onCropChange={onCropChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={onZoomChange}
                  rotation={0}
                  onRotationChange={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="custom-slider">
              <Slider
                min={100}
                trackStyle={{ backgroundColor: ' #c9c9c9', height: 1 }}
                railStyle={{ backgroundColor: ' #c9c9c9', height: 1 }}
                handleStyle={{
                  borderColor: '#c9c9c9',
                  marginTop: -7,
                }}
                value={cropper.zoom * 100}
                max={1000}
                style={{ display: 'inline-block' }}
                onChange={(value: number | number[]) => {
                  onZoomChange((value as number) / 100);
                }}
              />
            </div>
            <ul className="mt-4 btns-actions mt-md-0">
              {showCancel && (
                <li onClick={handlCancel}>
                  <NButton outline shape="circle" size="small">
                    Delete
                  </NButton>
                </li>
              )}
              {showReplace && (
                <li onClick={handleReplace}>
                  <NButton
                    outline
                    shape="circle"
                    size="small"
                    icon={
                      <span className="img">
                        <i className="icon icon-refresh"></i>
                      </span>
                    }
                  >
                    {changeBtnTitle}
                  </NButton>
                </li>
              )}
            </ul>
            <NButton
              icon={
                <span className="img">
                  <i className="icon icon-tick"></i>
                </span>
              }
              onClick={getCropData}
              isLoading={loading}
              type="primary"
              shape="circle"
            >
              {saveBtnTitle}
            </NButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default styled(CroperModal)`
  .modal-footer {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    position: relative;
  }
  .btns-actions {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .modal-dialog {
    max-width: 820px;
  }
  .modal-dialog .modal-title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 300;
  }
  .modal-dialog .modal-header {
    border: none;
  }
  .modal-body {
    padding: 0;
  }
  .modal-footer {
    padding-top: 20px;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .button {
    position: relative;
    .loading-icon {
      width: auto;
      position: absolute;
      left: 7px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  .button.has-icon,
  .button-has-icon {
    padding-left: 40px !important;
  }
  .button:hover .img {
    color: var(--pallete-text-main);
  }
  .button .img {
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: top;
    background: var(--pallete-background-default);
    color: #adadad;
    border-radius: 100%;
    text-align: center;
    position: absolute;
    left: 4px;
    top: 50%;
    -webkit-transform: translate(0, -50%);
    -ms-transform: translate(0, -50%);
    transform: translate(0, -50%);
    -webkit-transition: all 0.4s ease;
    transition: all 0.4s ease;
  }
  .button .img .icon {
    line-height: 24px;
  }
  .button-primary .img {
    width: 28px;
    height: 28px;
    font-size: 14px;
    color: #e51075;
  }
  .button-primary .img .icon {
    line-height: 28px;
  }
  .custom-slider {
    position: absolute;
    left: 32%;
    bottom: 50px;
  }
  .custom-slider .rc-slider {
    width: 300px;
  }
  .custom-slider::before {
    content: '-';
    font-weight: 1000;
    position: relative;
    left: -15px;
    top: -3px;
  }
  .custom-slider::after {
    content: '+';
    position: relative;
    font-weight: 1000;
    right: -6px;
    top: -4px;
  }
  .button {
    &.button-outline {
      border-color: #e5e5e5;
      color: #a3a0a0;
    }

    &:hover {
      .img {
        color: #000;
      }
    }

    &.button-primary {
      min-width: inherit;
    }

    .img {
      background: #fff;
    }
  }
  @media (max-width: 767px) {
    .btns-actions {
      width: 100%;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
    }
    .button-primary {
      width: 100%;
    }
    .btns-actions {
      margin-bottom: 10px;
    }
    .custom-slider {
      position: relative;
      left: 0px;
      width: 100%;
      bottom: auto;
      right: 0px;
      top: 0px;
      margin: 0 auto 20px;
      text-align: center;
    }
    .custom-slider .rc-slider {
      width: 85%;
      margin: 0 auto;
    }
  }
`;
