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
  const controls4 = useAnimation();
  const controls5 = useAnimation();
  const ref = useRef<any>(null);
  const inView = useInView(ref);
  const ref2 = useRef<any>(null);
  const inView2 = useInView(ref2);
  const ref3 = useRef<any>(null);
  const inView3 = useInView(ref3);
  const ref4 = useRef<any>(null);
  const inView4 = useInView(ref4);
  const ref5 = useRef<any>(null);
  const inView5 = useInView(ref5);

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
  useEffect(() => {
    if (inView4) {
      controls4.start('visible');
    }
  }, [controls4, inView4]);
  useEffect(() => {
    if (inView5) {
      controls5.start('visible');
    }
  }, [controls5, inView5]);
  return (
    <div className={className} id={id}>
      <section className="block-success">
        <div className="sp-container">
          <div ref={ref} className="sp-heading-box">
            <motion.h2
              animate={controls}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.1 }}
              variants={variants}
            >
              Dedicated to your success
            </motion.h2>
            <motion.p
              animate={controls}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.2 }}
              variants={variants}
            >
              We are here to help you to make the most
              <br /> out of your career as a digital creator!
            </motion.p>
          </div>
          <div className="sp-text-block">
            <div className="overlay-area">
              <div className="overlay overlay-top"></div>
              <div className="overlay overlay-bottom"></div>
            </div>
            <motion.div
              animate={controls2}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.3 }}
              variants={variants}
              ref={ref2}
              className="sp-text-box"
            >
              <h2>Creator first</h2>
              <p>
                <SelfiepopText /> is a creator first platform. This means that
                we work closely with you to ensure that you have all of the
                tools that you need to maximize your success.
              </p>
              <p>
                If you ever need a feature or have a question, our team is
                always ready to help and is just a few clicks away.
              </p>
            </motion.div>
            <motion.div
              animate={controls3}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.3 }}
              variants={variants}
              ref={ref3}
              className="sp-text-box"
            >
              <h2>Big and Small</h2>
              <p>
                No matter if you have 10,000 followers or 10,000,000{' '}
                <SelfiepopText /> has the features and tools you need to convert
                simple content from your everyday life into a recurring,
                dependable stream of income.
              </p>
            </motion.div>
            <motion.div
              animate={controls4}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.3 }}
              variants={variants}
              ref={ref4}
              className="sp-text-box"
            >
              <h2>No Monthly Fee</h2>
              <p>
                We are partners in your success and only make money when you do.
                There are no monthly fees for running your members-only
                micro-site and it does not cost you anything to get started.
              </p>
            </motion.div>
            <motion.div
              animate={controls5}
              initial="hidden"
              transition={{ duration: 0.8, delay: 0.3 }}
              variants={variants}
              ref={ref5}
              className="sp-text-box"
            >
              <h2>Easy to Create</h2>
              <p>Setting up your pop page is quick, easy and fun.</p>
              <p>
                Simply fill out the setup form and your own private,
                members-only micro-site can be up and running in the next three
                minutes or less!
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default styled(Hero)``;
