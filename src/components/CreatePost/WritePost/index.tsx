import { default as FocusInput } from 'components/focus-input';
import { useMemo } from 'react';
import styled from 'styled-components';
import Footer from './components/Footer';
import ViewPrice from './components/ViewPrice';

interface Props {
  className?: string;
  isPaid?: boolean;
  changeSubmitLabel?: string;
  form?: any;
  onPublish?: (paidData?: Record<string, any>) => void;
  onFileChanges?: (files: any[], type: string) => void;
  setShowPoll?: (isTrue: boolean) => void;

  membershipAccessType?: IPostMembershipAccessTypes[];
  messageKey?: string;
  actions?: boolean;
  isDisabled?: boolean;
  hasTemplate?: boolean;
  managedAccountId?: string;
  onNewListOpenModel?: () => void;
}

const WritePost: React.FC<Props> = ({
  className,
  isPaid,
  form,
  membershipAccessType,
  changeSubmitLabel = undefined,
  onPublish,
  onFileChanges,
  setShowPoll,

  onNewListOpenModel,
  messageKey = '',
  actions = true,
  isDisabled = false,
  managedAccountId,
}) => {
  const handlePublish = () => {
    onPublish?.();
  };
  const { values, handleChange, setFieldValue, errors, touched, isSubmitting } =
    form;
  const handleChangeMemberShips = (data: any) => {
    const memberShips = { ...data };
    const keys = Object.keys(memberShips || {});
    const membershipAccessType: any[] = [];
    if (keys?.length) {
      keys.forEach((key) => {
        membershipAccessType.push({
          membershipId: key,
          accessType: memberShips[key]?.value,
          viewPrice: memberShips[key]?.viewPrice || 0,
        });
      });
    }
    setFieldValue('membershipAccessType', membershipAccessType);
  };
  const ViewPriceComp = useMemo(() => {
    return (
      <ViewPrice
        onChangeMemberShips={handleChangeMemberShips}
        initialMemberships={membershipAccessType}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membershipAccessType]);
  return (
    <div className={className}>
      <FocusInput
        type="textarea"
        rows={6}
        name="text"
        materialDesign
        value={values.text}
        error={errors.text}
        touched={touched.text}
        disabled={isDisabled}
        hasLimit={false}
        placeholder="Share what you are thinking..."
        onChange={handleChange}
      />
      {!isSubmitting && ViewPriceComp}
      <Footer
        hasTemplate={false}
        changeSubmitLabel={changeSubmitLabel}
        form={form}
        onNewListOpenModel={onNewListOpenModel}
        setShowPoll={setShowPoll}
        onPublish={handlePublish}
        onFileChanges={onFileChanges}
        isPaid={isPaid}
        messageKey={messageKey}
        actions={actions}
        managedAccountId={managedAccountId}
      />
    </div>
  );
};

export default styled(WritePost)`
  .materialized-input {
    textarea {
      &.form-control {
        border: none;
      }
    }
  }
`;
