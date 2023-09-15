import { ImagesScreenSizes } from 'appconstants';
import ImageModifications from 'components/ImageModifications';
import { default as NewButton } from 'components/NButton';
import SimpleCard from 'components/SPCards/SimpleCard';
import { toast } from 'components/toaster';
import UploadandEditor, { IRcFile } from 'components/UploadandEditor';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { dataURLtoFile, getImageDimension } from 'util/index';
interface Props {
  value?: string | undefined;
  onChange?: Function;
  className?: string;
}

export function ProfileImageEditor({
  value: initialValue,
  onChange,
  className,
}: Props): ReactElement {
  const [image, setSetImage] = useState<string | undefined | null>(null);

  useEffect(() => {
    setSetImage(initialValue);
  }, [initialValue]);

  const handleChange = (
    image: string | null,
    imageData?: string,
    name?: string,
  ) => {
    setSetImage(image);
    onChange && onChange(image as any, imageData, name);
  };

  const onImageUpload = async (file: IRcFile) => {
    const { url, imageString } = file;
    const dimensions = await getImageDimension(dataURLtoFile(imageString));
    if (dimensions?.width < 600) {
      toast.info(
        'WARNING: For best results use an image that is 600px wide or larger.',
      );
    }
    handleChange(url!, imageString, file.name);
  };

  return (
    <div className={className}>
      <SimpleCard
        classes={{
          card: 'profile-image-editor',
        }}
        header={
          <div className="profile-editor-header">
            <div className="profile-editor__image">
              <UploadandEditor
                url="/image/upload"
                // accept="image/*"
                accept={{ 'image/*': [] }}
                cropper
                aspectRatio={1}
                imageSizes={ImagesScreenSizes.profile}
                onSuccess={onImageUpload}
                validation={{
                  maxSize: 1024 * 1024 * 1024,
                }}
              >
                <ImageModifications
                  imgeSizesProps={{
                    onlyDesktop: true,
                  }}
                  src={image || '/assets/images/default-profile-img.svg'}
                  alt="profile"
                  fallbackUrl={'/assets/images/default-profile-img.svg'}
                />
              </UploadandEditor>
            </div>
          </div>
        }
      >
        <UploadandEditor
          url="/image/upload"
          // accept="image/*"
          accept={{ 'image/*': [] }}
          cropper
          aspectRatio={1}
          imageSizes={ImagesScreenSizes.profile}
          onSuccess={onImageUpload}
          validation={{
            maxSize: 1024 * 1024 * 1024,
          }}
        >
          <NewButton type="primary">Upload an Image</NewButton>
        </UploadandEditor>

        <NewButton outline onClick={() => handleChange(null)}>
          Remove
        </NewButton>
      </SimpleCard>
    </div>
  );
}

export default styled(ProfileImageEditor)`
  .profile-image-editor {
    .card-header {
      background: var(--pallete-background-gray);
      padding: 15px 18px 15px;
    }

    .card-body-wrapper {
      display: flex;
      justify-content: center;
      padding: 19px 10px;

      .button {
        margin: 0 5px;
      }
    }
  }

  .profile-editor__image {
    overflow: visible;
    margin: 0 auto;
    width: 124px;
    height: 124px;
    /* border: 5px solid #fff; */

    &:before {
      position: absolute;
      left: -6px;
      right: -6px;
      top: -6px;
      bottom: -6px;
      content: '';
      border: 1px dashed #dcbde7;
      border-radius: 100%;
      display: none;
    }

    .image-comp {
      border-radius: 100%;
      border: 5px solid #fff;

      &.default-person-img {
        border-color: rgba(255, 255, 255, 0.1);
      }
    }

    img {
      border-radius: 100%;
      cursor: pointer;
    }
  }
`;
