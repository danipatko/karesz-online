export const Karesz = ({
    state,
    className,
}: {
    state: { x: number; y: number; rotation: number };
    className?: string;
}) => {
    return !state ? null : (
        <div
            style={{
                backgroundImage: `url(/karesz/karesz.png)`,
                backgroundSize: 'cover',
                transform: `translate(${100 * state.x}%,${
                    100 * state.y
                }%) rotate(${(state.rotation % 4) * 90}deg)`,
            }}
            className={`${className} absolute tilesize z-30`}
        ></div>
    );
};
