import { update } from 'api/User';
import {
  createTheme,
  getAllThemes,
  getTheme,
  getThemeCategories,
  updateTheme,
} from 'api/theme';
import NewButton from 'components/NButton';
import Select from 'components/Select';
import { RequestLoader } from 'components/SiteLoader';
import FocusInput from 'components/focus-input';
import SwitchboxWidget from 'components/switchboxWidget';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { setApplyThemeModal } from 'store/reducer/global';
import {
  setCurrentTheme,
  setCategories as setThemeCategories,
} from 'store/reducer/theme';
import styled from 'styled-components';
import mergeDeep, { parseQuery } from 'util/index';
import * as yup from 'yup';
import AdditionColorEditor from './components/Editor/AdditionColorEditor';
import AdditionFontOptions from './components/Editor/AdditionalFontOptions';
import BackGroundEditor from './components/Editor/BackgroupEditor';
import { default as ButtonColorEditor } from './components/Editor/ButtonColorEditor';
import ButtonStyleList from './components/Editor/ButtonStyleList';
import ChatEditor from './components/Editor/ChatEditor';
import FontPicker from './components/Editor/FontPicker';
import ProfileImageEditor from './components/Editor/ProfileImageEditor';
import SocialIcon from './components/Editor/SocialIcon';
import './theme-editor.module.css';
const validationSchema = yup.object().shape({
  name: yup.string().required('Provide theme name'),
});
const GalleryLoader = styled(RequestLoader)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const initialValues: {
  buttonStyle?: any;
  profile: ITheme['profile'] & { pstyle: string; profileImage?: string };
  category?: { label: string; value: string };
} & ITheme = {
  categoryId: '',
  name: 'New Theme',
  background: {
    videoOpacity: 100,
    patternColor: '#000000ff',
    opacity: 100,
    imageBlendMode: '',
    videoBlendMode: '',
    colorBlendMode: '',
    imageOpacity: 100,
    colorOpacity: 100,
  },
  cover: { isActive: false, size: 'default' },
  profile: {
    isActive: true,
    useProfileImage: true,
    pstyle: 'outline-soft-shadow-cirule',
    size: 'default',
    backgroundColor: '#ffffffff',
    opacity: 100,
    grayscale: 0,
    backgroundColorHistory: [],
    outlineColor: '#ffffffff',
    outlineColorHistory: [],
    blendMode: '',
    avatarPlaceholderColor: 'var(--pallete-primary-main)',
    avatarPlaceholderColorHistory: [],
    profileVideo: {
      desktop: '',
      mobile: '',
      active: false,
    },
  },
  buttonStyle: { style: 'filled-soft-shadow-soft-square' },
  additional: {
    titleSize: '22px',
    titleColor: '#000000',
    titleColorHistory: [],
    taglineSize: '18px',
    taglineColor: '#000000',
    taglineColorHistory: [],
    descriptionSize: '16px',
    descriptionColor: '#000000',
    descriptionColorHistory: [],
    sectionTitleSize: '19px',
    sectionTitleColor: '#000000',
    sectionTitleColorHistory: [],
    iconPrimaryColor: 'var(--pallete-primary-main)',
    iconPrimaryColorHistory: [],
    iconSecondaryColor: 'var(--pallete-primary-main)',
    iconSecondaryColorHistory: [],
  },
  chat: {
    titleSize: '22px',
    titleColor: '#000000',
    titleColorHistory: [],
    descriptionSize: '16px',
    descriptionColor: '#000000',
    descriptionColorHistory: [],
    subtype: 'solid',
    solidColor: 'rgba(255, 255, 255, 0.7)',
    solidColorHistory: [],
    inputsBackground: '#fff',
    inputsBackgroundHistory: [],
    inputsTextColor: '#000',
    inputsTextColorHistory: [],
    placeholderColor: '#9b9b9b',
    placeholderColorHistory: [],
    inputSvgColor: '#9b9b9b',
    inputSvgColorHistory: [],
    inputBorderColor: '#000',
    inputBorderColorHistory: [],
    inputBorderStyle: { label: 'Solid', value: 'solid' },
    inputErrorColor: '#f00',
  },
  button: {
    buttonRollOverColor: 'var(--pallete-primary-main)',
    textColor: '#000000ff',
    textRollOverColor: '#ffffffff',
    shadowColor: '#0000001a',
    style: 'filled-soft-shadow-soft-square',
    buttonColorHistory: [],
    buttonColor: '#f6f2f2ff',
    textColorHistory: [],
    shadowColorHistory: [],
    buttonRollOverColorHistory: [],
    shadowRollOverColor: '#efe4e4ff',
    shadowRollOverColorHistory: [],
    textRollOverColorHistory: [],
  },
  font: {
    id: '',
    family: 'Roboto',
    variants: ['100', '300', 'regular', '500', '700', '900'],
    subsets: [
      'cyrillic',
      'cyrillic-ext',
      'greek',
      'greek-ext',
      'latin',
      'latin-ext',
      'vietnamese',
    ],
    version: 'v27',
    lastModified: '2021-04-05',
    category: 'sans-serif',
    kind: 'webfonts#webfont',
  },
  socialIcon: { iconColor: '#4a90e2', iconColorHistory: [] },
  isActive: true,
  isPublished: false,
  isDefault: false,
};
function ThemeEditor({ className }: { className?: string }): ReactElement {
  const { user, setUser } = useAuth();
  const history = useHistory();
  const theme = useAppSelector((state) => state.theme?.current);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [activeTheme, setActiveTheme] = useState<ITheme>();
  const [isloading, setIsLoading] = useState<boolean>();
  const { themeId, systemThemeCreate: isSystemThemeCreate } = parseQuery(
    location.search,
  );

  const {
    values,
    handleChange,
    setValues,
    setFieldValue,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues,
    validateOnChange: true,
    onSubmit: async (values) => {
      const { category, ...rest } = values;
      const newTheme = {
        ...theme,
        ...rest,
        button: { ...rest.button, ...rest.buttonStyle },
        profile: { ...rest?.profile, style: rest?.buttonStyle?.style },
      };
      const profileImage = newTheme?.profile?.profileImage;
      //Delete extra keys before sending
      delete newTheme?.profile?.profileImage;
      try {
        let res;
        if (!theme?._id) {
          res = await createTheme({
            ...newTheme,
            isSystemTheme:
              isSystemThemeCreate === 'true' && !!user?.enableSystemThemeAccess,
            baseURL: `${window.location.host}/${user.username}`,
            isActive: true,
            categoryId: category?.value || '',
          });
        } else {
          res = await updateTheme(theme?._id, {
            ...newTheme,
            isActive: true,
            baseURL: `${window.location.host}/${user.username}`,
            categoryId: category?.value,
          });
        }

        let updatedUser = user;
        updatedUser = await update({ profileImage }).then(({ data }) => data);
        if (res?.theme) {
          setUser({ ...user, ...updatedUser, userThemeId: res.theme });
        }
        history.push(
          isSystemThemeCreate === 'true'
            ? '/theme-library'
            : '/my-profile/themes-listing',
        );
      } catch (e) {}
    },
  });

  async function getAllcategeries() {
    try {
      const response = await getThemeCategories();

      if (response.success) {
        const { items } = response;
        const updatedItems = items.map((item: Record<string, any>) => ({
          label: item.name,
          value: item._id,
        }));
        setCategories(updatedItems);
        dispatch(setThemeCategories(items));
        return updatedItems;
      }
      return [];
    } catch (error) {
      return [];
    }
  }
  useEffect(() => {
    setIsLoading(true);
    getAllcategeries();
    dispatch(
      setApplyThemeModal({
        active: true,
        edit: true,
      }),
    );
    return () => {
      dispatch(
        setApplyThemeModal({
          active: false,
          edit: false,
        }),
      );
      dispatch(setCurrentTheme(undefined));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (themeId) {
      getTheme(themeId as string)
        .then(async (res) => {
          setIsLoading(false);
          if (res.theme?._id) {
            const { button, ...rest } = res.theme;

            setTimeout(() => {
              setValues((v) => {
                return mergeDeep(
                  {
                    ...v,
                    button,
                    buttonStyle: { style: button?.style },
                    category: rest?.categoryId?._id
                      ? {
                          value: rest?.categoryId?._id,
                          label: rest?.categoryId?.name,
                        }
                      : categories[0],
                  },
                  rest,
                ) as any;
              });
            }, 500);
            setActiveTheme(res.theme);
          }
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
      // );
    } else {
      // withLoader(
      getAllThemes({ isDefault: true })
        .then(async (res) => {
          setIsLoading(false);
          const defaultTheme = res?.systemTheme?.items?.[0];
          delete defaultTheme._id;
          if (defaultTheme) {
            const { button, ...rest } = defaultTheme;

            delete rest.name;
            setTimeout(() => {
              setValues((v) => {
                return mergeDeep(
                  {
                    ...v,
                    button,
                    buttonStyle: { style: button?.style },
                    category: rest?.categoryId?._id
                      ? {
                          value: rest?.categoryId?._id,
                          label: rest?.categoryId?.name,
                        }
                      : categories[0],
                  },
                  { ...rest, isDefault: false },
                ) as any;
              });
            }, 500);
            setActiveTheme(defaultTheme);
          }
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId]);

  useEffect(() => {
    const newTheme = {
      ...values,
      button: { ...values.button, ...values.buttonStyle },
      profile: { ...values?.profile, style: values?.buttonStyle?.style },
    };

    dispatch(setCurrentTheme(newTheme));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const {
    name,
    background,
    button,
    additional,
    buttonStyle,
    font,
    profile,
    isPublished,
    isDefault,
    socialIcon,
    category,
    chat,
  } = values;

  return (
    <>
      {isloading ? (
        <GalleryLoader isLoading color="#D4008E" />
      ) : (
        <div style={{ height: '100%' }} className={className}>
          {/* <CoverImageEditor value={cover} name="cover" onChange={setFieldValue} /> */}
          <ProfileImageEditor
            value={profile}
            name="profile"
            onChange={setFieldValue}
            user={user}
          />
          <BackGroundEditor
            value={background}
            name="background"
            onChange={setFieldValue}
          />
          <ButtonStyleList
            value={buttonStyle}
            name="buttonStyle"
            onChange={setFieldValue}
          />
          <ButtonColorEditor
            value={button}
            name="button"
            onChange={setFieldValue}
          />
          <SocialIcon
            value={socialIcon}
            name="socialIcon"
            onChange={setFieldValue}
          />
          <AdditionColorEditor
            value={additional}
            name="additional"
            onChange={setFieldValue}
          />
          <AdditionFontOptions
            value={additional}
            name="additional"
            onChange={setFieldValue}
          />
          <ChatEditor value={chat} name="chat" onChange={setFieldValue} />
          <FontPicker value={font} name="font" onChange={setFieldValue} />
          <form onSubmit={handleSubmit}>
            <div className="block-actions">
              <span className="info-text d-block">*Changes have been made</span>
              <div className="px-20 py-20 card-actions px-sm-40">
                {isSystemThemeCreate === 'true' &&
                  !!user?.enableSystemThemeAccess && (
                    <>
                      <SwitchboxWidget
                        title="Publish This Theme"
                        status={false}
                        name="isPublished"
                        value={isPublished}
                        onChange={(e: any) =>
                          setFieldValue('isPublished', e.target.checked)
                        }
                      />
                      <SwitchboxWidget
                        title="Make this default"
                        status={false}
                        name="isDefault"
                        value={isDefault}
                        disabled={activeTheme?.isDefault ?? false}
                        onChange={(e: any) =>
                          setFieldValue('isDefault', e.target.checked)
                        }
                      />
                      {categories.length > 0 && (
                        <div className="select-wrap mb-45">
                          <Select
                            placeholder="Select category"
                            defaultValue={categories[0]}
                            value={category}
                            options={categories}
                            onChange={(value) => {
                              setFieldValue('category', value);
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                <div className="card-items">
                  <FocusInput
                    name="name"
                    label="Name Your Theme"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputClasses="mb-20"
                    touched={touched.name}
                    error={errors.name}
                    materialDesign
                  />
                  <div className="d-flex justify-content-between">
                    <NewButton
                      shape="circle"
                      type="info"
                      size="large"
                      htmlType="reset"
                      onClick={() =>
                        history.push(
                          isSystemThemeCreate === 'true'
                            ? '/theme-library'
                            : '/my-profile/themes-listing',
                        )
                      }
                    >
                      Cancel
                    </NewButton>
                    <NewButton
                      shape="circle"
                      size="large"
                      type="primary"
                      htmlType="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Save
                    </NewButton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default styled(ThemeEditor)`
  padding: 24px 18px;

  .block-actions {
    .info-text {
      text-align: center;
      color: var(--pallete-text-main);
      font-size: 14px;
      line-height: 16px;
      font-style: italic;
      margin: 0 0 5px;
    }

    .button {
      min-width: 166px;

      @media (max-width: 480px) {
        min-width: inherit;
        width: 50%;
      }
    }
  }
`;
