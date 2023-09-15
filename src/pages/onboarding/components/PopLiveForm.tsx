import { PopLive } from 'assets/svgs';
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
  baseName?: string;
  setValues?: any;
}

export const PaymaForm = ({
  handleBlur,
  handleChange,
  errors = {},
  values = {},
  touched = {},
  baseName,
}: Props) => {
  return (
    <Card
      title="Pop Live"
      icon={
        <PopLive
          secondaryColor="var(--pallete-primary-main)"
          primaryColor="white"
        />
      }
      classes={{ card: classNames('poplive', { isActive: values?.isActive }) }}
      showClose={false}
      showFooter={false}
      subtitle="Let your fans and followers pay you to schedule a live, one on one video chats with you, in a Pop Live video conference room."
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
              label={<span>Enable Pop Live on my Pop Page</span>}
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
