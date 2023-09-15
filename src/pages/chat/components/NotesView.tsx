import {
  addNote,
  deleteNote,
  getSubscriptionByNotes,
} from 'api/ChatSubscriptions';
import { Notes, PlusFilled, RecycleBin, Spinner } from 'assets/svgs';
import Button from 'components/NButton';
import Card from 'components/SPCards/SimpleCard';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import useOpenClose from 'hooks/useOpenClose';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import NotesModel from './Models/NotesModel';
interface Props {
  className?: string;
  sub: ChatSubsType;
  isBuyer?: boolean;
  user?: ChatUserType;
  managedAccountId?: string;
}
const PAGE_LIMIT = 2;
function NotesView({
  className,
  sub,

  managedAccountId,
}: Props): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [notes, setNote] = useState<{ items: NoteType[]; totalCount: number }>({
    items: [],
    totalCount: 0,
  });
  const [openModel, onOpenModel, onCloseModel] = useOpenClose();
  useEffect(() => {
    if (sub?._id) {
      const paramsList: any = {
        skip: 0 * PAGE_LIMIT,
        limit: PAGE_LIMIT,
        sort: -1,
        sellerId: managedAccountId,
      };
      getSubscriptionByNotes(sub?._id, paramsList).then((res) => {
        if (!!res?.items?.length) {
          setNote({
            items: res?.items,
            totalCount: res?.totalCount,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub?._id]);
  const handleAddNote = async (note = '') => {
    onCloseModel();
    if (!!note.length) {
      const oldNotes = { ...(notes || {}) };
      await addNote(sub._id || '', {
        note: note,
        sellerId: managedAccountId,
      })
        .then((res) => {
          if (res?.note) {
            setNote((note: any) => {
              if (!!note?.items?.length) {
                return {
                  items: [{ ...res?.note }, { ...note.items?.[0] }],
                  totalCount: note.totalCount + 1,
                };
              } else {
                return {
                  items: [{ ...res?.note }, ...note.items],
                  totalCount: note.totalCount + 1,
                };
              }
            });
          }
        })
        .catch((e) => {
          if (e.message) {
            toast.error(e.message);
          }
          // const updatedTags = newTags.filter((t) => t !== tag);
          setNote(oldNotes);
          console.log(e);
        });
    }
  };
  const handleDelete = async (noteId: string) => {
    if (sub?._id) {
      const oldNotes = { ...(notes || {}) };
      const newNotes: NoteType[] = [...notes.items];
      const updatedNotes = newNotes.filter((t) => t._id !== noteId);
      setNote((note: any) => {
        return {
          ...note,
          items: updatedNotes,
          totalCount: notes?.totalCount - 1,
        };
      });
      await deleteNote(sub._id, noteId, { sellerId: managedAccountId })
        .then(() => {})
        .catch((e) => {
          if (e.message) {
            toast.error(e.message);
          }
          setNote(oldNotes);
          console.log(e);
        });
    }
  };
  const loadMore = async () => {
    if (sub?._id) {
      setIsLoading(true);

      const paramsList: any = {
        skip: notes?.items?.length,
        limit: PAGE_LIMIT,
        sort: -1,
        sellerId: managedAccountId,
      };
      getSubscriptionByNotes(sub?._id, paramsList)
        .then((res) => {
          if (!!res?.items?.length) {
            setNote((note: any) => {
              return {
                ...note,
                items: [...note.items, ...res.items],
              };
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <div className={className}>
      <div className="title">
        <span className="icon">
          <Notes />
        </span>
        Notes
      </div>
      <Button
        block
        icon={<PlusFilled />}
        shape="round"
        className="btn-note"
        size="small"
        onClick={() => onOpenModel()}
      >
        New Note
      </Button>
      <div className="notes_listing">
        {!!notes?.items?.length ? (
          <>
            {notes?.items?.map((note) => (
              <Card
                key={note._id}
                extra={
                  <span
                    className="note_dlt_icon"
                    onClick={() => handleDelete(note?._id || '')}
                  >
                    <RecycleBin />
                  </span>
                }
                title={dayjs(note.noteDateTime).format('ddd hh:mm A')}
              >
                {note.noteValue}
              </Card>
            ))}
            {notes?.totalCount > notes?.items.length && !isLoading ? (
              <div className="load-more-notes">
                <span className="notes-loader" onClick={loadMore}>
                  <span className="arrow"></span> View More
                </span>
              </div>
            ) : (
              isLoading && (
                <div className="spiner-holder">
                  <Spinner />
                </div>
              )
            )}
          </>
        ) : (
          <Button
            block
            className="empty__placeholder"
            shape="circle"
            type="default"
            size="small"
            disabled
          >
            No notes added to this subscriber.
          </Button>
        )}
      </div>
      <NotesModel
        onSave={(note) => handleAddNote(note)}
        onCancel={() => onCloseModel()}
        isOpen={openModel}
      />
    </div>
  );
}

export default styled(NotesView)`
  padding: 14px 15px 0;
  background: var(--pallete-background-default);
  border-radius: 5px;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  border: 2px solid var(--pallete-colors-border);
  .title {
    font-size: 14px;
    line-height: 17px;
    color: var(--pallete-primary-main);
    position: relative;
    padding: 0 0 0 30px;
    margin: 0 0 15px;
    .icon {
      position: absolute;
      left: 0;
      top: 0;
    }
    path {
      fill: currentColor;
    }
  }
  .btn-note {
    background: var(--pallete-primary-main);
    color: #fff;
    margin: 0 0 13px;
    padding: 3px 10px;
    &.button-sm {
      padding: 3px 10px;
    }
    svg {
      width: 14px;
    }
  }
  .empty__placeholder {
    margin: 0 0 10px !important;
    font-size: 13px;
    line-height: 18px;
    background: var(--colors-darkGrey-50);
    color: #95999d;
    padding: 3px 10px;
    &.button-sm {
      padding: 3px 10px;
    }
    &:disabled {
      opacity: 1;
    }
  }
  .notes_listing {
    .card {
      border: none;
      margin: 0 0 15px;
    }
    .card-header {
      background: none;
      border: none;
      padding: 0 0 5px;
      .rc-card-title {
        color: var(--pallete-text-main-550);
        opacity: 0.6;
        font-size: 12px;
        line-height: 15px;
        font-weight: 500;
        word-break: normal;
      }
      svg {
        path {
          fill: #92969a;
        }
      }
    }
    .card-body-wrapper {
      background: var(--pallete-background-secondary-light);
      border-radius: 4px;
      padding: 10px 18px 9px;
      font-size: 13px;
      line-height: 20px;
      color: var(--pallete-text-light-50);
    }
  }
  .note_dlt_icon {
    cursor: pointer;
  }

  .load-more-notes {
    text-align: center;
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 15px;
    font-weight: 500;

    .notes-loader {
      color: var(--pallete-primary-main);
      cursor: pointer;
      transition: all 0.4s ease;

      &:hover {
        color: var(--colors-indigo-200);

        .arrow {
          border-color: var(--colors-indigo-200) transparent transparent
            transparent;
        }
      }
    }

    .arrow {
      transition: all 0.4s ease;
      display: inline-block;
      vertical-align: middle;
      border-style: solid;
      border-width: 5px 4px 0 4px;
      border-color: var(--pallete-primary-main) transparent transparent
        transparent;
      margin: -4px 0 0;
    }
  }

  .spiner-holder {
    color: var(--pallete-primary-main);
    width: 30px;
    margin: 0 auto 10px;

    svg {
      width: 100%;
      height: auto;
      display: block;
    }

    path {
      fill: currentColor;
    }
  }
`;
