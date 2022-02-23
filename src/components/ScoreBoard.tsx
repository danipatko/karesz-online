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
        <div className='pt-5 rounded-xl bg-main fixed'>
            {Object.keys(players).map((id, index) => (
                <div
                    key={index}
                    className={`${
                        index ? '' : 'bg-main-highlight'
                    } w-full flex`}
                >
                    <div className='font-semibold text-lg flex-initial'>
                        {id == host ? (
                            <span className='fa fa-crown'></span>
                        ) : null}{' '}
                        {players[id].name}
                    </div>
                    <div className=''>
                        <span
                            className={`fa ${
                                players[id].ready ? 'fa-tick' : 'fa-x'
                            }`}
                        ></span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ScoreBoard;
