export default process.platform === 'win32'
    ? `http://127.0.0.1:8000`
    : 'http://runner:8000';
