import { DefaultProfile } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import styled, { withTheme } from 'styled-components';

const StyledCover = styled.div`
  height: 190px;
  z-index: 1;
  ${({ theme }) => {
    switch (theme.cover?.size) {
      case 'default':
        return `
          height: 290px;
          max-width: 950px;
          margin-left: auto;
          margin-right: auto;
        `;
      case 'small':
        return `
          height: 290px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        `;
      default:
        return '';
    }
  }}
`;

const StyledProfile = styled.div`
  margin-bottom: 30px;
  .profile--photo {
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.12);
  }

  ${({ theme }) => {
    switch (theme.profile?.size) {
      case 'medium':
        return `
          .profile--photo {
            width: 226px;
            height: 226px;

            svg {
              max-width: 124px;
              margin: 0 0 0 22px;
            }
          }
        `;
      case 'large':
        return `
          .profile--photo {
            width: 312px;
            height: 312px;

            @media (max-width: 767px) {
              width: 260px;
              height: 260px;
            }

            svg {
              max-width: 170px;
              margin: 0 0 0 32px;
              width: 100%;

              @media (max-width: 767px) {
                max-width: 150px;
              }
            }
          }
        `;
      default:
        return `
          margin-top: -80px;

          .profile--photo {
            width: 160px;
            height: 160px;

            svg {
              max-width: 70px;
              width: 100%;
              margin: 0 0 0 12px;
            }
          }
        `;
    }
  }}

  ${({ theme }) => (!theme?.cover?.isActive ? 'margin-top: 40px;' : '')}

  ${({ theme }) => {
    switch (theme?.profile?.pstyle) {
      case 'outlile-soft-square':
        return `
          .profile--photo {
            border-radius: 20px;
            box-shadow: none;

            &:before {
              border-radius: 20px;
            }
          }
          .profile--photo img {
            border-radius: 16px;
          }
        `;
      case 'outlile-circule':
        return `
          .profile--photo {
            box-shadow: none
          }
        `;
      case 'outlile-sharp-square':
        return `
          .profile--photo {
            border-radius: 0;
            box-shadow: none;

            &:before {
              border-radius: 0;
            }
          }
          .profile--photo img {
            border-radius: 0;
          }
        `;
      case 'filled-soft-square':
        return `
          .profile--photo {
            border: none;
            border-radius: 20px;
            box-shadow: none;

            &:before {
              display: none;
            }
          }
          .profile--photo img {
            border-radius: 16px;
          }
        `;
      case 'filled-circule':
        return `
          .profile--photo {
            border: none;
            box-shadow: none;

            &:before {
              display: none;
            }
          }
        `;
      case 'filled-sharp-square':
        return `
          .profile--photo {
            border: none;
            border-radius: 0;
            box-shadow: none;

            &:before {
              display: none;
            }
          }
          .profile--photo img {
            border-radius: 0;
          }
        `;
      case 'outline-soft-shadow-soft-square':
        return `
          .profile--photo {
            border-radius: 20px;

            &:before {
              border-radius: 20px;
            }
          }
          .profile--photo img {
            border-radius: 16px;
          }
        `;
      case 'outline-soft-shadow-hard-square':
        return `
          .profile--photo {
            border-radius: 0;

            &:before {
              border-radius: 0;
            }
          }
          .profile--photo img {
            border-radius: 0;
          }
        `;
      case 'outline-hard-shadow-soft-square':
        return `
          .profile--photo {
            border-radius: 20px;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);

            &:before {
              border-radius: 20px;
            }
          }
          .profile--photo img {
            border-radius: 16px;
          }
        `;
      case 'outline-hard-shadow-cirule':
        return `
          .profile--photo {
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
          }
        `;
      case 'outline-hard-shadow-hard-square':
        return `
          .profile--photo {
            border-radius: 0;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);


            &:before {
              border-radius: 0;
            }
          }
          .profile--photo img {
            border-radius: 0;
          }
        `;
      case 'outline-soft-shadow-cirule':
      default:
        return '';
    }
  }}

  ${({ theme }) => {
    return `
      .profile--photo {
        background-color: ${theme?.profile?.backgroundColor || '#ffffffff'};
        color: ${theme?.profile?.avatarPlaceholderColor || '#255b87'}
      }
      .profile--photo img {
        opacity: ${(theme?.profile?.opacity ?? 100) / 100};
        filter: grayscale(${theme?.profile?.grayscale ?? 0}%);
        ${
          theme?.profile?.blendMode
            ? 'mix-blend-mode: ' + theme?.profile?.blendMode
            : ''
        }
      }
      .profile--photo:before {
        border-color: ${theme?.profile?.outlineColor || '#ffffff'}
      }
    `;
  }}
`;

const PublicHeader: React.FC<{
  applyFullTheme?: boolean;
  theme?: ITheme & { profile: ITheme['profile'] & { profileImage?: string } };
  user?: IUser;
}> = (props) => {
  const { applyFullTheme, theme, user } = props;

  const profileImage = theme?.profile?.profileImage ?? user?.profileImage;
  return (
    <div className="visual-frame" style={{ zIndex: 3 }}>
      {theme?.cover?.isActive && (
        <div className="visual">
          <StyledCover className="visual--image">
            <AnimatePresence>
              {applyFullTheme && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ height: '100%' }}
                >
                  {user ? (
                    <ImageModifications
                      onContextMenu={(e) => e.preventDefault()}
                      src={
                        props.theme?.cover?.image ||
                        '/assets/images/default-bg.png'
                      }
                      imgeSizesProps={{
                        checkspexist: true,
                      }}
                      fallbackUrl={'/assets/images/default-bg.png'}
                      alt="img description"
                    />
                  ) : (
                    <Skeleton height="100%" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </StyledCover>
        </div>
      )}

      {theme?.profile?.isActive && (
        <div className="container">
          <StyledProfile className="text-center profile">
            <div
              className="profile--photo"
              onContextMenu={(e) => e.preventDefault()}
            >
              {theme && user ? (
                profileImage ? (
                  <ImageModifications
                    src={profileImage || '/assets/images/svg/profile.svg'}
                    fallbackUrl={'/assets/images/svg/profile.svg'}
                    imgeSizesProps={{
                      onlyDesktop: true,
                      // defaultUrl: '/assets/images/svg/profile.svg',

                      imgix: { all: 'w=163&h=163' },
                    }}
                    alt="img description"
                  />
                ) : (
                  <DefaultProfile />
                )
              ) : (
                <Skeleton circle width="100%" height="100%" />
              )}
            </div>
          </StyledProfile>
        </div>
      )}
    </div>
  );
};

export default withTheme(PublicHeader);
