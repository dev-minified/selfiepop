import attrAccept from 'attr-accept';
import ImageModifications from 'components/ImageModifications';
import React from 'react';
import Slider, { Settings } from 'react-slick';

const PrevArrow = ({ onClick }: any) => (
  <button className="slick-arrow slick-prev" onClick={onClick}>
    <span className="icon-keyboard_arrow_left"></span>
  </button>
);
const NextArrow = ({ onClick }: any) => (
  <button className="slick-arrow slick-next" onClick={onClick}>
    <span className="icon-keyboard_arrow_right"></span>
  </button>
);

const defaultSettings: Settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  adaptiveHeight: true,
};
type IAdditionalArtType = IAdditionalArt & {
  fallbackUrl?: string;
};
const Item = ({
  additionalArt,
  imgSettings,
}: {
  additionalArt: IAdditionalArtType[];
  imgSettings: ImageSizesProps['settings'];
}) => {
  return additionalArt.map(
    ({ artName, artType, artPath, fallbackUrl }, index) => {
      if (attrAccept({ name: artName, type: artType }, 'video/*')) {
        return (
          <div key={`${index}`} className="slide">
            <div className="video-holder">
              <video controls width="100%" height="100%">
                <source src={artPath} type="video/mp4" />
              </video>
              <img src="/assets/images/img-slide.jpg" alt="img description" />
            </div>
          </div>
        );
      }
      return (
        <div key={`${index}`} className="slide">
          <div className="video-holder">
            <ImageModifications
              fallbackUrl={fallbackUrl}
              imgeSizesProps={imgSettings}
              src={artPath}
              alt="img description"
            />
          </div>
        </div>
      );
    },
  );
};
const index: React.FC<{
  settings?: Settings;
  additionalArt?: [];
  imgSettings?: ImageSizesProps['settings'];
}> = ({ settings, additionalArt = [], imgSettings = {} }) => {
  if (!additionalArt.length) return <></>;
  return (
    <Slider
      {...{ ...defaultSettings, ...settings }}
      className="slideshow mb-10"
    >
      {Item({ additionalArt, imgSettings })}
    </Slider>
  );
};

export default index;
