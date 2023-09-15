import { update } from 'api/User';
import { ImagesScreenSizes } from 'appconstants';
import { AvatarName } from 'assets/svgs';
import Button from 'components/NButton';
import { DashedLine } from 'components/Typography';
import UploadThumbnail from 'components/UploadThumbnail';
import FocusInput from 'components/focus-input';
import Switchbox from 'components/switchbox';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import swal from 'sweetalert';
import { getLocalStorage } from 'util/index';
import * as yup from 'yup';
import './bio-editor.module.css';
import CoverImageEditor from './components/Editor/CoverImageEditor';
interface Props {
  className?: string;
  [key: string]: any;
}
const sizes = ImagesScreenSizes.profile;

const validationSchema = yup.object().shape({
  description: yup.string(),
  pageTitle: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long!'),
  // .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter valid Page Title'),
  tagLine: yup.string(),
});

const BioEditor: React.FC<Props> = ({ className, ...rest }) => {
  const { user, setUser } = useAuth();
  const { scrollref = null } = rest;
  const [profileImage, setProfileImage] = useState<string>(user?.profileImage);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [coverPhoto, setCoverPhoto] = useState<{
    image: string;
    isActive: boolean;
  }>({
    image: '',
    isActive: false,
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setValues,
    handleSubmit: hSubmit,
  } = useFormik({
    validationSchema,
    initialValues: {
      pageTitle: user?.pageTitle || '',
      tagLine: user?.tagLine || '',
      description: user?.description || '',
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  useEffect(() => {
    const OBT = getLocalStorage('onBoardingTour', false) === 'true';
    if (OBT) {
      setTimeout(() => {
        if (scrollref?.current) {
          scrollref?.current.scrollToBottom();
        }
      }, 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (user?._id) {
      setProfileImage(user?.profileImage);
      setValues({
        description: user?.description || '',
        pageTitle: user?.pageTitle,
        tagLine: user?.tagLine || '',
      });

      setIsActive(user?.isActiveProfile);
      setCoverPhoto({
        image: user?.coverPhoto?.image || '',
        isActive: user?.coverPhoto?.isActive || false,
      });
    }
  }, [user]);
  const handleSubmit = async (values: Record<string, any>) => {
    setIsUpdating(true);
    const res: any = await update({
      ...(values || {}),
    }).catch((e) => {
      swal('Error', e.message, 'error');
    });
    if (res) {
      setUser({ ...user, ...res.data });
      swal('', res.message, 'success');
    }
    setIsUpdating(false);
  };
  const handleupdateData = async (image?: string, checked?: boolean) => {
    setIsUpdating(true);
    const res: any = await update({
      isActiveProfile: checked ?? isActive,
      profileImage: image ?? profileImage,
    }).catch((e) => {
      swal('Error', e.message, 'error');
    });
    if (res) {
      setUser({ ...user, ...res.data });
      swal('', res.message, 'success');
    }
    setIsUpdating(false);
  };
  const handleUpdateCover = async (value: any) => {
    setIsUpdating(true);
    const res: any = await update({
      coverPhoto: value,
    }).catch((e) => {
      swal('Error', e.message, 'error');
    });
    if (res) {
      setUser({ ...user, ...res.data });
      swal('', res.message, 'success');
    }
    setIsUpdating(false);
  };
  return (
    <div className={className}>
      <CoverImageEditor
        value={coverPhoto as any}
        onChange={(name: string, value: any) => {
          setCoverPhoto(value);
          handleUpdateCover(value);
        }}
        name="coverPhoto"
        showAdvanceOption={false}
      />
      <div className="page-status">
        <span>Page is {isActive ? 'active' : 'inactive'}</span>
        <Switchbox
          status={false}
          size="small"
          name="isThumbnailActive"
          onChange={(e: any) => {
            handleupdateData(profileImage, e.target.checked);
            setIsActive(e.target.checked);
          }}
          value={isActive}
        />
      </div>
      <div className={`py-15 px-30`}>
        <div className="mb-15">
          <UploadThumbnail
            imageSizes={sizes}
            icon={profileImage}
            imgSettings={{
              onlyDesktop: true,
              imgix: { all: 'w=163&h=163' },
            }}
            // fallbackUrl={'/assets/images/default-profile-img.svg'}
            fallbackComponent={
              <AvatarName text={user.pageTitle || 'Incognito User'} />
            }
            uploadProps={{
              onSuccess: (data: any) => {
                swal({
                  title: 'Update Profile Picture',
                  text: 'Are you sure you want to update your profile picture?',

                  icon: 'warning',
                  dangerMode: true,
                  buttons: ['No', 'Yes'],
                }).then(async (willDelete) => {
                  if (willDelete) {
                    handleupdateData(data.imageURL);
                  }
                });
              },
            }}
            hideText={true}
            title="Profile Image"
            onDelete={() => {
              swal({
                title: 'Remove Profile Picture',
                text: 'Are you sure you want to remove your profile picture?',

                icon: 'warning',
                dangerMode: true,
                buttons: ['No', 'Yes'],
              }).then(async (willDelete) => {
                if (willDelete) {
                  handleupdateData('');
                }
              });
            }}
          />
        </div>
        <div className="personal-info">
          <DashedLine />
          <div className="personal-info-wrap">
            <div className="field-holder mb-30">
              <FocusInput
                materialDesign
                label="Your Name"
                name="pageTitle"
                value={values.pageTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.pageTitle}
                touched={touched.pageTitle}
              />
            </div>
            <div className="field-holder mb-30">
              <FocusInput
                materialDesign
                label="Tag line"
                name="tagLine"
                value={values.tagLine}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.tagLine}
                touched={touched.tagLine}
              />
            </div>
            <div className="field-holder mb-30">
              <FocusInput
                materialDesign
                label="Bio / Description"
                type="textarea"
                name="description"
                rows={4}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.tagLine}
                touched={touched.tagLine}
              />
            </div>
          </div>
        </div>
        <Button
          type="primary"
          block
          size="large"
          onClick={() => hSubmit()}
          isLoading={isUpdating}
          disabled={isUpdating}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default styled(BioEditor)`
  background: var(--pallete-background-default);

  .card {
    border: none;
  }

  .page-status {
    border-bottom: 1px solid var(--pallete-background-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    color: var(--pallete-text-main);
    padding: 12px 30px;
  }

  .toggle-switch {
    .switcher {
      .sp_dark & {
        background: #333 !important;
      }
    }

    input:checked {
      + .switcher {
        .sp_dark & {
          background: #333 !important;
        }
      }
    }
  }

  .thumb-title {
    .img {
      width: 124px;
      height: 124px;
      margin: 0;
      border: none;
      position: relative;

      &:before {
        border-radius: 100%;
        position: absolute;
        left: -3px;
        right: -3px;
        top: -3px;
        bottom: -3px;
        border: 4px dashed #e1c5eb;
        content: '';
      }

      @media (max-width: 767px) {
        width: 60px;
        height: 60px;
      }

      img {
        width: 116px;
        height: 116px;

        @media (max-width: 767px) {
          width: 52px;
          height: 52px;
        }
      }
    }

    .thumb-box {
      max-width: inherit;
      width: 100%;
      align-items: flex-start;
    }

    .description {
      padding: 22px 0 0 19px;

      @media (max-width: 767px) {
        padding: 0 0 0 10px;
      }

      .description-title {
        font-size: 16px;
      }
    }
  }
  .custom-thumb-pop {
    .actions-btns {
      padding: 0 0 0 143px;
      margin: -70px 0 46px;

      @media (max-width: 767px) {
        padding: 0 0 0 70px;
        margin: -40px 0 16px;
      }
    }
  }

  .profile--info {
    position: relative;
    font-size: 16px;
    line-height: 1.5;
    color: var(--pallete-text-main);
    margin: 0 0 10px;

    .title {
      color: var(--pallete-text-main);
      display: block;
      font-size: 1.125rem;
      line-height: 1.1;
      font-weight: 400;
      margin: 0 0 9px;
    }

    p {
      margin: 0;
    }
  }

  .personal-info {
    margin: 0 -30px;
    background: var(--pallete-background-default);

    .personal-info-wrap {
      padding: 30px 30px 1px;
    }
  }

  .heading-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-lighter-50);
    position: relative;
    overflow: hidden;
    margin: 0 0 30px;

    .img {
      width: 40px;
      height: 40px;
      margin: 0 10px 0 0;
    }

    .description {
      flex-grow: 1;
      flex-basis: 0;
    }

    p {
      margin: 0;
    }
  }

  .description-title {
    display: block;
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
    margin: 0 0 6px;
    color: var(--pallete-text-main);
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

  .social-area {
    padding: 30px 0 0;
  }

  .materialized-input.text-input .pre-fix {
    left: 6px;
  }

  .slider-links {
    margin: 30px -30px -5px;
  }
`;
