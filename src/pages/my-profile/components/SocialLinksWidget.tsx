import { socialLinksPrefix } from 'appconstants';
import {
  FacebookSquare,
  Link,
  RecycleBin,
  SnapChat,
  ThumbsUp,
  TicTocSquare,
  TwitterSquare,
  YoutubeSquare,
} from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import Card from 'components/SPCards';
import Switchbox from 'components/switchbox';
import { SocialPlatformschecks } from 'enums';
import { useFormik } from 'formik';
import { ILinkEditorProps } from 'interfaces/ILinkEditorProps';
import React, { useEffect, useState } from 'react';
import { isValidUrl } from 'util/index';

interface Props extends ILinkEditorProps {
  user: IUser;
}

const SocialLinksWidget: React.FC<Props> = (props) => {
  const { value, user, options, onDeleteClick, onCancel, onSubmit } = props;
  const [socialErrors, setSocialErrors] = useState<Record<string, any>>({});

  const {
    values,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleSubmit,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      _id: undefined,
      isActive: true,
      links: {
        instagram:
          user?.socialMediaLinks?.find((l) => l.type === 'instagram')?.url ||
          '',
        youtube:
          user?.socialMediaLinks?.find((l) => l.type === 'youtube')?.url || '',
        facebook:
          user?.socialMediaLinks?.find((l) => l.type === 'facebook')?.url || '',
        tiktok:
          user?.socialMediaLinks?.find((l) => l.type === 'tiktok')?.url || '',
        twitter:
          user?.socialMediaLinks?.find((l) => l.type === 'twitter')?.url || '',
        snapchat:
          user?.socialMediaLinks?.find((l) => l.type === 'snapchat')?.url || '',
      },
    },
    validateOnChange: true,
    onSubmit: async (values) => {
      let isInvalid = false;
      const invalidUrls: Record<string, string> = {};
      Object.entries(values.links).forEach(([key, value]) => {
        if (
          value &&
          isValidUrl(value) &&
          !value.includes(
            SocialPlatformschecks[key as keyof typeof SocialPlatformschecks],
          )
        ) {
          isInvalid = true;
          invalidUrls[key] = `Please provide valid ${key} url`;
        }
      });
      if (isInvalid) {
        setSocialErrors(invalidUrls);
        return;
      }
      await onSubmit?.({
        id: values._id,
        isActive: values.isActive,
        socialMediaLinks: Object.entries(values.links)
          .map(([key, value]) => {
            const platformUrl = socialLinksPrefix.find(
              (l) => l.type === key,
            )?.platformUrl;
            let url;
            if (isValidUrl(value)) {
              url = value;
            } else {
              if (key === 'tiktok') {
                url = value?.trim()?.length
                  ? `${platformUrl}@${value?.replace('@', '')}`
                  : '';
              } else {
                url = value?.trim()?.length
                  ? `${platformUrl}${value?.replaceAll('@', '')}`
                  : '';
              }
            }
            return {
              type: key,
              url,
            };
          })
          .filter((l: { type: string; url: string }) => l?.url?.length),
      });

      resetForm();
      onCancel && onCancel();
    },
    validate: (values) => {
      const errors: any = {};
      const { links } = values;

      const validIndex = Object.values(links).findIndex((item) => item.length);
      if (validIndex === -1) errors.links = 'Please provide at least one link.';

      return errors;
    },
  });

  useEffect(() => {
    if (!!user?.socialMediaLinks?.length) {
      const links = user?.socialMediaLinks?.reduce((acc, cur) => {
        return { ...acc, [cur.type]: cur.url };
      }, {});

      setFieldValue('links', links);
    }
    if (value) {
      setFieldValue('isActive', value.isActive ?? true);
      setFieldValue('_id', value._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, user?.socialMediaLinks]);

  const { links, isActive } = values;

  return (
    <form onSubmit={handleSubmit}>
      <Card
        title={'Add Social Links'}
        subtitle={'Social Links Section'}
        extra={
          <div>
            <Switchbox
              value={isActive}
              onChange={handleChange}
              name="isActive"
              status={false}
              size="small"
            />
            {!!options?.delete && (
              <span>
                <Button icon={<RecycleBin />} outline onClick={onDeleteClick} />
              </span>
            )}
          </div>
        }
        isloading={isSubmitting}
        showClose={false}
        icon={<ThumbsUp />}
        onCancel={() => onCancel?.()}
      >
        <div className="social-area">
          <div className="heading-box">
            <div className="img">
              <Link />
            </div>
            <div className="description">
              <strong className="description-title">Social Links</strong>
              <p>Input your default social links below.</p>
            </div>
          </div>
          {errors.links && (
            <strong className="mb-10 text-danger">
              {errors['links'] as string}
            </strong>
          )}
          <div className="defualt_field mb-45">
            <FocusInput
              className="mb-15"
              label="Instagram"
              materialDesign
              name="links.instagram"
              value={links.instagram || ''}
              prefixElement={
                <img
                  src={'/assets/images/instagram.jpg'}
                  alt="instagram"
                  width="30"
                  style={{ borderRadius: '4px' }}
                />
              }
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  instagram: null,
                }));
                handleChange(e);
              }}
              touched={true}
              error={socialErrors.instagram}
            />
            <FocusInput
              className="mb-15"
              label="TikTok"
              materialDesign
              name="links.tiktok"
              value={links.tiktok || ''}
              prefixElement={<TicTocSquare />}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  tiktok: null,
                }));
                handleChange(e);
              }}
              touched={true}
              error={socialErrors.tiktok}
            />
            <FocusInput
              className="mb-15"
              label="Twitter"
              materialDesign
              name="links.twitter"
              value={links.twitter || ''}
              prefixElement={<TwitterSquare />}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  twitter: null,
                }));
                handleChange(e);
              }}
              touched={true}
              error={socialErrors.twitter}
            />
            <FocusInput
              className="mb-15"
              label="Youtube"
              materialDesign
              name="links.youtube"
              value={links.youtube || ''}
              prefixElement={<YoutubeSquare />}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  youtube: null,
                }));
                handleChange(e);
              }}
              touched={true}
              error={socialErrors.youtube}
            />
            <FocusInput
              className="mb-15"
              label="Facebook"
              materialDesign
              name="links.facebook"
              value={links.facebook || ''}
              prefixElement={<FacebookSquare />}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  facebook: null,
                }));
                handleChange(e);
              }}
              touched={true}
              error={socialErrors.facebook}
            />
            <FocusInput
              className="mb-15"
              label="Snapchat"
              materialDesign
              name="links.snapchat"
              value={links.snapchat || ''}
              prefixElement={<SnapChat />}
              onChange={(e) => {
                setSocialErrors((er) => ({
                  ...er,
                  snapchat: null,
                }));
                handleChange(e);
              }}
              touched={true}
              error={socialErrors.snapchat}
            />
          </div>
        </div>
      </Card>
    </form>
  );
};

export default SocialLinksWidget;
