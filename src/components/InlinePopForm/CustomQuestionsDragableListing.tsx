import { QuestionCircled, QuestionMark } from 'assets/svgs';
import NewButton from 'components/NButton';
import useOpenClose from 'hooks/useOpenClose';
import React, { useEffect, useState } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import DragableItem from './DragableItem';
import QuestionForm from './QuestionForm';
import SortableList from './SortableList';
type ActionTypes = {
  status?: boolean;
  delete?: boolean;
  close?: boolean;
  toggel?: boolean;
  edit?: boolean;
  view?: boolean;
};
interface ICustomQuestionsProps {
  value: Questions[];
  onChange: Function;
  showCorrectAnswerInput?: boolean;
  buttonTitle?: string;
  buttonPosition?: 'top' | 'bottom';
  options?: ActionTypes;
}

const AddQuestionButton = ({
  addQuestion,
  buttonTitle = 'Add a Question',
}: any) => {
  const [open, onOpen, onClose] = useOpenClose();
  const handleAddQuestion = async (values: any) => {
    addQuestion && (await addQuestion(values));
    onClose();
  };
  const handleOpen = () => {
    onOpen();
  };
  return (
    <div className="__add">
      <div onClick={handleOpen} className="d-flex justify-content-center">
        <NewButton type="primary" icon={<QuestionCircled />} block>
          <span className="pl-10">{buttonTitle}</span>
        </NewButton>
      </div>

      <QuestionForm
        isOpen={open}
        value={{ isActive: true }}
        title={'New Question'}
        cbonCancel={onClose}
        cbonSubmit={handleAddQuestion}
        options={{ close: true, status: true }}
      />
    </div>
  );
};

const CustomQuestions: React.FC<ICustomQuestionsProps> = ({
  value,
  onChange,
  showCorrectAnswerInput = false,
  buttonTitle = 'Add a Question',
  buttonPosition = 'top',
  options,
}) => {
  const [questions, setQuestions] = useState<any[]>(value || []);
  const [selected, setSelected] = useState<number | null | any>(-1);

  const batchQuestionChange = (v: any) => {
    setQuestions(v);
    onChange(v);
  };
  useEffect(() => {
    if (value?.length > 0) {
      setQuestions(value);
    }
  }, [value]);

  const addQuestion = (values: any) => {
    batchQuestionChange([...questions, { ...values }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    batchQuestionChange(newQuestions);
    setSelected(-1);
  };

  const updateActive = (index: number, isActive: boolean) => {
    const newArray = questions.slice();
    newArray[index] = { ...newArray[index], isActive };
    batchQuestionChange(newArray);
  };

  const updateQuestion = (values: any) => {
    if (selected < 0) return;
    const newArray = questions.slice();
    newArray[selected] = { ...newArray[selected], ...values };
    batchQuestionChange(newArray);
    setSelected(-1);
  };

  const onSortEnd = async ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    if (oldIndex === newIndex) return;
    const sortedArray = arrayMove<any>(questions, oldIndex, newIndex).map(
      (item, index) => ({ ...item, sortOrder: index }),
    );
    batchQuestionChange(sortedArray);
  };

  const selectedItemValue = selected !== null ? questions[selected] : undefined;
  return (
    <div>
      {buttonPosition === 'top' && (
        <AddQuestionButton
          correctAnswerInput={showCorrectAnswerInput}
          addQuestion={addQuestion}
          buttonTitle={buttonTitle}
        />
      )}
      <SortableList
        useDragHandle
        onSortEnd={onSortEnd}
        distance={5}
        selected={selected}
        items={questions.map((qs) => ({
          ...qs,
          title: qs.question || qs.title,
        }))}
        renderItem={(item: any, index: number) => {
          return (
            <DragableItem
              options={options}
              icon={<QuestionMark />}
              index={index}
              onDeleteClick={() => removeQuestion(index)}
              onEdit={(index: number) => setSelected(index)}
              onToggel={async () => {
                await updateActive(index, !item.isActive);
              }}
              {...item}
            />
          );
        }}
      />
      {buttonPosition === 'bottom' && (
        <AddQuestionButton
          correctAnswerInput={showCorrectAnswerInput}
          addQuestion={addQuestion}
          buttonTitle={buttonTitle}
        />
      )}

      <QuestionForm
        isOpen={selected !== -1}
        value={selectedItemValue}
        cbonCancel={() => setSelected(-1)}
        cbonSubmit={(values: any) => updateQuestion(values)}
        // onDeleteClick={() => removeQuestion(index)}
        className="mb-20"
      />
    </div>
  );
};

export default CustomQuestions;
