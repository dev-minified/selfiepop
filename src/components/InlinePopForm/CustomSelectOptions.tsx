import { PropsWithChildren } from 'react';
import { components } from 'react-select';
import styled from 'styled-components/macro';
// import vars from 'src/styles/variables';

// ------------------------
// Two line select option
// ------------------------

type SelectCustomItemProps = {
  icon: any;
  label: string;
  type?: string;
};

const StyledItemOption = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  &.youtube {
    .custom-icon {
      color: #f00;
    }
  }
  &.facebook {
    .custom-icon {
      color: #1877f2;
    }
  }
  &.instagram {
    .custom-icon {
      color: #724293;
    }
  }
  &.twitter {
    .custom-icon {
      color: #55acee;
    }
  }
  &.onlyfans {
    .custom-icon {
      color: #00aff0;
    }
  }
  &.tiktok {
    .custom-icon {
      color: #000;
    }
  }
  &.snapchat {
    .custom-icon {
      color: #fffc00;

      svg {
        fill: currentColor;
      }
    }
  }
  .label {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const CustomOption = styled.div`
  &.not_selected {
    .react-select__option--is-focused {
      background-color: transparent;
      color: #000;
    }

    .label {
      color: #000;
    }

    &:hover > div {
      background-color: var(--pallete-primary-main) !important;
      color: white !important;

      .label {
        color: #fff;
      }

      .custom-icon {
        color: #fff;
      }
    }
  }

  &.selected {
    background: var(--pallete-primary-main) !important;

    .label {
      color: #fff;
    }

    .custom-icon {
      color: #fff;
    }
  }
`;

export const SelectCustomMenu = (
  props: PropsWithChildren<any>,
): JSX.Element => {
  return (
    <>
      <components.Menu className="custom_menu" {...props}>
        {props.children}
      </components.Menu>
    </>
  );
};

export const SelectCustomOption = (
  props: PropsWithChildren<any>,
): JSX.Element => {
  const { isSelected, ...rest } = props;
  return (
    <CustomOption className={`${isSelected ? 'selected' : 'not_selected'}`}>
      <components.Option
        isSelected={isSelected}
        className="custom_option"
        {...rest}
      >
        {props.children}
      </components.Option>
    </CustomOption>
  );
};

export const SelectCustomItem = (props: SelectCustomItemProps): JSX.Element => {
  const { icon, label, type, ...rest } = props;

  return (
    <StyledItemOption className={` ${type}`} {...rest}>
      <span className="label">{label}</span>
      <span className="custom-icon">{icon}</span>
    </StyledItemOption>
  );
};
