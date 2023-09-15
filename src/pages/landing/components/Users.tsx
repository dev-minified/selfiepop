import SelfiepopText from 'components/selfipopText';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
function Hero({ className, id }: { className?: string; id?: string }) {
  const controls = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  const ref = useRef<any>(null);
  const inView = useInView(ref);
  const ref2 = useRef<any>(null);
  const inView2 = useInView(ref2);
  const ref3 = useRef<any>(null);
  const inView3 = useInView(ref3);
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  useEffect(() => {
    if (inView2) {
      controls2.start('visible');
    }
  }, [controls2, inView2]);
  useEffect(() => {
    if (inView3) {
      controls3.start('visible');
    }
  }, [controls3, inView3]);
  return (
    <div className={className} id={id}>
      <section className="block-users">
        <div className="sp-container">
          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            transition={{ duration: 0.8 }}
            variants={variants}
            className="sp-block-head"
          >
            <div>
              <h2>
                More than 1,000,000 users <br />
                can't be wrong!
              </h2>
              <p>
                <SelfiepopText /> is the perfect way for you to exchange more
                value with your most loyal fans and followers.
              </p>
            </div>
          </motion.div>
          <div className="sp-two-cols" ref={ref2}>
            <div className="sp-col-holder">
              <motion.article
                animate={controls2}
                initial="hidden"
                transition={{ duration: 0.8, delay: 0.2 }}
                variants={variants}
                className="sp-article"
              >
                <div className="text-holder">
                  <h3>Build deeper connections</h3>
                  <p>
                    Your superfans want to see more of you. They want to know
                    what goes on behind the scenes in your life and they will
                    pay you to be a part of it.
                  </p>
                </div>
                <div className="image-holder">
                  <img
                    src="/assets/images/landing-page/feature-img1.png"
                    alt="feature"
                  />
                </div>
              </motion.article>
            </div>
            <div className="sp-col-holder">
              <motion.article
                animate={controls2}
                initial="hidden"
                transition={{ duration: 0.8, delay: 0.2 }}
                variants={variants}
                className="sp-article"
              >
                <div className="text-holder">
                  <h3>Start making money in minutes..</h3>
                  <p>
                    Simply click the start here button and you too can start
                    growing your social revenue in the next three minutes or
                    less!
                  </p>
                </div>
                <div className="image-holder">
                  <img
                    src="/assets/images/landing-page/feature-img2.png"
                    alt="feature 2"
                  />
                </div>
              </motion.article>
            </div>
          </div>
          <div ref={ref3} className="sp-three-cols">
            <motion.div
              animate={controls3}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.2 }}
              variants={variants}
              className="sp-col-holder"
            >
              <div className="sp-service-box">
                <div className="img-holder">
                  <img
                    src="/assets/images/landing-page/members-white.svg"
                    alt="member"
                  />
                </div>
                <div className="text-holder">
                  <h4>Members Only Microsite</h4>
                  <p>
                    Instantly create a members only microsite offering free and
                    paid membership levels for your fans.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={controls3}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.2 }}
              variants={variants}
              className="sp-col-holder"
            >
              <div className="sp-service-box">
                <div className="img-holder">
                  <img
                    src="/assets/images/landing-page/services-white.svg"
                    alt="services"
                  />
                </div>
                <div className="text-holder">
                  <h4>Downloads &amp; Services</h4>
                  <p>
                    Create digital products, sell physical goods and offer
                    custom digital experiences.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={controls3}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.2 }}
              variants={variants}
              className="sp-col-holder"
            >
              <div className="sp-service-box">
                <div className="img-holder">
                  <img
                    src="/assets/images/landing-page/lock-white.svg"
                    alt="lock"
                  />
                </div>
                <div className="text-holder">
                  <h4>Unlockable Content</h4>
                  <p>
                    Create posts for your paid members that free members can
                    also pay to unlock.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default styled(Hero)``;
