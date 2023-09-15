import React, { useRef } from 'react';
import styled from 'styled-components';
import { noop } from '../../lib';
import { STOP_PROP_TYPES } from '../propTypes';
import useStopDragging from './hooks/useStopDragging';

const ColorStop = ({
  stop,
  limits,
  onPosChange,
  onDeleteColor,
  onDragStart = noop,
  onDragEnd = noop,
  className,
}) => {
  const colorStopRef = useRef();
  const [drag] = useStopDragging({
    stop,
    limits,
    onPosChange,
    onDragStart,
    onDragEnd,
    onDeleteColor,
    colorStopRef,
  });

  const { offset, color, isActive } = stop;

  return (
    <div className={className}>
      <div
        className={isActive ? 'cs active' : 'cs'}
        ref={colorStopRef}
        style={{ left: offset }}
        onMouseDown={drag}
        onTouchStart={drag}
      >
        <div style={{ backgroundColor: color }} />
      </div>
    </div>
  );
};

ColorStop.propTypes = STOP_PROP_TYPES;

export default styled(ColorStop)`
  .cs {
    height: 17px;
    position: absolute;
    width: 11px;
    cursor: pointer;
    background: url(/assets/images/ColorStop.png) right center;
  }

  .cs div {
    height: 7px;
    left: 2px;
    width: 7px;
    position: absolute;
    top: 8px;
  }

  .active {
    background-position: left center;
  }
`;
