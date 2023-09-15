import { ImageThumbnail, PrivateCommentIcon, Video } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Button from 'components/NButton';
import styled from 'styled-components';
interface IPostBuySection {
  className?: string;
  modalHandler?: Function | undefined;
  media?: IPostMedia[];
  buttonTitle?: string;
  isloading?: boolean;
}

const PostBuySection: React.FunctionComponent<IPostBuySection> = ({
  className,
  modalHandler,
  media,
  buttonTitle,
  isloading = false,
}) => {
  const onClickHandler = () => {
    modalHandler?.();
  };

  const images: any[] = [];
  const videos: any[] = [];
  const audios: any[] = [];

  media?.forEach((m) => {
    if (attrAccept({ type: m.type }, 'video/*')) {
      videos.push(m);
    } else if (attrAccept({ type: m.type }, 'image/*')) {
      images.push(m);
    } else {
      audios.push(m);
    }
  });
  return (
    <div className={`${className} post-options`}>
      <div className="post_option">
        <ul className="post_icon_list">
          <li>
            <span className="img">
              <PrivateCommentIcon />
            </span>{' '}
            <span className="text">{audios.length || 0}</span>
          </li>
          <li>
            <span className="img">
              <ImageThumbnail />{' '}
            </span>
            <span className="text">{images.length || 0}</span>
          </li>
          <li>
            <span className="img">
              <Video />
            </span>{' '}
            <span className="text">{videos.length || 0}</span>
          </li>
        </ul>
        <div className="post_buy_button">
          <Button
            shape="circle"
            type="primary"
            className="post_btn"
            block
            onClick={() => {
              onClickHandler();
            }}
            disabled={isloading}
            isLoading={isloading}
          >
            {buttonTitle || 'Subscribe to see Mai’s Posts'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default styled(PostBuySection)`
  padding: 10px 15px 18px;
  border: 2px solid var(--pallete-background-default);
  border-radius: 4px;

  .sp_dark & {
    border-color: rgba(255, 255, 255, 0.11);
  }

  .post_btn {
    font-size: 16px;
    line-height: 20px;
    padding: 11px 15px;

    &:hover {
      border-color: #fff;
      background: none;
      color: #fff;
    }
  }

  .post_icon_list {
    margin: 0 -13px 3px;
    padding: 0;
    list-style: none;
    display: flex;
    font-size: 13px;
    line-height: 15px;
    color: var(--pallete-secondary-lighter);
    font-weight: 500;

    .sp_dark & {
      color: #fff;
    }

    path {
      .sp_dark & {
        fill: #fff;
      }
    }

    li {
      padding: 0 10px 10px;
      display: flex;
      align-items: center;
    }

    .img {
      width: 16px;
      display: inline-block;
      vertical-align: top;
      line-height: 1;

      svg {
        height: 16px;
        width: 100%;
      }
    }

    .text {
      padding: 0 0 0 5px;
    }
  }
`;
