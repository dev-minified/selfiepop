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
} from 'react';
import styled from 'styled-components';
import { isValidUrl, URLParts } from 'util/index';

import { v4 } from 'uuid';
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
  fallbackComponent?: JSX.Element | null;
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
    imgClasses,
    fallbackComponent: FallbackComponent = null,
    ...rest
  } = props;
  const imageId = v4();
  const dispatch = useAppDispatch();
  const imageRef = useRef<HTMLImageElement>(null);
  const getElementandCheckClass = (className = '') => {
    const element = document.getElementById(imageId);
    return { isExist: element?.classList?.contains(className), element };
  };

  const onLoadingStateChange = (action = 'remove') => {
    const { isExist, element } = getElementandCheckClass('loading');

    if (element) {
      if (action === 'remove') {
        element.classList.remove('loading');
      }
      if (action === 'add' && !isExist) {
        element.classList.add('loading');
      }
    }
  };
  const onErrorStateChange = (action = 'remove') => {
    const { isExist, element } = getElementandCheckClass('error');
    if (element) {
      if (action === 'remove') {
        element.classList.remove('error');
      }
      if (action === 'add' && !isExist) {
        element.classList.add('error');
      }
    }
  };
  const onAddSrc = (src = props.src) => {
    const element = document.getElementById(imageId)?.querySelector('img');
    if (element && src) {
      onLoadingStateChange('add');
      element.setAttribute('src', src);
    }
  };
  const onAddClass = (className = 'defaultImage') => {
    const element = document.getElementById(imageId);
    if (element && !element?.classList?.contains(className)) {
      onLoadingStateChange();
      element.classList.add(className);
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
      });
    }
  };

  const onLoad = useCallback(
    (e: any) => {
      onLoadingStateChange();
      onErrorStateChange();

      const parentelement = document.getElementById(imageId);
      const element = parentelement?.querySelector('img');
      parentelement?.classList?.add('loaded');
      onImageLoad?.({ e, propSrc: element?.getAttribute('src'), fallbackUrl });
    },

    [onImageLoad, fallbackUrl, imageId],
  );

  const onError = useCallback(
    (e: any) => {
      const { isExist } = getElementandCheckClass('error');
      if (!isExist && ref && fallbackUrl && ref.current) {
        onLoadingStateChange('add');
        ref.current.src = fallbackUrl;
      }
      onErrorStateChange('add');
      if (!isExist && fallbackUrl && imageRef?.current?.src) {
        onAddSrc(fallbackUrl);
        imageRef.current.src = fallbackUrl;
      } else {
        onLoadingStateChange();
        onErrorStateChange();
        onAddClass();
        onAddSrc(defaultImagePlaceholder);
      }
      onImageError?.({ e, props });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fallbackUrl, ref, imageId],
  );

  useEffect(() => {
    if (isValidUrl(fallbackUrl)) {
      socketImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fallbackUrl, props.src, socket, imageId]);
  useEffect(() => {
    onLoadingStateChange('add');
    onErrorStateChange();
    onAddSrc(props.src);
  }, [props.src, imageId]);

  useEffect(() => {
    const el = getElementandCheckClass('');
    if (el.element) {
      const imageSrc = el.element?.querySelector('img')?.getAttribute('src');
      if (
        (imageRef?.current?.src &&
          imageSrc &&
          !imageRef?.current?.src.includes(imageSrc)) ||
        isLoading
      ) {
        // setLoading(true);

        onLoadingStateChange('add');
      } else {
        onLoadingStateChange(!imageRef?.current?.complete ? 'add' : 'remove');
      }
    } else {
      onLoadingStateChange('remove');
      onErrorStateChange('remove');
    }
  }, [isLoading, imageRef?.current?.complete, fallbackUrl, imageId]);

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
      className={`image-comp loading  ${className}`}
      {...(rest as any)}
    >
      <img
        {...rest}
        loading={loadStrategy}
        ref={(ref as any) || imageRef}
        onLoad={onLoad}
        src={props.src}
        alt={props?.alt}
        onError={onError}
        className={imgClasses}
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
  &.defaultImage {
    img {
      object-fit: contain !important;
    }
  }
`;
