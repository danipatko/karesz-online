# Karesz online
Available at [karesz.szlginfo.com](https://karesz.szlginfo.com) 

### Note
The project was long forgotten about 3 months ago and it still has a whole lot of issues. Feel free to contribute or take the entire project.

## Building and runnning
**Using docker compose**:
Build:
```
# docker-compose up
```
- There is an nginx reverse proxy with modsecurity, which may take time to compile for the first time  

Rebuild:
```
# docker-compose up --build --remove-orphans --force-recreate nginx app
```

**Running locally**
```
# in app/
npm i && npm i --save-dev typescript ts-node @types/react @types/node
npm run dev
```

## Under the hood
The stack is a custom server for ws and a spa using NextJS.  

**Dotnet version**
- Target framework: `netcoreapp3.2`
- Core: `6.0.2`

**Code execution**
- The client sends the code to the ws server
- The code is filtered to prevent malicious usage, and certain function calls are replaced to match the boilerplate.
- The prepared code is saved and compiled by invoking the Rosyln compiler directly. This enables us to control loading DLLs, and doesn't require creating a full dotnet project for every run.
- The compiled dll is then executed, and prints a json formatted result, which is picked up by the child process and sent back to the client

**Multiplayer**
- The multiplayer mode utilizes the [Threading.Barrier](https://docs.microsoft.com/en-us/dotnet/api/system.threading.barrier?view=net-6.0) class.
- Basically, each player's code runs on a separate thread, and when a 'step' function is called, `Barrier.SignalAndWait()` is also invoked.
- `Barrier.SignalAndWait()` is blocking until all threads have signalled.
- Barrier also has a callback function when the last thread has signalled, which is used to update game state.

