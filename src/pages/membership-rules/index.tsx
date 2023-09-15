import { Plus, RulesIcon } from 'assets/svgs';
import DragableItem from 'components/InlinePopForm/DragableItem';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { deleteRule, getRules, updateRule } from 'store/reducer/rule';
import styled from 'styled-components';

type Props = {
  className?: string;
};

const Rules: React.FC<Props> = (props) => {
  const { className } = props;

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const rules = useAppSelector((state) => state.rule.list);
  const { withLoader } = useRequestLoader();

  useEffect(() => {
    withLoader(dispatch(getRules({ sellerId: id })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (rule: Rule) => {
    if (rule.slug) {
      withLoader(dispatch(deleteRule({ id: rule.slug, sellerId: id })));
    }
  };

  const handleEdit = (rule: Rule) => {
    if (rule.slug) {
      history.push(`${location.pathname}/${rule.slug}`);
    }
  };
  const HandleToggle = async (
    isActive: boolean,
    rule: RuleMetadata,
    ruleId: string,
  ) => {
    return dispatch(
      updateRule({
        id: ruleId,
        data: { ...rule, isActive },
        sellerId: id,
      }),
    );
  };
  return (
    <div className={className}>
      {rules?.map(({ metadata: rule, createdAt, isActive }, idx, arr) => (
        <DragableItem
          subtitle={dayjs(createdAt).format('MM/DD/YYYY hh:mm A')}
          dragHandle={false}
          key={`${rule.id}`}
          icon={<RulesIcon />}
          index={idx}
          isActive={isActive}
          title={rule.title}
          onToggel={(e: any) =>
            HandleToggle(e.target.checked, rule, arr[idx].slug)
          }
          options={{ delete: true, edit: true, toggel: true }}
          onDeleteClick={(ruleIdx: number) => handleDelete(arr[ruleIdx])}
          onEdit={(ruleIdx: number) => handleEdit(arr[ruleIdx])}
        />
      ))}
      <div className="btn-holder">
        <Button
          type="primary"
          icon={<Plus />}
          onClick={() => {
            history.push(`${location.pathname}/create`);
          }}
        ></Button>
      </div>
    </div>
  );
};

export default styled(Rules)`
  padding: 20px;

  .card-dragable {
    padding: 10px;

    .icon {
      width: 37px;
      height: 37px;
      background: none;
      border-radius: 0;
      border: none;

      svg {
        width: 100%;

        rect {
          fill: var(--pallete-primary-main);
        }

        path {
          fill: #fff;
        }
      }
    }

    .card--title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      color: var(--pallete-text-main-550);
      font-weight: 500;
    }

    .card--sub--title {
      font-size: 13px;
      line-height: 15px;
      color: #b6b9bc;
      font-weight: 400;
    }
  }

  .btn-holder {
    text-align: center;
  }
`;
