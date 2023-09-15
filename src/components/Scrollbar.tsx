import classNames from 'classnames';
import React, { ReactElement, forwardRef, useEffect, useRef } from 'react';
import { ScrollbarProps, Scrollbars } from 'react-custom-scrollbars-2';
import Measure from 'react-measure';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
interface Props extends ScrollbarProps {
  children?: React.ReactNode;

  className?: string;
}

function Scrollbar(
  {
    children,

    className,
    ...rest
  }: Props,
  ref: any,
): ReactElement {
  const scrollRef = useRef<any>();

  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      ref?.current?.forceUpdate();

      scrollRef?.current?.forceUpdate();
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, scrollRef?.current, ref?.current]);
  const horizontalStyles = {
    backgroundColor: 'var(--pallete-text-main)',
    opacity: 0.2,
    borderRadius: '3px',
  };
  const verticalStyles = {
    backgroundColor: 'var(--pallete-text-main)',
    opacity: 0.2,
    borderRadius: '3px',
  };

  return (
    <Scrollbars
      {...rest}
      className={classNames(className)}
      ref={ref || scrollRef}
      renderThumbHorizontal={(props) => {
        const style = { ...props.style, ...horizontalStyles };
        return <div {...props} style={style} className="thumb-horizontal" />;
      }}
      renderView={(props) => {
        const style = { ...props.style };
        return <div {...props} style={style} className="rc-scrollbar-view" />;
      }}
      renderThumbVertical={(props) => {
        const style = { ...props.style, ...verticalStyles };
        return <div {...props} style={style} className="thumb-vertical" />;
      }}
    >
      <Measure
        bounds
        onResize={() => {
          ref?.current?.forceUpdate();
          scrollRef?.current?.forceUpdate();
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} className="rc-scollbar">
            {children}
          </div>
        )}
      </Measure>
    </Scrollbars>
  );
}
export default styled(forwardRef(Scrollbar))`
  > div:nth-child(3) {
    right: 6px !important;
  }
`;
