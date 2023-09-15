import { MutableRefObject } from 'react';
import styled from 'styled-components';
import GalleryViewUploadWidget from './GalleryViewUploadWidget';
const StandardChatSubMessageInput: React.FC<{
  message?: string;
  onMessage?: (...args: any) => void;
  files?: MediaType[];
  onFileChange?: (files: MediaType[]) => void;
  customButton?: boolean;
  onSortCallback?: (files: MediaType[]) => void;
  price?: Number;
  onPriceChange?: (p: number) => void;
  onCloseTabs?: (...args: any) => void;
  onSend?: () => void;
  defaultFiles?: any[];
  isSending?: boolean;
  openinGallery?: boolean;
  preivewMessage?: string;
  preivewSubMessage?: string;
  buttonRef?: MutableRefObject<any>;
  onNewListOpenModel?: () => void;
  showButton?: boolean;
  type?: string;
}> = ({
  onFileChange,
  files = [],
  preivewMessage,
  showButton,
  onNewListOpenModel,
  preivewSubMessage,
  customButton = true,
  buttonRef,
  openinGallery = false,
}) => {
  const handleFileChange = (ffls: MediaType[]) => {
    onFileChange &&
      onFileChange(
        ffls.map((i: any) => {
          return { ...i, isPaidType: false, islocK: false };
        }) as any,
      );
  };
  return (
    <div className="sub-tab-cotnent">
      <div className="sub-tab-holder">
        <GalleryViewUploadWidget
          openinGallery={openinGallery}
          onNewListOpenModel={onNewListOpenModel}
          buttonRef={buttonRef}
          showButton={showButton}
          customButton={customButton}
          accept={{ 'image/*': [], 'video/*': [], 'audio/*': [] }}
          message={preivewMessage}
          subMessage={preivewSubMessage}
          onChange={handleFileChange}
          onSortCallback={handleFileChange}
          // value={files?.filter((i) => !i.isPaidType)}
          value={files?.map((i) => ({
            ...i,
            isPaidType: false,
            islocK: false,
          }))}
        />
      </div>
    </div>
  );
};
export const StandardMessage = styled(StandardChatSubMessageInput)``;
const PaidChatSubMessageInput: React.FC<{
  message?: string;
  onMessage?: (...args: any) => void;
  files?: MediaType[];
  onFileChange?: (files: MediaType[], id?: string) => void;
  price?: Number;
  onPriceChange?: (p: number) => void;
  onCloseTabs?: (...args: any) => void;
  onSend?: () => void;
  defaultFiles?: any[];
  isSending?: boolean;
  openinGallery?: boolean;
  customButton?: boolean;
  preivewMessage?: string;
  preivewSubMessage?: string;
  buttonRef?: MutableRefObject<any>;
  galleryOptions?: {
    rotate: boolean;
    disableVideoAudioRotation?: boolean;
  };
  showButton?: boolean;
  onNewListOpenModel?: () => void;
  type?: string;
}> = ({
  onFileChange,
  files = [],
  preivewMessage,
  preivewSubMessage,
  buttonRef,
  onNewListOpenModel,
  showButton,
  customButton = true,
  openinGallery = false,
  galleryOptions = {
    rotate: false,
    disableVideoAudioRotation: true,
  },
}) => {
  const handleFileChange = (pfs: MediaType[], id?: string) => {
    onFileChange &&
      onFileChange(
        pfs.map((i: any) => {
          return { ...i, isPaidType: true, islocK: true };
        }) as any,
        id,
      );
  };

  return (
    <div className="sub-tab-cotnent">
      <div className="sub-tab-holder">
        <GalleryViewUploadWidget
          openinGallery={openinGallery}
          buttonRef={buttonRef}
          onNewListOpenModel={onNewListOpenModel}
          customButton={customButton}
          showButton={showButton}
          // accept={['image/*', 'video/*', 'audio/*']}
          accept={{ 'image/*': [], 'video/*': [], 'audio/*': [] }}
          message={preivewMessage}
          subMessage={preivewSubMessage}
          onChange={handleFileChange}
          value={files?.map((i) => ({ ...i, isPaidType: true, islocK: true }))}
          breakCache={true}
          galleryOptions={galleryOptions}
          onSortCallback={handleFileChange}
        />
      </div>
    </div>
  );
};
export const PaidMessage = styled(PaidChatSubMessageInput)``;
