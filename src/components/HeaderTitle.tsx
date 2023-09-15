import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { PlusFilled } from 'assets/svgs';
import classNames from 'classnames';
import NewButton from 'components/NButton';
import { toast } from 'components/toaster';

type IHeaderProps = {
  isloading?: boolean;
  className?: string;
  title?: ReactNode;
  caption?: ReactNode;
  buttonText?: ReactNode;
  buttonUrl?: string;
  isdisabled?: boolean;
  requests?: number;
  items?: any[];
  onClick?: (...args: any[]) => void | Promise<any>;
};
const HeaderTitle = (props: IHeaderProps) => {
  const [totalcommission, setTotalcommission] = useState<number>(0);
  const {
    title,
    caption,
    buttonUrl,
    buttonText,
    onClick,
    requests = 0,
    className,
    isdisabled = false,
    isloading,
    items,
  } = props;
  useEffect(() => {
    setTotalcommission(
      items
        ?.filter(
          (item) =>
            item?.item?.status === 'active' || item?.item?.status === 'pending',
        )
        ?.reduce((accumulator, currentValue) => {
          return (
            parseFloat(accumulator) +
            parseFloat(currentValue?.item?.commissionValue)
          );
        }, 0),
    );
  }, [items?.length]);

  return (
    <div className={classNames('block-head', className)}>
      <div className="block-head__wrap">{title && <h5>{title}</h5>}</div>

      {caption && <div>{caption}</div>}
      {buttonText && (
        <Link
          to={buttonUrl || ''}
          onClick={(e) => {
            if (totalcommission >= 100) {
              toast.info(
                'Total commission of all active managers can not be more than 100%',
              );
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            if (requests >= 5) {
              toast.info(
                'You can only have a total of five active or pending team members at a time.',
              );
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            if (isdisabled || isloading || buttonUrl) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            onClick?.(props);
          }}
        >
          <NewButton
            type={'secondary'}
            className="mt-10"
            size="middle"
            block
            icon={buttonText !== 'NEXT STEP' && <PlusFilled />}
            id="add-new-pop"
            disabled={isdisabled}
            isLoading={isloading}
          >
            {buttonText}
          </NewButton>
        </Link>
      )}
    </div>
  );
};
export default styled(HeaderTitle)`
  .button.button-secondary {
    background: var(--pallete-primary-main);

    &:hover {
      background: var(--colors-indigo-200);
    }
  }
`;
