import Button from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import Select from 'components/Select';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import { markTaskAsComplete } from 'store/reducer/task';
import styled from 'styled-components';

type Props = {
  className?: string;
  id: string;
  subscriberId: string;
};

const filterOptions = [
  {
    label: 'Incomplete Tasks',
    value: 'incomplete',
  },
  {
    label: 'Complete Tasks',
    value: 'complete',
  },
];

const TaskCard: React.FC<{
  task: SubscriptionTask;
  onMarkAsComplete: (taskSlug: string, idx?: number) => Promise<void>;
}> = (props) => {
  const { task, onMarkAsComplete } = props;

  const [loading, setLoading] = useState<(number | 'task')[]>([]);

  const handleMarkAsComplete = async (idx?: number) => {
    const loaderIdx = idx != null ? idx : 'task';
    setLoading((prev) => [...prev, loaderIdx]);
    await onMarkAsComplete(task.slug, idx);
    setLoading((prev) => prev.filter((i) => i !== loaderIdx));
  };

  return (
    <Card cardClass="card-tasks">
      <Card.Header>{task.taskData.taskTitle}</Card.Header>
      <Card.Body>
        <div className="card-description">
          <p>{task.taskData.taskDescription}</p>
        </div>
        {task.taskData.taskSteps?.map((subTask, idx) => (
          <div key={idx} className="card-task-area">
            <strong className="task-title">{subTask.stepTitle}</strong>
            <p>{subTask.stepDescription}</p>
            <div className="text-right"></div>
            <div className="text-right">
              {subTask.isComplete ? (
                <span className="task-completed">
                  Completed by {subTask.completedBy?.username} on{' '}
                  {dayjs(subTask.completedOn).format('MM/DD/YYYY')}
                </span>
              ) : (
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  onClick={() => handleMarkAsComplete(idx)}
                  isLoading={loading.includes(idx)}
                  disabled={loading.includes(idx)}
                >
                  Mark as complete
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="text-center pt-10">
          {task.completedOn ? (
            <span className="task-completed">
              Completed by {task.completedBy?.username} on{' '}
              {dayjs(task.completedOn).format('MM/DD/YYYY')}
            </span>
          ) : (
            <Button
              type="primary"
              shape="circle"
              size="small"
              onClick={() => handleMarkAsComplete()}
              isLoading={loading.includes('task')}
              disabled={loading.includes('task')}
            >
              Mark as complete
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const ManagerTasks: React.FC<Props> = (props) => {
  const { className, id, subscriberId } = props;

  const dispatch = useAppDispatch();

  const tasks = useAppSelector((state) => state.task.list);

  const [selectedOption, setSelectedOption] = useState<string>(
    filterOptions[0].value,
  );
  const [filteredTasks, setFilteredTasks] = useState<SubscriptionTask[]>([]);

  useEffect(() => {
    const initial: {
      completed: SubscriptionTask[];
      incomplete: SubscriptionTask[];
    } = { completed: [], incomplete: [] };
    const { completed, incomplete } = tasks?.reduce((acc, task) => {
      if (
        !!task.completedOn &&
        task.taskData.taskSteps?.every((subTask) => !!subTask.completedOn)
      ) {
        acc.completed.push(task);
      } else {
        acc.incomplete.push(task);
      }
      return acc;
    }, initial);

    setFilteredTasks(selectedOption === 'incomplete' ? incomplete : completed);
  }, [tasks, selectedOption]);

  const onMarkAsComplete = async (
    taskSlug: string,
    subTaskIndex?: number,
  ): Promise<any> => {
    return dispatch(
      markTaskAsComplete({
        sellerId: id,
        data: { taskSlug, subTaskIndex, subscriptionId: subscriberId },
      }),
    );
  };

  return (
    <div className={`${className} tasks-block`}>
      <div className="select-holder">
        <Select
          isSearchable={false}
          type="compact"
          value={filterOptions?.find(
            (option) => selectedOption === option.value,
          )}
          options={filterOptions}
          onChange={(e) => {
            const value = `${e?.value}`;
            setSelectedOption(value);
          }}
          size="small"
        />
      </div>
      {filteredTasks?.map((task, idx) => (
        <TaskCard key={idx} task={task} onMarkAsComplete={onMarkAsComplete} />
      ))}
    </div>
  );
};

export default styled(ManagerTasks)`
  &.tasks-block {
    .select-holder {
      max-width: 160px;
      margin: 0 0 20px;
    }

    .card-tasks {
      margin: 0 0 25px;

      .card-Header {
        font-weight: 500;
        font-size: 15px;
      }

      .card-body {
        padding: 20px 22px;

        p {
          margin: 0 0 16px;
        }
      }

      .card-description {
        position: relative;
        overflow: hidden;
        font-size: 13px;
        line-height: 20px;
        color: var(--pallete-text-light-50);
      }
    }

    .card-task-area {
      background: var(--pallete-background-secondary-light);
      border-radius: 4px;
      padding: 14px 15px 10px;
      margin: 0 -10px 13px;

      p {
        min-height: 50px;
        color: var(--pallete-text-light-50);
        font-size: 13px;
        line-height: 20px;
        margin: 0 0 10px;
        font-weight: 400;
      }

      .task-completed {
        color: var(--pallete-primary-main);
      }
    }

    .button.button-sm {
      font-size: 15px;
      min-width: 150px;
    }

    .task-title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      margin: 0 0 15px;
    }

    .btn-holder {
      padding: 20px 0 0;
    }

    .task-completed {
    }

    .task-completed {
      display: block;
      font-weight: 500;
      margin: 0;
      font-size: 12px;
      line-height: 15px;
    }
  }
`;
