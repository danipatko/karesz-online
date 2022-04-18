const Home = () => {
    return (
        <div className='h-[90vh] flex justify-center text-white items-center'>
            <div className='text-center'>
                <div className='text-3xl font-bold'>
                    Karesz online
                    <span
                        className='mx-2 w-8 h-8 absolute karesz-spin'
                        style={{
                            backgroundSize: 'contain',
                            backgroundImage: 'url(/karesz/karesz0.png)',
                        }}
                    ></span>
                </div>
                <div>Just imagine a nice homepage here</div>
            </div>
        </div>
    );
};

export default Home;
