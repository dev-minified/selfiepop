import { initialPallet } from 'appconstants';
import { RecycleBin } from 'assets/svgs';
import ColorPicker from 'components/ColorPicker';
import NewButton, { default as Button } from 'components/NButton';
import SimpleCard from 'components/SPCards/SimpleCard';
import Select from 'components/Select';
import { DashedLine } from 'components/Typography';
import useControlledState from 'hooks/useControlledState';
import { GradientPicker } from 'lib/ReactLinearGradientPicker/src/index';
import 'rc-slider/assets/index.css';
import { ReactElement, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';
import 'styles/theme-editor.css';
import { rgbToRgba } from 'util/index';
import SizeAndColorInput from './chatEditor/sizeAndColorInput';
import { addColorHistory } from './helper';

const ColorWrapper = styled.div`
  h5 {
    margin: 0 0 13px;
  }
  .options-block {
    margin: 0;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    .selector {
      width: 115px;
      font-size: 14px;
      height: 40px;
    }

    .indicator-container {
      height: 40px;
      padding: 6px 13px 8px;
    }

    .color-display {
      margin: 0 5px 0 0;
    }

    .color-selector {
      margin-right: 16px;

      .text-input {
        width: 115px;

        .form-control {
          padding: 10px 10px 10px 44px;
          font-size: 14px;
        }
      }
    }

    .list-swatches__li {
      width: 24px;
      height: 24px;
      margin: 0 4px;
    }

    .sub-title {
      width: 100%;
    }
  }

  .border-line {
    margin: 0 -20px;
    width: auto;

    @media (max-width: 767px) {
      margin: 0 -10px;
    }
  }

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

  .react-select-container {
    width: 168px;
  }
`;

interface Props {
  value?: any;
  onChange?: Function;
  name?: string;
}
type HideIChat =
  | 'gradient'
  | 'titleColorHistory'
  | 'descriptionColorHistory'
  | 'solidColorHistory'
  | 'inputBorderStyle';
const BorderStyle = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
];
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
export default function ChatEditor({
  value: initialValue,
  onChange,
  name,
}: Props): ReactElement {
  const isMounted = useRef(false);
  const [values, setValues] = useControlledState<IChat>(
    {},
    {
      onChange: (newValue) => {
        onChange && onChange(name, newValue);
        isMounted.current = false;
      },
    },
  );
  useEffect(() => {
    if (initialValue && !isMounted.current) {
      isMounted.current = true;
      setValues(initialValue);
    }
    return () => {};
  }, [initialValue]);

  const onColorHistoryChange = (name: keyof IChat) => {
    setValues((prev) => {
      const key = `${name}History` as keyof typeof prev;
      const colorHistory = addColorHistory(
        prev[name] as string,
        prev[key!] as string[],
      );

      return { ...prev, [key]: colorHistory };
    });
  };
  const handleChange = (name: string, value: any) => {
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleFontChange = (name: string, value: any) => {
    if (!value.includes('px')) {
      value += 'px';
    }
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const incremntFontSize = (name: keyof Omit<IChat, HideIChat>) => {
    setValues((v) => {
      const previousValue = v[name];
      const newValue =
        Number(previousValue?.slice(0, previousValue.length - 2)) || 0;
      return { ...v, [name]: `${newValue + 1}px` };
    });
  };
  const decrementFontSize = (name: keyof Omit<IChat, HideIChat>) => {
    setValues((v) => {
      const previousValue = v[name];
      const newValue =
        Number(previousValue?.slice(0, previousValue?.length - 2)) || 0;
      return { ...v, [name]: `${newValue ? newValue - 1 : newValue}px` };
    });
  };
  const {
    descriptionSize,
    descriptionColor,
    descriptionColorHistory,
    titleSize,
    titleColor,
    titleColorHistory,
    subtype = 'solid',
    gradient,
    solidColor,
    solidColorHistory,
    inputsBackground,
    inputsBackgroundHistory,
    inputsTextColor,
    inputsTextColorHistory,
    placeholderColor,
    placeholderColorHistory,
    inputSvgColor,
    inputSvgColorHistory,
    inputBorderColor,
    inputBorderColorHistory,
    inputBorderStyle,
    inputErrorColor,
  } = values;
  return (
    <SimpleCard showHeader={false} classes={{ card: 'button-color-editor' }}>
      <ColorWrapper className="p-md-20 p-10">
        <div className="editor-head mb-0">
          <h5 className="font-weight-medium">Chat Editor</h5>
          <p className="cover-size-body mb-0">
            Completely customize your Pop Page. Change your background with
            colors, gradients and images.
          </p>
        </div>
        <SizeAndColorInput
          name="Chat Title"
          size={titleSize}
          colorKey={'titleColor'}
          sizeKey={'titleSize'}
          decrementFontSize={decrementFontSize}
          handleChange={handleChange}
          handleFontChange={handleFontChange}
          incremntFontSize={incremntFontSize}
          colorPickerColors={titleColorHistory}
          colorPickerValue={titleColor}
          onColorHistoryChange={onColorHistoryChange}
        />
        <DashedLine className="border-line" />
        <SizeAndColorInput
          name="Chat Description"
          colorKey={'descriptionColor'}
          sizeKey={'descriptionSize'}
          size={descriptionSize}
          decrementFontSize={decrementFontSize}
          handleChange={handleChange}
          handleFontChange={handleFontChange}
          incremntFontSize={incremntFontSize}
          colorPickerColors={descriptionColorHistory}
          colorPickerValue={descriptionColor}
          onColorHistoryChange={onColorHistoryChange}
        />
        <DashedLine className="border-line" />
        <div className="pt-25 pb-10 py-md-25">
          <h5 className="font-weight-medium mb-15">Chat Background</h5>
          <div className="theme-editor-actions">
            <div className="action">
              <NewButton
                type={subtype === 'solid' ? 'primary' : undefined}
                block
                onClick={() => {
                  handleChange('subtype', 'solid');
                }}
              >
                Solid
              </NewButton>
              <NewButton
                type={subtype === 'gradient' ? 'primary' : undefined}
                block
                onClick={() => {
                  handleChange('subtype', 'gradient');
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
                      handleChange('gradient', {
                        ...gradient,
                        pallette: value,
                      });
                    },
                    angle: gradient?.angle || 90,
                    setAngle: (value: any) =>
                      handleChange('gradient', {
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
                  value={solidColor || '#ffffff'}
                  colors={solidColorHistory}
                  onChange={(value: string) => {
                    handleChange('solidColor', value);
                  }}
                  onClose={() => onColorHistoryChange('solidColor')}
                />
              </div>
            )}
          </div>
        </div>
        <DashedLine className="border-line" />
        <SizeAndColorInput
          sizeFiled={false}
          name="Input Text Color"
          colorKey="inputsTextColor"
          handleChange={handleChange}
          colorPickerColors={inputsTextColorHistory}
          colorPickerValue={inputsTextColor}
          onColorHistoryChange={onColorHistoryChange}
        />
        <DashedLine className="border-line" />

        <SizeAndColorInput
          sizeFiled={false}
          name="Placeholder Color"
          colorKey={'placeholderColor'}
          handleChange={handleChange}
          colorPickerColors={placeholderColorHistory}
          colorPickerValue={placeholderColor}
          onColorHistoryChange={onColorHistoryChange}
        />
        <DashedLine className="border-line" />

        <SizeAndColorInput
          sizeFiled={false}
          name="Input Background"
          colorKey={'inputsBackground'}
          handleChange={handleChange}
          colorPickerColors={inputsBackgroundHistory}
          colorPickerValue={inputsBackground}
          onColorHistoryChange={onColorHistoryChange}
        />
        <DashedLine className="border-line" />
        <SizeAndColorInput
          sizeFiled={false}
          name="Input Icon Color"
          colorKey={'inputSvgColor'}
          handleChange={handleChange}
          colorPickerColors={inputSvgColorHistory}
          colorPickerValue={inputSvgColor}
          onColorHistoryChange={onColorHistoryChange}
        />
        <DashedLine className="border-line" />
        <SizeAndColorInput
          sizeFiled={false}
          name="Input Error Color"
          colorKey={'inputErrorColor'}
          handleChange={handleChange}
          colorPickerValue={inputErrorColor}
        />
        <DashedLine className="border-line" />
        <SizeAndColorInput
          sizeFiled={false}
          name="Input Border Color"
          colorKey={'inputBorderColor'}
          handleChange={handleChange}
          colorPickerColors={inputBorderColorHistory}
          colorPickerValue={inputBorderColor}
          onColorHistoryChange={onColorHistoryChange}
        />
        <h5 className="font-weight-medium mb-15">Input Border Style</h5>
        <Select
          isSearchable={false}
          options={BorderStyle}
          onChange={(value) => {
            handleChange('inputBorderStyle', value);
          }}
          defaultValue={BorderStyle[0]}
          placeholder="Select"
          styles={{
            container: (base) => ({ ...base, width: '90px' }),
          }}
          value={inputBorderStyle}
        />
      </ColorWrapper>
    </SimpleCard>
  );
}
