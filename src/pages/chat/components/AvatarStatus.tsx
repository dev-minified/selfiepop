import ImageModifications from 'components/ImageModifications';
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  src?: string;
  fallbackUrl?: string;
  isActive?: boolean;
  imgSettings?: ImageSizesProps['settings'];
  fallbackComponent?: JSX.Element | null;
}
const AvatarStatus: React.FC<Props> = (props) => {
  const {
    className,
    src,
    isActive,
    fallbackUrl,
    imgSettings = {},
    fallbackComponent = null,
  } = props;
  const newsrc =
    src ||
    (!!fallbackComponent ? '' : '/assets/images/default-profile-img.svg');
  const fbUrl = !!fallbackComponent
    ? undefined
    : fallbackUrl || '/assets/images/default-profile-img.svg';
  return (
    <div className={`${className} user-image`}>
      <ImageModifications
        imgeSizesProps={imgSettings}
        src={newsrc}
        fallbackUrl={fbUrl}
        fallbackComponent={fallbackComponent}
      />
      {isActive && (
        <span className="status" style={{ backgroundColor: '#06D6A0' }}></span>
      )}
    </div>
  );
};

export default styled(AvatarStatus)`
  &.user-image {
    position: relative;
    width: 37px;
    height: 37px;

    .image-comp {
      width: 100%;
      height: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .status {
      position: absolute;
      right: -1px;
      bottom: 1px;
      border: 2px solid var(--pallete-background-default);
      width: 10px;
      height: 10px;
      border-radius: 100%;
    }
  }
`;
