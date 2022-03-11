const PlayerCard = ({
    name,
    id,
    ready,
}: {
    name: string;
    id: string;
    ready: boolean;
}) => {
    return (
        <li className={`px-5 py-2 `}>
            <div className='font-bold text-xl'>{name}</div>
            <div className={`${ready ? 'text-green-500' : 'text-red-600'}`}>
                {ready ? 'Ready' : 'Unready'}
            </div>
        </li>
    );
};

export default PlayerCard;
