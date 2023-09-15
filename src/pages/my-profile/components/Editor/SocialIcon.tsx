import ColorPicker from 'components/ColorPicker';
import SimpleCard from 'components/SPCards/SimpleCard';
import useControlledState from 'hooks/useControlledState';
import { ReactElement } from 'react';
import { addColorHistory } from './helper';
interface Props {
  value?: ISocialIcon;
  onChange: Function;
  name?: string;
}

export default function SocialIcon({
  value: initialValue,
  onChange,
  name,
}: Props): ReactElement {
  const [values, setValues] = useControlledState<ISocialIcon>(
    {},
    {
      value: initialValue,
      onChange: (newValue) => {
        onChange && onChange(name, newValue);
      },
    },
  );

  const handleChange = (name: string, value: string) => {
    setValues((prev) => {
      const key = `${name}History` as keyof typeof prev;
      const colorHistory = addColorHistory(value, prev[key!] as string[]);

      return { ...prev, [name]: value, [key]: colorHistory };
    });
  };
  const { iconColor, iconColorHistory } = values;
  return (
    <SimpleCard showHeader={false}>
      <div className="p-md-20 p-10">
        <div className="mb-40">
          <div className="editor-head mb-10">
            <h5 className="font-weight-medium">Social Icons</h5>
            <p className="cover-size-body mb-10">
              Choose the color you want to use for the social icons at the
              bottom of your Pop Page.
            </p>
          </div>
          <div className="options-block">
            <strong className="options-title">Icon Color</strong>
            <ColorPicker
              value={iconColor}
              colors={iconColorHistory}
              onChange={(value: string) => handleChange('iconColor', value)}
            />
          </div>
        </div>
      </div>
    </SimpleCard>
  );
}
