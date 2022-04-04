import Playback from '../playback/Playback';

const Playground = (props: any) => {
    return (
        <div>
            <Playback
                onClick={(x, y) => console.log(x, y)}
                size={20}
                showGrid={true}
            />
            <div>Playground</div>
        </div>
    );
};

export default Playground;
