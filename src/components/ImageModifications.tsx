import { DetailedHTMLProps, forwardRef, ImgHTMLAttributes } from 'react';
import { getImageURL, isValidUrl } from 'util/index';
import Image from './Image';
export type ImageType = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'onLoad'
> & {
  isLoading?: boolean;
  fallbackUrl?: string;
  fallbackComponent?: JSX.Element | null;
  onImageLoad?: (...args: any[]) => void;
  breakCache?: boolean;
  imgeSizesProps?: ImageSizesProps['settings'];
  loading?: 'eager' | 'lazy';
  round?: boolean;
};
const ImageModifications = (props: ImageType, ref: any) => {
  // eslint-disable-next-line
  const {
    src,
    imgeSizesProps = {},
    fallbackUrl,
    ref: refobj,
    fallbackComponent = null,
    round = false,
    ...rest
  } = props;
  let url = src;
  let fallback = fallbackUrl || src;
  if (url && isValidUrl(url)) {
    const { url: mediUrl, fallbackUrl: fFAllback } = getImageURL({
      url,
      settings: imgeSizesProps,
    });
    url = mediUrl;
    fallback = fFAllback;
  }
  if (!url) {
    url = fallback;
  }
  return (
    <Image
      fallbackComponent={fallbackComponent}
      round={round}
      {...rest}
      src={url}
      fallbackUrl={fallback || fallbackUrl}
      ref={ref}
    />
  );
};
export default forwardRef(ImageModifications);
