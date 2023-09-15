import { create, updatePop } from 'api/Pop';
import { update } from 'api/User';
import { upload } from 'api/Utils';
import { createSocialAccount } from 'api/social-accounts';
import {
  ArrowRightFilled,
  Correct,
  FacebookSquare,
  InstagramSquare,
  SnapChat,
  TicTocSquare,
  TwitterSquare,
  YoutubeSquare,
} from 'assets/svgs';
import classNames from 'classnames';
import Button from 'components/NButton';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import swal from 'sweetalert';
import { useAnalytics } from 'use-analytics';
// import OutlineTagger from 'components/Tags/OutlineTagger';
import { socialLinksPrefix } from 'appconstants';
import { crop } from 'components/UploadandEditor/cropImage';
import { toast } from 'components/toaster';
import { ServiceType, SocialPlatformschecks } from 'enums';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import CoverImageEditor from 'pages/my-profile/components/Editor/CoverImageEditor';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import { setCurrentTheme } from 'store/reducer/theme';
import styled from 'styled-components';
import { dataURLtoFile, isValidUrl, onboardingSequency } from 'util/index';
import * as yup from 'yup';
import ProfileImageEditor from './components/profileEditor';
type IPredefiendLinks = {
  url: string;
  type: string;
  platfromUrl: string;
  _id?: string;
};
const OptionComponent = (props: Record<string, any>) => {
  const { onClick, value, content, className, label } = props;
  return (
    <div
      onClick={onClick}
      className={`${classNames(className)} onboarding-option-item`}
    >
      <Checkbox
        className="make_it_required"
        name="allowBuyerToMessage"
        defaultChecked={false}
        checked={value}
        // onChange={(e: any) => console.log(e.target.name, e.target.checked)}
        label={label}
        value={value}
      />
      {content && (
        <ul className="onboarind-features-list">
          {(content || []).map((ele: any, index: number) => {
            return (
              <li key={index}>
                <>
                  <span className="img">{ele.icon}</span>
                  <strong>{ele.title}</strong>
                  <span dangerouslySetInnerHTML={{ __html: ele.discription }} />
                </>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
const PredefiendLinks: IPredefiendLinks[] = [
  {
    url: '',
    type: 'instagram',
    platfromUrl: 'https://www.instagram.com/',
  },
  {
    url: '',
    type: 'tiktok',
    platfromUrl: 'https://www.tiktok.com/',
  },
  {
    url: '',
    type: 'twitter',
    platfromUrl: 'https://www.twitter.com/',
  },
  {
    url: '',
    type: 'youtube',
    platfromUrl: 'https://www.youtube.com/c/',
  },
  {
    url: '',
    type: 'facebook',
    platfromUrl: 'https://www.facebook.com/',
  },
  {
    url: '',
    type: 'snapchat',
    platfromUrl: 'https://www.snapchat.com/add/',
  },
];
const validationSchema = yup.object().shape({
  pageTitle: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long!'),
  // .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter valid username'),
});

const defaultchatSub = {
  popType: 'chat-subscription',
  isActive: true,
  price: 5,
  actionText: 'Exclusive Content',
  priceVariations: [
    {
      price: 0,
      title: 'Free Membership',
      description: '',
      isActive: true,
      isArchive: false,
      questions: [],
      isDefault: true,
      allowBuyerToMessage: true,
      allowContentAccess: true,
      allowUpsaleOffer: true,
      type: 'simple',
    },
  ],
};
function OnboardingProfilePhoto({ className, title, ...rest }: any) {
  const { user, setUser }: any = useAuth();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const analytics = useAnalytics();
  const ref = useRef<any>(null);
  const [socialErrors, setSocialErrors] = useState<Record<string, any>>({});
  const [creator, setIsCreator] = useState<boolean>(false);
  const [selected, setselected] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [coverPhoto, setCoverPhoto] = useState<{
    image: string;
    isActive: boolean;
  }>({
    image: '',
    isActive: false,
  });
  const {
    values,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    setFieldError,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      profileImage: user?.profileImage,
      tagLine: user?.tagLine,
      IsCreator: true,
      description: user?.description,
      pageTitle: user?.pageTitle,
      tags: user?.tags || '',
      predefiendLinks: PredefiendLinks?.map((link: IPredefiendLinks) => {
        const socialLink = user?.socialMediaLinks?.find(
          (socialLink: IPredefiendLinks) => socialLink?.type === link?.type,
        );
        if (socialLink) {
          link = socialLink;
        }
        return link;
      }),
      Links: user.links,
      imageData: '',
      filename: '',
    },
    validateOnChange: true,
    onSubmit: async (values) => {
      const { predefiendLinks } = values;

      const altestOneIsFilled = predefiendLinks.findIndex(
        (item: IPredefiendLinks) => item.url.length,
      );
      const incorrectUrl = predefiendLinks.filter(
        (item: IPredefiendLinks) =>
          item.url.length &&
          isValidUrl(item.url) &&
          !item.url.includes(
            SocialPlatformschecks[
              item.type as keyof typeof SocialPlatformschecks
            ],
          ),
      );
      if (altestOneIsFilled === -1) {
        toast.error('Requires at least one social media link to continue.');
        scrollIntoView(ref.current, {
          behavior: 'smooth',
          scrollMode: 'if-needed',
          block: 'center',
          inline: 'nearest',
        });
        setFieldError('predefiendLinks', 'Please provide at least one link.');
        return;
      } else if (incorrectUrl?.length) {
        const err: Record<string, any> = {};
        incorrectUrl.forEach(
          (inc: IPredefiendLinks) =>
            (err[inc.type] = `Provide valid ${inc.type} url`),
        );
        setSocialErrors(err);
        return;
      }

      const pLinks = values.predefiendLinks
        .filter((i: IPredefiendLinks) => i?.url?.trim().length)
        .map((i: IPredefiendLinks) => {
          const platformUrl = socialLinksPrefix.find(
            (l) => l.type === i.type,
          )?.platformUrl;
          let url;
          if (isValidUrl(i.url)) {
            url = i.url;
          } else {
            if (i.type === 'tiktok') {
              url = i?.url?.trim()?.length
                ? `${platformUrl}@${i?.url.replace('@', '')}`
                : '';
            } else {
              url = i?.url?.trim()?.length
                ? `${platformUrl}${i?.url.replaceAll('@', '')}`
                : '';
            }
          }
          return { ...i, url };
        });

      const userLinks = values.Links.map((item: IUserLink) => {
        if (item.platfrom?.length) {
          return {
            ...item,
            url: pLinks.find((i: IPredefiendLinks) => i.type === item.platfrom)
              ?.url,
          };
        }
        return item.linkType === 'service'
          ? {
              ...item,
              popLinksId: item?.popLinksId?._id,
            }
          : item;
      }).filter((lnk: IUserLink) => {
        if (lnk.platfrom && !lnk.url?.trim().length) {
          return false;
        }
        return true;
      });
      const advertisePop = user.links.find(
        (pop: any) => pop.popLinksId?.popType === ServiceType.ADVERTISE,
      );
      if (advertisePop?.popLinksId) {
        const getSocial = { ...advertisePop?.popLinksId };
        getSocial.priceVariations = await Promise.all(
          pLinks
            .filter((l) => !l?._id)
            .map(async (l: IPredefiendLinks) => {
              const account = await createSocialAccount({
                name: l.type,
                url: l.url,
                type: l.type,
              });
              return {
                isActive: false,
                question: [],
                price: 50,
                description: '',
                stats: {
                  label: l.type,
                  value: account?.socialLink?._id,
                  url: l.url,
                  type: l.type,
                },
                title: l.type,
                type: l.type,
              };
            }),
        );
        await updatePop(getSocial, getSocial?._id);
      }
      const Links = user?.links?.find(
        (l: IUserLink) => l.linkType === 'socialLinks',
      )
        ? [...userLinks]
        : [
            ...userLinks,
            {
              title: 'Social Links',
              isActive: true,
              linkType: 'socialLinks',
              sortOrder: 1000,
            },
          ];

      if (!creator) {
        const ischateist = user.links?.find(
          (l: any) => l?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
        );
        if (ischateist) {
          const defaultchatsub = ischateist.popLinksId.priceVariations.map(
            (p: any) => {
              if (p.isDefault) {
                return { ...p, title: 'Free Membership', price: 0 };
              }
              return p;
            },
          );
          await updatePop(
            {
              priceVariations: defaultchatsub,
            },
            ischateist?.popLinksId?._id,
          );
        } else {
          const resp = await create({
            ...defaultchatSub,
            popName: 'chat',
          });
          Links.push(resp?.pop);
        }
      }
      const u = await update({
        userSetupStatus: creator ? 1 : 2,
        ...values,
        links: Links,
        socialMediaLinks: pLinks,
        isCreator: creator,
      });
      setUser(u.data);
      if (values?.imageData) {
        const cropped = await crop(values.imageData, 16 / 9);
        const file = dataURLtoFile(cropped.toDataURL(), values.filename);
        const form = new FormData();
        form.append('file', file);
        form.append('folder', 'users/link-image');

        const data = await upload('/image/upload', form).catch(() => {
          toast.error('Sorry, Please try again');
        });
        await Promise.all(
          values.Links.filter(
            (item: IUserLink) => item.linkType === 'service',
          ).map((item: IUserLink) => {
            return updatePop(
              {
                additionalArt: [
                  {
                    artName: file.name,
                    artPath: data.imageURL,
                    artType: file.type,
                  },
                ],
              },
              item.popLinksId?._id!,
            );
          }),
        ).catch(console.log);
      }

      analytics.track('new_reg_step_1', {
        url: window.location.href,
        onboardingFlowTypeId: user.onboardingTypeId,
        flowVersion: 1,
      });
      const onBoardRoute = onboardingSequency;
      history.push(onBoardRoute[creator ? 1 : 2]);
    },
  });

  useEffect(() => {
    if (user?._id) {
      const ischateist = user.links?.find(
        (l: any) => l?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
      );
      if (ischateist) {
        setIsCreator(user?.isCreator);
        setselected('creator');
      } else {
        if (user?.isCreator) {
          setIsCreator(user?.isCreator);
          setselected('creator');
        }
      }
    }
    if (user?.userSetupStatus < 9) {
      delete (values as any)?.imageData;
      setUser({
        ...user,
        ...values,
        userThemeId: {
          ...user?.userThemeId,
          profile: {
            ...user?.userThemeId?.profile,
            image: values.profileImage,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
  useEffect(() => {
    if (user?.userSetupStatus < 9) {
      if (user?.userSetupStatus !== 0) {
        setUser({
          ...user,
          userSetupStatus: 0,
        });
        update({
          userSetupStatus: 0,
        });
      }
    }
  }, []);
  useEffect(() => {
    // if (!user.tags) {
    //   setFieldValue('tags', '');
    // }
    if ((rest as any)?.onleftscrollposition) {
      (rest as any)?.onleftscrollposition(300);
    }
  }, []);
  useEffect(() => {
    dispatch(setCurrentTheme(user?.userThemeId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const handleUpdateCover = async (value: any) => {
    setIsUpdating(true);
    const res: any = await update({
      coverPhoto: { ...value, isActive: true },
    }).catch((e) => {
      swal('Error', e.message, 'error');
    });
    if (res) {
      setUser({ ...user, ...res.data });
      swal('', res.message, 'success');
    }
    setIsUpdating(false);
  };
  const { profileImage, tagLine, pageTitle, predefiendLinks } = values;
  return (
    <>
      <form className={className} onSubmit={handleSubmit}>
        <div className="profile--info">
          <h3>Great! Now let’s set up your {title}...</h3>
        </div>
        <div className="mb-40 card">
          <CoverImageEditor
            value={coverPhoto as any}
            onChange={(name: string, value: any) => {
              setCoverPhoto(value);
              handleUpdateCover(value);
            }}
            name="coverPhoto"
            showAdvanceOption={false}
          />
        </div>
        <div className="mb-40">
          <ProfileImageEditor
            value={profileImage}
            onChange={(url: string, imageData: string, filename: string) => {
              setFieldValue('imageData', imageData);
              setFieldValue('profileImage', url);
              setFieldValue('filename', filename);
            }}
          />
        </div>

        <div>
          <div className="field-holder mb-45 ">
            <div className="label-area">
              <strong className="label">Please choose your Name?</strong>
            </div>
            <FocusInput
              materialDesign
              label="Your Name"
              onChange={(e) => {
                handleChange(e);
              }}
              name="pageTitle"
              onBlur={handleBlur}
              value={pageTitle}
              touched={touched.pageTitle}
              error={errors.pageTitle}
            />
          </div>
          <div className="field-holder mb-45">
            <div className="label-area">
              <strong className="label">
                Would you like to add an optional tag line?
              </strong>
            </div>
            <FocusInput
              materialDesign
              label="Tag line"
              onChange={handleChange}
              name="tagLine"
              onBlur={handleBlur}
              value={tagLine}
              touched={touched.tagLine}
              error={errors.tagLine}
            />
          </div>
        </div>
        {/* <div className="mb-5 field-holder mb-md-5">
          <div className="label-area">
            <strong className="label">Tell us a bit about your Page.</strong>
            <span className="description-text">
              Select up to 3 tags that best describe your Pop Page. We'll
              customize your Selfie Pop experience based on your interests.
            </span>
          </div>
          <OutlineTagger
            selectedTags={tags}
            onChange={(tags) => setFieldValue('tags', tags)}
            selectionLimit={3}
          />
        </div> */}
        <div className="mb-10 content_component">
          <div className="label-area">
            <strong className="label">Social Links</strong>
            <span className="description-text">
              Input your social media links or handles in the fields below.
            </span>
          </div>
          {errors.predefiendLinks && (
            <strong className="mb-10 text-danger">
              {errors.predefiendLinks as string}
            </strong>
          )}

          <div className="defualt_field mb-45" ref={ref}>
            <FocusInput
              className="mb-15"
              label="Instagram"
              materialDesign
              name="predefiendLinks[0].url"
              value={predefiendLinks[0].url}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  [predefiendLinks[0].type]: null,
                }));
                handleChange(e);
              }}
              onBlur={handleBlur}
              prefixElement={<InstagramSquare />}
              validations={[{ noSpace: true }]}
              touched={true}
              error={socialErrors.instagram}
            />
            <FocusInput
              label="TikTok"
              materialDesign
              name="predefiendLinks[1].url"
              value={predefiendLinks[1].url}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  [predefiendLinks[1].type]: null,
                }));
                handleChange(e);
              }}
              onBlur={handleBlur}
              prefixElement={<TicTocSquare />}
              validations={[{ noSpace: true }]}
              touched={true}
              error={socialErrors.tiktok}
            />
            <FocusInput
              label="Twitter"
              materialDesign
              name="predefiendLinks[2].url"
              value={predefiendLinks[2].url}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  [predefiendLinks[2].type]: null,
                }));
                handleChange(e);
              }}
              onBlur={handleBlur}
              prefixElement={<TwitterSquare />}
              validations={[{ noSpace: true }]}
              touched={true}
              error={socialErrors.twitter}
            />
            <FocusInput
              label="Youtube"
              materialDesign
              name="predefiendLinks[3].url"
              value={predefiendLinks[3].url}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  [predefiendLinks[3].type]: null,
                }));
                handleChange(e);
              }}
              onBlur={handleBlur}
              prefixElement={<YoutubeSquare />}
              validations={[{ noSpace: true }]}
              touched={true}
              error={socialErrors.youtube}
            />
            <FocusInput
              label="Facebook"
              materialDesign
              name="predefiendLinks[4].url"
              value={predefiendLinks[4].url}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  [predefiendLinks[4].type]: null,
                }));
                handleChange(e);
              }}
              onBlur={handleBlur}
              validations={[{ noSpace: true }]}
              prefixElement={<FacebookSquare />}
              touched={true}
              error={socialErrors.facebook}
            />
            <FocusInput
              label="Snapchat"
              materialDesign
              name="predefiendLinks[5].url"
              value={predefiendLinks[5].url}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  [predefiendLinks[5].type]: null,
                }));
                handleChange(e);
              }}
              onBlur={handleBlur}
              validations={[{ noSpace: true }]}
              prefixElement={<SnapChat />}
              touched={true}
              error={socialErrors.snapchat}
            />
          </div>
          <div className="onboarding-options-area">
            <h3>Please choose from one of the following options:</h3>
            <OptionComponent
              label="I am a CREATOR & want to EARN"
              className={{ active: selected && creator }}
              content={[
                {
                  icon: <Correct />,
                  discription: ' your exclusive content',
                  title: 'SELL',
                },
                {
                  icon: <Correct />,
                  discription: ' your subscriptions',
                  title: 'CREATE',
                },
                {
                  icon: <Correct />,
                  discription: ' for custom videos',
                  title: 'CHARGE',
                },
                {
                  icon: <Correct />,
                  discription: ' and get paid',
                  title: 'GO LIVE',
                },
                {
                  icon: <Correct />,
                  discription: ' for Q&A',
                  title: 'GET PAID',
                },
                {
                  icon: <Correct />,
                  discription: ' your promotions',
                  title: 'MONETIZE',
                },
              ]}
              value={selected && creator}
              onClick={() => {
                setselected('creator');
                setIsCreator(true);
              }}
            />
            <OptionComponent
              label="I just want to SHARE my LINKS"
              className={{ active: selected && !creator }}
              content={[
                {
                  icon: <Correct />,
                  discription: ' your socials with your selfiepop™ link',
                  title: 'PROMOTE',
                },
                {
                  icon: <Correct />,
                  discription: ' your page for <strong>FREE</strong> ',
                  title: 'CUSTOMIZE',
                },
                {
                  icon: <Correct />,
                  discription: ' your link on your socials',
                  title: 'MARKET',
                },
                {
                  icon: <Correct />,
                  discription: ' your fans learn more about you ',
                  title: 'LET',
                },
                {
                  icon: <Correct />,
                  discription: ' centralized place for everything ',
                  title: 'ONE',
                },
                {
                  icon: <Correct />,
                  discription: ' to creator at anytime',
                  title: 'CONVERT',
                },
              ]}
              value={selected && !creator}
              onClick={() => {
                setselected('not_creator');

                setIsCreator(false);
              }}
            />
          </div>
        </div>
        <div className="text-center button-holder">
          <Button
            htmlType="submit"
            isLoading={isSubmitting}
            type="primary"
            size="large"
            block
            disabled={!selected || isSubmitting}
          >
            Next Step{' '}
            <span className="img">
              <ArrowRightFilled />
            </span>
          </Button>
        </div>
      </form>
    </>
  );
}

export default styled(OnboardingProfilePhoto)`
  padding: 0 20px 110px;
  position: relative;
  overflow: hidden;

  @media (max-width: 767px) {
    padding: 0 0 10px;
  }

  .button-holder {
    border-top: 1px solid var(--pallete-colors-border);
    padding: 30px 30px 30px 40px;
    position: fixed;
    left: 0;
    right: 0;
    /* width: 599px; */
    bottom: 0;
    background: var(--pallete-background-default);
    z-index: 11;
    .img {
      margin: 0 0 0 8px;
    }

    @media (max-width: 1023px) {
      width: auto;
      right: 0;
    }

    @media (max-width: 767px) {
      padding: 15px 20px;
    }
    .button {
      max-width: 615px;
      margin: 0 auto;
    }
  }

  .logo-holder {
    width: 152px;
    margin: 0 0 36px;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .steps-detail {
    font-size: 18px;
    line-height: 21px;
    font-weight: 500;
    margin: 0 0 33px;
  }

  .profile--info {
    position: relative;
  }

  h3 {
    font-size: 22px;
    line-height: 26px;
    font-weight: 500;
    margin: 0 0 30px;
  }

  h6 {
    font-size: 15px;
    line-height: 18px;
    margin: 0 0 20px;
    font-weight: 500;
  }

  .label-area {
    margin: 0 0 15px;
  }

  .label {
    display: block;
    margin: 0 0 8px;
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
  }

  .description-text {
    display: block;
    color: var(--pallete-text-main-300);
    font-size: 14px;
    line-height: 18px;
  }

  .onboarding-options-area {
    position: relative;
    overflow: hidden;
  }

  .onboarding-option-item {
    padding: 20px 15px;
    border: 2px solid var(--pallete-colors-border);
    border-radius: 8px;
    margin: 0 0 28px;
    transition: all 0.4s ease;

    &.active {
      border-color: var(--pallete-primary-main);
    }

    .checkbox {
      margin: 0 0 15px;

      .custom-input {
        width: 27px;
        height: 27px;
        border: 2px solid var(--pallete-colors-border);
      }

      input[type='checkbox'] {
        + .custom-input-holder {
          .custom-input {
            &:before {
              font-size: 11px;
              z-index: 2;
              color: #fff;
            }
          }
        }

        &:checked {
          + .custom-input-holder {
            .custom-input {
              border-color: var(--pallete-primary-main);
              &:after {
                opacity: 1;
                background: var(--pallete-primary-main);
                border-color: var(--pallete-primary-main);
              }
            }
          }
        }
      }

      label {
        padding: 0;

        &:hover {
          .custom-input {
            &:after {
              opacity: 0;
            }
          }
        }
      }

      .label-text {
        font-size: 18px;
        line-height: 24px;
        font-weight: 500;
        color: var(--pallete-text-main);
      }
    }
  }

  .onboarind-features-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-weight: 400;
    color: var(--pallete-text-main-300);

    li {
      margin: 0 0 12px;
      position: relative;
      padding: 0 0 0 28px;
    }

    strong {
      font-weight: 500;
      color: var(--pallete-text-main);
    }

    .img {
      position: absolute;
      left: 6px;
      width: 13px;
      top: 6px;

      svg {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }
`;
