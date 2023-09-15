import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from 'theme/logo';
const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
function Hero({ className }: { className?: string }) {
  const controls = useAnimation();
  const ref = useRef<any>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className={className}>
      <footer className="sp-footer">
        <motion.div
          animate={controls}
          initial="hidden"
          transition={{ duration: 0.8, delay: 0.2 }}
          variants={variants}
          ref={ref}
          className="sp-container"
        >
          <div className="sp-bottom-area">
            <div className="sp-left-area">
              <strong className="sp-f-logo">
                <Link to="/">
                  <Logo />
                </Link>
              </strong>
              <ul className="sp-footer-links">
                <li>
                  <Link to="/terms" target="_blank">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/policy" target="_blank">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <p>
              Copyright &copy;{' '}
              <Link to={''} className="f-logo">
                <Logo />
              </Link>{' '}
              Inc.
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
export default styled(Hero)``;
