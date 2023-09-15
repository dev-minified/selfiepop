import { removeLibraryImage } from 'api/theme';
import { ImagesScreenSizes } from 'appconstants';
import { AddImage, Cancel, Chromatic } from 'assets/svgs';
import NButton from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import SimpleCard from 'components/SPCards/SimpleCard';
import UploadandEditor from 'components/UploadandEditor';
import { useState } from 'react';
import styled from 'styled-components';
import { getImageURL } from 'util/index';
import ThemeCard from './ThemeCard';

interface Props {
  value?: any;
  onChange?: Function;
  name?: string;
  onClose?: any;
  images?: { id: string; url: string }[];
  onUserImageDelete?: Function;
  onUserImageUpload?: Function;
  className?: string;
  ImageSizes?: string[];
}

type BGEditorSelectedView = 'your-images' | 'image-library';

const BackgroundImageSelector = ({
  onChange,
  name,
  onClose,
  images = [],
  onUserImageDelete,
  onUserImageUpload,
  className,
  ImageSizes = ImagesScreenSizes.themeBackgroundImage,
}: Props) => {
  const [selectedView, setSelectedView] =
    useState<BGEditorSelectedView>('your-images');

  const onSelectHandler = (url: string) => {
    onChange && onChange(name, url);
    onClose && onClose();
  };

  return (
    <div className={className}>
      <SimpleCard
        header={
          <div className="rc-card-title">
            <div className="theme-bg-header-icon">
              <Chromatic />
            </div>
            Background Image
          </div>
        }
        classes={{ header: 'theme-bg-select-header' }}
        extra={
          <div onClick={onClose}>
            <Cancel />
          </div>
        }
      >
        <div className="theme-bg-select-container theme-editor-actions">
          <div className="action">
            <NButton
              type={selectedView === 'your-images' ? 'primary' : undefined}
              onClick={() => {
                setSelectedView('your-images');
              }}
              block
            >
              Your Images
            </NButton>
            <NButton
              type={selectedView === 'image-library' ? 'primary' : undefined}
              onClick={() => {
                setSelectedView('image-library');
              }}
              block
            >
              Image Library
            </NButton>
          </div>
          <div className="bg_scrollimages">
            <Scrollbar>
              <div className="theme-bg-cards row mx-0">
                {selectedView === 'your-images' && (
                  <div className="col-sm-3 px-10 mb-20">
                    <UploadandEditor
                      imageSizes={ImageSizes}
                      // accept="image/*"
                      accept={{ 'image/*': [] }}
                      url="/image/library/upload"
                      cropper={false}
                      onSuccess={({ imageURL }: any) => {
                        onSelectHandler(imageURL);
                        onUserImageUpload?.();
                      }}
                      validation={{
                        minWidth: 100,
                        minHeight: 100,
                        maxSize: 1024 * 1024 * 2,
                      }}
                    >
                      <ThemeCard
                        create
                        cardText="Upload an Image"
                        cardIcon={<AddImage />}
                        showFooter={false}
                      />
                    </UploadandEditor>
                  </div>
                )}
                {(selectedView === 'your-images' ? images : images).map(
                  (image, idx) => {
                    const {
                      url: profileImageUrl,
                      fallbackUrl: profileFallback,
                    } = getImageURL({
                      url: image.url,
                      settings: {
                        onlysMobile: true,
                        mobile: ImageSizes[0],

                        imgix: {
                          desktop: ImageSizes[1],
                          mobile: ImageSizes[0],
                        },
                      },
                    });
                    return (
                      <div key={idx} className="col-sm-3 px-10 mb-20">
                        <ThemeCard
                          image={profileImageUrl}
                          fallbackUrl={image.url ? profileFallback : image.url}
                          showFooter={false}
                          showRemoveIcon={selectedView === 'your-images'}
                          onClick={() => onSelectHandler(image.url)}
                          onDeleteClick={() => {
                            removeLibraryImage(image.id)
                              .then(() => {
                                onUserImageDelete?.(image.id);
                              })
                              .catch(console.log);
                          }}
                        />
                      </div>
                    );
                  },
                )}
              </div>
            </Scrollbar>
          </div>
        </div>
      </SimpleCard>
    </div>
  );
};

export default styled(BackgroundImageSelector)`
  height: 100%;
  .card {
    height: 100%;
    background: none;
    display: flex;
    flex-direction: column;
  }
  .theme-editor-actions {
    .action {
      margin-bottom: 10px;
      padding: 20px;
      background: var(--pallete-background-default);
      overflow: hidden;
      margin: 0;
    }
  }
  .theme-bg-select-container {
    /* background: var(--pallete-background-default); */
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .card-body-wrapper {
    flex-grow: 1;
    flex-basis: 0;
    min-height: 0;
  }
  .theme-bg-cards {
    background: var(--pallete-background-default);
    border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px);
  }
  .bg_scrollimages {
    margin: 0;
    flex-grow: 1;
    flex-basis: 0;
    .theme-bg-cards {
      padding: 0 10px 0 0;
    }
  }
`;
