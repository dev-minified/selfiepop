import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import Listing from './components/Listing';

export interface IProps {
  type: ProfileType;
  link: LINKTYPES;
  useDragHandle?: boolean;
  isMergeLinks?: boolean;
}

const NewProfile: React.FC<IProps> = ({ type, link, isMergeLinks }) => {
  const { user, setUser }: any = useAuth();
  const [Links, setLinks] = useState<IUserLink[]>([]);
  useEffect(() => {
    if (user?._id) {
      setLinks(() => {
        if (type === 'services') {
          const newLinks = [...(user?.links || [])];
          return newLinks?.sort((a: any, b: any) => b.isTemp - a.isTemp);
        } else {
          return user?.links;
        }
      });
    }
  }, [user, isMergeLinks]);
  return (
    <div id="profile-area">
      <Listing
        links={Links?.map((item: IUserLink) =>
          item.linkType === 'biography'
            ? { ...item, title: user.pageTitle ?? 'Incognito User' }
            : item,
        )}
        link={link}
        type={type}
        user={user}
        setLinks={(links: any[]) => {
          setUser((prev: any) => ({
            ...prev,
            [link]: links,
          }));
        }}
        addPop={type === 'services'}
        inlineForm={false}
      />
    </div>
  );
};

export default NewProfile;
