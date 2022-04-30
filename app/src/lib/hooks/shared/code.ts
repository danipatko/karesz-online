import { useEffect, useState } from 'react';

const defaultCode: string = `// start here
void FELADAT() {
    while(true) Lépj();
}`;

export interface codeState {
    code: string;
    saved: { [key: string]: string };
    fontSize: number;
    functions: {
        load: (name: string) => void;
        save: () => void;
        remove: () => void;
        saveAs: (name: string) => void;
        setCode: (code: string) => void;
        setFontSize: (fontSize: number) => void;
    };
}

export const useCode = (): codeState => {
    const [code, setCode] = useState<string>(defaultCode);
    const [saved, setSaved] = useState<{ [key: string]: string }>({});
    const [fontSize, setFontSize] = useState<number>(14);
    const [selected, select] = useState<string>('');

    useEffect(() => {
        const scripts = localStorage.getItem('karesz-scripts');
        if (scripts === null) localStorage.setItem('karesz-scripts', '{}');
        setSaved(scripts ? JSON.parse(scripts) : {});
    }, []);

    const save = (): void => {
        setSaved((s) => {
            localStorage.setItem(
                'karesz-scripts',
                JSON.stringify({ ...s, [selected]: code })
            );
            return { ...s, [selected]: code };
        });
    };

    const saveAs = (name: string): void => {
        setSaved((s) => {
            localStorage.setItem(
                'karesz-scripts',
                JSON.stringify({ ...s, [name]: code })
            );
            return { ...s, [name]: code };
        });
    };

    const remove = (): void => {
        setSaved((s) => {
            const { [selected]: _, ...rest } = s;
            localStorage.setItem('karesz-scripts', JSON.stringify(rest));
            return { ...rest };
        });
    };

    return {
        code,
        saved,
        fontSize,
        functions: {
            load: select,
            save,
            remove,
            saveAs,
            setCode,
            setFontSize,
        },
    };
};
