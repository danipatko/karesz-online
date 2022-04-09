import { ScoreBoard } from '../../lib/hooks/game';

const Scoreboard = ({ sb }: { sb: ScoreBoard | null }) => {
    return (
        <div className='p-2 flex-1 bg-main rounded-md text-white'>
            {sb ? (
                <>
                    <div className='flex gap-4 justify-between font-bold text-lg'>
                        <div>Results of last round</div>
                        {sb.draw ? (
                            <div className='text-karesz'>DRAW</div>
                        ) : (
                            <div className='text-karesz'>
                                Winner: {sb.winner}
                            </div>
                        )}
                    </div>
                    <div className='mt-3'>
                        <table className='sb w-full border-slate-600'>
                            <thead>
                                <tr>
                                    <th>Place</th>
                                    <th>Name</th>
                                    <th>Survived</th>
                                    <th>Kills</th>
                                    <th>Died</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sb.players
                                    .sort((a, b) =>
                                        a.place > b.place ? 1 : -1
                                    )
                                    .map((x, i) => (
                                        <tr key={i}>
                                            <td>{x.place}</td>
                                            <td>{x.name}</td>
                                            <td>{x.rounds_survived}</td>
                                            <td>{x.kills}</td>
                                            <td>{x.reason_of_death}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className='flex items-center justify-center h-full text-slate-400'>
                    Results will appear here after round
                </div>
            )}
        </div>
    );
};

export default Scoreboard;
