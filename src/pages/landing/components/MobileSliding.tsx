import classNames from 'classnames';
import { motion, useAnimation, useInView, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
type Props = {
  className?: string;
  onPlay?: () => void;
};

function MobileSliding({ className, onPlay }: Props) {
  const sr = useScroll();
  const [yprogress, setYprogess] = useState(0);
  const [height, setHeight] = useState(0);

  const refel = useRef<any>(null);
  const refel2 = useRef<any>(null);
  const ref = useRef<any>(null);
  const controls = useAnimation();

  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    if (inView) {
      sr.scrollYProgress.on('change', () => {
        const el = refel?.current?.getBoundingClientRect();
        const imageRef = refel2?.current?.getBoundingClientRect();
        if (refel2.current) {
          if (!height) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setHeight((_) => imageRef.height);
          }
        }
        if (Math.abs(el.y) >= el.height) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          setYprogess((_) => {
            return -el.height;
          });
          return;
        }
        if (el.y <= el.height) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          setYprogess((_) => {
            return el.y > 2 ? 0 : el.y;
          });
        }
      });
    }
    return () => sr.scrollYProgress.destroy();
  }, [inView]);
  useEffect(() => {
    const el = refel?.current?.getBoundingClientRect();
    const imageRef = refel2?.current?.getBoundingClientRect();
    if (imageRef) {
      if (!height) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setHeight((_) => imageRef.height);
      }
    }
    if (el) {
      if (Math.abs(el.y) >= el.height) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setYprogess((_) => {
          return -el.height;
        });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setYprogess((_) => {
        return el.y > 2 ? 0 : el.y;
      });
    }
  }, [refel.current, refel2.current, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.8, delay: 0.3 }}
      variants={variants}
      className={classNames(className, 'modbilesliding')}
    >
      <MobileContaner
        ref={refel}
        className="sp-small-container"
        imgHeight={refel2?.current?.getBoundingClientRect()?.height}
      >
        <div className="sp-visual-mobile">
          <div className="sp-visual-mobile-sticky">
            <div className="sp-visual-product">
              <div className="sp-visual-product-frame">
                <img
                  className="sp-visual-phone-frame"
                  src="/assets/images/landing-page/phone-frame.png"
                  alt="img description"
                  ref={refel2}
                />
                <div className="sp-visual-phone-content">
                  <img
                    className="sp-visual-demo-image"
                    src="/assets/images/landing-page/chatList-White.jpg"
                    alt="img description"
                  />
                  <img
                    className="sp-visual-lock-screen"
                    src="/assets/images/landing-page/lockScreen-Light.jpg"
                    alt="img description"
                    style={{ transform: `translateY(${yprogress}px)` }}
                  />
                </div>
              </div>
              <a
                className="sp-button-play"
                href="#"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onPlay?.();
                }}
                style={{
                  opacity:
                    height !== 0 && Math.abs(yprogress - 100) >= height ? 1 : 0,
                }}
              >
                <img
                  className="sp-play-image"
                  src="/assets/images/landing-page/play-button.svg"
                  alt="Play"
                />
              </a>
            </div>
          </div>
        </div>
      </MobileContaner>
    </motion.div>
  );
}
const MobileContaner = styled.div<{ imgHeight?: number }>`
  .sp-visual-mobile {
    height: ${({ imgHeight }) => {
      return `calc(${window.innerHeight}px + ${
        (imgHeight || 0) + 280 || 280
      }px)`;
    }};
  }
`;
export default styled(MobileSliding)`
  .sp-visual-mobile {
    position: relative;
    display: block;
    width: 100%;

    .sp-visual-mobile-sticky {
      position: sticky;
      top: 110px;
      z-index: 1;
      min-height: auto;
      padding-top: 0;
    }
  }

  .sp-visual-product {
    position: relative;
    top: -30px;
    display: flex;
    overflow: hidden;
    width: 100%;
    padding-top: 1em;
    padding-bottom: 1em;
    flex-direction: column;
    align-items: center;

    .sp-visual-product-frame {
      position: relative;
      width: 400px;

      @media (max-width: 479px) {
        width: 300px;
      }
    }

    .sp-visual-phone-frame {
      position: relative;
      z-index: 1;
      width: 100%;
    }

    .sp-visual-phone-content {
      position: absolute;
      left: 36px;
      top: 36px;
      right: 37px;
      bottom: 35px;
      z-index: -1;
      overflow: hidden;

      @media (max-width: 479px) {
        left: 27px;
        top: 26px;
        right: 27px;
        bottom: 26px;
      }
    }

    .sp-visual-demo-image {
      position: absolute;
      left: 0%;
      top: 0%;
      right: 0%;
      bottom: 0%;
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 40px;
      opacity: 1;
      object-fit: cover;

      @media (max-width: 991px) {
        border-radius: 10px;
      }
    }

    .sp-visual-lock-screen {
      position: absolute;
      left: 0%;
      top: 0%;
      right: 0%;
      bottom: 0%;
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: 36px;
      opacity: 1;
      object-fit: cover;

      @media (max-width: 479px) {
        border-radius: 30px;
      }
    }
  }

  .sp-button-play {
    position: absolute;
    left: 50%;
    top: 50%;
    right: auto;
    bottom: auto;
    z-index: 7;
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    border-radius: 100%;
    transition: box-shadow 200ms ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    /* visibility: hidden; */
    display: none;

    .sp-play-image {
      position: relative;
      border-style: solid;
      border-width: 1px;
      border-color: rgba(250, 88, 83, 0.41);
      border-radius: 100%;
      box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.05);
    }

    &:hover {
      box-shadow: 0 0 9px 4px rgba(0, 0, 0, 0.3);
    }
  }
`;
