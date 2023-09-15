import { FolderSvg } from 'assets/svgs';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement, ReactNode } from 'react';
// import { useDrop } from 'react-dnd';
import { useMultiDrop } from 'react-dnd-multi-backend';
import {
  checkIfFilesareReadytoUpload,
  moveLibrary,
  setLibraryLoading,
} from 'store/reducer/libraryFileUpload';
import styled from 'styled-components';
import ConfirmationModal from './model/ConfirmationModal';
type Props = {
  key?: string;
  onClick?: any;
  item?: MediaFolder;
  className?: string;
  managedAccountId?: string;
  icon?: ReactNode | ReactElement;
};

const ListItem = (props: Props) => {
  const { key, onClick, item, className, managedAccountId = '', icon } = props;
  const dispatch = useAppDispatch();
  const activeFolder = useAppSelector(
    (state) => state.libraryMedia.activeFolder,
  );
  const [open, onOpen, onClose] = useOpenClose();
  const checkifFilesExist = useAppSelector((state) =>
    checkIfFilesareReadytoUpload(state, ''),
  );
  const [
    [dropProps, drop],
    // {
    //   html5: [html5DropStyle, html5Drop],
    //   touch: [touchDropStyle, touchDrop],
    // },
  ] = useMultiDrop({
    accept: 'Umair',
    drop: (_item: any) => {
      // const message = `Dropped: ${item.color}`;
      // logs.current.innerHTML += `${message}<br />`;
      console.log({ _item });
      const { _id } = _item?.media;
      dispatch(setLibraryLoading({ loading: true }));
      if (!_id) {
        const multi = Object.keys(_item?.media || {});
        dispatch(
          moveLibrary({
            data: { ids: multi, folderId: item?._id },
            itemsIndex: multi,
            options: {
              params: {
                sellerId: managedAccountId,
              },
            },
          }),
        )
          .unwrap()
          .then(() => {
            toast.success('Media moved successfully');
          })
          .catch(() => {
            toast.error('Unable to move media');
          })
          .finally(() => {
            dispatch(setLibraryLoading({ loading: false }));
          });
        return;
      }
      dispatch(
        moveLibrary({
          data: { ids: [_item?.media?._id], folderId: item?._id },
          itemsIndex: [_item?.media?._id],
          options: {
            params: {
              sellerId: managedAccountId,
            },
          },
        }),
      )
        .unwrap()
        .then(() => {
          toast.success('Media moved successfully');
        })
        .catch(() => {
          toast.error('Unable to move media');
        })
        .finally(() => {
          dispatch(setLibraryLoading({ loading: false }));
        });
      return;
    },
    canDrop: (_item) => {
      const multi = Object.keys(_item?.media || {});
      return (
        item?._id !==
        (_item?.media?.folderId || _item?.media[multi[0]]?.folderId || 'trash')
      );
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  const onClickHandler = (e: any) => {
    e.stopPropagation();
    if (checkifFilesExist) {
      onOpen();
      return;
    }
    onClick?.();
  };
  return (
    <>
      <ConfirmationModal
        description="You have unsaved changes! Your changes will be discarded."
        isOpen={open}
        onSave={() => {
          onClose();
          onClick?.();
        }}
        okbuttonText="Discard"
        onClose={onClose}
      />
      <li
        key={key}
        onClick={onClickHandler}
        ref={drop}
        className={`${
          activeFolder?._id === item?._id ? 'active' : ''
        } ${className} ${
          dropProps.isOver && dropProps.canDrop ? 'isOver' : ''
        }`}
      >
        <span className="img">{icon ? icon : <FolderSvg />}</span> {item?.name}
      </li>
    </>
  );
};

export default styled(ListItem)`
  &.isOver {
    background-color: #ececec;
  }
`;
