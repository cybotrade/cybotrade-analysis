'use client';

import { useRouter } from 'next/navigation';
import { CSSProperties, useMemo, useState } from 'react';

import {
  ActiveEquityCurveMenuIcon,
  ActiveSurfacePlotMenuIcon,
  DisableEquityCurveMenuIcon,
  DisableSurfacePlotMenuIcon,
} from '@app/_assets/icons';
import { useActivePath } from '@app/_hooks/useActivePath';

const RadialMenu = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [checkActivePath, pathname] = useActivePath();
  const router = useRouter();

  const actions = useMemo(
    () => [
      {
        name: 'equity-curve',
        href: '/candles',
        icon: {
          active: (
            <ActiveEquityCurveMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
          disable: (
            <DisableEquityCurveMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
        },
      },
      {
        name: 'candle-chart',
        href: '/link-one',
        icon: {
          active: (
            <ActiveSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
          disable: (
            <DisableSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
        },
      },
      {
        name: 'result-breakdown',
        href: '/link-one',
        icon: {
          active: (
            <ActiveSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
          disable: (
            <DisableSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
        },
      },
      {
        name: 'surface-plot',
        href: '/link-one',
        icon: {
          active: (
            <ActiveSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
          disable: (
            <DisableSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
        },
      },
      {
        name: 'monte-carlo',
        href: '/link-one',
        icon: {
          active: (
            <ActiveSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
          disable: (
            <DisableSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
        },
      },
      {
        name: 'trend',
        href: '/link-one',
        icon: {
          active: (
            <ActiveSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
          disable: (
            <DisableSurfacePlotMenuIcon
              width="100%"
              height="100%"
              style={{
                transform: 'rotate(calc(var(--i) * (360deg / -12)))',
                rotate: '-165deg',
              }}
            />
          ),
        },
      },
    ],
    [],
  );
  const selectedAction = useMemo(() => {
    const findAction = actions.find((a) => a.href === pathname);
    return findAction ? findAction.icon.active : actions[0].icon.active;
  }, [pathname]);

  return (
    <nav className="fixed top-1/2 -translate-y-1/2 left-0 flex items-center justify-center z-10">
      <div className="nav-content absolute flex items-center justify-center rotate-[165deg]">
        <div className="absolute bg-[#FFD7A7] opacity-60 w-[250px] h-[250px] rounded-full blur-3xl"></div>
        <div className="toggle-btn cursor-pointer z-50 w-32" onClick={() => setOpenMenu(!openMenu)}>
          {selectedAction}
        </div>
        {actions.map(({ name, icon, href }, index) => (
          <div
            key={name}
            style={
              {
                '--i': index + 1,
                transform: openMenu && 'rotate(calc(var(--i) * (360deg / 12))) translateY(160px)',
                opacity: openMenu ? 1 : 0,
              } as CSSProperties
            }
            className="absolute transition-all ease-in-out duration-500 w-20"
            onClick={() => {
              router.push(href);
              setOpenMenu(false);
            }}
          >
            {pathname === href ? icon.active : icon.disable}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default RadialMenu;
