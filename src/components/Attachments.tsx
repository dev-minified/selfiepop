import styled from 'styled-components';
import 'styles/fileupload-toolbar.css';
import Button from './NButton';

const FileUpload = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;

  .status {
    font-weight: 500;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .status .icon-tick {
    width: 22px;
    height: 22px;
    font-size: 8px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 100%;
    margin: 0 15px 0 0;
    padding: 0 0 0 1px;
  }

  .status .icon-tick:before {
    color: #fff;
  }

  .status .icon-bars {
    width: 17px;
    height: 13px;
    border-bottom: 1px solid #aeb7c4;
    position: relative;
    margin: 0 24px 0 10px;
  }

  .status .icon-bars:before,
  .status .icon-bars:after {
    width: 17px;
    height: 1px;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background: #aeb7c4;
  }

  .status .icon-bars:after {
    top: 50%;
  }

  .buttons {
    margin-left: auto;
  }

  &.gray-bar {
    background-color: var(--pallete-background-gray-darker);
    padding: 10px 12px;
    margin: 0 0 14px;
  }

  &.white-bar {
    background: var(--pallete-background-default);
    padding: 10px 12px;
    margin: 0 0 14px;
  }

  @media (max-width: 767px) {
    .status {
      font-size: 14px;
      justify-content: center;
    }

    .status .icon-bars {
      margin: 0 10px 0 0;
    }

    &.gray-bar {
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
    }

    &.gray-bar .status {
      width: 100%;
      margin: 0 0 15px;
    }

    &.gray-bar .btn-round {
      min-width: inherit;
    }

    &.gray-bar .buttons {
      margin-left: 0;
      width: 100%;
      text-align: center;
    }

    &.white-bar {
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
    }

    &.white-bar .status {
      width: 100%;
      margin: 0 0 15px;
    }

    &.white-bar .buttons {
      margin-left: 0;
      width: 100%;
      text-align: center;
    }
  }
`;

export function AttachmentBar({
  title,
  url,
  onReplace,
  onDelete,
  options = { delete: true, replace: true },
}: {
  title: string;
  url?: string;
  onReplace?: (e: any) => {};
  onDelete?: (name: string) => void;
  options?: { delete?: boolean; replace?: boolean };
}) {
  return (
    <FileUpload className="fileupload-toolbar">
      <div className="status">
        <span className="icon-tick"></span>{' '}
        <a download={title} href={url}>
          {title}
        </a>
      </div>
      <div className="buttons">
        {options.replace && (
          <Button className="btn btn-round" onClick={onReplace}>
            Replace
          </Button>
        )}
        {options.delete && (
          <Button className="btn btn-round" onClick={() => onDelete?.(title)}>
            DELETE
          </Button>
        )}
      </div>
    </FileUpload>
  );
}
