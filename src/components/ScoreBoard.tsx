import PlayerCard from './PlayerCard';

const ScoreBoard = ({
    players,
}: {
    players: {
        [id: string]: {
            name: string;
            id: string;
            ready: boolean;
            wins: number;
        };
    };
}) => {
    return (
        <div className='p-2'>
            <ul className='list-none'>
                {Object.keys(players).map((id, index) => (
                    <li
                        key={index}
                        className='inline-flex flex-1 justify-start gap-4'
                    >
                        <div>{players[id].name}</div>
                        <div>{players[id].wins}</div>
                        <div>{players[id].ready ? 'Ready' : 'Unready'}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScoreBoard;
