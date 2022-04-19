const Docs = () => {
    return (
        <div className='h-[90vh] flex justify-center text-white'>
            <div className='w-[50vw]'>
                <div className='text-3xl font-semibold my-5'>Documentation</div>
                <section className='p-4 rounded-md bg-red-600 bg-opacity-50 border border-red-600'>
                    Please note that the project is still under development. If
                    you find any bugs or have any suggestions, feel free to open
                    a PR at{' '}
                    <a
                        className='hover:underline text-blue-600'
                        href='https://github.com/danipatko/karesz-online'
                    >
                        https://github.com/danipatko/karesz-online
                    </a>
                </section>
                <div className='py-4'>
                    <div className='text-xl font-semibold'>
                        About the project
                    </div>
                    <section className='py-4'>
                        The project aims to allow students to learn the basics
                        of coding and C# through a game called karesz, without
                        the need of installing the dotnet sdk locally. To
                        increase the fun factor, this game is also playable with
                        others.
                    </section>
                </div>

                <div className='py-4'>
                    <div className='text-xl font-semibold'>
                        How does it work?
                    </div>
                    <section className='py-4'>
                        Basically, there are two servers connected by an nginx
                        reverse proxy. One is a NextJS application serving the
                        frontend and managing multiplayer sessions. The other
                        server is meant to handle the compile and run process,
                        implemented in rust for increased speed.
                    </section>
                    <section className='py-4'>
                        When you upload your code, the server first processes
                        the code and writes it to a file. Then the file is
                        compiled by invoking the Roslyn code analyzer directly.
                        If the compile process finishes without any errors, the
                        compiled dll is run using a child process, which
                        communicates through the stdin/stdout pipe. In
                        playground mode, the child is a single main thread. In
                        mulitplayer, each player has their own separate thread.
                        Every player gets to send one command in a single
                        iteration, so there is a barrier object that waits for
                        all threads to signal their commands. After all threads
                        have signalled, the barrier object is reset and the next
                        iteration starts. In both game modes, about 5000
                        iterations are allowed before the child process is
                        killed. At the end of the process, the steps of each
                        player are sent back to the client.
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Docs;
