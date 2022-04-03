import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { View } from '../../lib/shared/types';

/* 
    boxShadow: selected ? '0 4px 10px -2px #1f2eff' : 'none',
    clipPath: 'inset(0px 0px -15px 0px)',
*/
const NavItem = ({
    onClick,
    children,
    selected,
}: {
    onClick: MouseEventHandler<HTMLDivElement>;
    children: React.ReactNode;
    selected: boolean;
}) => {
    return (
        <div
            style={{
                borderBottomColor: selected ? '#005eff' : 'transparent',
            }}
            className='text-white hover:bg-[#252525] p-2 border-b-[3px] flex-1 text-center font-semibold text-base select-none cursor-pointer'
            onClick={onClick}
        >
            {children}
        </div>
    );
};

const Navbar = ({
    selected,
    select,
}: {
    selected: View;
    select: Dispatch<SetStateAction<View>>;
}) => {
    return (
        <nav>
            <div className='flex bg-back gap-0'>
                <NavItem
                    selected={selected == View.Home}
                    onClick={() => select(View.Home)}
                >
                    Home
                </NavItem>
                <NavItem
                    selected={selected == View.Edit}
                    onClick={() => select(View.Edit)}
                >
                    Edit
                </NavItem>
                <NavItem
                    selected={selected == View.Playground}
                    onClick={() => select(View.Playground)}
                >
                    Playground
                </NavItem>
                <NavItem
                    selected={selected == View.Multiplayer}
                    onClick={() => select(View.Multiplayer)}
                >
                    Multiplayer
                </NavItem>
                <NavItem
                    selected={selected == View.Docs}
                    onClick={() => select(View.Docs)}
                >
                    Docs
                </NavItem>
            </div>
        </nav>
    );
};

export default Navbar;
