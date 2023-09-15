import classNames from 'classnames';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import Card from 'components/SPCards';
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  title?: string;
  description?: string;
  values?: any;
  errors?: any;
  handleChange?: any;
  handleBlur?: any;
  touched: any;
  baseName?: string;
  type?: string;
  icon?: any;
}

const AdvertiseLinkForm: React.FC<Props> = (props) => {
  const {
    className,
    title,
    description,
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    baseName,
    type,
    icon,
  } = props;
  return (
    <div className={className}>
      <Card
        title={title}
        icon={icon}
        classes={{
          card: classNames('advertise', { isActive: values?.isActive }),
        }}
        showClose={false}
        showFooter={false}
      >
        <p className="caption mb-30">{description}</p>
        <div className="form">
          <div className="row-holder mb-20">
            <div className="col-75">
              <FocusInput
                hasIcon={true}
                icon=""
                label={
                  <span>
                    <span className="text-capitalize">Shoutout</span> Title *
                  </span>
                }
                id="title"
                name={`${baseName}.title`}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.title}
                touched={touched?.title}
                value={values?.title}
                materialDesign
              />
            </div>
            <div className="col-25">
              <FocusInput
                label={<span> Price *</span>}
                hasIcon={true}
                id="price"
                name={baseName + '.price'}
                icon="dollar"
                validations={[{ type: 'number' }]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.price}
                touched={touched?.price}
                value={`${values?.price}`}
                materialDesign
              />
            </div>
          </div>
          <FocusInput
            label={
              <span>
                <span className="text-capitalize">Shoutout</span> Description
              </span>
            }
            inputClasses="mb-20"
            id="description"
            name={`${baseName}.description`}
            type="textarea"
            rows={4}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.description}
            touched={touched?.title}
            value={values?.description}
            materialDesign
          />
          <Checkbox
            name={baseName + '.isActive'}
            defaultChecked={values?.isActive}
            checked={values?.isActive}
            onChange={handleChange}
            onBlur={handleBlur}
            label={<span>Enable {type} Promotion Sales on my Page</span>}
          />
        </div>
      </Card>
    </div>
  );
};

export default styled(AdvertiseLinkForm)`
  &.pop-pricing {
    .header {
      align-items: center !important;

      .icon {
        background: var(--pallete-primary-darker);
        color: #fff;
      }
    }
  }
`;
