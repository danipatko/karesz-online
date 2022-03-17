use std::collections::HashMap;
mod prepare;
mod run;

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
    fn is_rock_under(&self, objects: &HashMap<(u32, u32), u8>) -> u8;
    // put down a rock to player position
    fn place_rock(&self, objects: &mut HashMap<(u32, u32), u8>, color: u8);
    // set field value to 0
    fn pick_up_rock(&self, objects: &mut HashMap<(u32, u32), u8>);
    // check the field's value under player's position
    fn what_is_under(&self, objects: &HashMap<(u32, u32), u8>) -> u8;
    // check if there is a wall in front
    fn is_wall_in_front(&self, objects: &HashMap<(u32, u32), u8>) -> u8;
    // check if forward is out of bounds
    fn is_on_edge(&self, size_x: u32, size_y: u32) -> u8;
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
    fn is_rock_under(&self, objects: &HashMap<(u32, u32), u8>) -> u8 {
        if objects.get(&self.position).unwrap() == &0 { 1 } else { 0 }
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
    fn what_is_under(&self, objects: &HashMap<(u32, u32), u8>) -> u8 {
        *objects.get(&self.position).unwrap_or(&0)
    }
    // check if forward is out of bounds
    fn is_on_edge(&self, size_x: u32, size_y: u32) -> u8 {
        if self.out_of_bounds(size_x, size_y, self.forward(self.position, self.rotation)) { 1 } else { 0 }
    }
    // check if there is a wall in front
    fn is_wall_in_front(&self, objects: &HashMap<(u32, u32), u8>) -> u8 {
        if self.is_wall(objects, self.forward(self.position, self.rotation)) { 1 } else { 0 }
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



fn main() {

    let mut game = Game { size_x:10, size_y:10, rounds:0, objects:HashMap::new(), players:HashMap::new(), proposed_steps:HashMap::new(), death_row: Vec::new() };
    game.players.insert(0, Karesz { id:0, position: (2, 5), rotation:0, steps:Vec::new(), is_moving:false, kills:0 });
    game.players.insert(1, Karesz { id:0, position: (7, 5), rotation:0, steps:Vec::new(), is_moving:false, kills:0 });
   
    let round_key = "round_key";
    let key = "random_key";

    /*
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
    ]; 
    println!("{}", prepare::create_multi_player_template(&mut v, "", key, round_key));
    // */

    run::compile();
    run::run(move |s| {
        let s = s.trim();
        // 0: key, 1: player index, 2: command, 3: value
        if s == round_key {
            println!("-----------------------");
            game.round();
        } else {
            let s: Vec<&str> = s.split(" ").collect();
            
            // ignore debug logs
            if s.len() < 3 || s[0] != key {
                println!("round key did not match.");
                return None
            }
            
            let id:u8 = s[1].parse::<u8>().unwrap();
            // player not in game (or dead)
            if !game.players.contains_key(&id) {
                println!("player does not exist.");
                return None
            }
            
            let player = game.players.get_mut(&id).unwrap();
            
            match s[2] {
                "0" => player.step(&mut game.proposed_steps),
                "1" => player.turn(-1),
                "2" => player.turn(1),
                "3" => {
                    if s.len() < 4 { return None; }
                    
                    if s[3] == "-1" {
                        player.turn(-1);
                    } else if s[3] == "1" {
                        player.turn(1);
                    }
                },
                "4" => player.pick_up_rock(&mut game.objects),
                "5" => {
                    if s.len() < 4 { 
                        player.place_rock(&mut game.objects, 2);
                        return None;
                    }
                    let mut value = s[3].parse::<u8>().unwrap();
                    // clamp value
                    value = if value < 2 { 2 } else if value > 5 { 5 } else { value };
                    player.place_rock(&mut game.objects, value);
                },
                "6" => return Some(player.looking_at()),
                "7" => return Some(player.is_rock_under(&game.objects)),
                "8" => return Some(player.what_is_under(&game.objects)),
                "9" => return Some(player.is_wall_in_front(&game.objects)),
                "a" => return Some(player.is_on_edge(game.size_x, game.size_y)),
                _ => {/* Ignore */}
            }
        }

        None
    }); // */

}

// a < 0 ? b + (a % b) : a % b;
fn modulus(a:i8, b:i8) -> u8 {
    if a < 0 {
        (b + (a % b)) as u8
    } else {
        (a % b) as u8
    }
}