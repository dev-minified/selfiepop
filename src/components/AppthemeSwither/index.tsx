import { motion } from 'framer-motion';
import useAppTheme from 'hooks/useAppTheme';
import SlideAnimation from './SlideAnimation';
import styles from './styles.module.css';

const ReactThemeToggleButton = () => {
  const { mode, toggleAppTheme } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <SlideAnimation type="left" key={mode}>
      <motion.label
        className={styles.container}
        title={isDark ? 'Activate light mode' : 'Activate dark mode'}
        aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}
      >
        <input
          type="checkbox"
          defaultChecked={!isDark}
          onChange={toggleAppTheme}
        />
        <div />
      </motion.label>
    </SlideAnimation>
  );
};

export default ReactThemeToggleButton;
