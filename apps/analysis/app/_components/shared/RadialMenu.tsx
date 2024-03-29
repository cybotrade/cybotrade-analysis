'use client';

import { useRouter } from 'next/navigation';
import { CSSProperties, useMemo, useState } from 'react';

import { EquityCurveMenuIcon } from '@app/_assets/icons';
import { MenuItem } from '@app/_components/radial-menu/MenuItem';
import { useActivePath } from '@app/_hooks/useActivePath';

const RadialMenu = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [checkActivePath, pathname] = useActivePath();
  const router = useRouter();

  const actions = useMemo(
    () => [
      {
        name: 'equity-curve',
        href: '/new/analysis/candle-chart',
        icon: (
          <EquityCurveMenuIcon
            width="100%"
            height="100%"
            style={{
              transform: 'rotate(calc(var(--i) * (360deg / -12)))',
              rotate: '-165deg',
            }}
          />
        ),
      },
      {
        name: 'equity-curve',
        href: '/candle-chart',
        icon: (
          <EquityCurveMenuIcon
            width="100%"
            height="100%"
            style={{
              transform: 'rotate(calc(var(--i) * (360deg / -12)))',
              rotate: '-165deg',
            }}
          />
        ),
      },
    ],
    [],
  );

  const selectedAction = actions.find((a) => a.href === pathname);

  return (
    <nav className="fixed top-1/2 -translate-y-1/2 left-0 flex items-center justify-center z-10">
      <div className="nav-content absolute flex items-center justify-center rotate-[165deg]">
        <div className="absolute bg-[#FFD7A7] opacity-60 w-[250px] h-[250px] rounded-full blur-3xl"></div>
        <div className="toggle-btn cursor-pointer z-50 w-32" onClick={() => setOpenMenu(!openMenu)}>
          {selectedAction ? selectedAction.icon : actions[0].icon}
        </div>
        {actions.map(({ name, icon, href }, index) => (
          <MenuItem
            key={index}
            index={index + 1}
            openMenu={openMenu}
            onItemClick={() => setOpenMenu(false)}
            href={href}
            icon={icon}
          />
        ))}
      </div>
    </nav>
  );
};

export default RadialMenu;
