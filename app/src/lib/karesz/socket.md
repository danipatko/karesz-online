#Websocket events

##Client to server events
###Host socket

-   map_update_type: { type }
-   map_update_load: { mapName }
-   map_update_size: { width, height }
-   map_update_object: { position, field }
-   map_update_clear: { }

###Player events (in session)

-   player_ready: { code }
-   player_unready: { }
-   chat: { message }
-   exit: { }
-   disconnect: { }

###Player events (outside any session)

-   info: { code }
-   join: { code, name }
-   create: { name }
-   run: { map, code, spawn }

##Server to client events

-   map_update_type: { type }
-   map_update_load: { mapName }
-   map_update_size: { width, height }
-   map_update_object: { position, field }
-   map_update_clear: { }

-   game_host_change: { host }
-   game_phase_change: { phase }
-   game_info_waiting: { waiting }

-   player_join: { ...playerdata }
-   player_leave: { id }
-   player_ready: { id, isReady }

-   game_error: { stderr, stdout }
-   game_end : { ? }

-   fetch: { map, code, host, phase, players }
