import { VerticalDots } from 'assets/svgs';
import classNames from 'classnames';
import FocusInput from 'components/focus-input';
import React, { ReactElement } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import styled from 'styled-components';

const DragableCardStyle = styled.div<Props>`
  position: relative;
  margin: 0 0 10px;

  .card-container {
    display: flex;
    align-items: center;
  }

  .field-holder {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    position: relative;

    .text-input {
      margin-bottom: 0 !important;
    }

    .img-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translate(0, -50%);
      z-index: 3;
      color: #d9dadb;
      width: 10px;
      height: 10px;
      cursor: pointer;

      &:hover {
        color: var(--pallete-primary-main);
      }

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .drag-dots {
    width: 20px;
    color: #d6dade;
    position: relative;
    cursor: grabbing;
    transition: all 0.4s ease;

    &:hover {
      color: var(--pallete-primary-main) !important;
    }

    &:before {
      position: absolute;
      left: -6px;
      right: -11px;
      top: -25px;
      bottom: -26px;
      content: '';
    }
  }
`;

interface Props {
  _id?: string;
  index?: number;
  isActive?: boolean;
  title?: string;
  message?: string;
  outlines?: any;
  autoAddAndRemove?: boolean;
  subtitle?: ReactElement | string;
  onToggel?: Function;
  onView?: Function;
  onEdit?: Function;
  setOutline?: Function;
  tag?: string | number | React.ReactNode;
  className?: string;
  icon?: ReactElement;
  extra?: ReactElement;
  onDeleteClick?(): void;
  onCancel?(): void;
  options?: {
    toggel?: boolean;
    delete?: boolean;
    edit?: boolean;
    view?: boolean;
    download?: boolean;
    tag?: boolean;
  };
  showProgress?: boolean;
  completed?: number;
  error?: false;
  downloadUrl?: string;
  dragHandle?: boolean;
}

function DragableItem({
  _id,
  index,
  isActive = false,
  outlines,
  autoAddAndRemove = true,

  className,
  setOutline,
  icon,
  message,

  showProgress = false,
  completed = 0,
  error = false,
  dragHandle = true,
}: Props): ReactElement {
  const DragHandler = SortableHandle(() => (
    <span className="drag-dots">
      <VerticalDots />
    </span>
  ));
  const outlinesHandle = () => {
    outlines.splice(index, 1);
    setOutline?.([...outlines]);
  };
  return (
    <DragableCardStyle
      key={_id || index}
      className={classNames(className, 'card-dragable', {
        inactive: !isActive,
      })}
      showProgress={showProgress}
      completed={completed}
      error={error}
    >
      <div className="card-container">
        {dragHandle && <DragHandler />}
        <div className="field-holder">
          {icon && (
            <div onClick={outlinesHandle} className="img-icon">
              <span className="icon">{icon}</span>
            </div>
          )}
          <FocusInput
            materialDesign
            value={message}
            type="text"
            name="description"
            onChange={(e: any) => {
              const msg = [...outlines];
              msg[index || 0] = e.target.value;
              if (autoAddAndRemove) {
                if (
                  index === outlines.length - 1 &&
                  msg[index || 0].length > 0
                ) {
                  setOutline?.([...msg, '']);
                  return;
                }
              }
              setOutline?.(msg);
            }}
            rows={2}
          />
        </div>
      </div>
    </DragableCardStyle>
  );
}

export default DragableItem;
