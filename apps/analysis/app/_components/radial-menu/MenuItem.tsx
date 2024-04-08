import Link from 'next/link';
import React, { CSSProperties, MouseEventHandler } from 'react';

type MenuItemProps = {
  index: number;
  openMenu: boolean;
  href: string;
  icon: React.ReactNode;
  onItemClick: () => void;
};

export const MenuItem = ({ index, openMenu, href, icon, onItemClick }: MenuItemProps) => {
  return (
    <Link
      href={href}
      style={
        {
          '--i': index,
          transform: openMenu && 'rotate(calc(var(--i) * (360deg / 12))) translateY(160px)',
          opacity: openMenu ? 1 : 0,
        } as CSSProperties
      }
      className="absolute transition-all ease-in-out duration-500 w-16"
      onClick={onItemClick}
    >
      {icon}
    </Link>
  );
};
