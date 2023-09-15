import ProfileSlider from 'components/ProfileSlider';
import React from 'react';
import styled from 'styled-components';
import './bio-editor.module.css';
interface Props {
  className?: string;
  [key: string]: any;
}

const Profile: React.FC<Props> = ({ className }) => {
  return (
    <div className={`${className}`}>
      <ProfileSlider />
    </div>
  );
};

export default styled(Profile)``;
