import FocusInput from 'components/focus-input';
import { ReactElement, useEffect, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';
import { AngleBracketUp } from '../../assets/svgs';
import useDropDown from '../../hooks/useDropDown';

interface Props {
  value?: string;
  onChange?: Function;
  colors?: string[];
  showDefaultColor?: boolean;
  onClose?: (c?: string) => void;
}

const ColorPickerStyle = styled.div`
  display: flex;
  align-items: flex-start;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }

  .color-selector {
    display: flex;
    margin-right: 30px;
    position: relative;
    @media (max-width: 767px) {
      margin-right: 10px;
    }

    @media (max-width: 480px) {
      margin: 0 0 10px;
      width: 100%;
    }
  }
  .selector,
  .indicator-container {
    border: 1px solid var(--pallete-colors-border);
    border-radius: 5px;
  }

  .selector {
    padding: 4px;
    display: flex;
    width: 130px;
    text-align: center;
    align-items: center;
    margin-right: 10px;
    position: relative;

    @media (max-width: 480px) {
      width: calc(100% - 52px);
    }
  }

  .text-input {
    width: 135px;
    margin-bottom: 0 !important;
    margin-right: 10px;

    .form-control {
      padding: 10px 10px 10px 50px;
      border-color: var(--pallete-colors-border);
      height: 40px;
    }

    .icon {
      left: 4px;
      height: 32px;
    }
  }

  .hax-number {
    font-weight: 400;
  }
  .color-display {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 5px;
    margin-right: 13px;
    background-color: blue;
    border: 1px solid var(--pallete-colors-border);
  }
  .indicator-container {
    padding: 7px 13px 9px;
    height: 40px;
  }

  .rc-picker {
    position: absolute;
    left: 0px;
    top: 47px;
    z-index: 10;
    .sketch-picker {
      background: var(--pallete-background-default) !important;
    }
  }
  .indicator-container.open .indicator-icon svg {
    transform: rotateX(180deg);
  }
  .color-list {
    flex-grow: 1;
    flex-basis: 0;
    padding-top: 7px;

    @media (max-width: 480px) {
      padding-bottom: 15px;
    }
  }
`;

const CircleColorPickerStyle = styled.div`
  .list-swatches {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    margin: 0 -7px;
    align-items: center;
  }

  .list-swatches__li {
    margin: 0 7px;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    border: 1px solid #dedede;
    display: block;
    overflow: hidden;
    background: var(--pallete-background-default);

    @media (max-width: 767px) {
      margin: 0 3px;
    }
  }

  .list-swatches__li.selected {
    border: 2px solid #e51075;
    padding: 4px;
  }

  // .list-swatches__li.selected .swatch-item {
  //   border: 1px solid #dedede;
  // }

  .swatch-item {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
    // transition: all 0.4s ease;
    border-radius: 100%;
    cursor: pointer;
  }
`;

export function CircleColorPicker({
  value,
  onChange,
  colors,
  classes = {},
}: { classes?: { list?: string; item?: string } } & Props): ReactElement {
  const { list: listClass, item: itemClass } = classes;
  const [color, setColor] = useState<string>('#f44336FF');

  useEffect(() => {
    value && setColor(value);
  }, [value]);

  const handleColorChange = (clr: string) => {
    setColor(clr);
    if (clr !== color) {
      onChange && onChange({ hex: clr });
    }
  };

  return (
    <CircleColorPickerStyle>
      <ul className={`list-swatches ${listClass}`}>
        {colors?.map((c, index: number) => (
          <li
            key={index}
            className={`list-swatches__li ${
              c === color && 'selected'
            } ${itemClass}`}
            onClick={() => handleColorChange(c)}
          >
            <span className="swatch-item" style={{ background: c }}></span>
          </li>
        ))}
      </ul>
    </CircleColorPickerStyle>
  );
}

export default function ColorPicker({
  value,
  onChange,
  colors,
  showDefaultColor,
  onClose,
}: Props): ReactElement {
  const { ref, isVisible } = useDropDown(false, false, {
    onCloseCallback: () => {
      onClose && onClose(color);
    },
  });
  const [color, setColor] = useState<string>('#f44336');

  useEffect(() => {
    value && setColor(value);
  }, [value]);
  const handleColorChange = (color: ColorResult) => {
    if (color.rgb) {
      const c = tinycolor(color.rgb).toHex8String();
      setColor(c);
      onChange && onChange(c);
      return;
    }
    setColor(color.hex);
    onChange && onChange(color.hex);
  };
  const handleColorInputChange = (e: any) => {
    const { value } = e.target;
    const updatedColor = `${value}${color?.substr(6, 2)}`;
    if (tinycolor(updatedColor).isValid()) {
      setColor(updatedColor);
      onChange && onChange(updatedColor);
    }
  };
  const rgba = tinycolor(color).toRgb();
  return (
    <ColorPickerStyle className="rc-color-picker">
      <div className="color-selector" ref={ref}>
        <FocusInput
          value={color?.substr(0, 7)}
          hasIcon={true}
          onBlur={handleColorInputChange}
          onChange={handleColorInputChange}
          limit={7}
          icon={
            <span
              className="color-display"
              style={{ background: color }}
            ></span>
          }
        />
        <span className={`indicator-container ${isVisible && 'open'}`}>
          <span className="indicator-icon">
            <AngleBracketUp />
          </span>
        </span>
        {isVisible && (
          <div className="rc-picker">
            <SketchPicker onChangeComplete={handleColorChange} color={rgba} />
          </div>
        )}
      </div>
      {(colors?.length || showDefaultColor) && (
        <div className="color-list">
          <CircleColorPicker
            value={color}
            colors={
              colors || [
                '#f44336',
                '#e91e63',
                '#9c27b0',
                '#673ab7',
                'var(--pallete-primary-main)',
                '#2196f3',
              ]
            }
            onChange={handleColorChange}
          />
        </div>
      )}
    </ColorPickerStyle>
  );
}
