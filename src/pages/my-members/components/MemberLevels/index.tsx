// import NewButton from 'components/NButton';
import MemberLevel from 'components/MemberLevel';
import { ServiceType } from 'enums';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
interface Props {
  className?: string;
}
function MembersLevels({ className }: Props): ReactElement {
  const {
    user: { links },
  } = useAuth();
  const [previewPop, setpreviewPop] = useState<any>(null);
  useEffect(() => {
    setpreviewPop(
      links?.find(
        (l: any) => l?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
      ),
    );
  }, [links]);
  return (
    <>
      <div className={`${className}`}>
        <MemberLevel value={previewPop || {}} showFooter={true} />
      </div>
    </>
  );
}
export default styled(MembersLevels)``;
