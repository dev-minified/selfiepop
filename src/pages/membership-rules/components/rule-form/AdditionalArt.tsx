/* eslint-disable react-hooks/exhaustive-deps */
import {
  AudioSVG,
  ImageThumbnail,
  MessageSendIcon,
  ProfileIcon,
  RulesIcon,
  VideoThumbnail,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import EditUpload from 'components/EditUpload';
import ImageModifications from 'components/ImageModifications';
import DragableItem from 'components/InlinePopForm/DragableItem';
import Modal from 'components/modal';
import { useCallback, useState } from 'react';
import swal from 'sweetalert';
const getArtIcon = (type: string) => {
  if (type === 'Post Name') {
    return <ProfileIcon />;
  }
  if (type === 'Message Name') {
    return <MessageSendIcon />;
  }
  if (type === 'Rule Name') {
    return <RulesIcon />;
  }
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
  content = false,
  binding = { name: 'name', path: 'path', type: 'type' },
  options = { delete: true },
}: {
  title?: string;
  description?: string;
  showLoading?: boolean;
  content?: boolean;
  value: any;
  onChange?: Function;
  binding?: { name: string; path: string; type: string };
  options?: Record<string, any>;
}) => {
  const [preview, setPreview] = useState<null | any>(null);
  const [selected, setSelected] = useState<number | null | any>(-1);

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
    <div>
      {value?.map((item: any, index: number) => (
        <DragableItem
          subtitle={value?.subtitle as any}
          content={content}
          dragHandle={false}
          key={`${item?._id}`}
          icon={getArtIcon(item['name'])}
          index={index}
          onEdit={(index: number) => setSelected(index)}
          title={item['name']}
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
      ))}
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
              <ImageModifications
                imgeSizesProps={{
                  onlyDesktop: true,

                  imgix: { all: 'w=163&h=163' },
                }}
                src={preview[binding.path]}
                style={{ width: '100%', height: '100%' }}
                alt="alt"
              />
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
export default AdditionalArt;
