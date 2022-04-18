use std::fs;
pub mod karesz;
mod prepare;
mod run;
use karesz::{Game, GameActions, PlayerScore};
use rand::Rng;
use rocket::serde::Serialize;
use std::collections::HashMap;

use crate::create::karesz::Moves;

#[derive(Serialize, Debug)]
pub struct GameResult {
    draw: bool,
    winner: String,
    rounds: u32,
    scoreboard: Vec<PlayerScore>,
}

impl GameResult {
    pub fn to_json(&self) -> String {
        return format!(
            "{{ \"winner\": \"{}\", \"draw\": {}, \"rounds\": {}, \"scoreboard\": {{ {} }} }}",
            self.winner,
            self.draw,
            self.rounds,
            self.scoreboard
                .iter()
                .map(|s| format!(
                    "\"{}\": {{ \"placement\":{}, \"kills\": {}, \"steps\":[{}], \"survived\": {}, \"death\": \"{}\" }}",
                    s.name,
                    s.place,
                    s.kills,
                    s.steps
                        .iter()
                        .map(|x| x.to_string())
                        .collect::<Vec<String>>()
                        .join(","),
                    s.rounds_survived,
                    s.reason_of_death
                ))
                .collect::<Vec<String>>()
                .join(", ")
        );
    }
}

pub struct PlaygroundResult {
    pub steps: Vec<u8>,
    pub rounds: u32,
}

impl PlaygroundResult {
    pub fn to_json(&self) -> String {
        return format!(
            "{{ \"steps\": [{}], \"rounds\": {} }}",
            self.steps
                .iter()
                .map(|x| x.to_string())
                .collect::<Vec<String>>()
                .join(","),
            self.rounds
        );
    }
}

// the directory where testing files and dlls are stored
const TESTING_DIRECTORY: &str = if cfg!(windows) {
    "C:/Users/Dani/home/Projects/karesz-online/testing"
} else {
    "/home/dapa/Projects/karesz-online/testing"
};

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
    map: &String,
) -> Result<String, String> {
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
                code: s.code.clone(),
                caller: format!("thread_{}", i),
            }
        })
        .collect();

    // generate template
    match prepare::create_multi_player_template(&mut v, &rand_str(10), &key, &round_key) {
        // if ok, write to file and compile
        Ok(x) => match run::compile(&x, TESTING_DIRECTORY, &key) {
            Ok(_) => println!("Compile OK"),
            Err(e) => {
                return Err(format!("Failed to start game: \n{}", e));
            }
        },
        Err(e) => {
            return Err(e);
        }
    }

    // run
    let exit_code = run::run(TESTING_DIRECTORY, &key, |s| {
        // 0: key, 1: player index, 2: command, 3: value
        let s = s.trim();
        // println!(">> '{}'", s);
        // end of round, evaluate steps
        if s == round_key {
            // println!("--------"); // debug
            return game.round();
        } else {
            // ignore debug logs
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
                // println!("player {} does not exist.", id);
                return None;
            }

            return game.parse(id, &s);
        }
    });

    if exit_code != 0 {
        return Err(format!("Failed to start game: exit code {}", exit_code));
    }

    // remove leftover files
    // FIXME: windows won't let you remove dll files
    match fs::remove_file(format!("{}/{}.dll", TESTING_DIRECTORY, &key)) {
        Ok(_) => println!("Removed file"),
        Err(e) => println!("Failed to remove dll file: '{}'", e),
    }
    match fs::remove_file(format!("{}/{}.cs", TESTING_DIRECTORY, &key)) {
        Ok(_) => println!("Removed file"),
        Err(e) => println!("Failed to remove cs file: '{}'", e),
    }

    Ok(GameResult {
        draw: game.draw,
        rounds: game.round,
        winner: game.winner,
        scoreboard: game.scoreboard,
    }
    .to_json())
}

pub fn run_single(
    code: &str,
    map: &str,
    start_x: u32,
    start_y: u32,
    rotation: u8,
    size_x: u32,
    size_y: u32,
) -> Result<String, String> {
    let key = rand_str(10);
    // parse map
    let mut objects: HashMap<(u32, u32), u8>;
    match karesz::parse_map(map, size_x, size_y) {
        Some(x) => objects = x,
        None => {
            return Err(String::from("Failed parse map: possibly malformatted"));
        }
    }
    // add player
    let mut player = karesz::Karesz {
        id: 0,
        kills: 0,
        is_moving: false,
        name: String::from(""),
        position: (start_x, start_y),
        rotation,
        steps: Vec::new(),
    };

    // compile
    match prepare::create_single_player_template(code.to_string(), &rand_str(10), &key) {
        // if ok, write to file and compile
        Ok(x) => match run::compile(&x, TESTING_DIRECTORY, &key) {
            Ok(_) => println!("Compile OK\n {}", x),
            Err(e) => {
                return Err(format!("Failed to start game: \n{}", e));
            }
        },
        Err(e) => {
            return Err(format!("Failed to start game: \n{}", e));
        }
    }

    // run
    run::run(TESTING_DIRECTORY, &key, |s| {
        let s = s.trim();
        let s: Vec<&str> = s.split(" ").collect();
        println!(">> {:?}", s);

        // ignore debug logs
        if s.len() < 3 || s[0] != key {
            return None;
        }

        player.parse_single(&s, size_x, size_y, &mut objects)
        //
    });

    // remove leftover files
    // FIXME: windows won't let you remove dll files
    match fs::remove_file(format!("{}/{}.dll", TESTING_DIRECTORY, &key)) {
        Ok(_) => println!("Removed file"),
        Err(e) => println!("Failed to remove dll file: '{}'", e),
    }
    match fs::remove_file(format!("{}/{}.cs", TESTING_DIRECTORY, &key)) {
        Ok(_) => println!("Removed file"),
        Err(e) => println!("Failed to remove cs file: '{}'", e),
    }

    Ok(PlaygroundResult {
        rounds: player.steps.len() as u32,
        steps: player.steps,
    }
    .to_json())
}
