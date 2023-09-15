import { update } from 'api/User';
import { Plus, RecycleBin } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Model from 'components/modal';
import NewButton from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import Switchbox from 'components/switchbox';
import { toast } from 'components/toaster';
import useAuth from 'hooks/useAuth';
import { ReactElement, useState } from 'react';
import styled from 'styled-components';
import swal from 'sweetalert';

const Description = styled.div`
  font-size: 14px;
  line-height: 18px;
  padding: 0 0 10px;
  margin: 0 0 10px;
  border-bottom: 1px solid var(--pallete-colors-border);
`;

const Ids = styled.strong``;

function AnalyticsModel({ isOpen, onClose, className }: any): ReactElement {
  const [addNewModal, setAddNewModal] = useState(false);
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(user.gaTrackers);
  const [addNewValue, setAddNewValue] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const handleCategorySave = () => {
    onClose?.();
  };
  const handleAddNewSave = async () => {
    if (addNewValue?.startsWith('G-')) {
      const isValidValue = userData?.findIndex(
        (ele: any) => ele.id === addNewValue,
      );
      if (isValidValue !== -1) {
        toast.error('You cannot add same tracking key please add valid key');
        return;
      }
      const newd = [...userData, { id: addNewValue, isActive: false }];
      setLoading(true);
      update({ gaTrackers: newd }).then(() => {
        setLoading(false);
        setAddNewModal(false);
        setUserData(newd);
      });
    } else {
      toast.info('Google Analytics ID must be start with G-');
    }
  };
  const handlDelete = async (id: string) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    } as any).then(async (willDelete) => {
      if (willDelete) {
        const filterData = userData.filter((e: any) => {
          return e.id !== id;
        });

        await update({ gaTrackers: filterData });
        setUserData(filterData);
      }
    });
  };
  const HandleToggel = async (ele: Record<string, any>) => {
    const userTrackers = [...(userData || [])];
    const newTracker = userTrackers.map((tracker) => {
      if (tracker.id === ele.id) {
        return { ...ele };
      }
      return { ...tracker, isActive: false };
    });
    toast.info('You can activate one Google Analytics ID at a time!');
    try {
      await update({ gaTrackers: newTracker });
      setUserData(newTracker);
    } catch (error) {
      setUserData(userTrackers);
    }
  };
  return (
    <div className={className}>
      <Model
        isOpen={isOpen}
        onClose={handleCategorySave}
        showFooter={false}
        className={`${className} theme_listing_sorting_modal`}
        title="Analytics"
      >
        <Description>
          Yay! You can use Google Analytics for your profile stats by simply
          adding the ID <Ids>G-7397392-1</Ids> by clicking the Add New button
          and You are all set up with tracking advanced Analytics.
        </Description>
        <div className="scrollbar-holder">
          <Scrollbar autoHeightMax={'calc(100vh - 260px)'} autoHeight>
            {(userData || [])?.map((ele: any, idx: number) => {
              return (
                <div key={idx} className="rc-according">
                  <span className="rc-header">{ele?.id}</span>
                  <div>
                    <Switchbox
                      status={false}
                      value={ele?.isActive || false}
                      onChange={(e: any) => {
                        HandleToggel({ ...ele, isActive: e.target.checked });
                      }}
                      size="small"
                    />

                    <NewButton
                      type="default"
                      className="ml-5"
                      outline
                      size="x-small"
                      icon={<RecycleBin />}
                      onClick={() => {
                        handlDelete(ele?.id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </Scrollbar>
          <div className="btn-holder">
            <NewButton
              icon={<Plus />}
              block
              onClick={() => {
                setAddNewModal(true);
                setAddNewValue('');
              }}
            >
              Add New
            </NewButton>
          </div>
        </div>
        <Model
          title="Add New"
          isOpen={addNewModal}
          onClose={() => {
            setAddNewModal(false);
          }}
          onOk={handleAddNewSave}
          confirmLoading={loading}
          isDisabled={!addNewValue?.length}
        >
          <FocusInput
            materialDesign
            label="Add New Id"
            name="addNew"
            value={addNewValue}
            required
            onChange={(e) => {
              setAddNewValue(e.target.value);
            }}
          />
        </Model>
      </Model>
    </div>
  );
}
export default styled(AnalyticsModel)`
  .modal-content {
    padding: 25px 20px;
  }

  .modal-header {
    padding: 0 0 12px;
    border: none;
  }

  .modal-body {
    padding: 0;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;

    .img-title {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .modal-content-holder {
    font-size: 16px;
    line-height: 1.375;
    font-weight: 400;
    color: #495057;
  }

  .modal-footer {
    padding: 0;
  }

  .scrollbar-holder {
    margin: 0 -15px 0 0;
  }

  .action {
    margin: 0;
    padding: 20px;
    background: #fff;
  }

  .rc-scollbar {
    overflow: hidden;
    padding: 0 15px 0 0;

    > .rc-according {
      display: flex;
      align-items: center;
      background: #fff;
      padding: 10px 0;

      .sp_dark & {
        /* background: none; */
      }
    }
  }
  .rc-header {
    border: none;
    padding: 0 10px 0 0 !important;
  }

  .btn-holder {
    padding: 10px 15px 0 0;
  }
`;
