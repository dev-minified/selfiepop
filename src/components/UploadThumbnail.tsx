import classNames from 'classnames';
import Button from 'components/NButton';
import * as React from 'react';
import styled from 'styled-components';
import ImageModifications from './ImageModifications';
import UploadandEditor, { IUploadAndEditor } from './UploadandEditor';
import Switchbox from './switchbox';
interface IAppProps {
  className?: string;
  classes?: { main?: string };
  icon?: string | React.ReactElement;
  uploadProps?: Partial<IUploadAndEditor>;
  hideText?: boolean;
  title?: string;
  capture?: string;
  onDelete?: () => void;
  options?: {
    title?: boolean;
    delete?: boolean;
    upload?: boolean;
    replace?: boolean;
  };
  onToggel?: Function;
  isActive?: boolean;
  imageSizes?: any[];
  fallbackUrl?: string;
  imgSettings?: ImageSizesProps['settings'];
  fallbackComponent?: JSX.Element;
}

const UploadThumbnail: React.FunctionComponent<IAppProps> = ({
  className,
  classes = {},
  icon,
  hideText = false,
  title,
  capture,
  uploadProps,
  onDelete,
  onToggel,
  isActive,
  imgSettings = {},
  imageSizes = [],
  fallbackUrl = '',
  fallbackComponent = null,
}) => {
  const { main: mainClass } = classes;
  const [renderedIcon, setIcon] = React.useState<any>();
  const [fallback, setFallbackUrl] = React.useState<any>();
  React.useEffect(() => {
    setIcon(icon);
    setFallbackUrl(fallbackUrl);
  }, [fallbackUrl, icon]);
  return (
    <div className={classNames(className, mainClass, 'custom-thumb-pop')}>
      <div className="thumb-title">
        <div className="thumb-box">
          <div className="social--icon img">
            {renderedIcon && (
              <>
                {typeof renderedIcon === 'string' ? (
                  <ImageModifications
                    imgeSizesProps={imgSettings}
                    fallbackUrl={fallbackComponent ? undefined : fallback}
                    src={renderedIcon}
                    fallbackComponent={fallbackComponent}
                    alt="img description"
                  />
                ) : (
                  renderedIcon
                )}
              </>
            )}
          </div>
          <div className="description">
            <strong className="description-title">
              {title || 'Custom Thumbnail'}
            </strong>
            <p>
              {!hideText &&
                (capture || 'Add a custom Icon or Thumbnail to this link.')}
            </p>
          </div>
        </div>
        {!hideText && (
          <Switchbox
            status={false}
            size="small"
            name="isThumbnailActive"
            onChange={onToggel}
            value={isActive}
          />
        )}
      </div>
      <div className="actions-btns">
        <UploadandEditor
          url={'/image/upload'}
          aspectRatio={1}
          // accept={['image/png', 'image/jpg', 'image/jpeg']}
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
          cropper
          validation={{ minHeight: 25, minWidth: 25 }}
          {...uploadProps}
          imageSizes={imageSizes}
        >
          <Button type="primary" block>
            Upload Image
          </Button>
        </UploadandEditor>
        {typeof icon === 'string' && (
          <Button onClick={onDelete} block>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default styled(UploadThumbnail)`
  .thumb-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    max-width: calc(100% - 50px);
  }

  .title {
    display: block;
    color: var(--pallete-text-main);
    font-weight: 500;
    font-size: 14px;
    margin: 0 0 2px;
  }

  .img {
    width: 60px;
    height: 60px;
    padding: 4px;
    border-radius: 100%;
    border: 2px dashed #e1c5eb;
    margin: 0 0 10px;
    color: var(--pallete-primary-main);

    .image-comp {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .img img {
    width: 52px;
    height: 52px;
    display: block;
    border-radius: 100%;
    object-fit: cover;
  }

  .description {
    flex-grow: 1;
    flex-basis: 0;
    padding: 0 0 0 10px;
    color: var(--pallete-text-main-350);
    font-size: 14px;
    line-height: 18px;

    .description-title {
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      color: var(--pallete-text-main);
    }

    p {
      margin: 0 0 10px;
    }
  }

  .toggle-switch {
    margin: 10px 0 0;
    .switcher {
      .sp_dark & {
        background: #333 !important;
      }
    }

    input:checked {
      + .switcher {
        .sp_dark & {
          background: #333 !important;
        }
      }
    }
  }

  .thumb-title {
    margin: 0 0 4px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .actions-btns {
    display: flex;
    flex-direction: row;

    > span {
      width: calc(50% - 5px);
      padding: 0 10px 0 0;

      .button {
        margin: 0;
      }
    }

    .button-primary,
    .button-default {
      border: none;
    }

    .button {
      flex: 1;
      margin: 0 0 0 10px;
    }
  }
`;
