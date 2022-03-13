/*
enum Rotation {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3,
}
impl PartialEq for Rotation {
    fn eq(&self, other: &Self) -> bool {
        self == other
    }
}

enum Direction {
    Left = -1,
    Right = 1,
}
impl PartialEq for Direction {
    fn eq(&self, other: &Self) -> bool {
        self == other
    }
}

#[derive(Debug)]
struct Karesz {
    steps: String,
    alive: bool,
    kills: u8,
    position: (u32, u32),
    rotation: u8,
}

struct Game {
    objects: HashMap<(u32, u32), u8>,
    players: HashMap<&'static str, Karesz>,
    proposed_steps: HashMap<(u32, u32), Vec<&'static str>>,
    rounds: u32,
    size_x: u32,
    size_y: u32,
}

// a < 0 ? b + (a % b) : a % b;
fn modulus(a:i8, b:i8) -> u8 {
    if a < 0 {
        (b + (a % b)) as u8
    } else {
        (a % b) as u8
    }
}

trait Moves {
    // Util
    // fn forward(&self, position: (u32, u32), rotation: u8) -> (u32, u32);
    fn is_wall(&self, position: &(u32, u32)) -> bool;
    fn out_of_bounds(&self, position: &(u32, u32)) -> bool;
    fn can_step(&self, position: &(u32, u32)) -> bool;
    // Player moves
    fn step(&mut self, id: &str);
    fn turn(&self, player: &mut Karesz, direction: i8);
    fn can_i_step(&self, player: &mut Karesz) -> bool;
    fn is_rock_under(&self, player: &mut Karesz) -> bool;
    fn place_rock(&mut self, player: &mut Karesz, color: u8);
    fn pick_up_rock(&mut self, player: &mut Karesz);
    fn what_is_under(&self, player: &mut Karesz) -> u8;
    fn is_on_edge(&self, player: &mut Karesz) -> bool;
    fn radar(&self, player: &mut Karesz) -> u8;
    fn looking_at(&self, player: &mut Karesz) -> u8;
}

fn forward(mut position: (u32, u32), rotation: u8) -> (u32, u32) {
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

// Rotations: 0 up, 1 right, 2 down, 3 left
impl Moves for Game {
    // calculate the field on step forward
    // copy the value, because it's i32,i32 and modified
    
    
    // check if a point is out of bounds
    // reference is enough for reading value
    fn out_of_bounds(&self, position: &(u32, u32)) -> bool {
        position.0 <= self.size_x && position.1 <= self.size_y && position.0 >= 0 && position.1 >= 0
    }

    // check wall ahead
    fn is_wall(&self, position: &(u32, u32)) -> bool {
        self.objects[&position] == 1 as u8
    }

    // check if a player is able to make a step forward
    // pass reference
    fn can_step(&self, position: &(u32, u32)) -> bool {
        !self.out_of_bounds(position) && !self.is_wall(position) 
    }

    // check if a player is able to make a step forward
    // pass forward's reference
    fn can_i_step(&self, player: &mut Karesz) -> bool {
        self.can_step(&forward(player.position, player.rotation))
    }
    
    // propose a step
    fn step(&mut self, id: &str) {
        let player = self.players.get_mut(id).unwrap();
        let target:(u32, u32) = forward(player.position, player.rotation);
        if !self.can_step(&target) {
            // TODO: put on death row
            return
        }
        // propose step
        let val:&mut Vec<&'static str> = self.proposed_steps.get_mut(&player.position).unwrap();
        val.push("player.alive");
    }

    // turn to a direction
    fn turn(&self, player: &mut Karesz, direction: i8) {
        // add +1 or -1
        player.rotation = modulus(player.rotation as i8 + direction, 4);
    }

    // check if rock is under player
    fn is_rock_under(&self, player: &mut Karesz) -> bool {
        self.objects[&player.position] > 2
    }

    // put a rock to a point
    fn place_rock(&mut self, player: &mut Karesz, color: u8) {
        self.objects.insert(player.position, color);
    }
    
    // pick up a rock
    fn pick_up_rock(&mut self, player: &mut Karesz) {
        self.objects.insert(player.position, 0);
    }

    // check the value of the field
    fn what_is_under(&self, player: &mut Karesz) -> u8 {
        self.objects[&player.position]
    }
    
    // check if about to step out of map
    fn is_on_edge(&self, player: &mut Karesz) -> bool {
        self.out_of_bounds(&forward(player.position, player.rotation))
    }

    // TODO: radar or idk
    fn radar(&self, player: &mut Karesz) -> u8 { 1 }

    // get the direction karesz is looking at
    fn looking_at(&self, player: &mut Karesz) -> u8 {
        player.rotation
    }
}
*/

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::thread;
use std::thread::sleep;
use std::time::Duration;

fn start_listener<T: 'static + Send + Fn(&str)>(cb: T) {
    let child = Command::new("ping")
        .arg("google.com")
        .stdout(Stdio::piped())
        .spawn()
        .expect("Failed to start ping process");

    println!("Started process: {}", child.id());

    thread::spawn(move || {
        let mut f = BufReader::new(child.stdout.unwrap());
        loop {
            let mut buf = String::new();
            match f.read_line(&mut buf) {
                Ok(_) => {
                    cb(buf.as_str());
                }
                Err(e) => println!("an error!: {:?}", e),
            }
        }
    });
}

fn main() {
    start_listener(|s| {
        println!("Got this back: {}", s);
    });

    sleep(Duration::from_secs(5));
    println!("Done!");
}
