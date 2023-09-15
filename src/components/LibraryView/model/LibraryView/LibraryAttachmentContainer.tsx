import attrAccept from 'attr-accept';
import AttachmentContainer from 'components/AttachmentContainer';
import { useAppSelector } from 'hooks/useAppSelector';
import { useMediaLibraryDrag } from 'hooks/useMediaLibraryDrag';
import React, { useEffect, useState } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  selectAlreadySharedmedia,
  selectMediaItemBykey,
} from 'store/reducer/libraryFileUpload';
import styled from 'styled-components';
interface ITemplateModal {
  className?: string;
  setActiveView?: any;
  index?: number;
  onClose?: () => void;

  oK?: () => void;
  onClick?: (item?: IPost | ChatMessage | MediaLibrary) => void;
  onItemSelect?: (item: MediaLibrary, index: number, value?: boolean) => void;
  onDeleteItem?: (item: MediaLibrary, index: number) => void;
  onImageLoadError?: (item: MediaLibrary, index: number) => void;
  item: MediaLibrary;
  notAllowedTypes?: string[];
}
const getType = (item: MediaLibrary) => {
  let type = '';
  if (attrAccept({ name: item.name, type: item.type }, 'image/*')) {
    type = 'image';
  }
  if (attrAccept({ name: item.name, type: item.type }, 'audio/*')) {
    type = 'audio';
  }
  if (attrAccept({ name: item.name, type: item.type }, 'video/*')) {
    type = 'video';
  }

  return type;
};
const LibraryAttachmentContainer: React.FC<ITemplateModal> = ({
  onClick,
  onImageLoadError,
  onItemSelect,
  onDeleteItem,
  index = 0,
  item,
  // setActiveView,
  notAllowedTypes = [],
  className,
}) => {
  const { isDragging, drag, preview } = useMediaLibraryDrag({
    item,
  });
  const [checked, setIsChecked] = useState<boolean | undefined>(false);
  const [isSelectable, setIsSelectable] = useState<boolean | undefined>(true);
  const isSelectedMedia = useAppSelector((state) =>
    selectMediaItemBykey(state, item?._id || ''),
  );
  const isAlreadyShared = useAppSelector((state) =>
    selectAlreadySharedmedia(state, item?._id || ''),
  );
  useEffect(() => {
    let ischecked = !!isSelectedMedia?._id;
    if (!!notAllowedTypes?.length) {
      const type = getType(item);
      const isInclude = notAllowedTypes.includes(type);
      if (isInclude) {
        ischecked = false;
        setIsSelectable(false);
      }
    }
    setIsChecked(ischecked);
    return () => {};
  }, [isSelectedMedia]);
  const handleItemSelect = (
    item: MediaLibrary,
    index: number,
    value?: boolean,
  ) => {
    onItemSelect?.(item, index, value);
  };
  useEffect(() => {
    preview(getEmptyImage());
  }, []);

  let addedBy = '';
  if (item.addedBy !== null) {
    addedBy = item.addedBy?.pageTitle || '';
  }
  // useEffect(() => {
  //   if (isDragging) {
  //     setActiveView?.('left');
  //   }
  // }, [isDragging]);

  return (
    <>
      <AttachmentContainer
        className={`${className} ${!!isAlreadyShared ? 'already-shared' : ''}`}
        isDragging={isDragging}
        ref={drag}
        key={(item?._id || '') + index}
        createdAt={item?.createdAt}
        onSelect={(id, value) => {
          setIsChecked(true);
          handleItemSelect(item, index, value);
        }}
        checked={checked}
        onImageLoadError={() => {
          onImageLoadError?.(item, index);
        }}
        onClick={() => {
          onClick?.(item);
        }}
        media={
          {
            index: index,
            ...item,
            addedBy,
          } as any
        }
        ImageSizesProps={{
          onlyMobile: true,
        }}
        onDelete={() => onDeleteItem?.(item, index)}
        showOptions={{
          timeStampText: true,
          video: true,
          image: true,
          play: true,
          edit: false,
          closeIcon: false,
          selectable: isSelectable,
          showprogress: false,
          mutipleSelect: false,
          infoData: true,
          recycleBin: true,
          viewMedia: true,
        }}
      />
    </>
  );
};

export default styled(LibraryAttachmentContainer)`
  &.already-shared {
    opacity: 0.4;
  }
  .audio_thumbnail {
    position: absolute;
  }
`;
