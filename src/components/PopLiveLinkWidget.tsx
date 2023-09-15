import React from 'react';
import 'styles/live-link-bar.css';
import useCopyToClipBoard from '../hooks/useCopyToClipBoard';
type Props = {
  link: string;
  title?: string;
};

const PopLiveLinkWidget: React.FC<Props> = ({ link, title }) => {
  const [copied, copy] = useCopyToClipBoard();
  return (
    <div className="live-link-bar mb-40">
      <div className="info-frame d-flex align-items-center">
        <div className="icon">
          <span className="icon-live"></span>
        </div>
        <div className="link-link-info">
          <p>
            <strong>{title || 'POP liVE lINK'}:</strong>
          </p>
          <p>
            <a href={link} target="_blank" rel="noreferrer">
              {link}
            </a>
          </p>
        </div>
      </div>
      <span
        onClick={() => {
          copy(link);
        }}
        className="btn btn-secondary"
      >
        <span className="icon-url"></span>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </div>
  );
};

export default PopLiveLinkWidget;
