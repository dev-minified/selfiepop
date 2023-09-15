import { Edit, RecycleBin, VerticalDots } from 'assets/svgs';
import classNames from 'classnames';
import NewButton from 'components/NButton';
import Switchbox from 'components/switchbox';
import useQuery from 'hooks/useQuery';
import { Fragment, ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SortableHandle } from 'react-sortable-hoc';
import styled from 'styled-components';

const DragableCardStyle = styled.div`
  &.card-dragable {
    transition: all 0.25s ease;
    padding: 15px 17px 15px 10px;
    background: var(--pallete-background-default);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 300;
    position: relative;
    z-index: 2;
    min-height: 84px;
    border-radius: 5px;

    .sp_dark & {
      background: var(--pallete-background-primary-100);
      color: #999;
    }

    &.isDraggingHover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
    }
  }

  &.card-dragable::after {
    content: '';
    border: 1px solid var(--pallete-colors-border);
    border-radius: 5px;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: -1;
  }

  &.card-dragable::before {
    content: '';
    position: absolute;
    width: 5px;
    border-radius: 5px 0px 0px 5px;
    left: 0px;
    bottom: 0px;
    top: 0px;
    z-index: 1;
  }

  &.card-dragable .drag-dots {
    color: #d2d2d2;
    margin-right: 12px;
    position: relative;
    cursor: grabbing;
    transition: all 0.4s ease;

    &:hover {
      color: var(--pallete-primary-main) !important;
    }

    &:before {
      position: absolute;
      left: -6px;
      right: -11px;
      top: -25px;
      bottom: -26px;
      content: '';
    }
  }

  &.card-dragable .icon {
    width: 54px;
    height: 54px;
    min-width: 54px;
    border-radius: 100%;
    font-size: 19px;
    font-weight: 700;
    border: 1px solid var(--pallete-colors-border);
    color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin: 0 10px 0 0;
    position: relative;
    z-index: 1;
    overflow: hidden;
    color: var(--pallete-primary-main);

    @media (max-width: 767px) {
      width: 36px;
      min-width: 36px;
      height: 36px;
    }

    svg,
    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;

      &.img-chat {
        max-width: 32px;
      }
    }
  }

  &.card-dragable .icon img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  &.card-dragable .left-section {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    align-items: center;
    // word-break: break-all;
  }

  &.card-dragable .card--text {
    display: flex;
    flex-direction: column;
  }

  &.card-dragable .card--title {
    font-size: 20px;
    font-weight: 400;
    color: var(--pallete-text-main);
  }

  &.card-dragable .card--subtitle {
    font-size: 14px;
    font-weight: 400;
    color: var(--pallete-text-main-500);
  }

  &.card-dragable .right-section {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 10px;
  }

  &.card-dragable:hover {
    box-shadow: none;
    color: #fff;
  }

  &.card-dragable.active {
    color: #e51075;
    background-color: #f4f6f9;
  }

  &.card-dragable.active .icon {
    background-color: #e51075;
    color: white;
    width: 24px;
    height: 24px;
    min-width: 24px;
    border-radius: 100%;
  }

  &.card-dragable.inactive {
    color: #fff;
    cursor: default;
  }

  &.card-dragable.inactive:before {
    background: #d4d4d4;
    border-color: #d5dade;
  }

  &.card-dragable.inactive .icon {
    border-color: #dadee2;
    color: #d5dade;

    img {
      filter: grayscale(100%);
      opacity: 0.2;
    }

    .chat-img {
      #Layer_2 {
        fill: none;
      }

      #Layer_1 {
        fill: #d5dade;

        .sp_dark & {
          /* fill: #000; */
        }
      }
    }

    .default-star {
      #Layer_2,
      rect {
        .sp_dark & {
          fill: #000;
        }
      }
    }

    #Layer_2,
    rect {
      fill: #d5dade;
    }

    #Layer_1 rect {
      fill: inherit;
    }
  }

  &.card-dragable.inactive .icon svg {
    fill: var(--pallete-background-gray-350);
    stroke: var(--pallete-background-gray-350);
  }

  &.card-dragable.inactive .drag-dots {
    color: var(--pallete-background-gray-400);

    .sp_dark & {
      color: var(--pallete-text-main-550);
    }
  }

  &.card-dragable.inactive .card--title {
    color: var(--pallete-background-gray-350);

    .sp_dark & {
      color: var(--pallete-text-main-550);
    }
  }
  &.card-dragable.inactive .card--subtitle {
    color: var(--pallete-background-gray-350);

    .sp_dark & {
      color: var(--pallete-text-main-550);
    }
  }

  &.card-dragable.inactive:hover {
    background: var(--pallete-background-gray-secondary-100);
  }

  &.card-dragable::before {
    background-color: var(--pallete-primary-main);
  }
  &.card-dragable.inactive .toggle-switch .switcher {
    background: var(--pallete-background-gray-350);
  }
  .toggle-switch {
    margin-right: 6px;
  }
  .button {
    + .button {
      margin-left: 6px;
    }
  }

  @media (max-width: 480px) {
    &.card-dragable .card--title {
      font-size: 14px;
    }

    &.card-dragable .drag-dots {
      margin-right: 5px;
    }
  }
`;

interface Props {
  _id: string;
  index: number | undefined;
  active: boolean;
  title: string;
  icon?: ReactNode;
  onEdit?: (e: any) => void;
  onAddPop?: (e: any) => void;
  onDelete?: (_id: number) => void;
  onClick?: any;
  subTitle?: string;
  onToggel?: (index?: number) => void | Promise<any>;
  type?: string;
  showDeleteIcon?: boolean;
  showActiveToggle?: boolean;
  showEditIcon?: boolean;
  showAddPopIcon?: boolean;
  TempLink?: boolean;
}

const CardDragable = ({
  index,
  active,
  title,
  subTitle,
  icon,
  onEdit,
  onDelete,
  onToggel,
  onClick,
  onAddPop,
  showDeleteIcon = true,
  showActiveToggle = true,
  showEditIcon = true,
  showAddPopIcon = false,
  TempLink = false,
}: Props) => {
  const { section } = useQuery();
  const { type } = useParams<{ type: string }>();
  const onEditHandler = (e: any) => {
    onEdit && onEdit(e);
  };
  const addToPopPage = (e: any) => {
    type === 'edit' || section === 'links'
      ? onEdit && onEdit(e)
      : onAddPop?.(e);
  };
  const [dragHandlerClass, setDragHandlerClass] = useState(false);
  const onDeletehanlder = () => {
    onDelete && onDelete(index as number);
  };
  const onClickHandler = (e: any) => {
    onClick && onClick(e);
  };
  const onToggelHandle = () => {
    onToggel && onToggel(index);
  };
  const DragHandler = SortableHandle(() => (
    <span
      className={`drag-dots`}
      onMouseOver={() => {
        setDragHandlerClass(true);
      }}
      onMouseLeave={() => {
        setDragHandlerClass(false);
      }}
    >
      <VerticalDots />
    </span>
  ));
  return (
    <DragableCardStyle
      className={classNames('card-dragable', {
        inactive: !active,
        [`pop-${subTitle}`]: subTitle,
        isDraggingHover: dragHandlerClass,
      })}
    >
      {!showAddPopIcon && <DragHandler />}

      <span className="left-section" id="stopDraging" onClick={onClickHandler}>
        {icon && (
          <div className="icon-holder">
            <span className="icon">{icon}</span>
          </div>
        )}

        <div className="card--text">
          <span className="card--title">{title}</span>
          <span className="card--subtitle">{subTitle}</span>
        </div>
      </span>

      <div className="right-section">
        {!showAddPopIcon && (
          <Fragment>
            {showActiveToggle && (
              <Switchbox
                status={false}
                value={active}
                onChange={onToggelHandle}
                size="small"
              />
            )}
            {showDeleteIcon && (
              <NewButton
                type="default"
                outline
                size="x-small"
                icon={<RecycleBin />}
                onClick={onDeletehanlder}
              />
            )}
            {showEditIcon && (
              <NewButton
                type="default"
                outline
                size="x-small"
                icon={<Edit />}
                onClick={onEditHandler}
              />
            )}
          </Fragment>
        )}
        {showAddPopIcon && (
          <Fragment>
            {TempLink ? (
              <Fragment>
                <NewButton
                  type="primary"
                  shape="circle"
                  size="x-small"
                  onClick={addToPopPage}
                >
                  {type === 'edit' || section === 'links'
                    ? 'EDIT'
                    : 'ADD TO POP PAGE'}
                </NewButton>
                {(type === 'edit' || section === 'links') && (
                  <NewButton
                    type="primary"
                    shape="circle"
                    size="x-small"
                    onClick={(e) => onAddPop?.(e)}
                  >
                    ADD TO POP PAGE
                  </NewButton>
                )}
                {showDeleteIcon && (
                  <NewButton
                    type="default"
                    outline
                    size="x-small"
                    icon={<RecycleBin />}
                    onClick={onDeletehanlder}
                  />
                )}
              </Fragment>
            ) : (
              <Fragment>
                <NewButton
                  type="primary"
                  shape="circle"
                  size="x-small"
                  onClick={addToPopPage}
                >
                  EDIT
                </NewButton>
                {showDeleteIcon && (
                  <NewButton
                    type="default"
                    outline
                    size="x-small"
                    icon={<RecycleBin />}
                    onClick={onDeletehanlder}
                  />
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </DragableCardStyle>
  );
};

export default CardDragable;
