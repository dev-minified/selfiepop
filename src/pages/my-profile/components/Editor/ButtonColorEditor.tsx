import ColorPicker from 'components/ColorPicker';
import SimpleCard from 'components/SPCards/SimpleCard';
import useControlledState from 'hooks/useControlledState';
import { ReactElement } from 'react';
import { addColorHistory } from './helper';
interface Props {
  value?: IButton;
  onChange: Function;
  name?: string;
}

export default function ButtonStyleList({
  value: initialValue,
  onChange,
  name,
}: Props): ReactElement {
  const [values, setValues] = useControlledState<IButton>(
    {},
    {
      value: initialValue,
      onChange: (newValue) => {
        onChange && onChange(name, newValue);
      },
    },
  );
  const onColorHistoryChange = (name: keyof IButton) => {
    setValues((prev) => {
      const key = `${name}History` as keyof typeof prev;
      const colorHistory = addColorHistory(
        prev[name] as string,
        prev[key!] as string[],
      );

      return { ...prev, [key]: colorHistory };
    });
  };
  const handleChange = (name: string, value: string) => {
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const {
    buttonColor,
    buttonColorHistory,
    buttonRollOverColor,
    buttonRollOverColorHistory,
    shadowColor,
    shadowColorHistory,
    shadowRollOverColor,
    shadowRollOverColorHistory,
    textColor,
    textColorHistory,
    textRollOverColor,
    textRollOverColorHistory,
    outlineColor,
    outlineColorHistory,
    outlineRollOverColorHistory,
    outlineRollOverColor,
  } = values;
  return (
    <SimpleCard showHeader={false} classes={{ card: 'button-color-editor' }}>
      <div className="p-md-20 p-10">
        <div className="mb-40">
          <div className="editor-head mb-10">
            <h5 className="font-weight-medium">Button Default State</h5>
            <p className="cover-size-body mb-10">
              Choose the colors for your button, button text and button shadow
              for the default state.
            </p>
          </div>
          <div className="options-block">
            <strong className="options-title">Button Color</strong>
            <ColorPicker
              value={buttonColor}
              colors={buttonColorHistory}
              onChange={(value: string) => handleChange('buttonColor', value)}
              onClose={() => onColorHistoryChange('buttonColor')}
            />
          </div>
          <div className="options-block">
            <strong className="options-title">Text Color</strong>
            <ColorPicker
              value={textColor}
              colors={textColorHistory}
              onChange={(value: string) => handleChange('textColor', value)}
              onClose={() => onColorHistoryChange('textColor')}
            />
          </div>
          <div className="options-block">
            <strong className="options-title">Shadow Color</strong>
            <ColorPicker
              value={shadowColor}
              colors={shadowColorHistory}
              onChange={(value: string) => handleChange('shadowColor', value)}
              onClose={() => onColorHistoryChange('shadowColor')}
            />
          </div>
          <div className="options-block">
            <strong className="options-title">Outline Color</strong>
            <ColorPicker
              value={outlineColor}
              colors={outlineColorHistory}
              onChange={(value: string) => handleChange('outlineColor', value)}
              onClose={() => onColorHistoryChange('outlineColor')}
            />
          </div>
        </div>
        <div className="editor-head mb-5">
          <h5 className="font-weight-medium">Button Hover Color</h5>
          <p className="cover-size-body mb-10">
            Set the colors for your button, button text and button shadow to set
            how the buttons will look when a user hovers over the button.
          </p>
        </div>
        <div className="options-block">
          <strong className="options-title">Button Hover Color</strong>
          <ColorPicker
            value={buttonRollOverColor}
            colors={buttonRollOverColorHistory}
            onChange={(value: string) =>
              handleChange('buttonRollOverColor', value)
            }
            onClose={() => onColorHistoryChange('buttonRollOverColor')}
          />
        </div>

        <div className="options-block">
          <strong className="options-title">Shadow Hover Color</strong>
          <ColorPicker
            value={shadowRollOverColor}
            colors={shadowRollOverColorHistory}
            onChange={(value: string) =>
              handleChange('shadowRollOverColor', value)
            }
            onClose={() => onColorHistoryChange('shadowRollOverColor')}
          />
        </div>

        <div className="options-block">
          <strong className="options-title">Text Hover Color</strong>
          <ColorPicker
            value={textRollOverColor}
            colors={textRollOverColorHistory}
            onChange={(value: string) =>
              handleChange('textRollOverColor', value)
            }
            onClose={() => onColorHistoryChange('textRollOverColor')}
          />
        </div>
        <div className="options-block">
          <strong className="options-title">Outline Hover Color</strong>
          <ColorPicker
            value={outlineRollOverColor}
            colors={outlineRollOverColorHistory}
            onChange={(value: string) =>
              handleChange('outlineRollOverColor', value)
            }
            onClose={() => onColorHistoryChange('outlineRollOverColor')}
          />
        </div>
      </div>
    </SimpleCard>
  );
}
