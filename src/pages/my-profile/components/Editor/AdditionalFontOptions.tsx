import { Letter, Minus, Plus } from 'assets/svgs';
import ColorPicker from 'components/ColorPicker';
import NewButton from 'components/NButton';
import SimpleCard from 'components/SPCards/SimpleCard';
import { DashedLine } from 'components/Typography';
import FocusInput from 'components/focus-input';
import useControlledState from 'hooks/useControlledState';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { addColorHistory } from './helper';

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
  }

  .border-line {
    margin: 0 -20px;
    width: auto;

    @media (max-width: 767px) {
      margin: 0 -10px;
    }
  }
`;

interface Props {
  value?: IAdditional;
  onChange: Function;
  name?: string;
}
type HideTypeAdi =
  | 'gradient'
  | 'sectionTitleColorHistory'
  | 'taglineColorHistory'
  | 'iconSecondaryColorHistory'
  | 'iconPrimaryColorHistory'
  | 'titleColorHistory'
  | 'descriptionColorHistory'
  | 'solidColorHistory';

export default function AdditionFontOptions({
  value: initialValue,
  onChange,
  name,
}: Props): ReactElement {
  const [values, setValues] = useControlledState<IAdditional>(
    {},
    {
      value: initialValue,
      onChange: (newValue) => {
        onChange && onChange(name, newValue);
      },
    },
  );

  const onColorHistoryChange = (name: keyof IAdditional) => {
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
  const incremntFontSize = (name: keyof Omit<IAdditional, HideTypeAdi>) => {
    setValues((v) => {
      const previousValue = v[name];
      const newValue =
        Number(previousValue?.slice(0, previousValue.length - 2)) || 0;
      return { ...v, [name]: `${newValue + 1}px` };
    });
  };
  const decrementFontSize = (name: keyof Omit<IAdditional, HideTypeAdi>) => {
    setValues((v) => {
      const previousValue = v[name];
      const newValue =
        Number(previousValue?.slice(0, previousValue.length - 2)) || 0;
      return { ...v, [name]: `${newValue ? newValue - 1 : newValue}px` };
    });
  };
  const {
    taglineSize,
    taglineColor,
    taglineColorHistory,
    descriptionSize,
    descriptionColor,
    descriptionColorHistory,
    sectionTitleSize,
    sectionTitleColor,
    sectionTitleColorHistory,
    titleSize,
    titleColor,
    titleColorHistory,
  } = values;

  return (
    <SimpleCard showHeader={false} classes={{ card: 'button-color-editor' }}>
      <ColorWrapper className="p-md-20 p-10">
        <div className="editor-head mb-0">
          <h5 className="font-weight-medium">Pop Page Text</h5>
          <p className="cover-size-body mb-0">
            Completely customize your Pop Page. Change your background with
            colors, gradients and images.
          </p>
        </div>
        <div className="pt-25 pb-10 py-md-25">
          <h5 className="font-weight-medium mb-20">Page Title</h5>
          <div className="options-block">
            <OptionWrapper>
              <FocusInput
                name="titleSize"
                value={titleSize}
                hasIcon={true}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                onBlur={(e) => handleFontChange(e.target.name, e.target.value)}
                icon={<Letter />}
              />
              <IconWrapper className="opitons_actions">
                <NewButton
                  icon={<Minus />}
                  outline
                  size="x-large"
                  onClick={() => decrementFontSize('titleSize')}
                />

                <NewButton
                  icon={<Plus />}
                  outline
                  size="x-large"
                  onClick={() => incremntFontSize('titleSize')}
                />
              </IconWrapper>
            </OptionWrapper>

            <ColorPicker
              colors={titleColorHistory}
              value={titleColor}
              onChange={(value: string) => handleChange('titleColor', value)}
              onClose={() => onColorHistoryChange('titleColor')}
            />
          </div>
        </div>
        <DashedLine className="border-line" />
        <div className="pt-25 pb-10 py-md-25">
          <h5 className="font-weight-medium mb-15">Tag Line</h5>
          <div className="options-block">
            <OptionWrapper>
              <FocusInput
                value={taglineSize}
                hasIcon={true}
                onBlur={(e) => handleFontChange(e.target.name, e.target.value)}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange(name, value);
                }}
                name="taglineSize"
                icon={<Letter />}
              />
              <IconWrapper className="opitons_actions">
                <NewButton
                  icon={<Minus />}
                  outline
                  size="x-large"
                  onClick={() => decrementFontSize('taglineSize')}
                />
                <NewButton
                  icon={<Plus />}
                  outline
                  size="x-large"
                  onClick={() => incremntFontSize('taglineSize')}
                />
              </IconWrapper>
              <IconWrapper className="opitons_actions"></IconWrapper>
            </OptionWrapper>
            <ColorPicker
              colors={taglineColorHistory}
              value={taglineColor}
              onChange={(value: string) => handleChange('taglineColor', value)}
              onClose={() => onColorHistoryChange('taglineColor')}
            />
          </div>
        </div>
        <DashedLine className="border-line" />
        <div className="pt-25 pb-10 py-md-25">
          <h5 className="font-weight-medium mb-15">Description</h5>
          <div className="options-block">
            <OptionWrapper>
              <FocusInput
                value={descriptionSize}
                hasIcon={true}
                onBlur={(e) => handleFontChange(e.target.name, e.target.value)}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange(name, value);
                }}
                name="descriptionSize"
                icon={<Letter />}
              />
              <IconWrapper className="opitons_actions">
                <NewButton
                  icon={<Minus />}
                  outline
                  size="x-large"
                  onClick={() => decrementFontSize('descriptionSize')}
                />
                <NewButton
                  icon={<Plus />}
                  outline
                  size="x-large"
                  onClick={() => incremntFontSize('descriptionSize')}
                />
              </IconWrapper>
              <IconWrapper className="opitons_actions"></IconWrapper>
            </OptionWrapper>
            <ColorPicker
              colors={descriptionColorHistory}
              value={descriptionColor}
              onChange={(value: string) =>
                handleChange('descriptionColor', value)
              }
              onClose={() => onColorHistoryChange('descriptionColor')}
            />
          </div>
        </div>
        <DashedLine className="border-line" />
        <div className="pt-25 pb-10 py-md-25">
          <h5 className="font-weight-medium mb-15">Section Titles</h5>
          <div className="options-block">
            <OptionWrapper>
              <FocusInput
                name="sectionTitleSize"
                value={sectionTitleSize}
                hasIcon={true}
                onBlur={(e) => handleFontChange(e.target.name, e.target.value)}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                icon={<Letter />}
              />
              <IconWrapper className="opitons_actions">
                <NewButton
                  icon={<Minus />}
                  outline
                  size="x-large"
                  onClick={() => decrementFontSize('sectionTitleSize')}
                />

                <NewButton
                  icon={<Plus />}
                  outline
                  size="x-large"
                  onClick={() => incremntFontSize('sectionTitleSize')}
                />
              </IconWrapper>
            </OptionWrapper>
            <ColorPicker
              colors={sectionTitleColorHistory}
              value={sectionTitleColor}
              onChange={(value: string) =>
                handleChange('sectionTitleColor', value)
              }
              onClose={() => onColorHistoryChange('sectionTitleColor')}
            />
          </div>
        </div>
      </ColorWrapper>
    </SimpleCard>
  );
}
