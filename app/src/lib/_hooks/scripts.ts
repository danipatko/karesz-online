import { useEffect, useState } from 'react';

// save scripts to localstorage
const useScripts = (): [
    { [key: string]: string },
    {
        save: (name: string, contents: string) => void;
        list: () => string[];
        remove: (name: string) => void;
    }
] => {
    const [state, setState] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const scripts = localStorage.getItem('karesz-scripts');
        if (scripts === null) localStorage.setItem('karesz-scripts', '{}');
        setState(scripts ? JSON.parse(scripts) : {});
    }, [setState]);

    // add new script
    const save = (name: string, contents: string): void => {
        setState((s) => {
            localStorage.setItem(
                'karesz-scripts',
                JSON.stringify({ ...s, [name]: contents })
            );
            return { ...s, [name]: contents };
        });
    };

    // remove a script
    const remove = (name: string) => {
        setState((s) => {
            const { [name]: _, ...rest } = s;
            localStorage.setItem('karesz-scripts', JSON.stringify(rest));
            return { ...rest };
        });
    };

    // list available scripts
    const list = (): string[] => Object.keys(state);

    return [state, { save, remove, list }];
};

export default useScripts;
