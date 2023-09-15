import { Payma } from 'assets/svgs';
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
      title="Ask me a Question"
      icon={
        <Payma
          secondaryColor="var(--pallete-primary-main)"
          primaryColor="white"
        />
      }
      classes={{ card: classNames('payma', { isActive: values?.isActive }) }}
      showClose={false}
      showFooter={false}
      // subtitle="Let your fans and followers pay you to answer their questions. Easily anwser them directly through email or text, while keeping your contact information private."
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
              label={<span>Enable Paid Q&A on my Pop Page</span>}
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
