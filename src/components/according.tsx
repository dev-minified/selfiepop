import classNames from 'classnames';
import React, { ReactElement, ReactNode, useEffect } from 'react';
import { Collapse as ReactCollapse } from 'react-collapse';
import useOpenClose from '../hooks/useOpenClose';
interface Props {
  title: string | ReactNode | ReactElement;
  icon?: string;
  Svg?: any;
  alt?: boolean;
  showIcon?: boolean;
  defaultOpen?: boolean;
  indicator?: React.ReactNode;
  children?: React.ReactNode;
  classes?: { according?: string; header?: string; content?: string };
  styles?: {
    according?: React.CSSProperties;
    header?: React.CSSProperties;
    icon?: React.CSSProperties;
  };
  onToggle?: (isOpen: boolean) => void;
  extra?: ReactElement | ReactNode | undefined;
  isOpen?: boolean;
}

const According: React.FC<Props> = ({
  title,
  icon = 'icon-star1',
  indicator,
  showIcon = true,
  defaultOpen = false,
  Svg,
  children,
  classes = {},
  styles = {},
  alt,
  onToggle: onToggleChange,
  isOpen: isAccordOpen,
  extra,
}) => {
  // tslint:disable-next-line: react-hooks-nesting
  const [isOpen, onOpen, OnClose, onToggel] = useOpenClose(defaultOpen);
  const hanldeToggle = () => {
    onToggel();
    onToggleChange?.(!isOpen);
  };
  useEffect(() => {
    if (typeof isAccordOpen === 'boolean') {
      if (isAccordOpen) {
        onOpen();
      } else OnClose();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccordOpen]);
  const {
    according: accordingClass,
    header: headerClass,
    content: contentClass,
  } = classes;
  const {
    according: accordingStyle,
    header: headerStyle,
    icon: iconStyle,
  } = styles;
  return (
    <div
      className={classNames(
        'rc-according',
        { open: isOpen, alt: alt },
        accordingClass,
      )}
      style={accordingStyle}
    >
      <div
        className={`rc-header ${headerClass}`}
        onClick={hanldeToggle}
        style={headerStyle}
      >
        {showIcon && (
          <span className="icon" style={iconStyle}>
            {Svg ? <Svg /> : <span className={icon}></span>}
          </span>
        )}
        <div className="title">
          <h5>{title}</h5>
        </div>
        <div className="indicator">
          {indicator || <span className="icon-keyboard_arrow_left"></span>}
        </div>
      </div>
      {extra && <div className="rc_extra">{extra}</div>}
      <ReactCollapse isOpened={isOpen}>
        <div className={`content ${contentClass}`}>{children}</div>
      </ReactCollapse>
    </div>
  );
};

export default According;
