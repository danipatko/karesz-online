import { IPlayer as Player } from '../../lib/shared/types';

// not the scoreboard, just the players
const Players = ({ players, host }: { players: Player[]; host: string }) => {
    return (
        <div className='p-2 flex gap-4 flex-wrap flex-1'>
            {players.map((x, i) => {
                return (
                    <div
                        key={i}
                        className='p-2 bg-slate-800 border-b-[3px] border-b-karesz '
                    >
                        <div className='text-base font-semibold text-white max-w-20vw overflow-x-hidden'>
                            {x.id === host ? (
                                <>
                                    <i className='fa fa-shield text-lg text-[#0f0]'></i>{' '}
                                </>
                            ) : null}
                            {x.name.substring(0, 30)}
                        </div>
                        <div className='text-sm text-gray-400 flex justify-between gap-3'>
                            <div
                                className='font-bold'
                                style={{
                                    color: x.ready ? '#0f0' : '#8f8f8f',
                                }}
                            >
                                {x.ready ? 'Ready' : 'Waiting'}
                            </div>
                            <div>{x.wins ? x.wins : 'No'} wins</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Players;
