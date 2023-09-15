import { GalleryPlus } from 'assets/svgs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import FileUploader from 'pages/Sales/components/FileUploader';
import { onFilesUpload } from 'store/reducer/libraryFileUpload';
import styled from 'styled-components';
import { fileChanges } from 'util/index';
import { v4 as uuid } from 'uuid';
type Props = {
  files?: any[];
  onFileChanges?: (files: any[]) => void;
  title?: string;
  icon?: React.ReactElement;
  GalleryIcon?: boolean;
  onFilesChangeCallback?: (files: any[]) => void;
  onChange?: (files: any[]) => void;
  showPreview?: boolean;
  className?: string;
  folderId?: string;
  onSubmit?: (...arg: any) => void;
};

const LibrarayUploadEditor = (props: Props) => {
  const {
    onFileChanges,
    GalleryIcon = true,
    className,
    folderId = uuid(),
  } = props;
  const isGellaryId = useAppSelector(
    (state) => state?.libraryMedia?.inProgressGellaryId?.[folderId],
  );

  const dispatch = useAppDispatch();

  return (
    <div className={`${className} file-uploader`}>
      {!isGellaryId && (
        <>
          <FileUploader
            customRequest={async (fls) => {
              const newFiles: MediaType[] = await fileChanges(fls, 'standard');
              const totalFiles = newFiles.map((f) => ({
                ...f,
                isPaidType: false,
                islocK: false,
              }));

              dispatch(onFilesUpload({ libraryMedia: totalFiles }));
              //   setFiles(totalFiles);
              onFileChanges?.(totalFiles);
            }}
            // accept={['image/*', 'video/*', 'audio/*']}
            accept={{ 'image/*': [], 'video/*': [], 'audio/*': [] }}
          >
            <>{GalleryIcon && <GalleryPlus />}</>
          </FileUploader>
        </>
      )}
    </div>
  );
};

export default styled(LibrarayUploadEditor)``;
