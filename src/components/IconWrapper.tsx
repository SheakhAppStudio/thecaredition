import React from 'react';
import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, className }) => {
  // @ts-ignore - Ignoring the IconType JSX error
  return <Icon className={className} aria-hidden="true" />;
};
