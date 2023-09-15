import { ImagesScreenSizes } from 'appconstants';
import { FileSvg, Star } from 'assets/svgs';
import AdditionalArt from 'components/InlinePopForm/AdditionalArt';
import UploadandEditor from 'components/UploadandEditor';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../NButton';

interface Props {
  className?: string;
  status: string;
  order: Record<string, any>;
  disabled?: boolean;
  onUpload?: (...args: any) => void;
  showEditor?: boolean;
  allowDelete?: boolean;
}

const PromotionalFileUpload: React.FC<Props> = (props) => {
  const {
    onUpload = null,
    order = {},
    className,
    disabled,
    showEditor = true,
    allowDelete = true,
  } = props;
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    setFiles(order.attachments);
  }, [order.attachments]);

  const pushIntoValueArray = async (name: string, value: any) => {
    setFiles((v) => {
      const newArray = [...v, value];
      return newArray;
    });
  };

  const updateNestedArrayElement = async (
    name: string,
    id: string,
    value: any,
  ) => {
    setFiles((vls) => {
      const oldarray: any = [...vls];
      const indexof: any = oldarray.findIndex((el: any) => el.id === id);

      if (indexof === -1) return vls;
      oldarray[indexof] = { ...oldarray[indexof], ...value };
      if (value.url && name === 'success') {
        onUpload && onUpload(oldarray);
      }
      return oldarray;
    });
  };
  const onChangeHander = (name: string, value: any) => {
    if (name === 'delete' && value._id) {
      onUpload && onUpload(value);
    }
    setFiles(value);
  };
  return (
    <div className={`${className} mb-30 mb-md-50`}>
      {showEditor && (
        <UploadandEditor
          imageSizes={ImagesScreenSizes.promotionalMedia}
          disabled={disabled}
          // accept={['image/*', 'video/*']}
          accept={{ 'image/*': [], 'video/*': [] }}
          onStartUploading={(file, handleCancel) => {
            pushIntoValueArray('start', {
              showProgressBar: true,
              isActive: true,
              cbOnCancel: handleCancel,
              ...file,
            });
          }}
          onProgress={(file) => {
            updateNestedArrayElement('progress', file.id, {
              showProgressBar: true,
              ...file,
            });
          }}
          onSuccess={(file) => {
            updateNestedArrayElement('success', file.id, {
              showProgressBar: false,
              path: file.url,
              ...file,
            });
          }}
          onFail={(file) => {
            updateNestedArrayElement('failed', file.id, {
              failed: true,
              ...file,
            });
          }}
          // maxFiles={5}
          validation={{ maxSize: 100 * 1024 * 1024 }} //100MB
          url={'/image/upload'}
          cropper={false}
        >
          <div className="file_uploadArea mb-20">
            <span className="img mb-10">
              <FileSvg />
            </span>

            <strong>Proof of Promotion</strong>

            <p className="text description">
              Upload Proof of Promotion Something like a screenshots or video.
            </p>
            <span className="or">or</span>
            <Button type="primary" shape="circle" disabled={disabled}>
              Upload File{''}
              <span className="img-star">
                <Star />
              </span>
            </Button>
          </div>
        </UploadandEditor>
      )}
      <AdditionalArt
        imgSettings={{
          onlyMobile: true,
        }}
        value={files.map((f) => ({ ...f, path: f.url }))}
        onChange={onChangeHander.bind(undefined, 'delete')}
        options={{ delete: allowDelete }}
      />
    </div>
  );
};

export default styled(PromotionalFileUpload)`
  .file_uploadArea {
    background-color: #f8f1f1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    .sp_dark & {
      color: #000;
    }
    strong {
      font-weight: 500;
    }
  }
  .description {
    margin: 0;
  }

  .button {
    .img-star {
      width: 20px;
      display: inline-block;
      vertical-align: middle;

      svg {
        margin: 0 0 0 5px;
        width: 100%;
        height: auto;
      }
    }
  }
`;
