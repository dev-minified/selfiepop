import { defaultImagePlaceholder } from 'appconstants';
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

import { v4 } from 'uuid';

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
  &.defaultImage {
    img {
      object-fit: contain !important;
    }
  }
`;
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
  imgClasses?: string;
};
const Image = forwardRef((props: ImageType, ref: any) => {
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
    imgClasses,
    ...rest
  } = props;
  const imageId = v4();
  const dispatch = useAppDispatch();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState(rest.src);
  const [imgWrapperClasses, setImgWrapperClasses] = useState({
    loadingState: 'loading',
    defaultImage: '',
    error: '',
  });

  const onStateChange = (state?: Partial<typeof imgWrapperClasses>) => {
    setImgWrapperClasses((s) => ({ ...s, ...state }));
  };

  const onAddSrc = (src = props.src) => {
    if (src) {
      onStateChange({ loadingState: 'loading' });
      setImgSrc(src);
    }
  };

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

        onAddSrc(NPRSC);
        // setImgSrc(NPRSC);
      });
    }
  };

  const onLoad = useCallback(
    (e: any) => {
      onStateChange({ loadingState: 'loaded', error: '' });

      onImageLoad?.({ e, propSrc: imgSrc, fallbackUrl });
    },

    [onImageLoad, fallbackUrl],
  );

  const onError = useCallback(
    (e: any) => {
      const { error } = { ...imgWrapperClasses };
      if (ref && fallbackUrl && ref.current) {
        onStateChange({ loadingState: 'loading', error: 'error' });
        onAddSrc(fallbackUrl);
        ref.current.src = fallbackUrl;
      }
      if (!error && fallbackUrl && imageRef?.current?.src) {
        // onAddSrc(fallbackUrl);
        // onAddSrc(fallbackUrl);
        onAddSrc(fallbackUrl);
        imageRef.current.src = fallbackUrl;
      } else {
        onStateChange({
          loadingState: 'loading',
          error: 'error',
          defaultImage: 'defaultImage',
        });
        setImgSrc(defaultImagePlaceholder);
      }
      onImageError?.({ e, props });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fallbackUrl, ref],
  );

  useEffect(() => {
    if (isValidUrl(fallbackUrl)) {
      socketImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fallbackUrl, props.src, socket]);
  useEffect(() => {
    // onErrorStateChange();
    onAddSrc(props.src);
  }, [props.src]);

  useEffect(() => {
    const el = imageRef?.current;
    if (el) {
      if (
        (imageRef?.current?.src &&
          imgSrc &&
          !imageRef?.current?.src.includes(imgSrc)) ||
        isLoading
      ) {
        onStateChange({ error: '', loadingState: 'loading' });
      } else {
        onStateChange({
          error: '',
          loadingState: !imageRef?.current?.complete ? 'loading' : 'loaded',
        });
      }
    } else {
      onStateChange({
        error: '',
        loadingState: 'loaded',
      });
    }
  }, [isLoading, imageRef?.current?.complete, fallbackUrl]);

  useEffect(() => {
    if (breakCache) {
      if (isValidUrl(props.src)) {
        const { url } = URLParts(props.src);
        onAddSrc(`${url}?${new Date().getTime()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakCache]);

  return (
    <ImageWrapper
      id={imageId}
      className={`image-comp  ${className} ${Object?.values(
        imgWrapperClasses || {},
      )?.join(' ')}`}
      {...(rest as any)}
    >
      <img
        {...rest}
        loading={loadStrategy}
        ref={(ref as any) || imageRef}
        onLoad={onLoad}
        src={imgSrc}
        alt={props?.alt}
        onError={onError}
        className={`${imgClasses} `}
      />
    </ImageWrapper>
  );
});
export default styled(Image)``;
