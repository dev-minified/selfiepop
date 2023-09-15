import { AudioSVG, ImageThumbnail, VideoThumbnail } from 'assets/svgs';
import attrAccept from 'attr-accept';
import EditUpload from 'components/EditUpload';
import ImageModifications from 'components/ImageModifications';
import Modal from 'components/modal';
import { useCallback, useState } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import styled from 'styled-components';
import swal from 'sweetalert';

import DragableItem from './DragableItem';
import SortableList from './SortableList';

const getArtIcon = (type: string) => {
  if (attrAccept({ type }, 'image/*')) {
    return <ImageThumbnail />;
  }
  if (attrAccept({ type }, 'video/*')) {
    return <VideoThumbnail />;
  }
  if (attrAccept({ type }, 'audio/*')) {
    return <AudioSVG />;
  }

  return null;
};

const AdditionalArt = ({
  value,
  onChange,
  showLoading = false,
  imgSettings = {
    onlyDesktop: true,
  },
  binding = { name: 'name', path: 'path', type: 'type' },
  options = { delete: true },
  className,
}: {
  title?: string;
  description?: string;
  showLoading?: boolean;

  value: Array<
    (IAdditionalArt | IDigitalDownloads) & {
      cbOnCancel?: (ms?: string) => void;
    }
  >;
  onChange?: Function;
  binding?: { name: string; path: string; type: string };
  options?: Record<string, any>;
  imgSettings?: ImageSizesProps['settings'];
  className?: string;
}) => {
  const [preview, setPreview] = useState<null | any>(null);
  const [selected, setSelected] = useState<number | null | any>(-1);
  const onPopSortEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      const sortedArray = arrayMove<any>(value, oldIndex, newIndex).map(
        (item, index) => ({ ...item, sortOrder: index }),
      );

      onChange?.(sortedArray);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  const onDelete = useCallback(
    (index: number) => {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to delete? ',
        icon: 'warning',
        dangerMode: true,
        buttons: ['Cancel', 'Delete'],
      }).then(async (willDelete) => {
        if (willDelete) {
          value[index]?.cbOnCancel?.('Operation canceled by the user.');
          const newadditionalArt = [...value];
          newadditionalArt.splice(index, 1);
          onChange?.(newadditionalArt, value[index]);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );

  const onView = (v: any) => {
    setPreview(v);
  };

  const updateActive = (index: number, isActive: boolean) => {
    const newArray = [...(value || [])].slice();
    newArray[index] = { ...newArray[index], isActive };
    onChange?.(newArray);
  };
  const onCancel = (index: number) => {
    onDelete(index);
  };
  const updataCoursePopMedia = (values: any) => {
    const arr = value;
    arr[selected] = values;
    onChange?.(arr);
  };
  const selectedItemValue = selected !== null ? value[selected] : undefined;

  return (
    <div className={className}>
      <SortableList
        useDragHandle
        items={value}
        onSortEnd={onPopSortEnd}
        renderItem={(item: any, index: number) => {
          return (
            <DragableItem
              icon={getArtIcon(item[binding.type])}
              index={index}
              onEdit={(index: number) => setSelected(index)}
              title={item[binding.name]}
              isActive={item.isActive}
              onView={() => onView(item)}
              onToggel={async () => {
                await updateActive(index, !item.isActive);
              }}
              showLoading={
                showLoading ||
                item?.status === 'uploading' ||
                item?.status === 'encoding'
              }
              onDeleteClick={() => onDelete(index)}
              options={{ view: true, ...options }}
              showProgress={item.showProgressBar}
              completed={item.uploadingProgress}
              onCancel={() => onCancel(index)}
              error={item.failed}
              {...item}
            />
          );
        }}
      />
      <EditUpload
        isOpen={selected !== -1}
        value={selectedItemValue}
        cbonCancel={() => setSelected(-1)}
        cbonSubmit={(values: any) => updataCoursePopMedia?.(values)}
      />
      <Modal
        isOpen={Boolean(preview)}
        onClose={() => setPreview(false)}
        showFooter={false}
        className={className}
      >
        {preview && (
          <>
            {attrAccept(
              {
                name: preview[binding.name],
                type: preview[binding.type],
              },
              'video/*',
            ) && (
              <video width="100%" height="100%" controls>
                <source src={preview[binding.path]} type={'video/mp4'} />
              </video>
            )}

            {attrAccept(
              {
                name: preview[binding.name],
                type: preview[binding.type],
              },
              'image/*',
            ) && (
              <div style={{ width: '100%', height: '100%' }}>
                <ImageModifications
                  imgeSizesProps={imgSettings}
                  src={preview?.[binding?.path]}
                  alt="alt"
                />
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
export default styled(AdditionalArt)`
  .modal-body {
    max-height: calc(100vh - 110px);
    overflow: auto;
    img {
      display: block;
      margin: 0 auto;
    }
  }
`;
