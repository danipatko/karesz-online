use std::io::{BufRead, BufReader, Write};
use std::process::{Command, Stdio};
use std::collections::HashMap;
use std::path::Path;
use std::thread;

mod prepare;

#[derive(Debug)]
struct Karesz {
    steps: Vec<char>,
    is_moving: bool,
    kills: u8,
    position: (u32, u32),
    rotation: u8,
    id: u8,
}

#[derive(Debug)]
struct Game {
    players: HashMap<u8, Karesz>,
    proposed_steps: HashMap<(u32, u32), Vec<u8>>, // hashmap containing player id's for that position
    objects: HashMap<(u32, u32), u8>,
    death_row: Vec<u8>,   
    rounds: u32,
    size_x: u32,
    size_y: u32,
}

trait GameActions {
    // increment round, make steps and kill people
    fn round(&mut self);
    // make steps
    fn make_steps(&mut self /*, players: &mut HashMap<u8, Karesz>, proposed_steps: &mut HashMap<(u32, u32), std::vec::Vec<u8>>, death_row: &mut Vec<u8>*/);
    // remove players on death row
    fn kill_row(&mut self /*, death_row: &mut Vec<u8>, players: &mut HashMap<u8, Karesz>*/);
}

trait Moves {
    // Util
    
    // get the point one step forward
    fn forward(&self, position: (u32, u32), rotation: u8) -> (u32, u32);
    // check if field is a wall
    fn is_wall(&self, objects: &HashMap<(u32, u32), u8>, position: (u32, u32)) -> bool;
    // check if field is out of bounds
    fn out_of_bounds(&self, size_x: u32, size_y: u32, position: (u32, u32)) -> bool;
    // check if position is valid one step forward
    fn can_step(&self, size_x: u32, size_y: u32, objects: &HashMap<(u32, u32), u8>, position: (u32, u32)) -> bool;
    
    // Player moves
    // propose a step (risky borrow??)
    fn step(&mut self, proposed_steps: &mut HashMap<(u32, u32), Vec<u8>>);
    // turn left or right (1 or -1)
    fn turn(&mut self, direction: i8);
    // check if able to step
    fn can_i_step(&self, size_x: u32, size_y: u32, objects: &HashMap<(u32, u32), u8>) -> bool;
    // check if player objects contain a rock at player position
    fn is_rock_under(&self, objects: &HashMap<(u32, u32), u8>) -> bool;
    // put down a rock to player position
    fn place_rock(&self, objects: &mut HashMap<(u32, u32), u8>, color: u8);
    // set field value to 0
    fn pick_up_rock(&self, objects: &mut HashMap<(u32, u32), u8>);
    // check the field's value under player's position
    fn what_is_under(&self, objects: &mut HashMap<(u32, u32), u8>) -> u8;
    // check if forward is out of bounds
    fn is_on_edge(&self, size_x: u32, size_y: u32) -> bool;
    // TODO: implement radar
    // fn radar(&self, player: &mut Karesz) -> u8;
    // return own direction
    fn looking_at(&self) -> u8;
}

impl Moves for Karesz {
    // get the point one step forward
    fn forward(&self, mut position: (u32, u32), rotation: u8) -> (u32, u32) {
        if rotation == 0 {
            position.1 += 1
        } else if rotation == 1 {
            position.0 += 1
        } else if rotation == 2 {
            position.1 -= 1
        } else {
            position.0 -= 1
        }
        position
    }
    // check if field is a wall
    fn is_wall(&self, objects: &HashMap<(u32, u32), u8>, position: (u32, u32)) -> bool {
        objects.get(&position).unwrap_or(&1) == &0
    }
    // check if field is out of bounds
    fn out_of_bounds(&self, size_x: u32, size_y: u32, position: (u32, u32)) -> bool {
        position.0 >= size_x || position.1 >= size_y
    }
    // check if position is valid
    fn can_step(&self, size_x: u32, size_y: u32, objects: &HashMap<(u32, u32), u8>, position: (u32, u32)) -> bool {
        !self.out_of_bounds(size_x, size_y, position) && !self.is_wall(objects, position) 
    }

    // player moves
    // propose step
    fn step(&mut self, proposed_steps: &mut HashMap<(u32, u32), Vec<u8>>) {
        let fwd = self.forward(self.position, self.rotation);
        self.is_moving = true;
        // if someone's already at a position, push id
        if proposed_steps.contains_key(&fwd) {
            proposed_steps.get_mut(&fwd).unwrap().push(self.id);
        // create new vector for position
        } else {
            let mut vec = Vec::new();
            vec.push(self.id);
            proposed_steps.insert(fwd, vec);
        }
    }
    // turn left or right (1 or -1)
    fn turn(&mut self, direction: i8) {
        self.rotation = modulus(self.rotation as i8 + direction, 4);
    }
    // check if able to step
    fn can_i_step(&self, size_x: u32, size_y: u32, objects: &HashMap<(u32, u32), u8>) -> bool {
        let fwd = self.forward(self.position, self.rotation);
        !self.out_of_bounds(size_x, size_y, fwd) && !self.is_wall(objects, fwd)
    }
    // check if player objects contain a rock at player position
    fn is_rock_under(&self, objects: &HashMap<(u32, u32), u8>) -> bool {
        objects.get(&self.position).unwrap() == &0
    }
    // put down a rock to player position
    fn place_rock(&self, objects: &mut HashMap<(u32, u32), u8>, color: u8) {
        objects.insert(self.position, color);
    }
    // set field value to 0
    fn pick_up_rock(&self, objects: &mut HashMap<(u32, u32), u8>) {
        objects.insert(self.position, 0);
    }
    // check the field's value under player's position
    fn what_is_under(&self, objects: &mut HashMap<(u32, u32), u8>) -> u8 {
        *objects.get_mut(&self.position).unwrap_or(&mut 0)
    }
    // check if forward is out of bounds
    fn is_on_edge(&self, size_x: u32, size_y: u32) -> bool {
        self.out_of_bounds(size_x, size_y, self.forward(self.position, self.rotation))
    }
    // TODO: implement radar
    // fn radar(&self, player: &mut Karesz) -> u8;
    // return own direction
    fn looking_at(&self) -> u8 {
        self.rotation
    }
}

impl GameActions for Game {
   
    fn make_steps(&mut self) {
        for (position, players_here) in &self.proposed_steps {
            // two (or more) players stepping on the same field
            if players_here.len() > 1 {
                for elem in players_here {
                    self.death_row.push(*elem);
                }
                return;
            }

            // one player stepping on another
            let mut did_kill:bool = false; 
            for (id, player) in &self.players {
                if player.position == *position && !player.is_moving {
                    self.death_row.push(*id);
                    did_kill = true;
                }
            }
            if did_kill {
                self.players.get_mut(&0).unwrap().kills += 1;
            }
            
            // step
            self.players.get_mut(&0).unwrap().position = *position;
        }
        self.proposed_steps.clear();
    }

    fn kill_row(&mut self) {
        for id in &self.death_row {
            self.players.remove(&id);
        }
        self.death_row.clear();
    }

    fn round(&mut self) {
        self.make_steps();
        self.kill_row();
        self.rounds += 1;
    }
}

// runner function 
fn run<T: 'static + Send + Fn(&str)>(callback: T) {

    let mut child = Command::new("dotnet")
        .arg("C:/Program Files/dotnet/sdk/5.0.402/Roslyn/bincore/csc.dll")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/5.0.11/netstandard.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/5.0.11/System.Console.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/5.0.11/System.Runtime.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/5.0.11/System.Core.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/5.0.11/System.Data.dll\"")
        .arg("-r:\"C:/Program Files/dotnet/shared/Microsoft.NETCore.App/5.0.11/System.Collections.dll\"")
        .arg("C:/Users/Dani/home/Projects/karesz-online/runner/dummy.cs")
        .stdout(Stdio::piped())
        .stdin(Stdio::piped()) 
        .current_dir(Path::new("C:/Users/Dani"))
        .spawn()
        .expect("Failed to start ping process");
    
    println!("Started process: {}", child.id());
    
    let mut stdout = BufReader::new(child.stdout.take().unwrap());
    let mut stdin = child.stdin.take().unwrap();
    let mut current_line = String::new();

    loop {
        match child.try_wait() {
            // process end
            Ok(Some(status)) => {
                println!("Process exited with code {}", status.code().unwrap());
                break
            },
            Ok(_) => {
                match stdout.read_line(&mut current_line) {
                    Ok(_) => {
                        // callback(buf.as_str());
                        println!("Received buffer: {buf}", buf=current_line);
                        // stdin.write_all(b"asdf\n");
                        current_line.clear();
                    }
                    Err(e) => {
                        println!("Error reading stdout: {}", e);
                        break
                    }
                }
            },
            Err(e) => {
                println!("An error occued when attempting to wait: {}",e);
                break
            }
        }
    }
     
        
    
    // let mut stdout = BufReader::new(child.stdout.unwrap());
    // let stdin = child.stdin.as_mut().unwrap();
    // let mut buffer = String::new();
    
    /* loop {
        match stdout.read_line(&mut buffer) {
            // successfully read child stdin
            Ok(_) => {
                // println!("Process stdout: << {}", buffer.as_str());
                // write some shit
                match stdin.write_all(b"heheheha\n") {
                    Ok(_) => {
                        println!(">> heheheha");
                    }
                    Err(e) => {
                        println!("uh oh: {}", e); 
                        break
                    },
                }// 
                // callback
                callback(buffer.as_str());
            }
            // catch error
            Err(_) => break
        }
    }*/

    println!("END");    
}

fn main() {

    /*let mut game = Game { size_x:10, size_y:10, rounds:0, objects:HashMap::new(), players:HashMap::new(), proposed_steps:HashMap::new(), death_row: Vec::new() };
    game.players.insert(0, Karesz { id:0, position: (5, 5), rotation:0, steps:Vec::new(), is_moving:false, kills:0 });
   
    let mut i:u8 = 0;
    let mut player: &mut Karesz;
    while i < 10 {
        
        player = game.players.get_mut(&0).unwrap();
        if player.can_i_step(game.size_x, game.size_y, &game.objects) {
            println!("I can step");
            player.step(&mut game.proposed_steps);
        } else {
            println!("I can't step");
        }
        game.round();
        i += 1;
    }*/

    let mut v = vec![
        prepare::MPCode { code: "void FELADAT()
        {
            Fordulj(jobbra);
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
        }".to_string(), caller: "epic_thread".to_string() },
        prepare::MPCode { code: "void FELADAT()
        {
            Fordulj(jobbra);
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
            while(!Kilépek_e_a_pályáról()) {
                Lépj();
            }
        }".to_string(), caller: "second_thread".to_string() }
    ]; //*/
    
    println!("{}", prepare::create_multi_player_template(&mut v, String::from("asdf"), 1));

    /*run(move |s| {
        println!("{}", s);
    })*/

}

// a < 0 ? b + (a % b) : a % b;
fn modulus(a:i8, b:i8) -> u8 {
    if a < 0 {
        (b + (a % b)) as u8
    } else {
        (a % b) as u8
    }
}