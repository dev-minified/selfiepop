import { PopLive, Shoutout } from 'assets/svgs';
import classNames from 'classnames';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import Card from 'components/SPCards';
import styled from 'styled-components';

interface Props {
  values?: any;
  errors?: any;
  handleChange?: any;
  handleBlur?: any;
  touched: any;
  className?: string;
  baseName?: string;
  title?: string;
  checkBoxText?: string;
}

export const PaymaForm = ({
  handleBlur,
  handleChange,
  errors = {},
  values = {},
  touched = {},
  baseName,
  title = 'Custom Video',
  checkBoxText = 'Enable Custom Video on my Pop Page',
}: Props) => {
  return (
    <Card
      title={title}
      icon={
        baseName === 'poplive' ? (
          <PopLive
            secondaryColor="var(--pallete-primary-main)"
            primaryColor="white"
          />
        ) : (
          <Shoutout
            secondaryColor="var(--pallete-primary-main)"
            primaryColor="white"
          />
        )
      }
      classes={{ card: classNames('payma', { isActive: values?.isActive }) }}
      showClose={false}
      showFooter={false}
      // subtitle="Get paid to create custom videos for your fans, follwers and their friends. Great for gifts, special ocassions or just as a fun way to deliver some advice. "
    >
      <div className="form">
        <div className="row-holder">
          <div className="col-75">
            <Checkbox
              name={baseName + '.isActive'}
              defaultChecked={values.isActive}
              checked={values.isActive}
              onChange={handleChange}
              onBlur={handleBlur}
              label={<span>{checkBoxText}</span>}
            />
          </div>

          <div className="col-25">
            <FocusInput
              inputClasses="mb-25"
              label={<span> Price *</span>}
              hasIcon={true}
              id="price"
              name={baseName + '.price'}
              icon="dollar"
              validations={[{ type: 'number' }]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.price}
              touched={touched.price}
              value={`${values.price}`}
              materialDesign
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default styled(PaymaForm)``;
