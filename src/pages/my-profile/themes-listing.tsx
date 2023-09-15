import { useIsPresent } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { isBrowser } from 'react-device-detect';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import {
  setCurrentTheme,
  setSystemThemes,
  setThemes,
  setThemesCount,
} from 'store/reducer/theme';
import styled from 'styled-components';
import { startThemePolling, stopThemePolling } from 'util/index';
import ThemesListingComponent from './components/Editor/ThemesListing';

const ThemesListing = forwardRef(
  (
    {
      className,
      refobj,
      ...rest
    }: {
      className?: string;
      setIsApplyModalOpen?: (isOpen: boolean) => void;
      refobj?: MutableRefObject<any>;
    },
    ref,
  ) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const parentref: any = useRef();
    const pollingref: any = useRef(false);
    const isPresent = useIsPresent();
    const {
      allthemes = [],
      systemThemes = [],
      totalThemesCount = { systemthemeCount: 0, userThemeCount: 0 },
    } = useAppSelector((state) => state.theme);
    useEffect(() => {
      if (!isPresent) {
        dispatch(setCurrentTheme(undefined));
        rest.setIsApplyModalOpen?.(false);
      }

      return () => {
        if (isPresent && isBrowser) {
          dispatch(setCurrentTheme(undefined));

          rest.setIsApplyModalOpen?.(false);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresent]);
    useImperativeHandle(ref || refobj, () => ({
      handleScroll: () => {
        if (!pollingref.current) {
          const totalThemes =
            totalThemesCount.systemthemeCount + totalThemesCount.userThemeCount;
          const currentTotalThems = allthemes.length + systemThemes.length;
          const isAllowToSend = totalThemes > currentTotalThems;

          if (isAllowToSend) {
            // eslint-disable-next-line
            setLoading((_) => true);
            pollingref.current = true;
            startThemePolling({
              callBack: (props: ThemeProps) => {
                // eslint-disable-next-line
                setLoading((_) => false);
                dispatch(setThemes([...allthemes, ...props.userThemes]));
                dispatch(
                  setSystemThemes([...systemThemes, ...props.systemThemes]),
                );
                dispatch(setThemesCount(props.totalThemesCount));
              },
              query: {
                limit: 10,
                skip:
                  allthemes.length > systemThemes.length
                    ? allthemes.length
                    : systemThemes.length,
              },
            })
              .catch(() => {})
              .finally(() => {
                pollingref.current = false;
                // eslint-disable-next-line
                setLoading((_) => false);
              });
          }
        }
      },
    }));
    useEffect(() => {
      setTimeout(() => {
        if (parentref.current) {
          scrollIntoView(parentref.current!, {
            behavior: 'smooth',
            scrollMode: 'if-needed',
            block: 'start',
          });
        }
      }, 700);
      setLoading(true);
      startThemePolling({
        callBack: (props: ThemeProps) => {
          setLoading(false);
          dispatch(setThemes(props.userThemes));
          dispatch(setSystemThemes(props.systemThemes));
          dispatch(setThemesCount(props.totalThemesCount));
        },
        query: {
          limit: 10,
          skip: 0,
        },
      }).finally(() => {
        pollingref.current = false;
      });
      return () => {
        stopThemePolling();
      };
    }, [dispatch]);

    return (
      <div className={className} ref={parentref}>
        <ThemesListingComponent {...rest} isThemesLoading={loading} />
      </div>
    );
  },
);

export default styled(ThemesListing)`
  padding: 19px 16px 0;
`;
