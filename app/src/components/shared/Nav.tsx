import { View } from '../../lib/shared/types';

export const Nav = ({
    view,
    setView,
}: {
    view: View;
    setView: (view: View) => void;
}) => {
    return (
        <div className='bg-back flex justify-start items-center flex-col gap-4 p-2'>
            <Item click={() => setView(View.Home)} current={view === View.Home}>
                <i className='fa fa-house'></i>
            </Item>
            <Item click={() => setView(View.Edit)} current={view === View.Edit}>
                <i className='fa fa-code'></i>
            </Item>
            <Item
                click={() => setView(View.Playground)}
                current={view === View.Playground}
            >
                <i className='fa fa-play'></i>
            </Item>
            <Item
                click={() => setView(View.Multiplayer)}
                current={view === View.Multiplayer}
            >
                <i className='fa fa-network-wired'></i>
            </Item>
            <Item click={() => setView(View.Docs)} current={view === View.Docs}>
                <i className='fa fa-book'></i>
            </Item>
        </div>
    );
};

export const Item = ({
    click,
    current,
    children,
}: {
    click: () => void;
    current: boolean;
    children?: React.ReactNode;
}) => {
    return (
        <div
            style={{ color: current ? 'rgb(34,127,255)' : '#4f4f4f' }}
            onClick={click}
            className='text-center text-lg items-center px-2 py-1.5 hover:bg-opacity-50 bg-opacity-0 bg-zinc-700 rounded-md cursor-pointer transition-colors'
        >
            {children}
        </div>
    );
};
