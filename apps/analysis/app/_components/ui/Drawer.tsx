import React, { PropsWithChildren, useEffect } from 'react';
import RDrawer, { DrawerProps } from 'rsuite/Drawer';

interface IDrawer extends DrawerProps {
  header?: boolean;
}

export const Drawer = (props: IDrawer) => {
  const { placement, open, onClose, children, header = true, closeButton = false, ...rest } = props;
  const currentScrollY = typeof document !== 'undefined' ? window.scrollY : 0;
  const topPosition = typeof document !== 'undefined' ? document.body.style.top : 0;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (open) {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentScrollY}px`;
      } else {
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(topPosition.toString() || '0') * -1);
      }
    }
  }, [open]);

  return (
    <RDrawer
      placement={placement ?? 'right'}
      open={open}
      onClose={onClose}
      backdropClassName="!bg-[#714614] !opacity-50 !z-20"
      closeButton={closeButton}
      className="font-sans !w-[70%] !rounded-l-xl !overflow-clip"
      {...rest}
    >
      {header && (
        <RDrawer.Header>
          <RDrawer.Title>Drawer Title</RDrawer.Title>
        </RDrawer.Header>
      )}
      <RDrawer.Body className="!p-0 z-50">{children}</RDrawer.Body>
      <RDrawer.Actions>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onClose}>Confirm</button>
      </RDrawer.Actions>
    </RDrawer>
  );
};

export default Drawer;
