import { ArrowDown } from 'assets/svgs';
import React from 'react';
import styled from 'styled-components';
import Button from '../NButton';

interface UploadItemProps {
  className?: string;
  icon?: React.ReactElement;
  title?: string;
  tag?: string;
  url?: string;
}

const UploadItem: React.FC<UploadItemProps> = (props) => {
  const { icon, title, tag, url, className } = props;
  return (
    <div className={className}>
      <span className="left-section" id="stopDraging">
        {icon && <div className="img-icon">{icon}</div>}
        <div className="card--text">
          <span className="card--title">{title}</span>
        </div>
        {tag && <div className="card--item">({tag})</div>}
      </span>

      <div className="right-section">
        <div className="extra">
          <a href={url} download={title}>
            <Button
              type="default"
              outline
              size="x-small"
              icon={<ArrowDown />}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default styled(UploadItem)`
  background: var(--pallete-background-gray);
  border: 1px solid var(--pallete-colors-border);
  border-radius: 4px;
  font-size: 15px;
  line-height: 18px;
  margin: 0 0 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 15px 14px 18px;
  color: #72777d;
  font-weight: 500;

  .left-section {
    position: relative;
    padding-left: 34px;
    display: flex;
    align-items: center;
    min-width: 0;

    .card--text {
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .right-section {
    flex-grow: 1;
    flex-basis: 0;
    margin: 0 0 0 10px;
  }

  .img-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    color: #86a7c3;
    max-width: 20px;
    height: auto;

    svg,
    img {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .card--item {
    font-size: 13px;
    padding: 0 0 0 15px;
    line-height: 1;
    white-space: nowrap;
  }
`;
