import { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  onClose?(label: string): void;
  className?: string;
  checked?: boolean;
  value?: string;
  label?: string;
  showCloseIcon?: boolean;
  closeAble?: boolean;
}

function Tag({
  className,
  checked,
  value,
  label = '',
  onClose,
  showCloseIcon = true,
  closeAble = true,
}: Props): ReactElement {
  return (
    <label className={className}>
      <input type="checkbox" checked={checked} value={value} />
      <span className="label-text">
        <span className="label">{label}</span>
        {closeAble ? (
          <span
            className="tag_close_icon"
            onClick={() => onClose?.(label)}
          ></span>
        ) : (
          showCloseIcon && <span className="tag_close_icon disable"></span>
        )}
      </span>
    </label>
  );
}

export default styled(Tag)`
  display: inline-block;
  vertical-align: top;
  margin: 0 5px 0 0;
  input[type='checkbox'] {
    opacity: 0;
    visibility: hidden;
    position: absolute;
  }
  .label-text {
    background: var(--pallete-text-main-550);
    color: #fff;
    font-size: 13px;
    line-height: 16px;
    font-weight: 500;
    padding: 4px 22px 4px 10px;
    position: relative;
    border-radius: 20px;
    display: inline-block;
    vertical-align: top;
    transition: all 0.4s ease;
    .tag_close_icon {
      position: absolute;
      right: 8px;
      width: 9px;
      height: 9px;
      top: 50%;
      transform: translate(0, -50%);
      cursor: pointer;
      &.disable {
        pointer-events: none;
        background: none;
        &:after,
        &:before {
          background: #9c9c9c;
        }
      }
      &:after,
      &:before {
        width: 100%;
        height: 2px;
        background: #fff;
        border-radius: 4px;
        content: '';
        top: 4px;
        transform: rotate(45deg);
        position: absolute;
      }
      &:after {
        transform: rotate(-45deg);
      }
    }
    .disable {
      background: grey;
    }
  }
`;
