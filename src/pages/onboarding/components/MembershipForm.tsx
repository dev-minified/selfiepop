import { Payma } from 'assets/svgs';
import classNames from 'classnames';
import FocusInput from 'components/focus-input';
import Card from 'components/SPCards';
import styled from 'styled-components';

interface Props {
  handleChange?: any;
  title?: string;
  amount?: string;
}

export const MemberShipForm = ({ handleChange, amount, title }: Props) => {
  return (
    <Card
      title={title}
      icon={
        <Payma
          secondaryColor="var(--pallete-primary-main)"
          primaryColor="white"
        />
      }
      classes={{ card: classNames('payma', { isActive: true }) }}
      showClose={false}
      showFooter={false}
      extra={
        <div className="col-25">
          <FocusInput
            inputClasses="mb-25"
            label={<span> Price *</span>}
            hasIcon={true}
            id="price"
            icon="dollar"
            validations={[{ type: 'number' }]}
            onChange={handleChange}
            value={amount}
            materialDesign
          />
        </div>
      }
    />
  );
};

export default styled(MemberShipForm)``;
