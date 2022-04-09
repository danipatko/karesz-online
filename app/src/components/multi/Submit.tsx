import { useEffect, useState } from 'react';

interface Checks {
    [key: string]: boolean;
    'has entry': boolean;
    'no imports': boolean;
    'uses functions': boolean;
    // syntax errors ?
    ok: boolean;
}

const anyFunction =
    /(Lépj\s*\(\s*\)|Fordulj_balra\s*\(\s*\)|Fordulj_jobbra\s*\(\s*\)|Fordulj\s*\(.*\)|Vegyél_fel_egy_kavicsot\s*\(\s*\)|Tegyél_le_egy_kavicsot\s*\(.*\)|Északra_néz\s*\(\s*\)|Délre_néz\s*\(\s*\)|Keletre_néz\s*\(\s*\)|Nyugatra_néz\s*\(\s*\)|Merre_néz\s*\(\s*\)|Van_e_itt_kavics\s*\(\s*\)|Mi_van_alattam\s*\(\s*\)|Van_e_előttem_fal\s*\(\s*\)|Kilépek_e_a_pályáról\s*\(\s*\))/gm;

const check = (content: string): Checks => {
    const res: Checks = {
        'has entry': true,
        'no imports': true,
        'uses functions': true,
        ok: true,
    };
    if (!content.match(/void\s+FELADAT\s*\(\s*\)[\s\n]*{/gm))
        res['has entry'] = false;
    if (content.match(/using\s+(\(|[A-za-z]+)/gm)) res['no imports'] = false;
    if (!content.match(anyFunction)) res['uses functions'] = false;

    return {
        ...res,
        ok: Object.keys(res)
            .map((x) => res[x])
            .every((x) => x),
    };
};

const Submit = ({
    current,
    shown,
    onSubmit,
    hide,
}: {
    current: string;
    shown: boolean;
    hide: () => void;
    onSubmit: () => void;
}) => {
    const [checks, setChecks] = useState<Checks>({
        'has entry': true,
        ok: true,
        'no imports': true,
        'uses functions': true,
    });

    useEffect(() => {
        setChecks(check(current));
    }, []);

    return (
        <div
            style={{ display: shown ? 'flex' : 'none' }}
            className='fixed top-0 left-0 w-[100vw] h-[100vh] bg-[rgba(0,0,0,60%)] flex justify-center items-center'
        >
            <div className='flex rounded-md text-white max-h-[70vh] max-w-[70vw] overflow-hidden'>
                <div className='p-4 bg-main rounded-l-md'>
                    <div className='text-lg font-semibold'>Check your code</div>
                    <div className='my-3'>
                        <ul>
                            {Object.keys(checks).map((x, i) => (
                                <li key={i}>
                                    {checks[x] ? (
                                        <i className='fa fa-check text-[#0f0]'></i>
                                    ) : (
                                        <i className='fa fa-x text-[#f00]'></i>
                                    )}{' '}
                                    {x}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='flex justify-between gap-6'>
                        <button
                            onClick={hide}
                            className='font-bold p-2 text-karesz hover:underline'
                        >
                            <i className='fa fa-arrow-left'></i>
                        </button>
                        <button
                            onClick={checks.ok ? onSubmit : () => {}}
                            style={{ opacity: checks.ok ? 1 : 0.5 }}
                            className='font-semibold p-2 rounded-md text-white bg-karesz hover:bg-karesz-light'
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className='bg-back-vs rounded-r-md  p-4 flex-1'>
                    <code className='text-xs whitespace-pre'>{current}</code>
                </div>
            </div>
        </div>
    );
};

export default Submit;
