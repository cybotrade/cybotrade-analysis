import React from 'react';

import { CybotradeTitleLogo } from '@app/_assets/icons';

const Header = () => {
  return (
    <header className="bg-transparent my-16 flex justify-between items-center">
      <CybotradeTitleLogo className="text-primary" />
    </header>
  );
};

export default Header;
