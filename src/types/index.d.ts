type ProfileType = 'services' | 'links';
type LINKTYPES = 'links' | 'tempLinks';

type CustomErrorType = {
  ignoreStatusCodes: number[];
};
type CancelFileUploadCallbackProps = {
  groupId: string;
  group: Record<string, any>;
  groupFiles: any[];
  isAllCancelled: boolean;
  isAllUploaded: boolean;
  isInprogress: boolean;
};
