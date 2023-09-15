import React from 'react';
import Slider from 'react-slick';
const setting = {
  dots: false,
  infinite: true,
  speed: 1000,
  autoplaySpeed: 5000,
  autoplay: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  rtl: true,
  nextArrow: <></>,
  prevArrow: <></>,
};

const MobileSlider: React.FC<any> = () => {
  return (
    <div className="slider-area">
      <div className="slideshow-area bg-back">
        <span className="img-overlay">
          <img
            src="assets/images/iphone-banner.png"
            alt="assets/images/iphone-banner.png"
          />
        </span>

        <img
          src="assets/images/img-front-cover.png"
          alt="assets/images/img-front-cover.png"
          className="parent-image"
        />
        <Slider className="mobile-slideshow" {...setting}>
          <div className="slide">
            <img
              src="assets/images/signup/A4.png"
              alt="assets/images/signup/A4.png"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B2.jpg"
              alt="assets/images/signup/B2.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A2.png"
              alt="assets/images/signup/A2.png"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A3.png"
              alt="assets/images/signup/A3.png"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B3.jpg"
              alt="assets/images/signup/B3.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A8.jpg"
              alt="assets/images/signup/A8.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B1.jpg"
              alt="assets/images/signup/B1.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A7.jpg"
              alt="assets/images/signup/A7.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B4.jpg"
              alt="assets/images/signup/B4.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B4.jpg"
              alt="assets/images/signup/B4.jpg"
            />
          </div>
        </Slider>
      </div>
      <div className="slideshow-area">
        <span className="img-overlay">
          <img
            src="assets/images/iphone-banner.png"
            alt="assets/images/iphone-banner.png"
          />
        </span>

        <img
          src="assets/images/img-front-cover.png"
          alt="assets/images/img-front-cover.png"
          className="parent-image"
        />
        <Slider className="mobile-slideshow" {...setting}>
          <div className="slide">
            <img
              src="assets/images/signup/B4.jpg"
              alt="assets/images/signup/B4.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A4.png"
              alt="assets/images/signup/A4.png"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B2.jpg"
              alt="assets/images/signup/B2.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A2.png"
              alt="assets/images/signup/A2.png"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A3.png"
              alt="assets/images/signup/A3.png"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B3.jpg"
              alt="assets/images/signup/B3.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A8.jpg"
              alt="assets/images/signup/A8.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/B1.jpg"
              alt="assets/images/signup/B1.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A7.jpg"
              alt="assets/images/signup/A7.jpg"
            />
          </div>
          <div className="slide">
            <img
              src="assets/images/signup/A9.jpg"
              alt="assets/images/signup/A9.jpg"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default MobileSlider;
