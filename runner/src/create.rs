use std::collections::HashMap;
use std::fs;
mod karesz;
mod prepare;
mod run;
use karesz::{Game, GameActions, Karesz, Moves};
use rocket::serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct Player<'r> {
    name: &'r str,
    code: &'r str,
}

pub fn rand_str<'a>(len: u32) -> String {
    (0..len)
        .map(|_| rand::random::<u8>() as char)
        .collect::<String>()
}

// run a multiplayer session with a custom map
pub fn run_multiplayer<'r>(
    players: &Vec<Player<'r>>,
    size_x: u32,
    size_y: u32,
    map: &str,
) -> Result<u8, String> {
    let mut game: Game;
    // generate game
    match Game::new_custom(players.len(), size_x, size_y, map) {
        Some(x) => game = x,
        None => {
            return Err(String::from("Failed to start game: invalid map"));
        }
    }
    // generate random strings
    let rand = rand_str(10);
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
    match fs::write(
        "../Program.cs",
        prepare::create_multi_player_template(&mut v, &rand, &key, &round_key),
    ) {
        Ok(_) => println!("Write OK"),
        Err(_) => {
            return Err(String::from(
                "Failed to start game: failed to write to file",
            ));
        }
    }

    match run::compile() {
        Ok(_) => println!("Compile OK"),
        Err(e) => {
            return Err(String::from(format!(
                "Failed to start game: failed to compile\nLogs:\n{}",
                e
            )));
        }
    }

    run::run(move |s| {
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
            if s.len() < 3 || s[0] != key {
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
    Ok(2)
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
