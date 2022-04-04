use rocket::serde::Deserialize;
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug)]
pub struct Karesz {
    pub steps: Vec<u8>,
    pub is_moving: bool,
    pub kills: u8,
    pub position: (u32, u32),
    pub rotation: u8,
    pub id: u8,
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct Player<'r> {
    pub name: &'r str,
    pub code: &'r str,
}
#[derive(Serialize, Debug)]
pub struct PlayerScore {
    pub name: String,
    pub kills: u8,
    pub steps: Vec<u8>,
    pub place: u8,
    pub rounds_survived: u32,
    pub reason_of_death: &'static str,
}

#[derive(Debug)]
pub struct Game {
    pub players: HashMap<u8, Karesz>,
    pub proposed_steps: HashMap<(u32, u32), Vec<u8>>, // hashmap containing player id's for that position
    pub objects: HashMap<(u32, u32), u8>,
    pub death_row: Vec<(u8, &'static str)>,
    pub scoreboard: Vec<PlayerScore>, // id, (placement, steps, kills)
    pub round: u32,
    pub winner: String,
    pub size_x: u32,
    pub size_y: u32,
    pub draw: bool,
}

// obtain objects from map string + size x, y
// returns none if map is invalid
pub fn parse_map(map: &str, mut size_x: u32, mut size_y: u32) -> Option<HashMap<(u32, u32), u8>> {
    // custom map is empty
    if map.len() == 0 {
        return Some(HashMap::<(u32, u32), u8>::new());
    }
    let lines = map.split("\n").collect::<Vec<&str>>();
    // check if map is valid
    if lines.len() != size_y as usize || lines[0].len() != size_x as usize {
        return None;
    }
    // parse map from string
    let mut res = HashMap::new();
    for line in lines {
        size_x = 0;
        for c in line.chars() {
            let c = c.to_digit(10).unwrap();
            res.insert((size_x, size_y), c as u8);
            size_x += 1;
        }
        size_y -= 1;
    }
    Some(res)
}

// generate the karesz objects and starting positions
pub fn get_players(players: &Vec<Player>, size_x: u32, size_y: u32) -> HashMap<u8, Karesz> {
    let mut res = HashMap::new();
    // align players evenly on the x axis
    let unit = size_x / (players.len() + 1) as u32;
    let y = size_y / 2;
    for i in 0..players.len() {
        res.insert(
            i as u8,
            Karesz {
                position: ((i + 1) as u32 * unit, y),
                rotation: 0,
                id: i as u8,
                is_moving: false,
                kills: 0,
                steps: vec![],
                name: players[i].name.to_string(),
            },
        );
    }
    res
}

pub trait GameActions {
    // increment round, make steps and kill people
    fn round(&mut self) -> Option<u8>;
    // make steps
    fn make_steps(
        &mut self, /*, players: &mut HashMap<u8, Karesz>, proposed_steps: &mut HashMap<(u32, u32), std::vec::Vec<u8>>, death_row: &mut Vec<(u8, &'static str)>*/
    );
    // remove players on death row
    fn kill_row(
        &mut self, /*, death_row: &mut Vec<(u8, &'static str)>, players: &mut HashMap<u8, Karesz>*/
    ) -> bool;
    // use for multiplayer
    fn parse(&mut self, id: u8, s: &Vec<&str>) -> Option<u8>;

    // constructors
    fn new_custom(players: &Vec<Player>, size_x: u32, size_y: u32, map: &String) -> Option<Game>;
    fn new_load(players: &Vec<Player>, map: &str) -> Option<Game>;
}

pub trait Moves {
    // Util

    // get the point one step forward
    fn forward(&self, position: (u32, u32), rotation: u8) -> (u32, u32);
    // check if field is a wall
    fn is_wall(&self, objects: &HashMap<(u32, u32), u8>, position: (u32, u32)) -> bool;
    // check if field is out of bounds
    fn out_of_bounds(&self, size_x: u32, size_y: u32, position: (u32, u32)) -> bool;
    // check if position is valid one step forward
    fn can_step(
        &self,
        size_x: u32,
        size_y: u32,
        objects: &HashMap<(u32, u32), u8>,
        position: (u32, u32),
    ) -> bool;

    // Player moves
    // propose a step
    fn step(
        &mut self,
        proposed_steps: &mut HashMap<(u32, u32), Vec<u8>>,
        death_row: &mut Vec<(u8, &'static str)>,
        size_x: u32,
        size_y: u32,
        objects: &HashMap<(u32, u32), u8>,
    );
    // normally step
    fn step_single(&mut self, size_x: u32, size_y: u32, objects: &HashMap<(u32, u32), u8>) -> bool;
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
    //
    fn parse_multi(
        &mut self,
        s: &Vec<&str>,
        proposed_steps: &mut HashMap<(u32, u32), Vec<u8>>,
        death_row: &mut Vec<(u8, &'static str)>,
        size_x: u32,
        size_y: u32,
        objects: &mut HashMap<(u32, u32), u8>,
    ) -> Option<u8>;

    fn parse_single(
        &mut self,
        s: &Vec<&str>,
        size_x: u32,
        size_y: u32,
        objects: &mut HashMap<(u32, u32), u8>,
    ) -> Option<u8>;
}

impl Moves for Karesz {
    // get the point one step forward | NOTE: if unable to step (negative value), the value will remain the same
    fn forward(&self, mut position: (u32, u32), rotation: u8) -> (u32, u32) {
        if rotation == 0 {
            position.1 += 1
        } else if rotation == 1 {
            position.0 += 1
        } else if rotation == 2 && position.1 > 0 {
            position.1 -= 1
        } else if rotation == 3 && position.0 > 0 {
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
    fn can_step(
        &self,
        size_x: u32,
        size_y: u32,
        objects: &HashMap<(u32, u32), u8>,
        position: (u32, u32),
    ) -> bool {
        !self.out_of_bounds(size_x, size_y, position) && !self.is_wall(objects, position)
    }

    // player moves
    // propose step
    fn step(
        &mut self,
        proposed_steps: &mut HashMap<(u32, u32), Vec<u8>>,
        death_row: &mut Vec<(u8, &'static str)>,
        size_x: u32,
        size_y: u32,
        objects: &HashMap<(u32, u32), u8>,
    ) {
        let fwd = self.forward(self.position, self.rotation);
        self.is_moving = true;
        // attempt to step out of map
        if fwd == self.position || !self.can_step(size_x, size_y, objects, fwd) {
            println!("Player {} attempted to step out of bounds", self.id);
            death_row.push((
                self.id,
                "Player attempted to step out of bounds or into a wall",
            ));
        // if someone's already at a position, push id
        } else if proposed_steps.contains_key(&fwd) {
            proposed_steps.get_mut(&fwd).unwrap().push(self.id);
        // create new vector for position
        } else {
            let mut vec = Vec::new();
            vec.push(self.id);
            proposed_steps.insert(fwd, vec);
        }
    }
    // actually step: returns true if player is dead
    fn step_single(&mut self, size_x: u32, size_y: u32, objects: &HashMap<(u32, u32), u8>) -> bool {
        let fwd = self.forward(self.position, self.rotation);
        // attempt to step out of map
        if fwd == self.position || !self.can_step(size_x, size_y, objects, fwd) {
            println!("Player {} attempted to step out of bounds", self.id);
            return true;
        }
        self.position = fwd;
        return false;
    }
    // turn left or right (1 or -1)
    fn turn(&mut self, direction: i8) {
        self.rotation = modulus(self.rotation as i8 + direction, 4);
    }
    // check if able to step
    fn can_i_step(&self, size_x: u32, size_y: u32, objects: &HashMap<(u32, u32), u8>) -> bool {
        let fwd = self.forward(self.position, self.rotation);
        fwd != self.position && self.can_step(size_x, size_y, objects, fwd)
    }
    // check if player objects contain a rock at player position
    fn is_rock_under(&self, objects: &HashMap<(u32, u32), u8>) -> u8 {
        if objects.get(&self.position).unwrap() == &0 {
            1
        } else {
            0
        }
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
        let fwd = self.forward(self.position, self.rotation);
        if fwd == self.position || self.out_of_bounds(size_x, size_y, fwd) {
            1
        } else {
            0
        }
    }
    // check if there is a wall in front
    fn is_wall_in_front(&self, objects: &HashMap<(u32, u32), u8>) -> u8 {
        if self.is_wall(objects, self.forward(self.position, self.rotation)) {
            1
        } else {
            0
        }
    }
    // TODO: implement radar
    // fn radar(&self, player: &mut Karesz) -> u8;
    // return own direction
    fn looking_at(&self) -> u8 {
        self.rotation
    }

    // parses a command
    fn parse_multi(
        &mut self,
        s: &Vec<&str>,
        proposed_steps: &mut HashMap<(u32, u32), Vec<u8>>,
        death_row: &mut Vec<(u8, &'static str)>,
        size_x: u32,
        size_y: u32,
        objects: &mut HashMap<(u32, u32), u8>,
    ) -> Option<u8> {
        print!(
            "    [{}] pos: {:?}, rot: {} => ",
            self.id, self.position, self.rotation
        );

        let res: Option<u8> = {
            match s[2] {
                "0" => {
                    self.steps.push(0x0);
                    self.step(proposed_steps, death_row, size_x, size_y, objects);
                    None
                }
                "1" => {
                    self.steps.push(0x1);
                    self.turn(-1);
                    None
                }
                "2" => {
                    self.steps.push(0x2);
                    self.turn(1);
                    None
                }
                "3" => {
                    // no value
                    if s.len() < 4 {
                        return None;
                    }

                    if s[3] == "-1" {
                        self.turn(-1);
                        self.steps.push(0x1);
                    } else if s[3] == "1" {
                        self.turn(1);
                        self.steps.push(0x2);
                    }
                    None
                }
                "4" => {
                    self.steps.push(0x4);
                    self.pick_up_rock(objects);
                    None
                }
                "5" => {
                    self.steps.push(0x5);
                    if s.len() < 4 {
                        self.place_rock(objects, 2);
                        return None;
                    }
                    let mut value = s[3].parse::<u8>().unwrap();
                    // clamp value and place
                    value = if value < 2 {
                        2
                    } else if value > 5 {
                        5
                    } else {
                        value
                    };
                    self.place_rock(objects, value);
                    None
                }
                "6" => {
                    self.steps.push(0x6);
                    Some(self.looking_at())
                }
                "7" => {
                    self.steps.push(0x7);
                    Some(self.is_rock_under(objects))
                }
                "8" => {
                    self.steps.push(0x8);
                    Some(self.what_is_under(objects))
                }
                "9" => {
                    self.steps.push(0x9);
                    Some(self.is_wall_in_front(objects))
                }
                "a" => {
                    self.steps.push(0x3);
                    Some(self.is_on_edge(size_x, size_y))
                }
                _ => None,
            }
        };
        println!(
            "res: {:?} pos: {:?}, rot: {}, steps: {:?} \n",
            res, self.position, self.rotation, self.steps
        );
        res
    }

    // parse as single (instead of passing empty hashmaps to the original function i literally just copy pasted the code without them)
    fn parse_single(
        &mut self,
        s: &Vec<&str>,
        size_x: u32,
        size_y: u32,
        objects: &mut HashMap<(u32, u32), u8>,
    ) -> Option<u8> {
        print!(
            "    [{}] pos: {:?}, rot: {} => ",
            self.id, self.position, self.rotation
        );

        let res: Option<u8> = {
            match s[2] {
                "0" => {
                    self.steps.push(0x0);
                    if self.step_single(size_x, size_y, objects) {
                        Some(8) // die
                    } else {
                        None
                    }
                }
                "1" => {
                    self.steps.push(0x1);
                    self.turn(-1);
                    None
                }
                "2" => {
                    self.steps.push(0x2);
                    self.turn(1);
                    None
                }
                "3" => {
                    // no value
                    if s.len() < 4 {
                        return None;
                    }

                    if s[3] == "-1" {
                        self.turn(-1);
                        self.steps.push(0x1);
                    } else if s[3] == "1" {
                        self.turn(1);
                        self.steps.push(0x2);
                    }
                    None
                }
                "4" => {
                    self.steps.push(0x4);
                    self.pick_up_rock(objects);
                    None
                }
                "5" => {
                    self.steps.push(0x5);
                    if s.len() < 4 {
                        self.place_rock(objects, 2);
                        return None;
                    }
                    let mut value = s[3].parse::<u8>().unwrap();
                    // clamp value and place
                    value = if value < 2 {
                        2
                    } else if value > 5 {
                        5
                    } else {
                        value
                    };
                    self.place_rock(objects, value);
                    None
                }
                "6" => {
                    self.steps.push(0x6);
                    Some(self.looking_at())
                }
                "7" => {
                    self.steps.push(0x7);
                    Some(self.is_rock_under(objects))
                }
                "8" => {
                    self.steps.push(0x8);
                    Some(self.what_is_under(objects))
                }
                "9" => {
                    self.steps.push(0x9);
                    Some(self.is_wall_in_front(objects))
                }
                "a" => {
                    self.steps.push(0xa);
                    Some(self.is_on_edge(size_x, size_y))
                }
                _ => None,
            }
        };
        println!(
            "res: {:?} pos: {:?}, rot: {}, steps: {:?} \n",
            res, self.position, self.rotation, self.steps
        );
        res
    }
}

impl GameActions for Game {
    // create a new custom game. Returns none if failed to parse map
    fn new_custom(players: &Vec<Player>, size_x: u32, size_y: u32, map: &String) -> Option<Self> {
        match parse_map(map, size_x, size_y) {
            Some(objects) => Some(Game {
                players: get_players(players, size_x, size_y),
                objects,
                proposed_steps: HashMap::new(),
                death_row: Vec::new(),
                scoreboard: Vec::new(),
                round: 0,
                winner: String::new(),
                size_x,
                size_y,
                draw: false,
            }),
            None => None,
        }
    }

    // create a new game with a predefined map
    fn new_load(players: &Vec<Player>, _map: &str) -> Option<Self> {
        // TODO: Load map by name
        Some(Game {
            players: get_players(players, 20, 20),
            objects: HashMap::new(),
            proposed_steps: HashMap::new(),
            death_row: Vec::new(),
            scoreboard: Vec::new(),
            round: 0,
            winner: String::new(),
            size_x: 20,
            size_y: 20,
            draw: false,
        })
    }

    fn make_steps(&mut self) {
        for (position, players_here) in &self.proposed_steps {
            // two (or more) players stepping on the same field
            if players_here.len() > 1 {
                for elem in players_here {
                    println!("Player {} stepped on the same field as others", elem);
                    self.death_row
                        .push((*elem, "Player stepped on the same field as others"));
                }
                return;
            }

            // one player stepping on another
            let mut did_kill: bool = false;
            for (id, player) in &mut self.players {
                if player.position == *position && !player.is_moving {
                    println!("Player {} was stepped on by Player {}", id, players_here[0]);
                    self.death_row
                        .push((*id, "Player was stepped on by another player"));
                    did_kill = true;
                }
                player.is_moving = false;
            }
            if did_kill {
                self.players.get_mut(&players_here[0]).unwrap().kills += 1;
            }

            // step
            self.players.get_mut(&players_here[0]).unwrap().position = *position;
        }
        self.proposed_steps.clear();
    }

    // returns true if the game is over
    fn kill_row(&mut self) -> bool {
        // everyone dies in the same round
        if self.death_row.len() == self.players.len() {
            self.draw = true;
            for (id, reason) in &self.death_row {
                let player = self.players.get(id).unwrap();
                self.scoreboard.push(PlayerScore {
                    name: player.name.clone(),
                    kills: player.kills,
                    steps: player.steps.clone(),
                    place: 1u8,
                    reason_of_death: reason,
                    rounds_survived: self.round,
                });
                self.players.remove(id);
            }
            return true;
        }

        // remove everybody in death row
        for (id, reason) in &self.death_row {
            let player = self.players.get(id).unwrap();
            self.scoreboard.push(PlayerScore {
                name: player.name.clone(),
                kills: player.kills,
                steps: player.steps.clone(),
                place: self.players.len() as u8,
                reason_of_death: reason,
                rounds_survived: self.round,
            });
            self.players.remove(id);
        }

        // if one player is left, game is over
        if self.players.len() == 1 {
            let id = *self.players.keys().last().unwrap();
            let player = self.players.get(&id).unwrap();
            self.scoreboard.push(PlayerScore {
                name: player.name.clone(),
                kills: player.kills,
                steps: player.steps.clone(),
                place: 1u8,
                reason_of_death: "",
                rounds_survived: self.round,
            });
            self.winner = player.name.clone();
            return true;
        }

        self.death_row.clear();
        false
    }

    fn round(&mut self) -> Option<u8> {
        self.make_steps();
        self.round += 1;
        if self.kill_row() {
            return Some(8u8);
        }
        None
    }

    fn parse(&mut self, id: u8, s: &Vec<&str>) -> Option<u8> {
        let player = self.players.get_mut(&id).unwrap();
        return player.parse_multi(
            s,
            &mut self.proposed_steps,
            &mut self.death_row,
            self.size_x,
            self.size_y,
            &mut self.objects,
        );
    }
}

// a < 0 ? b + (a % b) : a % b;
fn modulus(a: i8, b: i8) -> u8 {
    if a < 0 {
        (b + (a % b)) as u8
    } else {
        (a % b) as u8
    }
}
