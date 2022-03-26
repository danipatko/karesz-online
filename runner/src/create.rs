use std::collections::HashMap;
mod karesz;
mod prepare;
mod run;
use karesz::{Game, GameActions, Karesz, Moves};
use std::fs;

fn main() {
    run_single();
}

fn run_multiplayer(size_x: usize) {
    let mut game = Game {
        size_x: 10,
        size_y: 10,
        rounds: 0,
        objects: HashMap::new(),
        players: HashMap::new(),
        proposed_steps: HashMap::new(),
        death_row: Vec::new(),
    };
    game.players.insert(
        0,
        Karesz {
            id: 0,
            position: (2, 5),
            rotation: 0,
            steps: Vec::new(),
            is_moving: false,
            kills: 0,
        },
    );
    game.players.insert(
        1,
        Karesz {
            id: 1,
            position: (7, 5),
            rotation: 0,
            steps: Vec::new(),
            is_moving: false,
            kills: 0,
        },
    );

    let round_key = "round_key";
    let key = "random_key";

    let mut v = vec![
        prepare::MPCode {
            code: "void FELADAT()
        {
            Fordulj(jobbra);
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
        }"
            .to_string(),
            caller: "epic_thread".to_string(),
        },
        prepare::MPCode {
            code: "void FELADAT()
        {
            Fordulj(jobbra);
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
        }"
            .to_string(),
            caller: "second_thread".to_string(),
        },
    ];

    match fs::write(
        "../Program.cs",
        prepare::create_multi_player_template(&mut v, "", key, round_key),
    ) {
        Ok(_) => println!("Write OK"),
        Err(e) => println!("uh oh: {}", e),
    }

    run::compile();
    run::run(move |s| {
        let s = s.trim();
        // 0: key, 1: player index, 2: command, 3: value
        println!(">> '{}'", s);
        if s == round_key {
            println!("--------");
            game.round();
            return None;
        } else {
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
}

fn run_single() {
    // values
    let mut game = Game {
        size_x: 10,
        size_y: 10,
        rounds: 0,
        objects: HashMap::new(),
        players: HashMap::new(),
        proposed_steps: HashMap::new(),
        death_row: Vec::new(),
    };
    let mut player = Karesz {
        id: 0,
        position: (2, 5),
        rotation: 0,
        steps: Vec::new(),
        is_moving: false,
        kills: 0,
    };
    // game.players.insert(0, player);

    let key = "random_key";

    let code = "void FELADAT()
        {
            /* Fordulj(jobbra);
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }*/ 
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
            Lépj();
        }"
    .to_string();

    // Write to file
    match fs::write(
        "./Program.cs",
        prepare::create_single_player_template(code, key, key),
    ) {
        Ok(_) => println!("Write OK"),
        Err(e) => println!("uh oh: {}", e),
    }

    // compile
    match run::compile() {
        Ok(exit_code) => println!("Compile exited with code {}", exit_code),
        Err(e) => println!("{}", e),
    }

    // run
    run::run(move |s| {
        let s = s.trim();
        let s: Vec<&str> = s.split(" ").collect();
        println!(">> {:?}", s);

        // ignore debug logs
        if s.len() < 3 || s[0] != key {
            return None;
        }

        player.parse(
            &s,
            false,
            &mut game.proposed_steps,
            &mut game.death_row,
            game.size_x,
            game.size_y,
            &mut game.objects,
        )
        // */
    });
}
