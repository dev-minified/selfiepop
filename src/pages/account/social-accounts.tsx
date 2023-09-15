import {
  createSocialAccount,
  getSocialAccounts,
  updateSocialAccount,
} from 'api/social-accounts';
import {
  Dollar,
  Edit,
  FacebookAlt,
  InstagramAlt,
  OnlyFans,
  SnapChat,
  Tiktok,
  TwitterAlt,
  YoutubeAlt,
} from 'assets/svgs';
import Button from 'components/NButton';
import Pagination from 'components/pagination';
import { toast } from 'components/toaster';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getLocation } from 'util/index';
import SocailLinkCreateModal from './components/CreateSocialIconModel';
interface Props {
  className?: string;
}

const SocialAccounts: React.FC<Props> = (props) => {
  const { className } = props;
  const { user } = useAuth();
  const [isOpen, onOpen, onClose] = useOpenClose();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<SocialLink[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const { withLoader } = useRequestLoader();
  const [values, setValues] = useState<SocialLink | undefined>(undefined);

  useEffect(() => {
    if (user?._id) {
      withLoader(
        getSocialAccounts()
          .catch(console.log)
          .then((res) => {
            if (res?.socialMedia) {
              setSocialLinks(res?.socialMedia);
            }
          }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const links = [...socialLinks];
    setFilteredLinks(links.splice((selectedPage - 1) * 10, 10));
  }, [socialLinks, selectedPage]);

  const onSubmit = async (values: any) => {
    const { _id, name, type, url } = values;
    if (editing) {
      const res = await updateSocialAccount(_id, {
        name,
        url,
        type,
      }).catch(() => {
        toast.error('Could not update link');
      });

      if (res) {
        setSocialLinks((prev) => {
          const prevLinks = [...prev];
          const index = prevLinks.findIndex((link) => link._id === _id);
          prevLinks.splice(index, 1, res.socialLink);
          return prevLinks;
        });
      }
    } else {
      const res = await createSocialAccount({
        name,
        url,
        type,
      }).catch(() => {
        toast.error('Could not create link');
      });

      if (res) {
        setSocialLinks((prev) => {
          const prevLinks = [...prev];
          prevLinks.unshift(res.socialLink);
          return prevLinks;
        });
      }
    }
    handleCancel();
  };

  const getAdvertisementVariationIcon = (type?: string) => {
    switch (type) {
      case 'facebook':
        return (
          <span className="facebook">
            <FacebookAlt />
          </span>
        );
      case 'instagram':
        return (
          <span className="instagram">
            <InstagramAlt />
          </span>
        );
      case 'snapchat':
        return (
          <span className="snapchat">
            <SnapChat />
          </span>
        );
      case 'twitter':
        return (
          <span className="twitter">
            <TwitterAlt />
          </span>
        );
      case 'youtube':
        return (
          <span className="youtube">
            <YoutubeAlt />
          </span>
        );
      case 'tiktok':
        return (
          <span className="tiktok">
            <Tiktok />
          </span>
        );
      case 'onlyfans':
        return (
          <span className="onlyfans">
            <OnlyFans />
          </span>
        );
      default:
        return (
          <span className="dollar">
            <Dollar />
          </span>
        );
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditing(true);
    setValues(link);
    onOpen();
  };

  const handleCancel = () => {
    onClose();
    setEditing(false);
    setValues(undefined);
  };

  return (
    <div className={className}>
      <h3>Accounts</h3>
      <div className="text-center">
        {/* <Button type="primary" size="large" className="mb-15">
          Connect to Facebook/Instagram
        </Button> */}
        <Button
          type="primary"
          size="large"
          className="mb-15"
          onClick={() => {
            onOpen();
          }}
        >
          Add other social accounts manually
        </Button>
      </div>
      {filteredLinks.map((link) => (
        <div key={link._id} className="primary-shadow social-widget">
          <div className="social-widget-wrap">
            <div className="icon">
              {getAdvertisementVariationIcon(link?.type)}
            </div>
            <div className="wrap">
              <div className="title-wrap">
                <span
                  onClick={() => {
                    window.open(getLocation(link.url).href, '_blank');
                  }}
                  className="title"
                >
                  {link.name}
                </span>
                <div className="btns-actions">
                  {/* <Button
                    icon={<RecycleBin />}
                    onClick={() => handleDelete(link?._id)}
                  ></Button> */}
                  <Button
                    icon={<Edit />}
                    onClick={() => handleEdit(link)}
                  ></Button>
                </div>
              </div>
              <div className="text-wrap">
                <span className="subtext">
                  <span className="text-uppercase">{link.type}</span>
                </span>
                {/* {getStats(link)} */}
              </div>
            </div>
          </div>
        </div>
      ))}
      {socialLinks?.length > 10 && (
        <Pagination
          total={socialLinks.length}
          defaultPageSize={10}
          onChange={(page) => setSelectedPage(page)}
          current={selectedPage}
        />
      )}

      <SocailLinkCreateModal
        isOpen={isOpen}
        onClose={handleCancel}
        onSubmit={onSubmit}
        isEdit={editing}
        values={values}
      />
    </div>
  );
};

export default styled(SocialAccounts)`
  .primary-shadow:hover {
    cursor: default;
  }
  .title {
    cursor: pointer;
  }
  .social-widget {
    background: var(--pallete-background-primary-light);
    border: 1px solid var(--pallete-colors-border);
    overflow: hidden;
    border-radius: 5px;
    margin: 0 0 9px;
    display: block;

    .icon {
      width: 36px;
      margin: 0 10px 0 0;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .twitter {
      color: #55acee;
    }

    .instagram {
      color: #724293;
    }

    .facebook {
      color: #3b5998;
    }

    .youtube {
      color: #c4302b;
    }

    .onlyfans {
      color: #00aff0;
    }
  }

  .social-widget-wrap {
    display: flex;
    align-items: center;
    padding: 12px 11px;
  }

  .social-widget-footer {
    background: var(--pallete-background-default);
    padding: 8px 15px 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e5e5e5;
  }

  .social-widget .img-holder {
    width: 54px;
    height: 54px;
    min-width: 54px;
    overflow: hidden;
    border-radius: 100%;
    margin: 0 15px 0 2px;
  }

  .social-widget .img-holder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
  }

  .social-widget .wrap {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
  }

  .social-widget .title {
    font-size: 20px;
    line-height: 1.4;
    font-weight: 400;
    margin: 0 0 2px;
    color: var(--pallete-text-main);
    display: inline-block;
    flex-grow: 1;
    flex-basis: 0;
    margin: 0 5px 0 0;
    min-width: 0;
    /* max-width: calc(100% - 90px); */
  }

  .social-widget .price {
    color: #fff;
    min-width: 82px;
    background: var(--pallete-primary-main);
    border-radius: 5px;
    font-size: 14px;
    text-align: center;
    line-height: 19px;
    padding: 3px 15px;
    font-weight: 700;
    margin: 0 0 4px;
  }

  .social-widget .title-wrap,
  .social-widget .text-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: 0 0 4px;
  }

  .social-widget .subtext {
    display: block;
    font-size: 13px;
    color: var(--pallete-text-main-500);
    font-weight: 400;
  }

  .social-widget .status {
    color: var(--pallete-text-main-500);
    font-size: 14px;
  }

  .social-widget .status time,
  .social-widget .status span {
    color: var(--pallete-text-main);
    font-weight: 500;
    font-size: 14px;
  }

  .social-widget .status span {
    position: relative;
  }

  @media (max-width: 767px) {
    .social-widget .title {
      font-size: 18px;
    }
  }

  @media (max-width: 640px) {
    .social-widget .subtext {
      margin: 0 7px 0 0;
    }

    .social-widget .text-wrap {
      flex-wrap: wrap;
    }
  }
`;
