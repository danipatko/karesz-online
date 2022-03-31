import Head from 'next/head';

export const Layout = (props: any) => {
    return (
        <>
            <Head>
                <title>Karesz online</title>
            </Head>
            <main>{props.children}</main>
        </>
    );
};
