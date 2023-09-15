// import { Announcement } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import Card from 'components/SPCards';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { ReactElement, useEffect, useState } from 'react';
import {
  createLibraryFolderName,
  updateLibraryFolderName,
} from 'store/reducer/libraryFileUpload';
import styled from 'styled-components';

type Props = {
  isOpen?: boolean;
  className?: string;
  managedAccountId?: string;

  onSave?: (...args: any) => void;
  error?: string;
  onClose?: () => void;
  setLibraryListName?: (string: string) => void | Promise<any>;

  InputModal?: boolean;

  value?: MediaFolder;
};

function LibraryInputModal({
  isOpen,
  className,
  setLibraryListName,
  // eslint-disable-next-line
  onSave,
  error,
  value,
  onClose,
  managedAccountId = '',
}: Props): ReactElement {
  const [listName, setListName] = useState(value?.name || '');
  const dispatch = useAppDispatch();
  const [loading, setIsloading] = useState(false);

  useEffect(() => {
    if (value?.name) {
      setListName(value?.name);
    }
  }, [value?._id]);
  const onCloseHanldler = () => {
    setListName('');
    onClose?.();
  };
  const setGalleryName = async (name: string) => {
    if (!name) {
      return;
    }
    setIsloading(true);
    setLibraryListName?.(listName);

    if (value) {
      dispatch(
        updateLibraryFolderName({
          id: value?._id as string,
          name,
          options: {
            params: {
              sellerId: managedAccountId,
            },
          },
        }),
      )
        .unwrap()
        .catch((e) => {
          console.log(e);
        });
      setIsloading(false);
      onCloseHanldler();
      return;
    }
    dispatch(
      createLibraryFolderName({
        name,
        options: {
          params: {
            sellerId: managedAccountId,
          },
        },
      }),
    )
      .unwrap()
      .catch((e) => {
        if (e?.message) {
          toast.error(e.message);
        }
        console.log(e);
      });
    setIsloading(false);
    setListName('');
    onCloseHanldler();
    return true;
  };
  const onSaveName = async () => {
    return await setGalleryName?.(listName);
  };
  return (
    <Model
      className={className}
      isOpen={!!isOpen}
      showHeader={false}
      showFooter={false}
      isDisabled={loading}
      confirmLoading={loading}
      onClose={onCloseHanldler}
    >
      <Card onCancel={onCloseHanldler} showClose={false} onSave={onSaveName}>
        <div className="galleyName">
          <FocusInput
            onChange={(e) => {
              setListName(e.target.value);
            }}
            error={error}
            label="Enter list name"
            inputClasses="mb-25"
            name="username"
            value={listName}
            materialDesign
            limit={80}
          />
        </div>
      </Card>
    </Model>
  );
}
export default styled(LibraryInputModal)`
  max-width: 415px;
  padding: 0 15px;

  .modal-content {
    border: none;
  }

  .modal-body {
    padding: 0;
  }

  .galleyName {
    p {
      margin: 0;
    }
  }

  .sp__card {
    overflow: visible;
    padding: 17px;
    background: none;

    .header {
      display: none;
    }

    .dashed {
      display: none;
    }

    .body {
      padding: 0;
      border: none;
    }

    .footer-card {
      padding: 20px 10px 0;
      background: none;

      /* .sp_dark & {
        background: var(--pallete-background-primary-100);
      } */
    }

    .text-input {
      margin-bottom: 0 !important;
    }

    .footer-links {
      .button {
        min-width: 166px;

        @media (max-width: 767px) {
          min-width: 120px;
          padding: 10px;
        }
      }
    }
  }
`;
