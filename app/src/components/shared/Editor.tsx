import { codeState } from '../../lib/hooks/shared/code';
import { Number, WhiteButton } from './Util';

export const Editor = ({ code }: { code: codeState }) => {
    return (
        <div className='flex w-full h-screen'>
            <div className='p-4 h-full bg-slate-800'>
                <div className='font-bold'>Karesz editor</div>
                <div>
                    <Number onChange={() => {}} />
                </div>
            </div>
            <div className='p-4 h-full flex-1 bg-back'>{code.code}</div>
        </div>
    );
};
