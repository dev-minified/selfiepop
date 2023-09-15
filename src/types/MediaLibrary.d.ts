type MediaFolder = {
  _id?: string;
  name: string;
  updatedAt?: string;
  createdAt?: string;
  userId?: string;
};
type IAddedBy = {
  pageTitle?: string;
  _id?: string;
  username?: string;
  profileImage?: string;
};
type MediaLibrary = {
  path: string;
  _id?: string;
  folderId: string;
  title?: string;
  name?: string;
  type: string;
  sortOrder: number;
  height: number;
  width: number;
  thumbnail?: string;
  duration?: number;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
  addedBy?: IAddedBy;
  blurThumbnail?: string;
};
