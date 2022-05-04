import { useEffect, useState } from 'react';

// the default value of the editor hook
const example: string = `// start here
void FELADAT() {
    while(true) Lépj();
}


`;

export interface codeState {
    code: string;
    // saved: { [key: string]: string };
    fontSize: number;
    functions: {
        // load: (name: string) => void;
        // save: () => void;
        // remove: () => void;
        // saveAs: (name: string) => void;
        setCode: (code: string) => void;
        setFontSize: (fontSize: number) => void;
    };
}

export const useCode = (): codeState => {
    const [code, setCode] = useState<string>(example);
    const [fontSize, setFontSize] = useState<number>(14);
    // const [saved, setSaved] = useState<{ [key: string]: string }>({});
    // const [selected, select] = useState<string>('example');

    // useEffect(() => {
    //     const scripts = localStorage.getItem('karesz-scripts');
    //     scripts === null &&
    //         localStorage.setItem('karesz-scripts', JSON.stringify({ example }));
    //     setSaved(scripts ? JSON.parse(scripts) : { example });
    // }, []);

    // const save = (): void => {
    //     setSaved((s) => {
    //         localStorage.setItem(
    //             'karesz-scripts',
    //             JSON.stringify({ ...s, [selected]: code })
    //         );
    //         return { ...s, [selected]: code };
    //     });
    // };

    // const saveAs = (name: string): void => {
    //     setSaved((s) => {
    //         localStorage.setItem(
    //             'karesz-scripts',
    //             JSON.stringify({ ...s, [name]: code })
    //         );
    //         return { ...s, [name]: code };
    //     });
    // };

    // const remove = (): void => {
    //     setSaved((s) => {
    //         const { [selected]: _, ...rest } = s;
    //         localStorage.setItem('karesz-scripts', JSON.stringify(rest));
    //         return { ...rest };
    //     });
    // };

    return {
        code,
        // saved,
        fontSize,
        functions: {
            // load: select,
            // save,
            // remove,
            // saveAs,
            setCode,
            setFontSize,
        },
    };
};
