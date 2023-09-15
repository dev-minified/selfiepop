import React, { useEffect, useState } from 'react';
import Ratio, { IClasses, IRadio } from './radio';

interface IRadioGroup extends Partial<IRadio> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  items: Partial<IRadio>[];
  classes?: { group?: string; item?: string; active?: string } & IClasses;
  name?: string;
  defaultValue?: string;
  fallbackurl?: string;
  imgSettings?: ImageSizesProps['settings'];
}

export default function RadioGroup({
  value,
  onChange,
  items,
  classes = {},
  defaultValue,
  ...rest
}: IRadioGroup) {
  const {
    group: groupClass,
    item: itemClass,
    active: activeClass,
    ...restClasses
  } = classes;
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setSelected(e.target.value);
    onChange && onChange(e);
  };

  return (
    <div className={`${groupClass || 'radios-list'}`}>
      {items &&
        items.map(
          ({ value, label, ...restItemProps }: IRadio, index: number) => {
            return (
              <div
                key={index}
                className={`${itemClass || 'mb-15'} ${
                  selected && value === selected && activeClass
                }`}
              >
                <Ratio
                  onChange={handleChange}
                  value={value}
                  label={label}
                  checked={value === selected}
                  {...{ classes: restClasses }}
                  {...restItemProps}
                  {...rest}
                />
              </div>
            );
          },
        )}
    </div>
  );
}
