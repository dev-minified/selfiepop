import InlineTagger from 'components/Tags/InlineTagger';
import React from 'react';

type Props = {
  name: string;
  title: string;
  value: string[];
  limit?: number;
  onChange: (e: { target: { value: string[] } }) => void;
};

const Tagger: React.FC<Props> = (props) => {
  const { name, title, value, onChange, limit } = props;
  return (
    <InlineTagger
      placeholder="Add Tag"
      showAddButton
      title={title}
      subtitle={false}
      value={value?.join(',') || ''}
      name={name}
      limit={limit}
      onChange={(e: React.ChangeEvent<any>) => {
        onChange({
          target: {
            ...e.target,
            value: e.target.value?.split(',')?.filter(Boolean) || [],
          },
        });
      }}
    />
  );
};

export default Tagger;
