import SelfiepopText from 'components/selfipopText';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
function Hero({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="sp-visual-container">
        <div className="sp-small-container">
          <div className="sp-visual-textbox">
            <motion.h1
              animate={{
                skewY: 0,
                opacity: 1,
              }}
              initial={{
                skewY: -5,
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
            >
              Give your fans more of what they want!
            </motion.h1>
            <motion.p
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              initial={{
                translateY: 5,
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.5,
              }}
            >
              The <SelfiepopText /> is the ultimate platform for creators to
              sell the exclusive,
              <br /> members-only content that their superfans want to see!
            </motion.p>
            <motion.div
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              initial={{
                translateY: 9,
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="sp-visual-button"
            >
              <Link to="/signup" className="sp-button-small">
                Click Here to Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default styled(Hero)`
  .sp-visual-textbox {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @media (max-width: 991px) {
      padding-bottom: 10px;
    }

    @media (max-width: 767px) {
      padding-bottom: 15px;
    }
  }

  h1 {
    margin-top: 20px;
    margin-bottom: 11px;
    color: var(--pallete-background-black);
  }

  p {
    margin: 0 0 10px;
  }

  .sp-visual-button {
    display: flex;
    margin-top: 2em;
    margin-bottom: 3em;
  }
`;
