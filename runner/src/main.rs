// Epic karesz implementation in rust
#[derive(Debug)]
#[derive(Eq, Hash)]
struct Point(i32, i32);

impl PartialEq for Point {
    fn eq(&self, other: &Self) -> bool {
        self.0 == other.0 && self.1 == other.0
    }
}

enum Rotation {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3,
}

struct Karesz {
    steps: String,
    alive: bool,
    kills: u8,
    position: Point,
    rotation: Rotation,
}

struct Game<'a> {
    objects: HashMap<Point, u8>,
    players: HashMap<&'a str, Karesz>,
    rounds: i32,
    size_x: i32,
    size_y: i32,
}

trait Moves {
    // Util
    fn forward(&self, position:Point, rotation:Rotation) -> Point;
    fn is_wall(&self, position: Point) -> bool;
    fn out_of_bounds(&self, position:Point) -> bool;
    fn can_step(&self, id: &str) -> bool;
    // Player moves
    fn step(&self, id: &str);
    fn turn(&self, id: &str, rotation: Rotation);
    fn is_rock_under(&self, id: &str) -> bool;
    fn place_rock(&self, id: &str, color: u8);
    fn pick_up_rock(&self, id: &str);
    fn what_is_under(&self, id: &str) -> u8;
    fn is_on_edge(&self, id: &str) -> bool;
    fn radar(&self, id: &str) -> u8;
    fn looking_at(&self, id: &str) -> u8;
}

// Rotations: 0 up, 1 right, 2 down, 3 left
impl Moves for Game<'_> {
    // calculate the field on step forward
    fn forward(&self, position:Point, rotation: Rotation) -> Point {
        if assert_eq!(rotation, Rotation::Up as u8) {
            position.1 += 1
        } else if assert_eq!(rotation, Rotation::Right as u8) {
            position.0 += 1
        } else if assert_eq!(rotation, Rotation::Down as u8) {
            position.1 -= 1
        } else {
            position.0 -= 1
        }
        position
    }
    
    // check if a point is out of bounds
    fn out_of_bounds(&self, position:Point) -> bool {
        position.0 <= self.size_x && position.1 <= self.size_y && position.0 >= 0 && position.1 >= 0
    }

    // check wall ahead
    fn is_wall(&self, position: Point) -> bool {
        assert_eq!(self.objects.get(&position), 1)
    }

    // check if a player is able to make a step forward
    fn can_step(&self, id: &str) -> bool {
        let p = self.forward(self.players[id].position, self.players[id].rotation);
        !self.out_of_bounds(p) && !self.is_wall(p) 
    }

}

use std::collections::HashMap;

fn main() {
    println!("Hello, world!");

    let mut game = Game { players:HashMap::new(), rounds:0, size_x:10, size_y:10, objects: HashMap::new() };
    // add players
    game.players.insert("ghehehea", Karesz { position:Point(5,5), rotation:Rotation::Up, kills:0, steps:String::from(""), alive:false, });
    
}
