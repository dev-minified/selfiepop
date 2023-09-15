import { Plus } from 'assets/svgs';
import classNames from 'classnames';
import DragableItem from 'components/InlinePopForm/DragableItem';
import NewButton from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import styled from 'styled-components';

type Props = {
  className?: string;
  items?: Record<string, any>[];
  bindings?: {
    title: string;
    subtitle: string;
  };
  icon?: React.ReactElement;
  title?: string;
  onAddClick?: () => void;
  onDeleteClick?: (idx: number) => void;
  onEditClick?: (idx: number) => void;
};

const Listing = ({
  className,
  items,
  bindings,
  icon,
  title,
  onDeleteClick,
  onAddClick,
  onEditClick,
}: Props) => {
  return (
    <div className={classNames(className, 'messages-area')}>
      <div className="post-card">
        <Card className="pop-card-alt">
          <Card.Header className="card-header-box">
            <strong className="header-title">{title}</strong>
          </Card.Header>

          <div className="addition__art">
            {items?.map((item, idx) => (
              <DragableItem
                subtitle={item[`${bindings?.subtitle}`]}
                dragHandle={false}
                key={`${idx}`}
                icon={icon}
                index={idx}
                title={item[`${bindings?.title}`]}
                options={{ delete: true, edit: true }}
                onDeleteClick={onDeleteClick}
                onEdit={onEditClick}
              />
            ))}
            <div className="btn-holder">
              <NewButton
                type="primary"
                icon={<Plus />}
                className="mb-20"
                onClick={onAddClick}
              ></NewButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default styled(Listing)`
  .pop-card {
    padding: 0;
    border: none;
    margin: 0 0 20px;

    .card-dragable {
      .card--title,
      .card--sub--title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
`;
