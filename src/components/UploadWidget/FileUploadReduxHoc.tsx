import { useAppDispatch } from 'hooks/useAppDispatch';
import useSocket from 'hooks/useSocket';
import { useEffect, useState } from 'react';
import { IFileGroup, uploadFiles } from 'store/reducer/files';
import { v4 as uuid } from 'uuid';

interface IProps {
  children: (
    files: any[],
    onChange: (files: any) => void,
    extra: { onSubmit: (extra: { [key: string]: any }) => void },
  ) => any;
  url?: string;
  files?: any[];
}

const FileUploadReduxHoc = ({
  children,
  url = '/image/upload',
  files: value,
}: IProps) => {
  const [files, setFiles] = useState<IFileGroup['files']>([]);
  const { socket } = useSocket();

  useEffect(() => {
    setFiles(value || []);
  }, [value]);

  const disptach = useAppDispatch();

  const onSubmit = (extra?: { [key: string]: any }) => {
    const groupdId = uuid();
    disptach(uploadFiles({ key: groupdId, url, socket, files, ...extra }));
  };

  return <>{children(files, setFiles, { onSubmit })}</>;
};

export default FileUploadReduxHoc;
