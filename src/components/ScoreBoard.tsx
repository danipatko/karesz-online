import PlayerCard from './PlayerCard';

const ScoreBoard = ({
    players,
}: {
    players: { [key: string]: { name: string; id: string; ready: boolean } };
}) => {
    return (
        <div className='p-2'>
            <ul className='list-none bg-zinc-800 odd:bg-zinc-700'>
                {Object.keys(players).map((id, index) => (
                    <PlayerCard
                        key={index}
                        id={id}
                        name={players[id].name}
                        ready={players[id].ready}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ScoreBoard;
