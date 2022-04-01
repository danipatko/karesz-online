// save scripts to localstorage
const useScripts = (): {
    save: (name: string, contents: string) => void;
    load: (name: string) => string;
    list: () => any;
} => {
    const save = (name: string, contents: string): void => {
        localStorage.setItem(name, contents);
    };

    const list = () => {
        return localStorage.keys();
    };

    const load = (name: string): string => {
        return localStorage.getItem(name) ?? '';
    };

    return { save, load, list };
};

export default useScripts;
