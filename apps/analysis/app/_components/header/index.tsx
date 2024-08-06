import React from 'react';

import { CybotradeTitleLogo } from '@app/_assets/icons';

const Header = () => {
  return (
    <header className="bg-transparent h-full max-h-48 flex justify-between items-center select-none">
      <CybotradeTitleLogo className="text-primary" />
    </header>
  );
};

export default Header;
