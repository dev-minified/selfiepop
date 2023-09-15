import * as PropTypes from 'prop-types';
import * as React from 'react';

export type ProgressBarProps = {
  completed: string | number;
  bgcolor?: string;
  baseBgColor?: string;
  height?: string;
  width?: string;
  borderRadius?: string;
  margin?: string;
  padding?: string;
  labelAlignment?: 'left' | 'center' | 'right' | 'outside' | 'none';
  labelColor?: string;
  labelSize?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  bgcolor,
  completed,
  baseBgColor,
  height,
  width,
  margin,
  padding,
  borderRadius,
  labelAlignment,
  labelColor,
  labelSize,
}) => {
  const getAlignment = (
    alignmentOption: ProgressBarProps['labelAlignment'],
  ) => {
    if (alignmentOption === 'left') {
      return 'flex-start';
    }
    if (alignmentOption === 'center') {
      return 'center';
    }
    if (alignmentOption === 'right') {
      return 'flex-end';
    }
    return null;
  };

  const alignment = getAlignment(labelAlignment);

  const containerStyles: React.CSSProperties = {
    borderRadius,
    height,
    padding,
    width,
    margin,
    backgroundColor: baseBgColor,
  };

  const fillerStyles: React.CSSProperties = {
    height,
    width:
      typeof completed === 'string' || completed > 100
        ? '100%'
        : `${completed}%`,
    backgroundColor: bgcolor,
    transition: 'width 1s ease-in-out',
    borderRadius: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      labelAlignment !== 'outside' && alignment ? alignment : 'normal',
  };

  const labelStyles: React.CSSProperties = {
    padding: labelAlignment === 'outside' ? '0 0 0 5px' : '5px',
    color: labelColor,
    fontWeight: 'bold',
    fontSize: labelSize,
  };

  const outsideStyles = {
    display: labelAlignment === 'outside' ? 'flex' : 'initial',
    alignItems: labelAlignment === 'outside' ? 'center' : 'initial',
  };

  return (
    <div style={outsideStyles} className="progress-bar-area">
      <div style={containerStyles} className="progress-bar-holder">
        <div style={fillerStyles} className="progress-bar-filled">
          {labelAlignment && !['outside', 'none'].includes(labelAlignment) && (
            <span style={labelStyles}>
              {typeof completed === 'number' ? `${completed}%` : `${completed}`}
            </span>
          )}
        </div>
      </div>
      {labelAlignment === 'outside' && (
        <span style={labelStyles}>
          {typeof completed === 'number' ? `${completed}%` : `${completed}`}
        </span>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  completed: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  bgcolor: PropTypes.string,
  baseBgColor: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  borderRadius: PropTypes.string,
  margin: PropTypes.string,
  padding: PropTypes.string,
  labelAlignment: PropTypes.oneOf([
    'left',
    'center',
    'right',
    'outside',
    'none',
  ]),
  labelColor: PropTypes.string,
  labelSize: PropTypes.string,
};

ProgressBar.defaultProps = {
  bgcolor: '#41b1f0',
  height: '10px',
  width: '100%',
  borderRadius: '50px',
  labelAlignment: 'none',
  baseBgColor: '#e0e0de',
  labelColor: '#fff',
  labelSize: '15px',
};

export default ProgressBar;
