#[macro_use]
extern crate rocket;
// use rocket::response::status;
use rocket::serde::json::Json;
use rocket::serde::Deserialize;
mod create;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

// single player params
// #[derive(Deserialize, Debug)]
// struct SinglePlayerRequest<'r> {
//     start_x: u32,
//     start_y: u32,
//     rotation: u8,
//     code: &'r str,
// }

// #[derive(Deserialize, Debug)]
// struct SinglePlayerRequestCustom<'r> {
//     map: &'r str,
//     start_x: u32,
//     start_y: u32,
//     rotation: u8,
//     code: &'r str,
// }

// // singleplayer, load an existing map
// #[post("/sp/map/<mapname>", data = "<req>")]
// fn singleplayer_map(mapname: &str, req: Json<SinglePlayerRequest<'_>>) -> &'static str {
//     println!(
//         "start from ({}, {} | {}) in map {}",
//         req.start_x, req.start_y, req.rotation, mapname
//     );
//     "xd"
// }

// // singleplayer, parse a map from string
// #[post("/sp/custom", data = "<req>")]
// fn singleplayer_custom(req: Json<SinglePlayerRequestCustom<'_>>) -> &'static str {
//     println!(
//         "start from ({}, {} | {}) in map {}",
//         req.start_x, req.start_y, req.rotation, req.map
//     );
//     "xd"
// }

// #[derive(Deserialize, Debug)]
// struct MultiplayerRequest<'r> {
//     #[serde(borrow)]
//     players: Vec<create::karesz::Player<'r>>,
// }

#[derive(Deserialize, Debug)]
struct MultiplayerRequestCustom<'a> {
    size_x: u32,
    size_y: u32,
    map: String,
    #[serde(borrow)]
    players: Vec<create::karesz::Player<'a>>,
}

// multiplayer, custom map
#[post("/mp/custom", data = "<req>")]
fn multiplayer_custom(req: Json<MultiplayerRequestCustom<'_>>) -> &'static str {
    match create::run_multiplayer(&req.players, req.size_x, req.size_y, &req.map) {
        Ok(x) => {
            println!("{:?}", x);
            return "OK";
        }
        Err(x) => {
            println!("{}", x);
            return "NOT OK";
        }
    }
}

// multiplayer, selected map
/*#[post("/mp/map/<mapname>", data = "<req>")]
fn multiplayer_map(mapname: &str, req: Json<MultiplayerRequest<'_>>) -> &'static str {
    "xd"
}*/

#[launch]
fn rocket() -> _ {
    rocket::build().mount(
        "/",
        routes![
            index,
            //singleplayer_map,
            //singleplayer_custom,
            multiplayer_custom,
            //multiplayer_map
        ],
    )
}
