import { useEffect } from 'react';
import {
  ConnectDragPreview,
  DragSourceHookSpec,
  FactoryOrInstance,
} from 'react-dnd';
import { useMultiDrag } from 'react-dnd-multi-backend';
import { setItemsDragging } from 'store/reducer/libraryFileUpload';
import { store } from 'store/store';
import { useAppDispatch } from './useAppDispatch';
type Props = {
  item?: any;
  dragProps?: FactoryOrInstance<DragSourceHookSpec<unknown, unknown, unknown>>;
  preview?: ConnectDragPreview;
};

export const useMediaLibraryDrag = (props: Props) => {
  const { item } = props;
  const dispatch = useAppDispatch();
  const [
    [dragProps, drag, preview],
    // {
    // html5: [, html5Drag],
    // touch: [touchProps, touchDrag],
    // },
  ] = useMultiDrag({
    type: 'Umair',
    item: () => {
      let selectedItems = store.getState().libraryMedia?.selectedMediaItems;
      if (!selectedItems?.[item?._id]) {
        selectedItems = item;
      }
      return {
        media: selectedItems,
      };
      // return item;
    },
    collect: (monitor) => {
      return {
        isDragging:
          !!monitor.isDragging() || !!monitor.getItem()?.media?.[item?._id],
      };
    },
  });
  useEffect(() => {
    dispatch(setItemsDragging(dragProps.isDragging));
  }, [dragProps.isDragging]);
  return { isDragging: dragProps.isDragging, drag, preview };
};
