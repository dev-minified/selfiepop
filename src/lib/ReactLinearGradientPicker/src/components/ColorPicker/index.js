import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from './constants';
import styled from 'styled-components';

const ColorPicker = ({ onSelect, className }) => (
  <div className={className}>
    <div className="cp">
      {COLORS.map(({ value, name }) => (
        <div
          onClick={() => onSelect(value)}
          key={name}
          title={name}
          style={{ backgroundColor: value }}
        />
      ))}
    </div>
  </div>
);

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default styled(ColorPicker)`
  .cp div {
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    height: 16px;
    width: 16px;
  }
  .cp div:hover {
    border: 1px solid #fff;
  }
`;
