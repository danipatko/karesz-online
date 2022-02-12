import { useState } from 'react';
import { Karesz } from '../karesz/core/types';

const useGame = () => {
    const [state, setState] = useState<{
        players: Map<string, { name: string; id: string; ready: string }>;
        code: number;
        host: string;
        lastWinner: string;
    }>(null as any);

    return [state, setState];
};

export default useGame;
