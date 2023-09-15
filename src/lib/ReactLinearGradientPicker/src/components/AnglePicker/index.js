import React, { useRef } from 'react';
import { ANGLE_PICKER_PROP_TYPES } from '../propTypes';
import useDragging from '../hooks/useDragging';
import { centerOffset, clampAngle, snapAngle, pointDegrees } from '../../lib';
import styled from 'styled-components';

const AnglePicker = ({ angle, setAngle, size = 48, snap = 5, className }) => {
  const pickerRef = useRef();
  const sizeStyle = { height: size, width: size };

  const onAngleChange = ({ clientX, clientY }, useSnap = false) => {
    const center = centerOffset(pickerRef.current);
    const degrees = pointDegrees(clientX, clientY, center);

    const clamped = clampAngle(degrees);
    const angle = useSnap ? snapAngle(clamped, snap) : clamped;

    setAngle(angle);
    return angle;
  };

  const [drag] = useDragging({
    onDragStart: (e) => onAngleChange(e, true),
    onDrag: onAngleChange,
    onDragEnd: (angle) => {
      if (!angle) return;
      const snappedAngle = snapAngle(angle, snap);

      setAngle(snappedAngle);
    },
  });

  return (
    <div className={className}>
      <div
        className="ap"
        ref={pickerRef}
        onMouseDown={drag}
        onTouchStart={drag}
        style={sizeStyle}
      >
        <span
          className="apc"
          style={{ transform: `rotate(${angle}deg)`, height: size }}
        >
          <i className="aph" />
        </span>
      </div>
    </div>
  );
};

AnglePicker.propTypes = ANGLE_PICKER_PROP_TYPES;

export default styled(AnglePicker)`
  .ap {
    flex: none;
    box-sizing: border-box;
    background-color: var(--pallete-background-default);
    border: 1px solid #d2d5dc;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    cursor: pointer;
  }

  .ap .apc {
    width: 6px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .ap .aph {
    width: 6px;
    height: 6px;
    background-color: #4374ad;
    display: inline-block;
    border-radius: 50%;
    position: absolute;
    left: 0;
    right: 0;
    top: 4px;
    margin: auto;
    cursor: pointer;
  }
`;
