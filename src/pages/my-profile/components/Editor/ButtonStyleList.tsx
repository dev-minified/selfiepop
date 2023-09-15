import React, { ReactElement } from 'react';
import RadioGroup from '../../../../components/RadioGroup';
import SimpleCard from '../../../../components/SPCards/SimpleCard';
import useControlledState from '../../../../hooks/useControlledState';

interface Props {
  value?: any;
  onChange: Function;
  name?: string;
}

export default function ButtonStyleList({
  value: initialValue,
  onChange,
  name,
}: Props): ReactElement {
  const [values, setValues] = useControlledState<any>(
    {},
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

  const { style } = values;
  return (
    <SimpleCard
      showHeader={false}
      classes={{
        card: 'profile-button-editor',
      }}
    >
      <div className="editor-head mb-10">
        <h5 className="font-weight-medium">Button Style</h5>
        <p className="cover-size-body mb-10">
          Select the button shape and style that you want to use for the content
          and links on your pop page.
        </p>
      </div>
      <div className="profile-buttons-block">
        <div className="options-block">
          <strong className="options-title">No Shadow</strong>
          <RadioGroup
            name="style"
            classes={{
              group: 'list-shape-options',
              item: 'list-shape-options__item',
              active: 'selected',
              label: 'd-block',
            }}
            value={style}
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
            name="style"
            classes={{
              group: 'list-shape-options',
              item: 'list-shape-options__item',
              active: 'selected',
              label: 'd-block',
            }}
            value={style}
            items={[
              {
                value: 'filled-soft-shadow-soft-square',
                render: () => {
                  return (
                    <div className="list-button-options__image btn-shadow solid radius"></div>
                  );
                },
              },
              {
                value: 'filled-soft-shadow-circule',
                render: () => {
                  return (
                    <div className="list-button-options__image btn-shadow solid square"></div>
                  );
                },
              },
              {
                value: 'filled-soft-shadow-sharp-square',
                render: () => {
                  return (
                    <div className="list-button-options__image btn-shadow solid"></div>
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
            name="style"
            classes={{
              group: 'list-shape-options',
              item: 'list-shape-options__item',
              active: 'selected',
              label: 'd-block',
            }}
            value={style}
            items={[
              {
                value: 'filled-hard-shadow-soft-square',
                render: () => {
                  return (
                    <div className="list-button-options__image btn-solid-shadow solid radius"></div>
                  );
                },
              },
              {
                value: 'filled-hard-shadow-circule',
                render: () => {
                  return (
                    <div className="list-button-options__image btn-solid-shadow solid square"></div>
                  );
                },
              },
              {
                value: 'filled-hard-shadow-sharp-square',
                render: () => {
                  return (
                    <div className="list-button-options__image btn-solid-shadow solid"></div>
                  );
                },
              },
            ]}
            onChange={handleChangeInput}
          />
        </div>
      </div>
    </SimpleCard>
  );
}
