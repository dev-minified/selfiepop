import attrAccept from 'attr-accept';
import Button from 'components/NButton';

import { Mp3Icon, PlayIcon } from 'assets/svgs';
import ImageComp from 'components/Image';
import ImageModifications from 'components/ImageModifications';
import styled from 'styled-components';

interface Props {
  className?: string;
  images?: MediaType[];
  messages?: string;
  onEditCb: (...args: any) => void;
}
const ViewMessage: React.FC<Props> = (props) => {
  const { className, images, messages, onEditCb } = props;

  return (
    <div className={className}>
      {(!!images?.length || messages) && (
        <div className="left-area">
          {!!images?.length && (
            <div className="images-list">
              {images?.map((item: any, index: number) => {
                const isAudio = attrAccept(
                  { name: item.name, type: item.type },
                  'audio/*',
                );
                const isVideo = attrAccept(
                  { name: item.name, type: item.type },
                  'video/*',
                );

                return (
                  <div key={index} className="image">
                    {isVideo ? (
                      <div className="video_thumbnail">
                        <div className="icon-play">
                          <PlayIcon />
                        </div>

                        <ImageComp
                          className="img-responsive"
                          src={item.thumbnail}
                          alt={item.thumbnail}
                          fallbackUrl={item.thumbnail}
                        />
                      </div>
                    ) : isAudio ? (
                      <div className="audio_thumbnail">
                        <div className="icons-holder">
                          <span className="icon-play">
                            <PlayIcon />
                          </span>
                          <span className="img-audio">
                            <Mp3Icon />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <ImageModifications
                        imgeSizesProps={{
                          onlyMobile: true,
                        }}
                        src={
                          item.path || '/assets/images/default-profile-img.svg'
                        }
                        fallbackUrl={
                          item.path || '/assets/images/default-profile-img.svg'
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {messages && <div className="message-holder">{messages}</div>}
        </div>
      )}

      <Button onClick={() => onEditCb()} shape="circle" size="x-small">
        Edit
      </Button>
    </div>
  );
};

export default styled(ViewMessage)`
  background: var(--pallete-background-default);
  border: 1px solid var(--pallete-colors-border);
  overflow: hidden;
  border-radius: 5px;
  margin: 0 0 9px;
  padding: 10px;
  font-weight: 400;
  line-height: 1.2;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .images-list {
    display: flex;
    flex-wrap: wrap;

    .image {
      width: 34px;
      height: 34px;
      border-radius: 3px;
      margin: 0 2px;
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }
    }
  }

  .video_thumbnail {
    width: 100%;
    height: 100%;
    .icon-play {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      z-index: 2;
    }

    svg {
      height: auto;
      width: 100%;

      circle {
        fill: #333;
      }
    }
  }

  .left-area {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }

  .message-holder {
    padding: 5px 0 0;
    font-size: 14px;
    line-height: 18px;
  }
`;
