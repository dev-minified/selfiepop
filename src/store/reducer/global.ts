//// Example
import { createSlice } from '@reduxjs/toolkit';

interface IAppState {
  applyThemeModal?: { active: boolean; edit: boolean };
  loading: boolean;
  publicUser?: any;
  emailNotificationClosedByUser?: boolean;
  socialLinks?: SocialLink[];
  showWelcomeModel: boolean;
  userCards?: any[];
  primaryCard?: any;
  selectedLibraryMedia: any[];
}

const initialState: IAppState = {
  loading: false,
  socialLinks: [],
  showWelcomeModel: false,
  userCards: [],
  primaryCard: null,
  selectedLibraryMedia: [],
};

const setLibraryMediaItems = ({
  items,
  state,
  editPost,
}: {
  items: any;
  state: any;
  editPost: boolean;
}) => {
  const mediItems = { ...(items || {}) };
  let mediaArray: any = [...(state || [])];

  if (!!mediaArray?.length) {
    mediaArray.forEach((element: any) => {
      if (!!mediItems[element?._id]) {
        mediItems[element?._id] = {
          ...element,
          ...mediItems[element?._id],
        };
      }
    });
  }
  let values: string[] = Object.values(mediItems || {});
  const addMoreMedia = values.map((ele: any) => {
    return {
      type: ele?.fileType,
      name: ele?.ogFileName,
      ...ele,
    };
  });
  if (editPost) return addMoreMedia;
  else return [...mediaArray, ...addMoreMedia];
};
export const headerSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setUserCards: (state, { payload }) => {
      state.userCards = payload;
    },
    setPrimaryCard: (state, { payload }) => {
      state.primaryCard = payload;
    },
    setSocialLinks: (state, { payload }) => {
      state.socialLinks = payload;
    },
    setPublicUser: (state, { payload }) => {
      state.publicUser = payload;
    },
    setEmailNotificationClosedByUser: (state, { payload }) => {
      state.emailNotificationClosedByUser = payload;
    },
    setWecomeModelState: (state, { payload }) => {
      state.showWelcomeModel = payload;
    },
    setApplyThemeModal: (state, { payload }) => {
      state.applyThemeModal = {
        active: payload?.active,
        edit: payload?.edit || false,
      };
    },
    restGlobalState: (state) => {
      state = initialState;
    },
    setLibraryMedia: (state, action) => {
      let itemsArray: any = [...(state?.selectedLibraryMedia || [])];
      const callback = action?.payload?.callback;
      const mediaArray = setLibraryMediaItems({
        items: action.payload.items,
        editPost: action.payload.editPost,
        state: itemsArray,
      });
      callback?.(mediaArray);
      state.selectedLibraryMedia = mediaArray;
    },
    resetLibraryMedia: (state) => {
      state.selectedLibraryMedia = [];
    },
    setLibrarymediaItems: (state, action) => {
      state.selectedLibraryMedia = action.payload.items;
    },
    updateibraryMedia: (state, action) => {
      let itemsArray: any = [...(state?.selectedLibraryMedia || [])];
      const callback = action?.payload?.callback;
      const mediaArray = setLibraryMediaItems({
        items: action.payload.items,
        editPost: action.payload.editPost,
        state: itemsArray,
      });
      callback?.(mediaArray);
      state.selectedLibraryMedia = mediaArray;
    },
  },
  //   extraReducers: (builder) => {},
});

const { actions, reducer } = headerSlice;

export const {
  setLoading,
  setLibraryMedia,
  setSocialLinks,
  resetLibraryMedia,
  setPublicUser,
  setEmailNotificationClosedByUser,
  setWecomeModelState,
  setApplyThemeModal,
  updateibraryMedia,
  restGlobalState,
  setUserCards,
  setLibrarymediaItems,
  setPrimaryCard,
} = actions;

export default reducer;
