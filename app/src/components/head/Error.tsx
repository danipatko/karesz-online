const Errors = ({
    errors,
    onRemove,
}: {
    errors: string[];
    onRemove: (index: number) => void;
}) => {
    return (
        <div className='fixed bottom-0 left-0 m-5 bg-[rgba(0,0,0,70%)] max-w-[30vw]'>
            <div className='flex flex-col gap-2'>
                {errors.map((e, i) => (
                    <Error key={i} error={e} onClose={() => onRemove(i)} />
                ))}
            </div>
        </div>
    );
};

const Error = ({ error, onClose }: { error: string; onClose: () => void }) => {
    return (
        <div className='flex gap-4 justify-between p-3 rounded-md bg-slate-700 select-none'>
            <div className='text-base text-white font-semibold'>{error}</div>
            <div>
                <span
                    onClick={onClose}
                    className='text-white text-xs py-[0.20rem] px-[0.36rem] rounded-full bg-slate-500 hover:bg-slate-400 transition-colors text-center'
                >
                    &#10005;
                </span>
            </div>
        </div>
    );
};

export default Errors;
