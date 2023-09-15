import { IMAGE_BLEND_OPTIONS, ImagesScreenSizes } from 'appconstants';
import {
  AddImage,
  ProfileDefault,
  ProfileLarge,
  ProfileMedium,
} from 'assets/svgs';
import ColorPicker from 'components/ColorPicker';
import ImageModifications from 'components/ImageModifications';
import NewButton from 'components/NButton';
import RadioGroup from 'components/RadioGroup';
import SimpleCard from 'components/SPCards/SimpleCard';
import Select from 'components/Select';
import UploadandEditor from 'components/UploadandEditor';
import Accordion from 'components/according';
import { default as SwitchBox } from 'components/switchbox';
import { ImagesSizes } from 'enums';
import useControlledState from 'hooks/useControlledState';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider/lib/Slider';
import { ReactElement } from 'react';
import { OpacitySlider } from './BackgroupEditor';
import { addColorHistory } from './helper';

interface Props {
  value?: ICover & { pstyle?: string; profileImage?: string };
  onChange?: Function;
  name?: string;
  user?: IUser;
}
const sizes = ImagesScreenSizes.profile;
const fallback = [ImagesSizes['64x64'], ImagesSizes['163x163']];
export default function ProfileImageEditor({
  value: initialValue,
  onChange,
  name,
  user,
}: Props): ReactElement {
  const [values, setValues] = useControlledState<
    ICover & { pstyle?: string; profileImage?: string }
  >(
    {
      size: 'default',
      useProfileImage: true,
      grayscale: 0,
      opacity: 100,
      backgroundColor: '#ffffffff',
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
    {
      value: initialValue,
      onChange: (newValue) => {
        onChange && onChange(name, newValue);
      },
    },
  );

  const handleChangeInput = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleActive = (e: any) => {
    const { name, checked } = e.target;
    setValues({ ...values, [name]: checked });
  };

  const onImageUpload = (res: any) => {
    setValues((v) => {
      return {
        ...v,
        profileImage: res.imageURL,
      };
    });
  };

  const {
    isActive,
    pstyle,
    size,
    profileImage,
    backgroundColor,
    opacity,
    grayscale,
    backgroundColorHistory,
    outlineColor,
    outlineColorHistory,
    blendMode,
    avatarPlaceholderColor,
    avatarPlaceholderColorHistory,
  } = values;

  const pImage = profileImage ?? user?.profileImage;
  const onColorHistoryChange = (name: string) => {
    setValues((prev: any) => {
      const key = `${name}History` as keyof typeof prev;
      const colorHistory = addColorHistory(
        prev[name] as string,
        prev[key!] as string[],
      );

      return { ...prev, [key]: colorHistory };
    });
  };
  return (
    <div>
      <SimpleCard
        classes={{
          card: 'profile-image-editor',
        }}
        header={
          <div className="profile-editor-header">
            <UploadandEditor
              url="/image/upload"
              // accept="image/*"
              accept={{ 'image/*': [] }}
              aspectRatio={1}
              onSuccess={onImageUpload}
              imageSizes={sizes}
              validation={{
                minWidth: 100,
                minHeight: 100,
                maxSize: 1024 * 1024 * 2,
              }}
              cropper={true}
            >
              <div className="profile-editor__image">
                <div className="profile-editor__add-image">
                  <AddImage />
                </div>
                <ImageModifications
                  imgeSizesProps={{
                    imgix: {
                      desktop: fallback[1],
                      mobile: fallback[0],
                    },
                  }}
                  src={pImage || '/assets/images/default-profile-img.svg'}
                  fallbackUrl={'/assets/images/default-profile-img.svg'}
                  alt="profile"
                />
              </div>
            </UploadandEditor>
            <div className="profile-editor__actions-area">
              <SwitchBox
                status={false}
                size="small"
                value={isActive}
                name="isActive"
                onChange={handleActive}
              />
              <h6>Profile Image</h6>
              <div className="btns">
                <UploadandEditor
                  url="/image/upload"
                  // accept="image/*"
                  aspectRatio={1}
                  imageSizes={sizes}
                  onSuccess={onImageUpload}
                  validation={{
                    minWidth: 100,
                    minHeight: 100,
                    maxSize: 1024 * 1024 * 2,
                  }}
                  cropper={true}
                >
                  <NewButton type={'primary'}>Upload Profile Image</NewButton>
                </UploadandEditor>

                <NewButton
                  outline
                  block
                  onClick={() => {
                    setValues((v) => {
                      return {
                        ...v,
                        profileImage: '',
                      };
                    });
                  }}
                >
                  Remove
                </NewButton>
              </div>
            </div>
          </div>
        }
      >
        <Accordion
          title="Advance Options"
          showIcon={false}
          indicator={<span className="icon-keyboard_arrow_left"></span>}
          alt
        >
          <div className="editor-section mb-25">
            <div className="editor-head">
              <h6>Profile Image Shape and Style</h6>
              <p className="cover-size-body">
                Completely customize your Pop Page. Change your background with
                colors, gradients and images.
              </p>
            </div>
            <div className="editor-section">
              <div className="editor-head">
                <h6>Outline Color</h6>
              </div>
              <div className="options-block">
                <ColorPicker
                  value={outlineColor}
                  colors={outlineColorHistory}
                  onChange={(value: string) =>
                    handleChangeInput({
                      target: { name: 'outlineColor', value },
                    })
                  }
                  onClose={() => onColorHistoryChange('outlineColor')}
                />
              </div>
              <div className="editor-head pt-30">
                <h6>Background Color</h6>
              </div>
              <div className="options-block">
                <ColorPicker
                  value={backgroundColor}
                  colors={backgroundColorHistory}
                  onChange={(value: string) =>
                    handleChangeInput({
                      target: { name: 'backgroundColor', value },
                    })
                  }
                  onClose={() => onColorHistoryChange('backgroundColor')}
                />
              </div>
              {user?.enableSystemThemeAccess && (
                <>
                  <div className="editor-head pt-30">
                    <h6>Default Avatar Placeholder Color</h6>
                  </div>
                  <div className="options-block">
                    <ColorPicker
                      value={avatarPlaceholderColor}
                      colors={avatarPlaceholderColorHistory}
                      onChange={(value: string) =>
                        handleChangeInput({
                          target: { name: 'avatarPlaceholderColor', value },
                        })
                      }
                      onClose={() =>
                        onColorHistoryChange('avatarPlaceholderColor')
                      }
                    />
                  </div>
                </>
              )}
              <div className="editor-head pt-30 ">
                <h6>Image Opacity</h6>
              </div>
              <OpacitySlider color={'#000'}>
                <Slider
                  min={0}
                  max={100}
                  value={opacity}
                  className={'slider-opacity video-opacity'}
                  onChange={(value) => {
                    handleChangeInput({ target: { name: 'opacity', value } });
                  }}
                />
                <div className="slider-val">{opacity || 0}%</div>
              </OpacitySlider>

              <div className="editor-head pt-30 ">
                <h6>Image Grey Scale</h6>
              </div>
              <OpacitySlider color={'#000'}>
                <Slider
                  min={0}
                  max={100}
                  value={grayscale}
                  className={'slider-opacity video-opacity'}
                  onChange={(value) => {
                    handleChangeInput({ target: { name: 'grayscale', value } });
                  }}
                />
                <div className="slider-val">{grayscale || 0}%</div>
              </OpacitySlider>
              <div className="editor-head pt-30">
                <h6>Blend Mode</h6>
              </div>
              <Select
                className="mb-30"
                defaultValue={IMAGE_BLEND_OPTIONS[0]}
                value={IMAGE_BLEND_OPTIONS.find(
                  (option) => option.value === blendMode,
                )}
                isSearchable={false}
                options={IMAGE_BLEND_OPTIONS}
                onChange={(value: any) => {
                  handleChangeInput({
                    target: { name: 'blendMode', value: value.value },
                  });
                }}
              />
            </div>
            <div className="image-options">
              <div className="options-block">
                <strong className="options-title">Outline</strong>
                <RadioGroup
                  name="pstyle"
                  classes={{
                    group: 'list-shape-options image-shape',
                    item: 'list-shape-options__item w-auto ',
                    active: 'selected',
                  }}
                  value={pstyle}
                  items={[
                    {
                      value: 'outlile-soft-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image radius"></div>
                        );
                      },
                    },
                    {
                      value: 'outlile-circule',
                      render: () => {
                        return (
                          <div className="list-button-options__image square"></div>
                        );
                      },
                    },
                    {
                      value: 'outlile-sharp-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image"></div>
                        );
                      },
                    },
                  ]}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="options-block">
                <strong className="options-title">Solid</strong>
                <RadioGroup
                  name="pstyle"
                  classes={{
                    group: 'list-shape-options image-shape',
                    item: 'list-shape-options__item w-auto ',
                    active: 'selected',
                  }}
                  value={pstyle}
                  items={[
                    {
                      value: 'filled-soft-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image solid radius"></div>
                        );
                      },
                    },
                    {
                      value: 'filled-circule',
                      render: () => {
                        return (
                          <div className="list-button-options__image solid square"></div>
                        );
                      },
                    },
                    {
                      value: 'filled-sharp-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image solid"></div>
                        );
                      },
                    },
                  ]}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="options-block">
                <strong className="options-title">Soft Shadow</strong>
                <RadioGroup
                  name="pstyle"
                  classes={{
                    group: 'list-shape-options image-shape',
                    item: 'list-shape-options__item w-auto ',
                    active: 'selected',
                  }}
                  value={pstyle}
                  items={[
                    {
                      value: 'outline-soft-shadow-soft-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image btn-shadow radius"></div>
                        );
                      },
                    },
                    {
                      value: 'outline-soft-shadow-cirule',
                      render: () => {
                        return (
                          <div className="list-button-options__image btn-shadow square"></div>
                        );
                      },
                    },
                    {
                      value: 'outline-soft-shadow-hard-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image btn-shadow"></div>
                        );
                      },
                    },
                  ]}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="options-block">
                <strong className="options-title">Hard Shadow</strong>
                <RadioGroup
                  name="pstyle"
                  classes={{
                    group: 'list-shape-options image-shape',
                    item: 'list-shape-options__item w-auto ',
                    active: 'selected',
                  }}
                  value={pstyle}
                  items={[
                    {
                      value: 'outline-hard-shadow-soft-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image btn-solid-shadow radius"></div>
                        );
                      },
                    },
                    {
                      value: 'outline-hard-shadow-cirule',
                      render: () => {
                        return (
                          <div className="list-button-options__image btn-solid-shadow square"></div>
                        );
                      },
                    },
                    {
                      value: 'outline-hard-shadow-hard-square',
                      render: () => {
                        return (
                          <div className="list-button-options__image btn-solid-shadow"></div>
                        );
                      },
                    },
                  ]}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
          </div>
          <div className="editor-section">
            <div className="editor-head">
              <h6>Profile Image Size</h6>
              <p className="cover-size-body">
                Completely customize your Pop Page. Change your background with
                colors, gradients and images. Choose a size and position.
              </p>
            </div>
            <div className="options-block">
              <strong className="options-title">Size</strong>
              <RadioGroup
                name="size"
                classes={{
                  group: 'list-shape-options',
                  item: 'list-shape-options__item w-auto ',
                  active: 'selected',
                }}
                value={size}
                items={[
                  {
                    value: 'default',
                    render: () => {
                      return (
                        <div>
                          {/* tslint:disable-next-line: max-line-length*/}
                          <div className="list-shape-options__image list-shape-options__image--size">
                            <ProfileDefault />
                          </div>
                          <span className="list-shape-options__text">
                            Default
                          </span>
                        </div>
                      );
                    },
                  },
                  {
                    value: 'medium',
                    render: () => {
                      return (
                        <div>
                          {/* tslint:disable-next-line: max-line-length*/}
                          <div className="list-shape-options__image list-shape-options__image--size">
                            <ProfileMedium />
                          </div>
                          <span className="list-shape-options__text">
                            Medium
                          </span>
                        </div>
                      );
                    },
                  },
                  {
                    value: 'large',
                    render: () => {
                      return (
                        <div>
                          <div className="list-shape-options__image list-shape-options__image--size">
                            <ProfileLarge />
                          </div>
                          <span className="list-shape-options__text">
                            Large
                          </span>
                        </div>
                      );
                    },
                  },
                ]}
                onChange={handleChangeInput}
              />
            </div>
          </div>
        </Accordion>
      </SimpleCard>
    </div>
  );
}
