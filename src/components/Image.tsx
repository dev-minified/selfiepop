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
const url = '/assets/images/default-profile-img.svg';
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
  round?: boolean;
};
const Image = (props: ImageType, ref: any) => {
  const { socket } = useSocket();
  const {
    isLoading = false,
    fallbackUrl: fallbackUrlll = '',
    className = '',
    onImageLoad,
    breakCache = false,
    onError: onImageError,
    loading: loadStrategy = 'lazy',
    onSocketRecieve,
    imgClasses,
    fallbackComponent: FallbackComponent = null,
    round = false,
    ...rest
  } = props;
  const dispatch = useAppDispatch();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageId, setImageId] = useState('');
  const [imgSrc, SetImgSrc] = useState((rest.src || '')?.trim());
  const fallbackUrl = fallbackUrlll.trim();
  const [imgWrapperClasses, setImgWrapperClasses] = useState({
    loadingState: 'loading',
    defaultImage: '',
    error: '',
    classes: '',
    isFallBackComponent: false,
  });
  const propsSrc = (props.src || '').trim();
  const p = new RegExp(url);

  useEffect(() => {
    setImageId(v4());
    return () => {};
  }, [propsSrc]);
  const onStateChange = (state?: Partial<typeof imgWrapperClasses>) => {
    setImgWrapperClasses((s) => ({ ...s, ...state }));
  };

  const getElementandCheckClass = (className = '') => {
    const element = document.getElementById(imageId);
    return { isExist: element?.classList?.contains(className), element };
  };

  const onAddSrc = (src = propsSrc as string) => {
    onStateChange({ loadingState: 'loading' });
    SetImgSrc(src as string);
  };

  const socketImage = () => {
    if (isValidUrl(fallbackUrl)) {
      const { pathname } = URLParts(fallbackUrl);
      // socket?.off(pathname.slice(1));
      socket?.on(pathname.slice(1), () => {
        const NPRSC = `${propsSrc}?${new Date().getTime()}`;
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
      const parentelement = document.getElementById(imageId);
      const element = parentelement?.querySelector('img');
      // parentelement?.classList?.add('loaded');
      onStateChange({ loadingState: 'loaded', error: '' });
      onImageLoad?.({ e, propSrc: element?.getAttribute('src'), fallbackUrl });
    },

    [onImageLoad, fallbackUrl, imageId, imgWrapperClasses.loadingState],
  );
  const onError = useCallback(
    (e: any) => {
      const { isExist } = getElementandCheckClass('error');

      if (!isExist && ref && fallbackUrl && ref.current) {
        onAddSrc(fallbackUrl);

        ref.current.src = fallbackUrl;
      }
      onStateChange({
        error: 'error',
      });
      if (!isExist && fallbackUrl && imageRef?.current?.src) {
        onAddSrc(fallbackUrl);
        imageRef.current.src = fallbackUrl;
      } else {
        onStateChange({
          loadingState: 'loaded',
          error: '',
          classes: 'defaultImage',
          isFallBackComponent: !!FallbackComponent,
        });
        if (!FallbackComponent) {
          SetImgSrc(defaultImagePlaceholder);
        }
      }
      onImageError?.({ e, props });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fallbackUrl, ref, imageId, imgWrapperClasses.loadingState],
  );

  useEffect(() => {
    if (isValidUrl(fallbackUrl)) {
      socketImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fallbackUrl, props.src, socket, imageId]);
  useEffect(() => {
    if (!!propsSrc) {
      onStateChange({
        loadingState: 'loading',
        error: '',
        isFallBackComponent: false,
        classes: ``,
      });

      SetImgSrc(propsSrc);
    } else {
      const stateObj: any = {
        loadingState: 'loaded',
        error: '',
        classes: 'defaultImage',
        isFallBackComponent: !FallbackComponent,
      };
      if (!!FallbackComponent) {
        stateObj['isFallBackComponent'] = true;
      } else {
        SetImgSrc(defaultImagePlaceholder);
      }
      onStateChange(stateObj);
    }
  }, [props.src]);

  useEffect(() => {
    const el = getElementandCheckClass('');
    const imageSrc = imgSrc;
    if (el.element && imageSrc) {
      if (
        (imageRef?.current?.src &&
          imageSrc &&
          !imageRef?.current?.src.includes(imageSrc)) ||
        isLoading
      ) {
        // setLoading(true);
        onStateChange({
          error: '',
          loadingState: 'loading',
        });
      } else {
        if (imageRef?.current) {
          onStateChange({
            loadingState: !imageRef?.current?.complete ? 'loading' : 'loaded',
          });
        } else {
          onStateChange({
            loadingState: 'loaded',
          });
        }
      }
    } else {
      onStateChange({
        error: '',
        loadingState: 'loaded',
      });
    }
  }, [isLoading, imageRef?.current?.complete, fallbackUrl, imageId, imgSrc]);

  useEffect(() => {
    if (breakCache) {
      if (isValidUrl(props.src)) {
        const { url } = URLParts(props.src);
        onAddSrc(`${url}?${new Date().getTime()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakCache]);
  const isdefaulturl = p.test(imgSrc);
  return (
    <ImageWrapper
      id={imageId}
      // className={`image-comp loading  ${className}`}
      className={`image-comp ${isdefaulturl ? 'default-person-img' : ''} ${
        round ? 'rounded_img' : ''
      }  ${className} ${Object?.values(imgWrapperClasses || {})?.join(' ')}`}
      {...(rest as any)}
    >
      {imgWrapperClasses.isFallBackComponent ? (
        FallbackComponent
      ) : (
        <img
          {...rest}
          loading={loadStrategy}
          ref={(ref as any) || imageRef}
          onLoad={onLoad}
          src={imgSrc}
          alt={props?.alt}
          onError={onError}
          className={imgClasses}
        />
      )}
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
  &.rounded_img {
    border-radius: 100%;
    img {
      border-radius: 100%;
    }
  }
`;
