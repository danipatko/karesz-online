const ScoreBoard = ({
    players,
    host,
}: {
    host: string;
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
        <div className='p-3 rounded-md bg-main w-fit'>
            <div className='flex justify-between gap-10'>
                <div className='text-white font-semibold text-3xl mb-3'>
                    Lobby
                </div>
                <div className='text-gray-400 text-base float-right'>
                    Name/Wins/Ready
                </div>
            </div>
            {Object.keys(players).map((id, index) => (
                <div
                    key={index}
                    className='p-1 text-white flex flex-1 justify-end gap-4'
                >
                    <div className='grow overflow-hidden text-lg'>
                        {players[id].name}
                        {id == host ? (
                            <i className='text-xs pl-2 fa fa-crown text-yellow-500'></i>
                        ) : null}
                    </div>
                    <div>{players[id].wins}</div>
                    <div>
                        <i
                            className={
                                players[id].ready
                                    ? 'fa fa-tick text-green-500'
                                    : 'fa fa-x text-red-600'
                            }
                        ></i>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScoreBoard;
