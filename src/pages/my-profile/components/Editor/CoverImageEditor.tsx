import { ImagesScreenSizes } from 'appconstants';
import { CoverDefault, CoverFull, CoverSmall } from 'assets/svgs';
import Accordion from 'components/according';
import ImageModifications from 'components/ImageModifications';
import NewButton from 'components/NButton';
import RadioGroup from 'components/RadioGroup';
import SimpleCard from 'components/SPCards/SimpleCard';
import SwitchBox from 'components/switchbox';
import UploadandEditor from 'components/UploadandEditor';
import useControlledState from 'hooks/useControlledState';
import styled from 'styled-components';
const CoverImageEditor = ({
  value: initialValue = {},
  onChange,
  name,
  className,
  showAdvanceOption = true,
  fallbackUrl = '/assets/images/defaultCover.png',
}: {
  value?: ICover;
  onChange?: Function;
  name?: string;
  className?: string;
  showAdvanceOption?: boolean;
  fallbackUrl?: string;
}) => {
  const [values, setValues] = useControlledState<any>(
    {
      size: 'default',
    },
    {
      value: initialValue,
      onChange: (newValue) => {
        onChange && onChange(name, newValue);
      },
    },
  );

  const handleChangeInput = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleActive = (e: any) => {
    const { name, checked } = e.target;
    setValues({ ...values, [name]: checked });
  };

  const onImageUpload = (res: any) => {
    setValues({ ...values, image: res.imageURL });
  };
  const handleRemoveBackgroup = () => {
    setValues({ ...values, image: '' });
  };

  const { isActive, image } = values;

  return (
    <div className={className}>
      <SimpleCard
        title="Cover Image"
        classes={{
          header: 'theme-cover-img-card-header',
        }}
        extra={
          <SwitchBox
            name="isActive"
            status={false}
            size="small"
            value={isActive}
            onChange={handleActive}
          />
        }
      >
        <div className="theme-cover-img-editor theme-editor-actions">
          <div className="theme-cover-img-card-body">
            <ImageModifications
              className="cover-img"
              src={image || fallbackUrl}
              fallbackUrl={fallbackUrl}
              alt="cover"
              imgeSizesProps={{
                onlyMobile: true,
              }}
            />
            <div className="action justify-content-between">
              <UploadandEditor
                onSuccess={onImageUpload}
                imageSizes={ImagesScreenSizes.profileCover}
                aspectRatio={4}
                cropper={true}
                // accept="image/*"
                accept={{ 'image/*': [] }}
                url="/image/upload"
                validation={{
                  minWidth: 300,
                  minHeight: 300,
                  maxSize: 1024 * 1024 * 2,
                }}
              >
                <NewButton type="primary" block>
                  Upload an Image
                </NewButton>
              </UploadandEditor>
              <span>
                <NewButton outline block onClick={handleRemoveBackgroup}>
                  Remove
                </NewButton>
              </span>
            </div>
          </div>
          <hr className="dashed mt-20 mb-0" />
          {showAdvanceOption && (
            <Accordion
              title="Advance Options"
              showIcon={false}
              indicator={<span className="icon-keyboard_arrow_left"></span>}
              alt
            >
              <div>
                <span className="cover-size-title">Cover Image Size</span>
                <p className="cover-size-body">
                  Completely customize your Pop Page. Change your background
                  with colors, gradients and images
                </p>
                <div className="cover-sizes">
                  <RadioGroup
                    defaultValue="default"
                    name="size"
                    value={values?.size}
                    classes={{ group: 'd-flex ' }}
                    items={[
                      {
                        value: 'small',
                        render: ({ checked }) => {
                          return (
                            <div
                              className={`cover-container ${
                                checked && 'selected'
                              }`}
                            >
                              <div className="cover-container__image">
                                <CoverSmall />
                              </div>
                              <span className="cover-container__text">
                                Small
                              </span>
                            </div>
                          );
                        },
                      },
                      {
                        value: 'default',
                        render: ({ checked }) => {
                          return (
                            <div
                              className={`cover-container ${
                                checked && 'selected'
                              }`}
                            >
                              <div className="cover-container__image">
                                <CoverDefault />
                              </div>
                              <span className="cover-container__text">
                                Default
                              </span>
                            </div>
                          );
                        },
                      },
                      {
                        value: 'full-width',
                        render: ({ checked }) => {
                          return (
                            <div
                              className={`cover-container ${
                                checked && 'selected'
                              }`}
                            >
                              <div className="cover-container__image">
                                <CoverFull />
                              </div>
                              <span className="cover-container__text">
                                Full Width
                              </span>
                            </div>
                          );
                        },
                      },
                    ]}
                    onChange={handleChangeInput}
                  />
                </div>
              </div>
            </Accordion>
          )}
        </div>
      </SimpleCard>
    </div>
  );
};

export default styled(CoverImageEditor)`
  .card {
    border: none;
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
`;
