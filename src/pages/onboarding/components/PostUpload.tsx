import { GalleryPlus } from 'assets/svgs';
import classNames from 'classnames';
import GalleryViewUploadWidget from 'components/CreatePost/components/GalleryViewUploadWidget';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import FileUploader from 'pages/Sales/components/FileUploader';
import { ChangeEvent, Fragment, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import { fileChanges } from 'util/index';
import { POST } from '../private-pop-setup';

interface Props {
  className?: string;
  post?: POST;
  setPost?: React.Dispatch<React.SetStateAction<POST>>;
  onChange?: (files: any) => void;
  files?: any[];
  extra?: ReactElement | ReactNode;
}

const PostUpload: React.FC<Props> = (props) => {
  const { className, post, setPost, onChange, files, extra } = props;
  return (
    <div className={classNames(className)}>
      <div className="steps-detail">
        <div className="post-head">
          <h3>Post Upload</h3> {extra && extra}
        </div>
        <h6>
          Please upload your first post you want to charge your fans to unlock!{' '}
        </h6>
      </div>
      <Card>
        <Fragment>
          <GalleryViewUploadWidget
            openinGallery={true}
            value={files}
            onChange={onChange}
          />
          <FocusInput
            value={post?.text}
            type="textarea"
            rows={6}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPost?.((prev: POST) => ({
                ...prev,
                text: e.target.value,
              }))
            }
            name="text"
            hasLimit={false}
            placeholder="Tell them about this content..."
          />
          <div className="uploader-button">
            <FileUploader
              customRequest={async (files) => {
                const newFiles = await fileChanges(files, 'standard');
                onChange?.(newFiles);
              }}
              // accept={['image/*', 'video/*']}
              accept={{ 'image/*': [], 'video/*': [] }}
            >
              <Button icon={<GalleryPlus />} outline>
                Upload Media
              </Button>
            </FileUploader>
          </div>
        </Fragment>
      </Card>
    </div>
  );
};

export default styled(PostUpload)`
  margin: 0 0 60px;
  border: 2px solid var(--pallete-text-secondary-50);
  border-radius: 8px;
  padding: 15px 22px 14px;

  .post-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 8px;

    .text-input {
      width: 125px;
    }
  }

  .pop-card {
    padding: 0;
    border: none;
  }

  .card-main-body {
    padding: 20px 27px;
    border: 2px solid #e6ecf5;
    border-radius: 5px;
    margin: 0 0 30px;

    .uploader-button {
      margin: 0 -27px;
      padding: 0 27px;
      border-top: 1px solid var(--pallete-colors-border);
      padding: 20px 0 0;
      display: flex;
      justify-content: center;
    }

    .imag_media {
      margin: 0;

      .upload_placeholder {
        width: 60px;
        min-width: 60px;

        svg {
          width: 26px;
        }
      }
    }

    .text-input {
      margin-bottom: 0 !important;
    }

    .form-control {
      background: none;
      padding: 0;
      border: none;

      &::placeholder {
        color: var(--pallete-text-main-500);
      }
    }

    .button-outline {
      &:not(:hover) {
        color: var(--pallete-primary-main);
        border: 2px solid rgba(37, 91, 135, 0.12);
      }
    }
  }
`;
