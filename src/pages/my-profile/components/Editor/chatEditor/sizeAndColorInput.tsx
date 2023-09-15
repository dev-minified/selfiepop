import { Letter, Minus, Plus } from 'assets/svgs';
import ColorPicker from 'components/ColorPicker';
import FocusInput from 'components/focus-input';
import NewButton from 'components/NButton';
import 'rc-slider/assets/index.css';
import styled from 'styled-components';
import 'styles/theme-editor.css';
const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-space-between;
  margin-right: 15px;

  @media (max-width: 767px) {
    margin-bottom: 15px;
  }

  .icon {
    left: 5px;
  }

  .text-input {
    margin: 0 10px 0 0 !important;
  }

  input {
    width: 95px;
    height: 40px;
    border: 1px solid var(--pallete-colors-border);
    padding: 10px 10px 10px 45px !important;

    &:focus {
      padding: 10px 10px 10px 45px !important;
    }
  }
  svg {
    /* width: 25px;
    height: 30px; */
    fill: none;
    path:not(:last-child) {
      color: lightgray;
    }
    path:not(:first-child) {
      color: var(--pallete-text-main);
      font-weight: bold;
    }
  }

  .opitons_actions {
    margin: 0 !important;

    > button {
      color: var(--pallete-text-main);
      // border-color: #d5dade;

      svg {
        width: 11px;
      }

      &:first-child {
        border-radius: 5px 0 0 5px;
      }

      + .button {
        margin: 0 0 0 -1px;
        border-radius: 0 5px 5px 0;
      }
    }
    margin-bottom: 1.25rem;
  }
`;
const IconWrapper = styled.span``;

interface Props {
  name?: string;
  size?: string;
  handleFontChange?: Function;
  handleChange?: Function;
  decrementFontSize?: Function;
  incremntFontSize?: Function;
  colorPickerColors?: string[];
  colorPickerValue?: string;
  onColorHistoryChange?: Function;
  colorKey?: string;
  sizeKey?: string;
  sizeFiled?: boolean;
}
const SizeAndColorInput = ({
  name,
  size,
  handleFontChange,
  handleChange,
  decrementFontSize,
  incremntFontSize,
  colorPickerColors,
  colorPickerValue,
  onColorHistoryChange,
  colorKey,
  sizeKey,
  sizeFiled = true,
}: Props) => {
  return (
    <div className="pt-25 pb-10 py-md-25">
      <h5 className="font-weight-medium mb-15">{name}</h5>
      <div className="options-block">
        {sizeFiled && (
          <OptionWrapper>
            <FocusInput
              value={size}
              hasIcon={true}
              onBlur={(e) => handleFontChange?.(e.target.name, e.target.value)}
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange?.(name, value);
              }}
              name={sizeKey}
              icon={<Letter />}
            />
            <IconWrapper className="opitons_actions">
              <NewButton
                icon={<Minus />}
                outline
                size="x-large"
                onClick={() => decrementFontSize?.(`${sizeKey}`)}
              />
              <NewButton
                icon={<Plus />}
                outline
                size="x-large"
                onClick={() => incremntFontSize?.(`${sizeKey}`)}
              />
            </IconWrapper>
            <IconWrapper className="opitons_actions"></IconWrapper>
          </OptionWrapper>
        )}

        <ColorPicker
          colors={colorPickerColors}
          value={colorPickerValue}
          onChange={(value: string) => handleChange?.(`${colorKey}`, value)}
          onClose={() => onColorHistoryChange?.(`${colorKey}`)}
        />
      </div>
    </div>
  );
};

export default SizeAndColorInput;
