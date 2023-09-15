import { MessageSendIcon } from 'assets/svgs';
import classNames from 'classnames';
import FocusInput from 'components/focus-input';
import NewButton from 'components/NButton';
import EditBack from 'components/partials/components/profileBack';
import { useFormik } from 'formik';
import { useAppSelector } from 'hooks/useAppSelector';
import useOpenClose from 'hooks/useOpenClose';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect, useRef, useState } from 'react';
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed';
import styled from 'styled-components';
import * as yup from 'yup';
import Listing from './Listing';
import SubTaskModal from './SubTaskModal';
import Tagger from './Tagger';

type Props = {
  className?: string;
  onSave?: (values: any) => void;
  onCancel?: () => void;
  value?: Task;
  showHeader?: boolean;
  managedAccountId?: string;
};

const validationSchema = yup.object().shape({
  taskTitle: yup.string().required('Title is required'),
});

const TaskEditor: React.FC<Props> = (props) => {
  const { className, onSave, onCancel, value, showHeader } = props;
  const title = useAppSelector((state) => state.header.title);

  const [isSubTaskModalOpen, openSubTaskModal, closeSubTaskModal] =
    useOpenClose();
  const [selectedSubtask, setSelectedSubtask] = useState<number>(-1);

  const container = useRef<HTMLDivElement>(null);
  const form = useFormik<Task>({
    initialValues: value || {
      taskTitle: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSave?.(values);
    },
  });

  const { values, errors, handleChange, handleSubmit } = form;

  useEffect(() => {
    setTimeout(() => {
      if (container.current) {
        smoothScrollIntoView(container.current, {
          scrollMode: 'if-needed',
          block: 'start',
        });
      }
    }, 600);
  }, []);

  useEffect(() => {
    if (value) {
      form.setValues(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={classNames(className, 'block-creation')} ref={container}>
      {showHeader && (
        <EditBack title={title} onClick={() => onCancel?.()} backUrl="#" />
      )}
      <div className="add-tasks-wrap">
        <div className="field-holder">
          <FocusInput
            materialDesign
            label="Task Title"
            name="taskTitle"
            onChange={handleChange}
            value={values.taskTitle}
            touched={true}
            error={errors.taskTitle}
          />
        </div>
        <div className="field-holder">
          <FocusInput
            materialDesign
            label="Task Description"
            name="taskDescription"
            onChange={handleChange}
            type="textarea"
            rows={5}
            value={values.taskDescription}
            touched={true}
            error={errors.taskDescription}
          />
        </div>
        <div className="condition-area">
          <div className="condition-block">
            <span className="heading-text">Task Steps</span>
            <div className="variation-body">
              <Listing
                items={values.taskSteps}
                onAddClick={() => openSubTaskModal()}
                onDeleteClick={(idx) => {
                  const tasks = cloneDeep(values.taskSteps);
                  if (tasks) {
                    tasks.splice(idx, 1);
                    form.setFieldValue('taskSteps', tasks);
                  }
                }}
                onEditClick={(idx) => {
                  const subTask = values.taskSteps?.[idx];
                  if (subTask) {
                    setSelectedSubtask(idx);
                    openSubTaskModal();
                  }
                }}
                title="Task Steps"
                bindings={{
                  title: 'stepTitle',
                  subtitle: 'stepDescription',
                }}
                icon={<MessageSendIcon />}
              />
            </div>
          </div>
          <Tagger
            title="On task completion, add tag(s):"
            name="taskTagsAddOnComplete"
            onChange={handleChange}
            value={values.taskTagsAddOnComplete || []}
          />
          <Tagger
            title="On task completion, remove tag(s):"
            name="taskTagsRemoveOnComplete"
            onChange={handleChange}
            value={values.taskTagsRemoveOnComplete || []}
          />
        </div>
        <footer className="footer-btns">
          <NewButton
            type="default"
            size="large"
            shape="circle"
            onClick={onCancel}
          >
            Cancel
          </NewButton>
          <NewButton
            type="primary"
            size="large"
            shape="circle"
            onClick={() => handleSubmit()}
          >
            Save
          </NewButton>
        </footer>
      </div>
      <SubTaskModal
        isOpen={isSubTaskModalOpen}
        value={values.taskSteps?.[selectedSubtask]}
        onClose={() => {
          setSelectedSubtask(-1);
          closeSubTaskModal();
        }}
        onSubmit={async (item) => {
          const tasks = cloneDeep(values.taskSteps) || [];
          if (selectedSubtask > -1) {
            tasks[selectedSubtask] = item;
          } else {
            tasks.push(item);
          }
          form.setFieldValue('taskSteps', tasks);
        }}
      />
    </div>
  );
};

export default styled(TaskEditor)`
  background: var(--pallete-background-default);

  .add-tasks-wrap {
    padding: 20px;
  }

  .footer-btns {
    margin: 0 -20px;
  }
`;
