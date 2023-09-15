import { useAppDispatch } from 'hooks/useAppDispatch';
import useSocket from 'hooks/useSocket';
import {
  DetailedHTMLProps,
  forwardRef,
  ImgHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { isValidUrl, URLParts } from 'util/index';
export type ImageType = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'onLoad' | 'onError'
> & {
  isLoading?: boolean;
  fallbackUrl?: string;
  onImageLoad?: (...args: any[]) => void;
  onError?: (...args: any[]) => void;
  breakCache?: boolean;
  onSocketRecieve?: (...args: any[]) => void;
};
const Image = (props: ImageType, ref: any) => {
  const { socket } = useSocket();
  const {
    isLoading = false,
    fallbackUrl = '',
    className = '',
    onImageLoad,
    breakCache = false,
    onError: onImageError,
    loading: loadStrategy = 'lazy',
    onSocketRecieve,
    ...rest
  } = props;
  const [loading, setLoading] = useState(false);
  const [propSrc, setSrc] = useState(props.src);
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();
  const imageRef = useRef<HTMLImageElement>(null);

  const socketImage = () => {
    if (isValidUrl(fallbackUrl)) {
      const { pathname } = URLParts(fallbackUrl);
      // socket?.off(pathname.slice(1));
      socket?.on(pathname.slice(1), () => {
        const NPRSC = `${props.src}?${new Date().getTime()}`;
        if (imageRef.current) {
          imageRef.current.src = NPRSC;
        }
        onSocketRecieve?.({ src: NPRSC, fallbackUrl });
        setLoading(true);
        setSrc(NPRSC);
      });
    }
  };
  const onLoad = useCallback(
    (e: any) => {
      setLoading(false);
      onImageLoad?.({ e, error, propSrc, fallbackUrl });
      setError(false);
    },
    [onImageLoad, error, propSrc, fallbackUrl],
  );

  const onError = useCallback(
    (e: any) => {
      if (ref && fallbackUrl && ref.current) {
        ref.current.src = fallbackUrl;
      }
      if (!error && fallbackUrl && imageRef?.current?.src) {
        setLoading(true);
        imageRef.current.src = fallbackUrl;
        setSrc(`${fallbackUrl}`);
      } else {
        setLoading(false);
      }
      setError(true);
      onImageError?.({ e, props });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [error, fallbackUrl, ref],
  );

  useEffect(() => {
    if (isValidUrl(fallbackUrl)) {
      socketImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fallbackUrl, props.src, socket]);

  useEffect(() => {
    setLoading(true);
    setSrc(props.src);
  }, [props.src]);
  useEffect(() => {
    if (
      (imageRef?.current?.src &&
        propSrc &&
        !imageRef?.current?.src.includes(propSrc)) ||
      isLoading
    ) {
      setLoading(true);
    } else {
      setLoading(!imageRef?.current?.complete);
    }
  }, [isLoading, imageRef?.current?.complete, fallbackUrl, propSrc]);

  useEffect(() => {
    if (breakCache) {
      if (isValidUrl(props.src)) {
        const { url } = URLParts(props.src);
        setSrc(`${url}?${new Date().getTime()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakCache]);
  return (
    <ImageWrapper
      // loading={loading}
      className={`image-comp ${loading ? 'loading' : 'loaded'} ${className}`}
      {...(rest as any)}
    >
      <img
        loading={loadStrategy}
        ref={(ref as any) || imageRef}
        onLoad={onLoad}
        src={propSrc}
        alt={props?.alt}
        onError={onError}
      />
    </ImageWrapper>
  );
};
export default forwardRef(Image);
const ImageWrapper = styled.div<{
  loading: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  &.loading {
    &:before {
      opacity: 1;
      visibility: visible;
    }
  }
  &:before {
    position: absolute;
    left: 50%;
    top: 50%;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top: 2px solid var(--pallete-primary-main);
    border-right: 2px solid var(--pallete-primary-main);
    width: 30px;
    height: 30px;
    -webkit-animation: rotation 2s infinite linear;
    animation: rotation 2s infinite linear;
    content: '';
    margin: -15px 0 0 -15px;
    opacity: 0;
    visibility: hidden;
    z-index: 100;
  }
  img {
    max-width: 100%;
  }
`;
