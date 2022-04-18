#[macro_use]
extern crate rocket;
use rocket::response::content;
use rocket::serde::json::Json;
use rocket::serde::Deserialize;
use urlencoding::encode;
mod create;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

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

#[derive(Deserialize, Debug)]
struct SinglePlayerRequestCustom<'r> {
    map: &'r str,
    start_x: u32,
    start_y: u32,
    size_y: u32,
    size_x: u32,
    rotation: u8,
    code: &'r str,
}

// // singleplayer, load an existing map
// #[post("/sp/map/<mapname>", data = "<req>")]
// fn singleplayer_map(mapname: &str, req: Json<SinglePlayerRequest<'_>>) -> &'static str {
//     println!(
//         "start from ({}, {} | {}) in map {}",
//         req.start_x, req.start_y, req.rotation, mapname
//     );
//     "xd"
// }

// singleplayer, parse a map from string
#[post("/sp/custom", data = "<req>")]
fn singleplayer_custom(req: Json<SinglePlayerRequestCustom<'_>>) -> content::Json<String> {
    match create::run_single(
        req.code,
        req.map,
        req.start_x,
        req.start_y,
        req.rotation,
        req.size_x,
        req.size_y,
    ) {
        Ok(result) => {
            return content::Json(result);
        }
        Err(e) => {
            return content::Json(format!("{{ \"error\":\"{}\" }}", encode(&e)));
        }
    }
}

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
fn multiplayer_custom(req: Json<MultiplayerRequestCustom<'_>>) -> content::Json<String> {
    match create::run_multiplayer(&req.players, req.size_x, req.size_y, &req.map) {
        Ok(x) => {
            return content::Json(x);
            // return rocket_contrib::json::Json(x);
        }
        Err(x) => {
            return content::Json(format!("{{\"error\": \"{}\"}}", encode(&x)));
            // return content::Json(format!("{{ \"error\": \"{}\" }}", x));
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
    rocket::build().attach(CORS).mount(
        "/",
        routes![
            index,
            //singleplayer_map,
            singleplayer_custom,
            multiplayer_custom,
            //multiplayer_map
        ],
    )
}
