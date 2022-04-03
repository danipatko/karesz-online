import { ReactNode } from 'react';

export const Lines = ({
    children,
    classNameSpan,
    classNameDiv,
}: {
    children: ReactNode;
    classNameSpan?: string;
    classNameDiv?: string;
}) => {
    return (
        <div
            className={`${
                classNameDiv ?? ''
            } w-full text-center border-b border-b-[#666666] leading-[0.1rem] my-5`}
        >
            <span className={`${classNameSpan ?? ''} px-3`}>{children}</span>
        </div>
    );
};
