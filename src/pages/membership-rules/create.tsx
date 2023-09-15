import { useAppDispatch } from 'hooks/useAppDispatch';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createRule } from 'store/reducer/rule';
import RuleForm from './components/rule-form';

type Props = {
  showHeader?: boolean;
  backUrl?: string;
};

const CreateRule: React.FC<Props> = (props) => {
  const { showHeader = true, backUrl } = props;
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const navigateToListing = () => {
    history.push(backUrl || '/my-profile/members-content/rules');
  };

  const handleSave = async (rule: RuleMetadata) => {
    return dispatch(createRule({ data: rule, sellerId: id }))
      .unwrap()
      .then(() => {
        navigateToListing();
      });
  };

  const handleCancel = () => {
    navigateToListing();
  };

  return (
    <div>
      <RuleForm
        onCancel={handleCancel}
        onSave={handleSave}
        showHeader={showHeader}
        backUrl={backUrl}
        managedAccountId={id}
      />
    </div>
  );
};

export default CreateRule;
