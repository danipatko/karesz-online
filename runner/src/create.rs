use std::{collections::HashMap, fs};
pub mod karesz;
mod prepare;
mod run;
use karesz::{Game, GameActions};
use rand::Rng;

pub fn rand_str(len: u32) -> String {
    rand::thread_rng()
        .sample_iter(&rand::distributions::Alphanumeric)
        .take(len as usize)
        .map(char::from)
        .collect()
}

// run a multiplayer session with a custom map
pub fn run_multiplayer(
    players: &Vec<karesz::Player>,
    size_x: u32,
    size_y: u32,
    map: &str,
) -> Result<HashMap<u8, karesz::PlayerScore>, String> {
    let mut game: Game;
    // generate game
    match Game::new_custom(players, size_x, size_y, map) {
        Some(x) => game = x,
        None => {
            return Err(String::from("Failed to start game: invalid map"));
        }
    }
    // generate random strings
    let round_key = rand_str(10);
    let key = rand_str(10);

    // get players
    let mut i = 0;
    let mut v = players
        .iter()
        .map(|s| {
            i += 1;
            prepare::MPCode {
                code: String::from(s.code),
                caller: format!("thread_{}", i),
            }
        })
        .collect();

    // TODO: randomized dirs and files

    // generate template
    match prepare::create_multi_player_template(&mut v, &rand_str(10), &key, &round_key) {
        // if ok, write to file
        Ok(code) => match fs::write("../Program.cs", code) {
            Ok(_) => println!("Write OK"),
            Err(_) => {
                return Err(String::from(
                    "Failed to start game: failed to write to file",
                ));
            }
        },
        Err(e) => {
            return Err(e);
        }
    }

    // compile
    match run::compile() {
        Ok(_) => println!("Compile OK"),
        Err(e) => {
            return Err(String::from(format!(
                "Failed to start game: failed to compile\nLogs:\n{}",
                e
            )));
        }
    }

    // run
    run::run(|s| {
        // 0: key, 1: player index, 2: command, 3: value
        let s = s.trim();
        println!(">> '{}'", s);
        // end of round, evaluate steps
        if s == round_key {
            println!("--------"); // debug
            return game.round();
        } else {
            // TODO: append string to debug logs
            if !s.starts_with(&key) {
                return None;
            }
            // parse current line
            let s: Vec<&str> = s.split(" ").collect();
            // ignore debug logs
            if s.len() < 3 {
                return None;
            }

            let id: u8 = s[1].parse::<u8>().unwrap();
            // player not in game (or dead)
            if !game.players.contains_key(&id) {
                println!("player {} does not exist.", id);
                return None;
            }

            return game.parse(id, &s);
        }
    }); // */
    Ok(game.scoreboard)
}

pub fn run_single() {
    // // values
    // let mut game = Game {
    //     size_x: 10,
    //     size_y: 10,
    //     round: 0,
    //     objects: HashMap::new(),
    //     players: HashMap::new(),
    //     proposed_steps: HashMap::new(),
    //     death_row: Vec::new(),
    // };
    // let mut player = Karesz {
    //     id: 0,
    //     position: (2, 5),
    //     rotation: 0,
    //     steps: Vec::new(),
    //     is_moving: false,
    //     kills: 0,
    // };
    // // game.players.insert(0, player);

    // let key = rand_str(10);
    // let code = "void FELADAT()
    //     {
    //         /* Fordulj(jobbra);
    //         while(!Kilépek_e_a_pályáról()) {
    //             Lépj();
    //         }*/
    //         while(!Kilépek_e_a_pályáról()) {
    //             Lépj();
    //         }
    //         Lépj();
    //     }"
    // .to_string();

    // // Write to file
    // match fs::write(
    //     "./Program.cs",
    //     prepare::create_single_player_template(code, &key, &key),
    // ) {
    //     Ok(_) => println!("Write OK"),
    //     Err(e) => println!("uh oh: {}", e),
    // }

    // // compile
    // match run::compile() {
    //     Ok(exit_code) => println!("Compile exited with code {}", exit_code),
    //     Err(e) => println!("{}", e),
    // }

    // // run
    // run::run(move |s| {
    //     let s = s.trim();
    //     let s: Vec<&str> = s.split(" ").collect();
    //     println!(">> {:?}", s);

    //     // ignore debug logs
    //     if s.len() < 3 || s[0] != key {
    //         return None;
    //     }

    //     player.parse(
    //         &s,
    //         false,
    //         &mut game.proposed_steps,
    //         &mut game.death_row,
    //         game.size_x,
    //         game.size_y,
    //         &mut game.objects,
    //     )
    //     // */
    // });
}
