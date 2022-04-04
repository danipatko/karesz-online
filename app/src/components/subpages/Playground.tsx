import Playback from '../playback/Playback';

const Playground = (props: any) => {
    return (
        <div>
            <Playback size={20} showGrid={true} />
            <div>Playground</div>
        </div>
    );
};

export default Playground;
