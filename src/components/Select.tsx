import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import SelectComponent, {
  ActionMeta,
  GroupedOptionsType,
  NamedProps,
  OptionsType,
  OptionTypeBase,
  ValueType,
} from 'react-select';
import styled from 'styled-components';

export interface SelectProps<
  OptionType extends OptionTypeBase = { label: string; value: string },
  IsMulti extends boolean = false,
> {
  onChange?: (
    value: ValueType<OptionType, IsMulti>,
    action: ActionMeta<OptionType>,
  ) => void;
  options?: GroupedOptionsType<OptionType> | OptionsType<OptionType> | any;
  placeholder?: string;
  size?: 'x-small' | 'small' | 'medium' | 'large';
  defaultValue?: IsMulti extends true
    ? ValueType<OptionType, boolean>
    : ValueType<OptionType, false>;
  value?: OptionType;
  name?: string;
  touched?: boolean;
  error?: string | undefined;
  width?: string | number;
  heigth?: string | number;
  type?: 'default' | 'seprated' | 'compact';
  className?: string;
  style?: CSSProperties;
  isSearchable?: boolean;
  styles?: NamedProps['styles'];
  disabled?: boolean;
  onclick?: (...args: any) => void;
  onMenuOpen?: (...args: any) => void;
  onMenuClose?: (...args: any) => void;
  components?: Record<string, any>;
}

const Select: React.FC<SelectProps> = ({
  onChange,
  options,
  placeholder,
  size,
  value,
  defaultValue,
  name,
  error,
  type,
  touched,
  className,
  style,
  disabled = false,
  components = undefined,
  onMenuOpen,
  onMenuClose,
  ...rest
}: SelectProps) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  let sizeCls = '';
  switch (size) {
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
      break;
    case 'x-small':
      sizeCls = 'xs';
      break;
    default:
      break;
  }

  return (
    <div
      className={classNames(className, sizeCls, type || 'default', {
        has__error: touched && error,
      })}
      style={style}
    >
      <SelectComponent
        // menuIsOpen={true}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        className="react-select-container"
        name={name}
        components={components}
        isDisabled={disabled}
        classNamePrefix="react-select"
        menuPlacement="auto"
        openMenuOnFocus={true}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={onChange}
        {...rest}
      />
      {touched && error && (
        <>
          <div
            id="title-error"
            style={{
              // paddingBottom: 5,
              width: '100%',
              textAlign: 'right',
            }}
            className="error-msg is-invalid d-block"
          >
            <div>
              <FontAwesomeIcon
                style={{ marginRight: 3 }}
                icon={faExclamationCircle}
              />
              {error}
            </div>
          </div>
          {/* <div style={{ clear: 'both' }}></div> */}
        </>
      )}
    </div>
  );
};

export default styled(Select)`
  &.seprated {
    .react-select-container {
      padding-right: 50px;
      position: relative;
    }

    .react-select__indicators {
      position: absolute;
      right: -50px;
      top: -1px;
      border: 1px solid #d8d8d8;
      height: 40px !important;
      border-radius: 3px;

      .react-select__indicator-separator {
        display: none;
      }
    }

    &.lg {
      .react-select-container {
        padding-right: 64px;
      }
      .react-select__indicators {
        height: 54px !important;
        position: absolute;
        right: -64px;
      }
    }
  }

  &.lg {
    .react-select__control {
      min-height: 54px;
      font-size: 16px;

      .react-select__indicators {
        height: 52px;
        width: 54px;
      }
    }
  }

  &.compact {
    .react-select__value-container {
      font-size: 12px;
      font-weight: 500;
      padding: 0 8px;
    }

    .react-select__control {
      border-radius: 40px;
      border-color: var(--pallete-colors-border);
      min-height: 28px;
      .react-select__indicator-separator {
        display: none;
      }

      .react-select__indicators {
        width: 28px;
        height: 28px;
        background: none;
      }
    }

    .react-select__menu {
      background: var(--pallete-background-default);
      overflow: hidden;
      border: 1px solid var(--pallete-colors-border);
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
      border-radius: 4px;

      .sp_dark & {
        background: #242424;
      }

      .react-select__menu-list {
        background: var(--pallete-background-default);
        padding: 5px;
      }

      .react-select__option {
        background: none;
        color: #8d778d;
        padding: 6px 10px;
        min-width: inherit;
        margin: 0;
        text-align: left;
        font-size: 13px;
        line-height: 17px;
        font-weight: 500;
        border-radius: 4px;
        cursor: pointer;
        white-space: normal;

        .sp_dark & {
          color: rgba(255, 255, 255, 0.4);
        }

        &:hover:not(.react-select__option--is-selected),
        &.react-select__option--is-focused:not(
            .react-select__option--is-selected
          ) {
          color: var(--pallete-text-secondary-100);
          background: var(--pallete-background-gray-secondary-200);

          .sp_dark & {
            color: #fff;
            background: none;
          }
        }

        &.react-select__option--is-selected {
          color: var(--pallete-text-secondary-100);
          background: none;

          .sp_dark & {
            color: #fff;
            background: none;
          }
        }
      }
    }
  }

  .react-select__menu {
    margin: 0;
    z-index: 10;
    background: var(--pallete-background-default);

    .sp_dark & {
      background: #242424;
    }

    &-list {
      padding: 0;
    }

    .react-select__option {
      white-space: normal;
      background: none !important;

      .sp_dark & {
        color: rgba(255, 255, 255, 0.4);
      }

      &.react-select__option--is-focused,
      &.react-select__option--is-selected {
        background: var(--pallete-primary-main);
        color: #fff;

        .sp_dark & {
          color: #fff;
          background: none;
        }

        .icon {
          color: #fff;
        }
      }
    }
  }

  .react-select__control {
    border: 1px solid var(--pallete-colors-border) !important;
    border-radius: 3px;
    font-size: 15px;
    line-height: 20px;
    color: var(--pallete-text-main);
    min-height: 40px;
    box-shadow: none !important;
    outline: none !important;
    background: var(--pallete-background-default);

    .sp_dark & {
      background: rgba(255, 255, 255, 0.1);
      border-color: #353535;
      overflow: hidden;
    }

    &:hover {
      border: 1px solid var(--pallete-colors-border);
    }

    .react-select__indicators {
      width: 40px;
      height: 38px;
      position: relative;
      justify-content: center;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.15);
      }
    }

    .react-select__indicator {
      color: #72777d;

      .sp_dark & {
        color: #fff;
      }
    }

    .react-select__indicator-separator {
      margin-top: 0;
      margin-bottom: 0;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background-color: var(--pallete-background-gray-secondary-200);

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .react-select__single-value {
    color: var(--pallete-text-main);
  }
`;
