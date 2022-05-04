import { IPlayer as Player } from '../../../lib/shared/types';

// not the scoreboard, just the players
const Players = ({ players, host }: { players: Player[]; host: string }) => {
    return (
        <div className='p-2 flex gap-4 flex-wrap flex-1'>
            {players.map((x, i) => (
                <div key={i} className='rounded-xl flex items-center '>
                    <div className='px-2 py-1.5 bg-slate-800 text-sm rounded-l-md'>
                        {x.ready ? (
                            <i className='fa fa-check text-karesz'></i>
                        ) : (
                            // <span className='text-gray-400'>&#10005;</span>
                            <i className='spin fa fa-hourglass-empty text-gray-400'></i>
                        )}
                    </div>
                    <div
                        style={{ color: host === x.id ? '#0f0' : '#fff' }}
                        className='px-2 py-1 bg-main font-semibold max-w-20vw overflow-x-hidden'
                    >
                        {x.name}
                    </div>
                    <div className='px-2 py-1 text-zinc-400 bg-main rounded-r-md'>
                        {x.wins}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Players;
