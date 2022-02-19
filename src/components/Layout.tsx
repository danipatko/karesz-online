import Head from 'next/head';
import Script from 'next/script';

export const Layout = (props: any) => {
    return (
        <div>
            <Head>
                <title>Karesz online</title>
                <meta name='heheheha' content='i hate the antichrist' />
                <link rel='icon' href='/favicon.ico' />
                <link href='/fontawesome/css/all.css' rel='stylesheet'></link>
            </Head>
            {props.children}
        </div>
    );
};
