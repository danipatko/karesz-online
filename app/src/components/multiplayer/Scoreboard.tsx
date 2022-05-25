import { useState } from 'react';
import { MultiplayerState, Player } from '../../lib/hooks/multiplayer/game';

export const PlayerCard = ({
    place,
    player,
    onClick,
    extended,
}: {
    place: number;
    player: Player;
    onClick: () => void;
    extended: boolean;
}) => {
    return (
        <li className='px-2 select-none'>
            <div
                onClick={onClick}
                className='mt-1 border-[2px] hover:border-karesz bg-back cursor-pointer border-transparent rounded-tl-md rounded-br-md'
            >
                <div className='flex text-lg gap-1 transition-colors relative justify-end items-center '>
                    <div className='px-2 h-full w-[32px] overflow-hidden text-white text-center font-semibold'>
                        {place}
                    </div>
                    <div className='w-full px-2'>{player.name}</div>
                    {player.isReady ? (
                        <div className='px-2 fa text-green-500 fa-check'></div>
                    ) : (
                        <div className='px-2 fa text-zinc-500 fa-check'></div>
                    )}
                    {player.error && (
                        <div className='absolute pl-2 px-1 translate-x-[100%] fa text-red-500 fa-exclamation-circle'></div>
                    )}
                    {player.warning && (
                        <div className='absolute pl-2 px-1 translate-x-[100%] fa text-yellow-500 fa-exclamation-triangle'></div>
                    )}
                </div>
                {extended && (
                    <div className='px-2 py-1 bg-back rounded-br-md text-zinc-500 text-sm'>
                        {player.result ? (
                            <>
                                <div>
                                    Survived{' '}
                                    <span className='text-karesz font-bold'>
                                        {player.result.alive}
                                    </span>{' '}
                                    rounds
                                    {player.result.survived
                                        ? '.'
                                        : ` (${player.result.death}).`}
                                </div>
                                <div>
                                    Placed{' '}
                                    <span className='text-karesz font-bold'>
                                        {player.result.rocks.placed}
                                    </span>{' '}
                                    rocks and picked up{' '}
                                    <span className='text-karesz font-bold'>
                                        {player.result.rocks.picked_up}
                                    </span>
                                    .
                                </div>
                            </>
                        ) : (
                            <div className='text-center'>N/A</div>
                        )}
                    </div>
                )}
            </div>
        </li>
    );
};

export const Scoreboard = ({ game }: { game: MultiplayerState }) => {
    const [s, select] = useState<number>(-1);
    return (
        <ul>
            {game.players.map(([_, player], i) => (
                <PlayerCard
                    key={i}
                    place={i + 1}
                    player={player}
                    extended={s == i}
                    onClick={() => select((s) => (s == i ? -1 : i))}
                />
            ))}
        </ul>
    );
};
