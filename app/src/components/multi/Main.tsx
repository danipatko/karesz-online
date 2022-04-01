import { Game } from '../../lib/hooks/game';

const Main = ({ game }: { game: Game }) => {
    return <div>{JSON.stringify(game)}</div>;
};

export default Main;
