import { getLibrary } from 'api/theme';
import {
  IMAGE_BLEND_OPTIONS,
  ImagesScreenSizes,
  initialPallet,
} from 'appconstants';
import { AddImage, AddVideo, RecycleBin } from 'assets/svgs';
import ColorPicker from 'components/ColorPicker';
import { AppAlert } from 'components/Model';
import NButton, {
  default as Button,
  default as NewButton,
} from 'components/NButton';
import RadioGroup from 'components/RadioGroup';
import SimpleCard, { CardSection } from 'components/SPCards/SimpleCard';
import Select from 'components/Select';
import According from 'components/according';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import Switchbox from 'components/switchbox';
import { ImageLayoutOptions } from 'enums';
import useAuth from 'hooks/useAuth';
import useControlledState from 'hooks/useControlledState';
import useOpenClose from 'hooks/useOpenClose';
import { GradientPicker } from 'lib/ReactLinearGradientPicker/src/index';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider/lib/Slider';
import { SketchPicker } from 'react-color';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';
import 'styles/theme-editor.css';
import {
  arrayFind,
  getGradient,
  getImageURL,
  getUrlParts,
  isValidUrl,
  rgbToRgba,
} from 'util/index';
import BackgroundImageSelector from './BackgroundImageSelector';
import ThemeCard from './ThemeCard';
import { addColorHistory } from './helper';

const CustomModal = styled(Model)`
  height: calc(100vh - 56px);
  &.modal-dialog {
    max-width: 700px;
  }
  .modal-content {
    height: 100%;
    background: none;
  }
  .card {
    border: none;
  }
`;

export const OpacitySlider = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  .slider-val {
    width: 53px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid var(--pallete-colors-border);
    background: var(--pallete-background-default);
    font-size: 15px;
    line-height: 18px;
    padding: 9px 5px;
    text-align: center;
  }

  .slider-opacity {
    width: calc(100% - 124px);
  }

  .rc-slider.slider-opacity {
    height: 36px;
    padding: 0;
    margin: 0 19px;
  }

  .rc-slider.slider-opacity .rc-slider-rail {
    background: url(../../assets/images/profile-editor/bg-pattern.png);
    height: 100%;
    border-radius: 36px;
    margin: 0 -19px;
    width: calc(100% + 40px);
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        rgba(95, 95, 255, 0) 0%,
        ${({ color }) => color} 100%
      );
    }
  }

  .rc-slider.slider-opacity .rc-slider-step {
    height: 100%;
  }

  .rc-slider.slider-opacity .rc-slider-track {
    display: none;
  }

  .rc-slider.slider-opacity .rc-slider-handle {
    width: 32px;
    height: 32px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
    background: #000;
    border: 3px solid #fff;
    border-radius: 100%;
    margin: 2px 0 0;
  }
`;

const ColorSelector = styled.div`
  @media (max-width: 1023px) {
    .theme-card.create,
    .theme-card {
      min-height: inherit;
      padding-top: 150%;
      padding-bottom: 0;

      .theme-card-image,
      .theme-card-inner {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        max-height: inherit;
      }

      .theme-card-inner {
        &:before {
          inset: 2px;
        }
      }
    }
  }
`;

interface Props {
  value?: IBackground;
  onChange: Function;
  name?: string;
  className?: string;
}

const ImageOptions = [
  {
    label: 'Fit to page',
    value: ImageLayoutOptions.FIT,
  },
  {
    label: 'Tile',
    value: ImageLayoutOptions.TITLE,
  },
  {
    label: 'Top Center',
    value: ImageLayoutOptions.TOP,
  },
  {
    label: 'Middle Center',
    value: ImageLayoutOptions.MIDDLE,
  },
  {
    label: 'Bottom Center',
    value: ImageLayoutOptions.BOTTOM,
  },
  {
    label: 'Top Cover',
    value: ImageLayoutOptions.TOP_COVER,
  },
  {
    label: 'Middle Cover',
    value: ImageLayoutOptions.MIDDLE_COVER,
  },
  {
    label: 'Bottom Cover',
    value: ImageLayoutOptions.BOTTOM_COVER,
  },
];
const sizes = ImagesScreenSizes.themeBackgroundImage;

const WrappedSketchPicker = ({ onSelect, deleteActiveColor, ...rest }: any) => {
  return (
    <div className="colorpicker-wrap">
      <SketchPicker
        {...rest}
        color={rgbToRgba(rest.color, rest.opacity)}
        onChange={(c) => {
          const { r, g, b, a } = c.rgb;
          onSelect(`rgb(${r}, ${g}, ${b})`, a);
        }}
        width={255}
      />
      <Button
        type="primary"
        size="x-small"
        block
        icon={<RecycleBin />}
        onClick={deleteActiveColor}
      />
    </div>
  );
};
const CommonComponent = ({
  title,
  opacity,
  blondModeValue,
  setFieldValue,
  opacityKey,
  blondmodeKey,
  imageBlur,
  blurKey,
}: any) => {
  return (
    <div className="common_settings">
      <div className="editor-head pt-20 mb-15">
        <h6>{title} Opacity</h6>
      </div>
      <OpacitySlider color={'#000'}>
        <Slider
          min={0}
          max={100}
          value={opacity}
          className={'slider-opacity video-opacity'}
          onChange={(value) => {
            setFieldValue([opacityKey], value);
          }}
        />
        <div className="slider-val">{opacity || 0}%</div>
      </OpacitySlider>
      {title === 'Image' && (
        <>
          <div className="editor-head pt-20 mb-15">
            <h6>{title} blur</h6>
          </div>
          <OpacitySlider color={'#ccc'}>
            <Slider
              min={0}
              max={100}
              value={imageBlur}
              className={'slider-opacity video-opacity'}
              onChange={(value) => {
                setFieldValue(blurKey, value);
              }}
            />
            <div className="slider-val">{imageBlur || 0}%</div>
          </OpacitySlider>
        </>
      )}
      <div className="editor-head pt-20 mb-15">
        <h6>{title} Blend Mode</h6>
      </div>
      <Select
        className="mb-10"
        defaultValue={IMAGE_BLEND_OPTIONS[0]}
        value={IMAGE_BLEND_OPTIONS.find(
          (option) => option.value === blondModeValue,
        )}
        isSearchable={false}
        options={IMAGE_BLEND_OPTIONS}
        onChange={(value: any) => {
          setFieldValue([blondmodeKey], value.value);
        }}
      />
    </div>
  );
};

const getVideoThumb = (video?: string) => {
  if (!!video && isValidUrl(video)) {
    try {
      const url = new URL(video);
      const videoId = url.searchParams.get('v');
      const { pathname, companyName } = getUrlParts(video);
      if (companyName === 'vimeo' && pathname) {
        return `https://vumbnail.com${pathname}.jpg`;
      }
      return videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : '';
    } catch (e) {
      return '';
    }
  }

  return '';
};

const BackgroundEditor = ({
  value: initialValue,
  onChange,
  name,
  className,
}: Props) => {
  const { user, setUser } = useAuth();
  const [values, setValues] = useControlledState<IBackground>(
    {
      type: undefined,
      subtype: undefined,
    },
    {
      value: initialValue,
      onChange: (newValue) => {
        onChange && onChange(name, newValue);
      },
    },
  );

  const [isGallaryOpen, onOpenGallary, onCloseGallary] = useOpenClose(false);

  const setFieldValue = (name: string, value: any) => {
    setValues((v) => ({ ...v, [name]: value }));
  };
  const onColorHistoryChange = (name: keyof IBackground) => {
    setValues((prev) => {
      const key = `${name}History` as keyof typeof prev;
      const colorHistory = addColorHistory(
        prev[name] as string,
        prev[key!] as string[],
      );

      return { ...prev, [key]: colorHistory };
    });
  };

  const {
    type,
    subtype = 'solid',
    solidColor = '#fff',
    solidColorHistory,
    video,
    pattern,
    patternColor,
    patternColorHistory = [],
    layout,
    image,
    gradient,
    videoOpacity,
    imageOpacity = 100,
    imageBlur = 0,
    videoBlendMode,
    imageBlendMode,
    patternOpacity = 100,
    isPatternActive = false,
  } = values;

  const { url, fallbackUrl } = getImageURL({
    url: image,
    settings: {
      onlysMobile: true,
    },
  });

  return (
    <div className={className}>
      <SimpleCard
        classes={{ header: 'theme-cover-img-card-header card-background' }}
      >
        <div className="color-selector-container pb-0">
          <div className="editor-head mb-10">
            <h5 className="font-weight-medium">Background</h5>
            <p className="cover-size-body mb-10">
              Completely customize your Pop Page. Change your background with
              colors, gradients and images. Choose a button style, change the
              typeface and more.
            </p>
          </div>
          <strong className="options-title">Styles</strong>
          <ColorSelector className="color-selector-cards row mx-n5 mx-sm-n10">
            <div className="col-4 px-5 px-md-10 mb-20">
              <ThemeCard
                selected={type === 'color'}
                gradient={getGradient(subtype, gradient, solidColor)}
                title="Color"
                footerIcons={{ edit: false, add: false }}
                onClick={() => {
                  setValues({
                    ...values,
                    type: 'color',
                    subtype: subtype || 'solid',
                  });
                }}
              />
            </div>
            <div className="col-4 px-5 px-md-10 mb-20">
              <ThemeCard
                selected={type === 'image'}
                create={!image}
                fallbackUrl={image ? fallbackUrl : image}
                cardIcon={<AddImage />}
                title="Image"
                image={url}
                showRemoveIcon
                onDeleteClick={() => {
                  AppAlert({
                    title: 'Are you sure?',
                    text: 'Once deleted, you will not be able to recover this!',
                    buttons: ['', { text: 'Delete', closeModal: false }],
                    onConfirm: async () => {
                      setFieldValue('image', null);
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //  @ts-ignore-block
                      swal?.close();
                    },
                  });
                }}
                footerIcons={{ edit: false, add: false }}
                onClick={() => {
                  setFieldValue('type', 'image');
                }}
              />
            </div>
            <div
              id="sp_test_theme_video_bg_button"
              className="col-4 px-5 px-md-10 mb-20"
            >
              <ThemeCard
                selected={type === 'video'}
                create={!video}
                cardIcon={<AddVideo />}
                title="Video Background"
                showRemoveIcon
                image={getVideoThumb(video)}
                onDeleteClick={() => {
                  AppAlert({
                    title: 'Are you sure?',
                    text: 'Once deleted, you will not be able to recover this!',
                    buttons: ['', { text: 'Delete', closeModal: false }],
                    onConfirm: async () => {
                      setFieldValue('video', null);
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //  @ts-ignore-block
                      swal?.close();
                    },
                  });
                }}
                footerIcons={{ edit: false, add: false }}
                onClick={() => setFieldValue('type', 'video')}
              />
            </div>
          </ColorSelector>
          {type === 'color' && (
            <div className="pb-20">
              <div className="theme-editor-actions">
                <div className="action">
                  <NewButton
                    type={subtype === 'solid' ? 'primary' : undefined}
                    block
                    onClick={() => {
                      setFieldValue('subtype', 'solid');
                    }}
                  >
                    Solid
                  </NewButton>

                  <NewButton
                    type={subtype === 'gradient' ? 'primary' : undefined}
                    block
                    onClick={() => {
                      setFieldValue('subtype', 'gradient');
                    }}
                  >
                    Gradient
                  </NewButton>
                </div>
              </div>
              <div className="color-selectors">
                {subtype === 'gradient' && (
                  <div className="gradient-picker">
                    <GradientPicker
                      {...{
                        width: isMobileOnly ? 200 : 280,
                        paletteHeight: 32,
                        maxStops: 20,
                        palette: gradient?.pallette || initialPallet,
                        onPaletteChange: (value: any) => {
                          setFieldValue('gradient', {
                            ...gradient,
                            pallette: value,
                          });
                        },
                        angle: gradient?.angle || 90,
                        setAngle: (value: any) =>
                          setFieldValue('gradient', {
                            ...gradient,
                            angle: value,
                          }),
                      }}
                    >
                      <WrappedSketchPicker />
                    </GradientPicker>
                  </div>
                )}
                {subtype === 'solid' && (
                  <div className="color-selector options-block mt-20">
                    <strong className="mb-15 sub-title">
                      Solid Background Color
                    </strong>
                    <ColorPicker
                      value={values.solidColor || '#ffffff'}
                      colors={solidColorHistory}
                      onChange={(value: string) => {
                        setFieldValue('solidColor', value);
                      }}
                      onClose={() => onColorHistoryChange('solidColor')}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {type === 'image' && (
            <div className="pb-20">
              <div className="theme-editor-actions">
                <div className="action">
                  <NButton onClick={onOpenGallary} block type="primary">
                    Upload an Image
                  </NButton>
                  <NButton
                    block
                    onChange={() => {
                      setFieldValue('image', null);
                    }}
                  >
                    Remove
                  </NButton>
                </div>
              </div>
              <div className="mt-20">
                <strong className="mb-15 sub-title">
                  Choose Background Layout
                </strong>
                <div className="select-container">
                  <Select
                    size="small"
                    options={ImageOptions}
                    defaultValue={ImageOptions[0]}
                    value={arrayFind<{ label: string; value: string }>(
                      ImageOptions,
                      { value: layout },
                    )}
                    onChange={(value) => {
                      setFieldValue('layout', value?.value);
                    }}
                  />
                </div>
              </div>
              <CommonComponent
                title={'Image'}
                setFieldValue={setFieldValue}
                opacity={imageOpacity}
                blondmodeKey={'imageBlendMode'}
                opacityKey={'imageOpacity'}
                blurKey={'imageBlur'}
                imageBlur={imageBlur}
                blondModeValue={imageBlendMode}
              />

              <CustomModal
                isOpen={isGallaryOpen}
                showFooter={false}
                showHeader={false}
                styles={{
                  body: { padding: '0px' },
                  dialog: { maxWidth: '600px' },
                }}
              >
                <BackgroundImageSelector
                  ImageSizes={sizes}
                  onChange={setFieldValue}
                  images={
                    user?.library?.map((image: any) => ({
                      url: image.url,
                      id: image._id,
                    })) || []
                  }
                  onUserImageDelete={(imageId: string) => {
                    setUser({
                      ...user,
                      library: user?.library?.filter(
                        (image: any) => image._id !== imageId,
                      ),
                    });
                  }}
                  onUserImageUpload={() => {
                    getLibrary()
                      .then((res) => setUser({ ...user, library: res.items }))
                      .catch(console.log);
                  }}
                  name={'image'}
                  onClose={onCloseGallary}
                />
              </CustomModal>
            </div>
          )}
          {type === 'video' && (
            <div className="pb-20">
              <div className="editor-head">
                <h5>Background Video URL</h5>
                <p className="cover-size-body mb-0">
                  Paste the link to add a background video to your Pop page.
                </p>
              </div>
              <div className="block-videos">
                <div className="py-0">
                  <FocusInput
                    icon="url"
                    className="mb-0"
                    hasIcon
                    name="video"
                    label="Video URL"
                    value={video || ''}
                    inputClasses="mb-20"
                    materialDesign
                    touched={true}
                    error={
                      video && !isValidUrl(video)
                        ? 'Please enter a valid url'
                        : ''
                    }
                    onChange={(e: any) => {
                      setFieldValue('video', e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* <div className="editor-head pt-30 "> */}
              <CommonComponent
                title={'Video'}
                setFieldValue={setFieldValue}
                opacity={videoOpacity}
                blondmodeKey={'videoBlendMode'}
                opacityKey={'videoOpacity'}
                blondModeValue={videoBlendMode}
              />
            </div>
          )}
          <div>
            <According
              title="Advance Options"
              showIcon={false}
              indicator={<span className="icon-keyboard_arrow_left"></span>}
              alt
              styles={{ according: { margin: ' 0px -20px' } }}
            >
              <CardSection
                title="Patterns"
                extra={
                  <Switchbox
                    size="small"
                    status={false}
                    name={'isPatternActive'}
                    value={isPatternActive}
                    onChange={(e: any) => {
                      setFieldValue('isPatternActive', e.target.checked);
                    }}
                  />
                }
              >
                <h6
                  style={{
                    color: 'var(--pallete-text-main-400)',
                    marginBottom: '25px',
                  }}
                >
                  Choose a patter to add an extra effect to your{' '}
                  {type === 'video'
                    ? 'Video'
                    : type === 'image'
                    ? 'Image'
                    : 'Color'}
                  background
                </h6>
                <RadioGroup
                  classes={{
                    group: 'list-shape-options mb-10 mb-md-20',
                    item: 'pattern',
                    active: 'selected',
                  }}
                  value={pattern}
                  name="imagepattern"
                  onChange={(e: any) => {
                    setFieldValue('pattern', e.target.value);
                  }}
                  items={[
                    {
                      value: 'pattern1',
                      render: () => (
                        <img
                          src="/assets/images/profile-editor/diagonal.gif"
                          alt="pattern"
                        />
                      ),
                    },
                    {
                      value: 'pattern2',
                      render: () => (
                        <img
                          src="/assets/images/profile-editor/horizontal.gif"
                          alt="pattern"
                        />
                      ),
                    },
                    {
                      value: 'pattern3',
                      render: () => (
                        <img
                          src="/assets/images/profile-editor/vertical.gif"
                          alt="pattern"
                        />
                      ),
                    },
                    {
                      value: 'pattern4',
                      render: () => (
                        <img
                          src="/assets/images/profile-editor/solid.gif"
                          alt="pattern"
                        />
                      ),
                    },
                  ]}
                />

                <div>
                  <div className="editor-head pt-5">
                    <h6>Pattern Color</h6>
                  </div>
                  <ColorPicker
                    colors={patternColorHistory || []}
                    value={patternColor}
                    onChange={(value: string) => {
                      setFieldValue('patternColor', value);
                    }}
                    onClose={() => onColorHistoryChange('patternColor')}
                  />

                  <div className="editor-head pt-30 ">
                    <h6>Pattern Opacity</h6>
                  </div>
                  <OpacitySlider color={patternColor}>
                    <Slider
                      min={0}
                      max={100}
                      value={patternOpacity}
                      className={'slider-opacity'}
                      onChange={(value) => {
                        setFieldValue('patternOpacity', value);
                      }}
                    />
                    <div className="slider-val">{patternOpacity || 0}%</div>
                  </OpacitySlider>
                </div>
              </CardSection>
            </According>
          </div>
        </div>
      </SimpleCard>
    </div>
  );
};

export default styled(BackgroundEditor)`
  .gradient-picker {
    padding: 10px 0 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;

    .gp {
      display: block;

      > div {
        padding: 5px 70px 0 0;
        position: relative;
      }
    }

    .ap {
      position: absolute;
      right: 0;
      top: 0;
    }

    .colorpicker-wrap {
      position: absolute;
      z-index: 9;
    }

    .button-icon-only.button-xs {
      width: 277px;
      border-radius: 0 0 5px 5px;
      margin: -3px -1px 0;
    }
  }
`;
