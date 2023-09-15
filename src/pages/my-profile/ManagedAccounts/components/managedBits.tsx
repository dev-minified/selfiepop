import { Correct, CrossRed, StarSquare } from 'assets/svgs';
import DragableItem from 'components/InlinePopForm/DragableItem';
import React from 'react';
interface Props {
  isActive?: boolean;
  title?: string;
}
const ManagedBits: React.FC<Props> = ({ isActive = false, title }) => {
  return (
    <div>
      {isActive && (
        <DragableItem
          dragHandle={false}
          icon={
            <span className="permission-status-image">
              <StarSquare />
            </span>
          }
          extraLeft={
            isActive ? (
              <span className="image-status tick">
                <Correct />
              </span>
            ) : (
              <span className="image-status cross">
                <CrossRed />
              </span>
            )
          }
          isActive={isActive}
          title={title}
          options={{ edit: false, toggel: false }}
        />
      )}
    </div>
  );
};

export default ManagedBits;
