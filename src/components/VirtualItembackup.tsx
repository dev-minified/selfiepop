import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
type Props = {
  /**
   * Whether the element should be visible initially or not.
   * Useful e.g. for always setting the first N items to visible.
   * Default: false
   */
  initialVisible?: boolean;
  /** An estimate of the element's height */
  defaultHeight?: number;
  /** How far outside the viewport in pixels should elements be considered visible?  */
  visibleOffset?: number;
  /** Should the element stay rendered after it becomes visible? */
  stayRendered?: boolean;
  root?: HTMLElement | null;
  /** E.g. 'span', 'tbody'. Default = 'div' */
  rootElement?: string;
  rootElementClass?: string;
  /** E.g. 'span', 'tr'. Default = 'div' */
  placeholderElement?: string;
  placeholderElementClass?: string;
  children: React.ReactElement;
  id?: string;
};

const VirtualItem = ({
  initialVisible = false,
  defaultHeight = 300,
  visibleOffset = 1000,
  stayRendered = false,
  root = null,
  rootElement = 'div',
  rootElementClass = '',
  placeholderElement = 'div',
  placeholderElementClass = '',
  children,
  id,
}: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(initialVisible);
  const wasVisible = useRef<boolean>(initialVisible);
  const [placeholderHeight, setPlaceHolderHeight] =
    useState<number>(defaultHeight);
  const intersectionRef = useRef<HTMLDivElement>(null);
  const reCalcHeight = useCallback(() => {
    setPlaceHolderHeight(intersectionRef.current!.offsetHeight);
  }, []);
  // Set visibility with intersection observer
  useEffect(() => {
    if (intersectionRef.current) {
      const localRef = intersectionRef.current;
      const observer = new IntersectionObserver(
        (entries) => {
          // Before switching off `isVisible`, set the height of the placeholder;
          const firstEntry = entries[0];
          if (firstEntry.isIntersecting && localRef!.offsetHeight) {
            setPlaceHolderHeight(localRef!.offsetHeight);
          }
          if (
            typeof window !== undefined &&
            (window as any).requestIdleCallback
          ) {
            (window as any).requestIdleCallback(
              () => setIsVisible(firstEntry.isIntersecting),
              {
                timeout: 600,
              },
            );
          } else {
            setIsVisible(firstEntry.isIntersecting);
          }
        },
        { root, rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px` },
      );

      observer.observe(localRef);
      return () => {
        if (localRef) {
          observer.unobserve(localRef);
        }
      };
    }
    return () => {};
  }, [intersectionRef]);

  useEffect(() => {
    if (isVisible) {
      wasVisible.current = true;
    }
  }, [isVisible]);

  const placeholderStyle = { height: placeholderHeight };

  // eslint-disable-next-line react/no-children-prop
  return React.createElement(rootElement, {
    children:
      isVisible || (stayRendered && wasVisible.current) ? (
        <div ref={intersectionRef}>
          {React.cloneElement(children, {
            ...children.props,
            reCalcHeight,
          })}
        </div>
      ) : (
        React.createElement(placeholderElement, {
          className: classNames('virtual-placeholder', placeholderElementClass),
          style: placeholderStyle,
        })
      ),
    className: classNames('virtual-item', rootElementClass, rootElementClass, {
      'is-interacting': isVisible,
    }),
    id: id,
    // style: wasVisible ? placeholderStyle : undefined,
    style: { minHeight: placeholderHeight },
  });
};

export default VirtualItem;
