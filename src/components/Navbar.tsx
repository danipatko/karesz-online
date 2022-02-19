import { useState } from 'react';

const NavButton = ({
    action,
    icon,
    extended,
    text,
}: {
    action: () => void;
    icon: string;
    text: string;
    extended: boolean;
}) => {
    return (
        <div className='p-2 my-2 rounded-xl transition-colors text-white bg-fore hover:bg-white hover:text-fore cursor-pointer'>
            {extended ? (
                <div>
                    <span className={`px-1 fa text-xl ${icon}`}></span>
                    <span className='pl-2'>{text}</span>
                </div>
            ) : (
                <div className='text-center'>
                    <span className={`px-1 fa text-xl ${icon}`}></span>
                </div>
            )}
        </div>
    );
};

const Navbar = () => {
    const [extended, setExtended] = useState(false);

    return (
        <div
            onMouseEnter={() => setExtended(true)}
            onMouseLeave={() => setExtended(false)}
            className='fixed left-0 px-2 top-[10vh] bg-main m-5 rounded-xl'
        >
            <ul className='list-none'>
                <NavButton
                    action={() => {}}
                    text='Home'
                    extended={extended}
                    icon='fa-house'
                />
                <NavButton
                    action={() => {}}
                    text='Edit code'
                    extended={extended}
                    icon='fa-code'
                />
                <NavButton
                    action={() => {}}
                    text='Join game'
                    extended={extended}
                    icon='fa-gamepad'
                />
                <NavButton
                    action={() => {}}
                    text='Docs'
                    extended={extended}
                    icon='fa-book'
                />
            </ul>
        </div>
    );
};

export default Navbar;
