import { defaultImage } from 'appconstants';
import attrAccept from 'attr-accept';
import ImageModifications from 'components/ImageModifications';
import { usePreview } from 'react-dnd-multi-backend';
import styled from 'styled-components';

const DragerPreview = (props: any) => {
  const { className } = props;
  const { display, item = {}, style = {} }: any = usePreview();
  let url: any = '';
  if (!display) {
    return null;
  }

  const key = Object.keys(item?.media || {});
  if (!key.length) {
    return null;
  }
  const isvideo = attrAccept(
    { type: item?.media?.type || item?.media?.[key[0]]?.type },
    'video/*',
  );
  const isaudio = attrAccept(
    { type: item?.media?.type || item?.media?.[key[0]]?.type },
    'audio/*',
  );

  if (isvideo) {
    url = item?.media?.thumbnail || item?.media?.[key[0]]?.thumbnail;
  } else if (isaudio) {
    url = '/assets/images/mp3.svg';
  } else {
    url = item?.media?.path || item?.media?.[key[0]]?.path || '';
  }

  return (
    <div
      className={`${className} wrap-counter`}
      style={{
        ...style,
        zIndex: 9999,
        width: '150px',
        height: '150px',
      }}
    >
      <ImageModifications
        style={{
          width: '150px',
          height: '150px',
          objectFit: 'cover',
        }}
        imgeSizesProps={{ onlyMobile: true, checkspexist: true }}
        src={url || ''}
        alt=""
        fallbackUrl={defaultImage}
      />
      {!!item?.media?.[key[0]]?._id && (
        <span className="drag-counter">{key?.length}</span>
      )}
    </div>
  );
};
export default styled(DragerPreview)`
  &.wrap-counter {
    .drag-counter {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      top: 50%;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      font-size: 14px;
      line-height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
