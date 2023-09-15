import { createPost, updateImagesPhysically } from 'api/sales';
import { ImagesScreenSizes } from 'appconstants';
import attrAccept from 'attr-accept';
import CreatePost from 'components/CreatePost';
import { toast } from 'components/toaster';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useHistory } from 'react-router-dom';
import {
  insertBeginningOfUserPosts,
  removeSelectedPost,
} from 'store/reducer/member-post';
import styled from 'styled-components';
import swal from 'sweetalert';
import { parseQuery, processFilesForRotation } from 'util/index';

const variants = {
  initial: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
  animate: {
    left: '0',
    opacity: 1,
    // position: 'relative',
  },
  exit: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
};

type ActionTypes = {
  status?: boolean;
  delete?: boolean;
  close?: boolean;
  toggel?: boolean;
  edit?: boolean;
  view?: boolean;
};
interface Props {
  value?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  className?: string;
  options?: ActionTypes;
  questionActions?: ActionTypes;

  onChange?: Function;
}

const MemberShipPostPop = ({ className }: Props) => {
  const selectedPost = useAppSelector(
    (state) => state.memberPost.selectedPostTemplate,
  );
  const dispatch = useAppDispatch();
  const history = useHistory();
  const st = parseQuery(history.location?.search);

  const onSubmit = async (values: any, form: any) => {
    if (!values?.media?.length && values.text === '') {
      toast.error('Please select aleast one media or enter text');
      return;
    }
    const newMedia: any[] = values?.media || [];
    const { filesWithoutRotation = [], newFiles } = processFilesForRotation(
      newMedia,
      ImagesScreenSizes.schedulePost,
    );
    const fWithoutRotation = filesWithoutRotation.map((file) => {
      const isVideo = attrAccept({ type: file.type }, 'video/*');
      const isAudio = attrAccept({ type: file.type }, 'audio/*');
      const type = isVideo
        ? 'video/mp4'
        : !isAudio
        ? `image/${(file.path ? file.path : file.url)?.split('.')?.pop()}`
        : file.type;
      return { ...file, type };
    });
    const objTem = selectedPost?.template_id
      ? {
          media: [...fWithoutRotation],
          membershipAccessType: selectedPost?.membershipAccessType,
          text: values?.text as string,
          templateId: !newFiles?.length ? selectedPost?.template_id : null,
          userId: selectedPost?.userId,
          _id: selectedPost?._id,
        }
      : {};
    const post: any = { ...values, media: fWithoutRotation, ...objTem };
    const promises: any = [];
    newFiles?.forEach((f: any) => {
      promises.push(
        updateImagesPhysically({
          url: f.oldUrl,
          name: f.path.split('/').pop(),
        }),
      );
    });

    return await Promise.all([...promises])
      .then(async () => {
        delete post.publishAt;
        return await createPost(post)
          .then((v) => {
            dispatch(insertBeginningOfUserPosts({ data: v }));
            dispatch(removeSelectedPost());
            form.resetForm();
          })
          .catch((err) => swal('', err.message, 'error'));
      })
      .catch((e) => console.log({ e }));
  };

  const getComponents = () => {
    const { step } = st;
    if (step === '1') {
      return (
        <AnimatePresence initial={false}>
          <motion.div
            key="left"
            custom={'left'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants as any}
            style={{ width: '100%', position: 'relative' }}
            transition={{ mass: 0.2, duration: 0.6 }}
            className="left-col"
          >
            <CreatePost
              getMemberships
              onSubmit={onSubmit}
              showBackButton={false}
            />
          </motion.div>
        </AnimatePresence>
      );
    }
  };

  return <div className={className}>{getComponents()}</div>;
};

export default styled(MemberShipPostPop)`
  /* overflow: hidden; */

  .personal-info {
    padding: 20px;

    @media (max-width: 479px) {
      padding: 20px 15px;
    }

    .react-datepicker__current-month {
      color: var(--pallete-primary-main);
    }

    .react-datepicker__day {
      &.react-datepicker__day--selected,
      &.react-datepicker__day--keyboard-selected,
      &:hover {
        background: var(--pallete-primary-main);
      }

      &:before {
        border-color: var(--pallete-primary-main);
      }
    }
  }

  .heading-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-main);
    font-weight: 400;

    .img {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-darker);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      overflow: hidden;
    }

    .description {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 10px;
    }

    .description-title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      margin: 0 0 3px;
    }
  }

  .footer-links {
    padding: 20px;
    text-align: center;
    border-top: 1px solid var(--pallete-colors-border);
  }

  ul.sortable {
    margin-top: 20px;

    .card--price {
      white-space: nowrap;
    }

    .card--text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }

    .card--title {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .price-area {
    display: flex;
    flex-direction: row;
    align-items: center;

    .text-input {
      width: 141px;
      margin: 0 10px 10px 0 !important;
    }

    .price-info {
      font-size: 13px;
      line-height: 15px;
      color: var(--pallete-text-main-100);
      font-weight: 500;
      margin: 0 0 10px;
    }
  }

  .price-description {
    color: #959a9f;
    font-size: 13px;
    line-height: 15px;

    strong {
      color: var(--pallete-text-main);
    }
  }

  .card-header-box {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.2857;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 25px;

    .header-image {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-main);
      color: #e5e5e5;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-title {
      color: var(--pallete-text-main);
      font-size: 15px;
    }

    .header-text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 12px;
    }

    p {
      margin: 0;
    }
  }

  .dashedLine {
    margin: 0 -20px;
    border: none;
    height: 1px;
    background: #e6ecf5;
  }
`;
