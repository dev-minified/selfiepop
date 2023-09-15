import { createTheme, getTheme } from 'api/theme';
import { ArrowBack } from 'assets/svgs';
import Button from 'components/NButton';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import PublicLayout, { defaultTheme } from 'layout/public';
import PublicProfile from 'pages/[username]';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { setThemes } from 'store/reducer/theme';
import styled from 'styled-components';

const ThemePreview: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useQuery();
  const { user, setUser } = useAuth();
  const dispatch = useAppDispatch();
  const allthemes = useAppSelector((state) => state.theme.allthemes || []);
  const history = useHistory();

  const [appliedTheme, setAppliedTheme] = useState<ITheme>();
  const [isApplying, setIsApplying] = useState<boolean>(false);

  useEffect(() => {
    if (theme) {
      getPreviewTheme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 0);
  }, []);

  const getPreviewTheme = async () => {
    const res = await getTheme(theme as string).catch((e) => console.log(e));
    if (res) {
      setAppliedTheme(res.theme);
    }
  };

  const applySystemTheme = async () => {
    setIsApplying(true);
    await createTheme({
      ...appliedTheme,
      isSystemTheme: false,
      isPublished: false,
      isDefault: false,
      isActive: true,
      baseURL: `${window.location.host}/${user.username}`,
      categoryId: (appliedTheme?.categoryId as any)?._id,
    })
      .then((res) => {
        dispatch(setThemes([...allthemes, res?.theme]));
        setUser({ ...user, userThemeId: res.theme });
        history.push('/my-profile');
      })
      .catch(console.log);

    setIsApplying(false);
  };

  const Header = () => (
    <div className="theme-preview-header">
      <Link to="/theme-library" className="btn-back" type="text">
        <span className="img">
          <ArrowBack />
        </span>
        Back
      </Link>
      <div className="middle">
        <h5>
          You are previewing theme: <span>{appliedTheme?.name}</span>
        </h5>
        <div className="action">
          <Button
            type="primary"
            shape="circle"
            isLoading={isApplying}
            onClick={() => {
              applySystemTheme();
            }}
          >
            Apply Theme
          </Button>
          <Button
            type="info"
            color="#D4D4D4"
            shape="circle"
            onClick={() => {
              history.push('/theme-library');
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {appliedTheme ? <Header /> : null}
      <div className="theme-preview-content">
        <PublicLayout
          showFooter={false}
          enableTheme={true}
          theme={appliedTheme || defaultTheme}
          user={appliedTheme ? user : null}
        >
          <PublicProfile preview />
        </PublicLayout>
      </div>
    </div>
  );
};

export default styled(ThemePreview)`
  padding-top: 60px;
  @media (max-width: 1023px) {
    padding-top: 105px;
  }
  .theme-preview-header {
    background: var(--pallete-background-gray);
    padding: 10px 80px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;

    @media (max-width: 1023px) {
      padding: 18px 20px 15px;
      background: var(--pallete-background-default);
    }

    h5 {
      text-align: center;
      margin: 0;
      font-size: 18px;
      line-height: 20px;
      font-weight: 500;
      margin: 0 15px 0 0;

      @media (max-width: 1023px) {
        width: 100%;
        margin: 0;
        font-weight: 300;
        color: var(--pallete-text-main-450);
      }

      span {
        color: var(--pallete-primary-darker);

        @media (max-width: 1023px) {
          font-weight: 700;
          color: var(--pallete-text-main-450);
        }
      }
    }

    .btn-back {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translate(0, -50%);
      color: var(--pallete-primary-darker);

      @media (max-width: 1023px) {
        display: none;
      }

      .img {
        width: 18px;
        height: 18px;
        display: inline-block;
        vertical-align: top;
        margin: 2px 6px 0 0;
      }

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .middle {
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 1023px) {
        display: block;
      }

      .action {
        @media (max-width: 1023px) {
          text-align: center;
          padding: 16px 0 0;
        }
      }

      .button {
        @media (max-width: 1023px) {
          padding: 5px 10px;
          min-width: 127px;
          font-size: 13px;
          line-height: 18px;
        }
      }
    }
  }
`;
