import { MEDIA_UPLOAD_STATUSES } from 'appconstants';
import { getDuration } from 'util/index';
//// Example
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  current,
} from '@reduxjs/toolkit';
import { getPresignedUrl } from 'api/User';
import { upload } from 'api/Utils';
import attrAccept from 'attr-accept';
import axios, { CancelTokenSource } from 'axios';
import { toast } from 'components/toaster';
import { CLOUD_FRONT_S3, CLOUD_FRONT_THUMBNAI, VIDEOURL } from 'config';
import { RootState } from 'store/store';
import {
  getAudioDuration,
  getChangeUrlsOnly,
  getImageURL,
  getImageURLDimentions,
} from 'util/index';

// Define a type for the slice state
export interface IFileGroup {
  [key: string]: any;
  progress?: number;
  status?: MEDIA_GROUP_UPLOAD_STATUS;
  numberOfCompletedFiles?: number;
  files: {
    id?: string;
    orignalFile: File;
    progress: number;
    status: MEDIA_UPLOAD_STATUS;
    requestToken: CancelTokenSource;
    url?: string;
    [key: string]: any;
    videoDuration: string;
    duration?: number;
  }[];
}
interface Ifiles {
  [key: string]: IFileGroup;
}

// Define the initial state using that type
const initialState: Ifiles = {};

interface MyReturnType {
  [key: string]: any;
}
export const uploadFiles = createAsyncThunk<MyReturnType, IFileGroup>(
  'files/startUploading',
  async (payload, { dispatch }) => {
    const {
      key: groupKey,
      url,
      socket,
      onCompletedCallback,
      onSingleFileUpload,
      onCancelFileUpload,
      onFileUploadingFailed,
      removeOnCancel = true,
      ...rest
    } = payload;
    // let socket = Socket;
    // if (!Socket) {
    //   socket = useSocket();
    // }
    if (!url) {
      throw new Error('Please Provide a Url to upload');
    }

    if (rest.files.length < 1) {
      onCompletedCallback();
      return;
    }
    const onUploadingFileCancelled = async (file: any) => {
      if (file.status !== MEDIA_UPLOAD_STATUSES.IN_PROGRESS) {
        dispatch(
          onFileUploadingCancelled({
            groupId: groupKey,
            fileId: file?.id,
            status: MEDIA_UPLOAD_STATUSES.CANCELLED,
            callBack: onCancelFileUpload,
            removeOnCancel,
          }),
        );
      }
      return (file as any)?.requestToken?.cancel('file uploading cancelled');
    };
    dispatch(startGroupUploading({ ...rest, key: groupKey }));
    for (let index = 0; index < rest.files.length; index++) {
      const file = rest.files[index];
      if (file.orignalFile) {
        if (attrAccept({ name: file.name, type: file.type }, 'video/*')) {
          let extention: any = file.name.split('.');
          extention = extention[extention.length - 1];
          const key = `${file.id}.${extention}`;
          getPresignedUrl(key, file.type)
            .then((res) => {
              const ourRequest = axios.CancelToken.source();
              dispatch(
                startFileUploading({
                  groupId: groupKey,
                  fileId: file.id,
                  requestToken: ourRequest,
                  onUploadingFileCancelled,
                }),
              );
              upload(
                '',
                file.orignalFile,
                {
                  method: 'PUT',
                  cancelToken: ourRequest.token,
                  headers: { 'Content-Type': file.type },
                  baseURL: res.signedUrl,
                  onUploadProgress: (PE) => {
                    dispatch(
                      setFileUpoadingProgress({
                        groupId: groupKey,
                        fileId: file.id,
                        progress: Math.floor(
                          (PE.loaded * 100) / (PE?.total || 0),
                        ),
                        ...PE,
                      }),
                    );
                  },
                },
                false,
              )
                .then((res) => {
                  const videoThumbnail = `${CLOUD_FRONT_THUMBNAI}/thumb-pops/order-videos/${file.id}.0000000.png`;
                  const videoPath = `${CLOUD_FRONT_S3}/vid-pops/order-videos/${file.id}.mp4`;
                  if (!res?.sucess && res?.reason === 'cancelled') {
                    dispatch(
                      onFileUploadingCancelled({
                        groupId: groupKey,
                        fileId: file.id,
                        status: MEDIA_UPLOAD_STATUSES.CANCELLED,
                        callBack: onCancelFileUpload,
                        removeOnCancel,
                      }),
                    );
                  }
                  socket?.on(`${VIDEOURL}${key}`, async ({ status }: any) => {
                    if (status === 'PROGRESSING') {
                      dispatch(
                        setFileUpoadingProgress({
                          groupId: groupKey,
                          fileId: file.id,
                          progress: 100,
                          status: MEDIA_UPLOAD_STATUSES.ENCODING,
                        }),
                      );
                    } else if (status === 'COMPLETE') {
                      let blurThumbnail = undefined;
                      // if (index === 0) {
                      blurThumbnail = getImageURL({
                        url: videoThumbnail,
                        settings: {
                          isThumbBdesktop: true,
                          transform: false,
                        },
                      })?.url;
                      // if (blurThumbnail && isValidUrl(blurThumbnail)) {
                      //   let newBlurThumbnail = blurThumbnail?.slice(0, -5);

                      //   for (let index = 0; index < 6; index++) {
                      //     const newBlurUrl = `${newBlurThumbnail}${index}.png`;
                      //     console.log({ newBlurUrl });
                      //     try {
                      //       const widthHeight = await getImageURLDimentions(
                      //         newBlurUrl,
                      //       );
                      //       if (widthHeight.success) {
                      //         console.log({ newBlurUrl }, 'success');
                      //         blurThumbnail = newBlurUrl;
                      //         break;
                      //       }
                      //     } catch (error) {}
                      //     console.log({ newBlurUrl }, 'false');
                      //   }
                      // }

                      // }
                      let videoDuration = file.videoDuration || 0;
                      let width = file.width;
                      let height = file.height;
                      let duration = file.duration;
                      let medataData: any;
                      if (!duration) {
                        try {
                          medataData = await getDuration({
                            ...file,
                            url: videoPath,
                          });
                          width = medataData?.width || 0;
                          height = medataData?.height || 0;
                          duration = medataData?.duration || 0;
                          videoDuration = medataData?.videoDuration || 0;
                        } catch (error) {}
                      }
                      dispatch(
                        onFileUpoadingComplete({
                          onSingleFileUpload,
                          onCompletedCallback,
                          groupId: groupKey,
                          fileId: file.id,
                          url: videoPath,
                          path: videoPath,
                          status: MEDIA_UPLOAD_STATUSES.COMPLETED,
                          thumbnail: videoThumbnail,
                          thumb: videoThumbnail,
                          videoDuration,
                          blurThumbnail,
                          duration,
                          width,
                          height,
                        }),
                      );
                    } else if (status === 'ERROR') {
                      dispatch(
                        onFileUpoadingFailed({
                          groupId: groupKey,
                          fileId: file.id,
                          onFileUploadingFailed,
                        }),
                      );
                    }
                  });
                })
                .catch((e) => {
                  toast.error('Sorry, Please try again');
                  dispatch(
                    onFileUpoadingFailed({
                      groupId: groupKey,
                      fileId: file.id,
                      onFileUploadingFailed,
                    }),
                  );
                });
            })
            .catch((e) => {
              toast.error('Sorry, Please try again second', e);
              dispatch(
                onFileUpoadingFailed({
                  groupId: groupKey,
                  fileId: file.id,
                  onFileUploadingFailed,
                }),
              );
            });
        } else if (
          attrAccept({ name: file.name, type: file.type }, 'audio/*')
        ) {
          let extention: any = file.name.split('.');
          extention = extention[extention.length - 1];
          const key = `audio/${file.id}.${extention}`;

          getPresignedUrl(key, file.type, false)
            .then((pres) => {
              const ourRequest = axios.CancelToken.source();
              dispatch(
                startFileUploading({
                  groupId: groupKey,
                  fileId: file.id,
                  requestToken: ourRequest,
                  onUploadingFileCancelled,
                }),
              );
              upload(
                '',
                file.orignalFile,
                {
                  method: 'PUT',
                  cancelToken: ourRequest.token,
                  headers: { 'Content-Type': file.type },
                  baseURL: pres.signedUrl,
                  onUploadProgress: (PE) => {
                    dispatch(
                      setFileUpoadingProgress({
                        groupId: groupKey,
                        fileId: file.id,
                        progress: Math.floor(
                          (PE.loaded * 100) / (PE.total || 0),
                        ),
                        ...PE,
                      }),
                    );
                  },
                },
                false,
              )
                .then(async (res) => {
                  const path = pres.signedUrl?.split('?')[0];
                  let duration = file?.duration;
                  let videoDuration = file?.videoDuration;
                  if (!duration) {
                    try {
                      const data: any = await getAudioDuration({
                        ...file,
                        url: path,
                      } as any);
                      duration = data.duration || undefined;
                      videoDuration = data.timeDuration || undefined;
                    } catch (error) {
                      console.log({ error });
                    }
                  }

                  dispatch(
                    onFileUpoadingComplete({
                      ...file,
                      percentCompleted: 100,
                      onSingleFileUpload,
                      onCompletedCallback,
                      groupId: groupKey,
                      encoding: 'completed',
                      fileId: file.id,
                      url: path,
                      path: path,
                      status: MEDIA_UPLOAD_STATUSES.COMPLETED,
                      duration,
                      videoDuration,
                    }),
                  );
                })
                .catch((e) => {
                  toast.error('Sorry, Please try again');
                  dispatch(
                    onFileUpoadingFailed({
                      groupId: groupKey,
                      fileId: file.id,
                      onFileUploadingFailed,
                    }),
                  );
                });
            })
            .catch((e) => {
              toast.error('Sorry, Please try again');
              dispatch(
                onFileUpoadingFailed({
                  groupId: groupKey,
                  fileId: file.id,
                  onFileUploadingFailed,
                }),
              );
            });
        } else {
          const from = new FormData();
          from.append('file', file.orignalFile!);
          from.append('folder', 'users/link-image');
          const updatedFile: any = file.orignalFile;
          const fileName =
            updatedFile?.fileName || updatedFile.name || file?.id;

          from.append('fileName', fileName);
          const ourRequest = axios.CancelToken.source();
          dispatch(
            startFileUploading({
              groupId: groupKey,
              fileId: file.id,
              requestToken: ourRequest,
              onUploadingFileCancelled,
            }),
          );
          upload(url, from, {
            onUploadProgress: (PE) => {
              dispatch(
                setFileUpoadingProgress({
                  groupId: groupKey,
                  fileId: file.id,
                  progress: Math.floor((PE.loaded * 100) / (PE.total || 0)),
                  ...PE,
                }),
              );
            },
            cancelToken: ourRequest.token,
          })
            .then(async (data) => {
              if (!data.sucess && data?.reason === 'cancelled') {
                dispatch(
                  onFileUploadingCancelled({
                    groupId: groupKey,
                    fileId: file.id,
                    status: MEDIA_UPLOAD_STATUSES.CANCELLED,
                    callBack: onCancelFileUpload,
                    removeOnCancel,
                  }),
                );
              } else {
                const url = data.imageURL;
                let blurThumbnail = undefined;
                if (index === 0) {
                  blurThumbnail = getImageURL({
                    url: data.imageURL,
                    settings: {
                      bdesktop: true,
                      transform: false,
                    },
                  })?.url;
                }
                let width = data.width || 0;
                let height = data.height || 0;
                if (!width || !height) {
                  try {
                    const getUrl = getChangeUrlsOnly(data.imageURL);
                    const widthHeight = await getImageURLDimentions(getUrl.url);
                    width = widthHeight.width;
                    height = widthHeight.height;
                  } catch (error) {}
                }
                dispatch(
                  onFileUpoadingComplete({
                    groupId: groupKey,
                    fileId: file.id,
                    url: url,
                    onCompletedCallback,
                    onSingleFileUpload,
                    ...data,
                    type: `image/${url?.split('.')?.pop()}`,
                    path: url,
                    imageURL: url,
                    // fallbackUrl: url,
                    blurThumbnail,
                    height,
                    width,
                  }),
                );
              }
            })
            .catch((e) => {
              // throw e;
              toast.error('Sorry, Please try again');
              console.log(e);
              dispatch(
                onFileUpoadingFailed({
                  groupId: groupKey,
                  fileId: file.id,
                  onFileUploadingFailed,
                }),
              );
            });
        }
      } else {
        let url = file.path || file.url;
        let width = file.width || 0;
        let height = file.height || 0;
        if (attrAccept({ name: file.name, type: file.type }, 'image/*')) {
          if (!width || !height) {
            try {
              const getUrl = getChangeUrlsOnly(url);
              const wh = await getImageURLDimentions(getUrl.url);
              width = wh.width;
              height = wh.height;
            } catch (error) {}
          }
        }
        dispatch(
          onFileUpoadingComplete({
            onCompletedCallback,
            onSingleFileUpload,
            onUploadingFileCancelled,
            groupId: groupKey,
            fileId: file._id,
            url: url,
            path: url,
            status: MEDIA_UPLOAD_STATUSES.COMPLETED,
            thumbnail: file.thumbnail,
            thumb: file.thumbnail,
            width,
            height,
          }),
        );
      }
    }
  },
);

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    startGroupUploading: (state, { payload }) => {
      state[payload.key] = {
        ...payload,
        progress: 0,
        status: MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
        numberOfCompletedFiles: 0,
      };
    },
    startFileUploading: (state, { payload }) => {
      const { groupId, fileId, requestToken, onUploadingFileCancelled } =
        payload;
      state[groupId].files = state[groupId].files.map((f) => {
        if (f.id !== fileId) return f;
        f.requestToken = requestToken;
        f.progress = 0;
        f.status = MEDIA_UPLOAD_STATUSES.IN_PROGRESS;
        f.onUploadingFileCancelled = onUploadingFileCancelled;
        return f;
      });
    },
    setFileUpoadingProgress: (state, { payload }) => {
      const { groupId, fileId, progress, ...rest } = payload;
      if (state[groupId]) {
        state[groupId].progress =
          (state[groupId].files.reduce((pv, cv) => {
            return pv + cv.progress;
          }, 0) /
            state[groupId]?.files?.length) |
          0;
        state[groupId].files = state[groupId].files.map((f) => {
          const isVideo = attrAccept({ type: f.type }, 'video/*');
          return f.id !== fileId
            ? { ...f, type: isVideo ? 'video/mp4' : f.type }
            : { ...f, progress, ...rest, type: isVideo ? 'video/mp4' : f.type };
        });
      }
    },
    onFileUpoadingFailed: (state, { payload }) => {
      const { groupId, fileId, onFileUploadingFailed, ...rest } = payload;
      const group = { ...state[groupId] };
      if (group) {
        let gFiles = group?.files;
        gFiles = (gFiles || []).map((f) => {
          return f.id !== fileId
            ? f
            : { ...f, ...rest, status: MEDIA_UPLOAD_STATUSES.FAILED };
        });
        let failedFiles = 0;
        let isUploadingProcessCompleted = true;
        (gFiles || []).forEach((f) => {
          if (f.status === MEDIA_UPLOAD_STATUSES.FAILED) {
            failedFiles = failedFiles + 1;
          } else if (
            f.status === MEDIA_UPLOAD_STATUSES.IN_PROGRESS ||
            f.status === MEDIA_UPLOAD_STATUSES.ENCODING
          ) {
            isUploadingProcessCompleted = false;
          }
          return {
            ...f,
          };
        });
        state[groupId].files = gFiles;
        const fileGroup = current(state[groupId]);

        onFileUploadingFailed?.({
          groupId,
          group: fileGroup,
          groupFiles: gFiles,
          fileId: fileId,
          isUploadingProcessCompleted,
          isAllFailed: failedFiles === gFiles?.length,
        });
      }
    },

    onFileUploadingCancelled: (state, { payload }) => {
      const {
        groupId,
        fileId,
        callBack,
        removeOnCancel = true,
        onCompletedCallback,
        ...rest
      } = payload;
      const group = state?.[groupId];
      if (group) {
        const cancelledFileIndex = group.files.findIndex(
          (f) => f.id === fileId,
        );
        if (cancelledFileIndex > -1) {
          const groupFiles = group.files;

          // if (removeOnCancel) {
          groupFiles.splice(cancelledFileIndex, 1);
          // }

          // let isAllCancelled = true;
          if (!!groupFiles?.length) {
            let completedFiles = 0;
            groupFiles.map((f) => {
              if (
                f.status === MEDIA_UPLOAD_STATUSES.COMPLETED &&
                f.id !== fileId
              ) {
                completedFiles = completedFiles + 1;
              }
              return {
                ...f,
              };
            });

            group.progress =
              (groupFiles.reduce((pv: number, cv: Record<string, any>) => {
                return pv + cv.progress;
              }, 0) /
                groupFiles?.length) |
              0;
            group.numberOfCompletedFiles = completedFiles;
            group.status =
              group.numberOfCompletedFiles === groupFiles?.length
                ? MEDIA_UPLOAD_STATUSES.COMPLETED
                : MEDIA_UPLOAD_STATUSES.IN_PROGRESS;
            group.files = groupFiles;
          } else {
            group.status = MEDIA_UPLOAD_STATUSES.CANCELLED;
            group.numberOfCompletedFiles = 0;
            group.progress = 0;
            group.files = [];
          }
          state[groupId] = group;
          const isAllCancelled =
            group?.status === MEDIA_UPLOAD_STATUSES.CANCELLED;
          const isAllUploaded =
            group?.status === MEDIA_UPLOAD_STATUSES.COMPLETED;

          callBack?.({
            groupId: groupId,
            group: group,
            groupFiles: group?.files,
            isAllCancelled,
            isAllUploaded,
            isInprogress: group?.status === MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
          });
        }
      }
    },
    onRemoveGroup: (state, { payload }) => {
      const { groupId } = payload;
      if (state?.[groupId]) {
        delete state[groupId];
      }
    },
    onUpdateUploadingFiles: (state, { payload }) => {
      const { groupId, fileId, callBack } = payload;
      let isGroupDeleted = true;
      if (state?.[groupId]) {
        if (state?.[groupId]?.files?.length === 1) {
          delete state[groupId];
          isGroupDeleted = true;
        } else {
          state[groupId].files = state[groupId].files.filter((f) => {
            return f.id !== fileId;
          });
          isGroupDeleted = false;
        }
      }
      callBack?.(isGroupDeleted, groupId, fileId);
    },
    onFileUpoadingComplete: (state, { payload }) => {
      const { onCompletedCallback, onSingleFileUpload } = payload;
      const { groupId, fileId, ...rest } = payload;
      if (!!state?.[groupId]?.files?.length) {
        state[groupId].files = state[groupId].files.map((f) => {
          const isVideo = attrAccept({ type: f.type }, 'video/*');
          if (f.id !== fileId) {
            return { ...f, type: isVideo ? 'video/mp4' : f.type };
          }
          onSingleFileUpload?.({
            ...f,
            ...rest,
            type: isVideo ? 'video/mp4' : f.type,
            status: MEDIA_UPLOAD_STATUSES.COMPLETED,
            progress: 100,
          });
          return {
            ...f,
            ...rest,
            type: isVideo ? 'video/mp4' : f.type,
            status: MEDIA_UPLOAD_STATUSES.COMPLETED,
            progress: 100,
          };
        });

        state[groupId].progress =
          (state[groupId].files.reduce((pv, cv) => {
            return pv + cv.progress;
          }, 0) /
            state[groupId]?.files?.length) |
          0;

        state[groupId].numberOfCompletedFiles =
          (state[groupId]?.numberOfCompletedFiles! | 0) + 1;

        state[groupId].status =
          state[groupId].numberOfCompletedFiles === state[groupId].files.length
            ? MEDIA_UPLOAD_STATUSES.COMPLETED
            : MEDIA_UPLOAD_STATUSES.IN_PROGRESS;

        if (
          state[groupId].status === MEDIA_UPLOAD_STATUSES.COMPLETED &&
          onCompletedCallback
        ) {
          const fileGroup = current(state[groupId]);
          setTimeout(() => {
            onCompletedCallback(fileGroup);
          }, 1000);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(uploadFiles.fulfilled, (state, { payload }) => {
      // Add user to the state array
      for (const files in payload) {
        state[files] = payload[files];
      }
    });
  },
});
const groups = (state: RootState) => {
  return state?.fileGroups;
};
// Extract the action creators object and the reducer
const { reducer, actions } = filesSlice;
export const selectGroupBykey = createSelector(
  [groups, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return groups?.[groupKey];
  },
);
export const checkIfGropExist = createSelector(
  [groups, (state: RootState, groupKey: string) => groupKey],
  (groups, groupKey) => {
    return Object.keys(groups?.[groupKey] || {})?.length > 0;
  },
);
export const {
  startGroupUploading,
  startFileUploading,
  setFileUpoadingProgress,
  onFileUpoadingFailed,
  onFileUpoadingComplete,
  onUpdateUploadingFiles,
  onFileUploadingCancelled,
  onRemoveGroup,
} = actions;

export default reducer;
