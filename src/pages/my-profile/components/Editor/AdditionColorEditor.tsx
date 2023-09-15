import ColorPicker from 'components/ColorPicker';
import SimpleCard from 'components/SPCards/SimpleCard';
import useControlledState from 'hooks/useControlledState';
import { ReactElement } from 'react';
import { addColorHistory } from './helper';

interface Props {
  value?: IAdditional;
  onChange: Function;
  name?: string;
}

export default function AdditionColorEditor({
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
  const handleChange = (name: string, value: string) => {
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const {
    iconPrimaryColor,
    iconPrimaryColorHistory,
    iconSecondaryColor,
    iconSecondaryColorHistory,
  } = values;
  return (
    <SimpleCard showHeader={false} classes={{ card: 'button-color-editor' }}>
      <div className="p-md-20 p-10">
        <div className="editor-head mb-10">
          <h5 className="font-weight-medium">Additional Colors</h5>
          <p className="cover-size-body mb-10">
            Completely customize your Pop Page. Change your background with
            colors, gradients and images. Choose a button style, change the
            typeface and more.
          </p>
        </div>

        <div className="options-block">
          <strong className="options-title">Icon Primary Color</strong>
          <ColorPicker
            colors={iconPrimaryColorHistory}
            value={iconPrimaryColor}
            onChange={(value: string) =>
              handleChange('iconPrimaryColor', value)
            }
            onClose={() => onColorHistoryChange('iconPrimaryColor')}
          />
        </div>
        <div className="options-block">
          <strong className="options-title">Icon Secondary Color</strong>
          <ColorPicker
            colors={iconSecondaryColorHistory}
            value={iconSecondaryColor}
            onChange={(value: string) =>
              handleChange('iconSecondaryColor', value)
            }
            onClose={() => onColorHistoryChange('iconSecondaryColor')}
          />
        </div>
      </div>
    </SimpleCard>
  );
}
