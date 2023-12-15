import { CybotradeTitleLogo } from '@app/_assets/icons';
import React from 'react';

const Header = () => {
    return (
        <header className="bg-transparent mb-16 flex justify-between items-center">
            <CybotradeTitleLogo className="text-primary" />
            {/* {amount !== undefined && checkActive('/arena') && <WalletTopUp amount={amount} />} */}
            {/* {checkActive('/profile') && (
                <Link href="/api/auth/logout">
                    <button
                        className={cn(
                            'border border-primary ',
                            'rounded-[20px]',
                            'text-primary font-bold',
                            'py-5 px-16',
                            'hover:opacity-80'
                        )}
                    >
                        Logout
                    </button>
                </Link>
            )} */}
        </header>
    );
};

export default Header;
