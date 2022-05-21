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
                    <div className='px-2 py-1 bg-back rounded-br-md'>
                        {player.result ? (
                            <>
                                <div>
                                    Rounds survived: {player.result.alive}
                                </div>
                                <div>
                                    Rocks: {player.result.rocks.placed} placed,{' '}
                                    {player.result.rocks.picked_up} picked up
                                </div>
                                <div>
                                    {player.result.survived
                                        ? 'Survived'
                                        : player.result.death}
                                </div>
                            </>
                        ) : (
                            <div className='text-center text-zinc-400'>N/A</div>
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
            {game.players.map(([_, player], index) => (
                <PlayerCard
                    key={index}
                    place={index + 1}
                    player={player}
                    extended={s == index}
                    onClick={() => select((s) => (s == index ? -1 : index))}
                />
            ))}
        </ul>
    );
};
