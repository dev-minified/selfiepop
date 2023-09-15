import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getRule, setSelectedRule, updateRule } from 'store/reducer/rule';
import RuleForm from './components/rule-form';

type Props = {
  showHeader?: boolean;
  backUrl?: string;
};

const EditRule: React.FC<Props> = (props) => {
  const { showHeader = true, backUrl } = props;

  const { id, ruleId } = useParams<{ id: string; ruleId: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { withLoader } = useRequestLoader();

  const rule = useAppSelector((state) => state.rule.item);

  useEffect(() => {
    withLoader(dispatch(getRule({ id: ruleId, sellerId: id })));

    return () => {
      dispatch(setSelectedRule(undefined));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToListing = () => {
    history.push(backUrl || '/my-profile/members-content/rules');
  };

  const handleSave = async (rule: RuleMetadata) => {
    const data = { ...rule, sellerId: undefined };
    return dispatch(updateRule({ id: ruleId, data, sellerId: id }))
      .unwrap()
      .then(() => {
        navigateToListing();
      });
  };

  const handleCancel = () => {
    navigateToListing();
  };

  return (
    <RuleForm
      value={rule?.metadata}
      onCancel={handleCancel}
      onSave={handleSave}
      showHeader={showHeader}
      backUrl={backUrl}
      managedAccountId={id}
    />
  );
};

export default EditRule;
