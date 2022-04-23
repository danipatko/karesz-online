// allowed imports
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Collections.Concurrent;

/*
STEPS 
-1: nothing
0: step
1: turn left
2: turn right
3: is wall
4: stepping out
5: get position
6: get direction
7: pick up rock
8: what is under
9: anything under
10: radar
11: scan
20+ place rock of color
 */

class Program
{
    // the number of steps each player can do
    static readonly int MAX_ITERATIONS = 5000;
    // the number of players to stop the game (the game finishes if this many players are alive)
    static readonly int MIN_PLAYER_COUNT = 1;
    // add map dimensions from template here
    static readonly int MAP_WIDTH = 20; 
    static readonly int MAP_HEIGHT = 20;
    // to look up map objects
    static readonly ConcurrentDictionary<(int x, int y), uint> Map = new ConcurrentDictionary<(int x, int y), uint>()
    {
        // Assign map points from template here
        [(0, 0)] = 1,
        [(0, 1)] = 1,
    };

    static readonly int RadarRange = 10;
    static readonly int ScanRange = 3;

    static void FinishGame()
    {
        Console.WriteLine($"KEYHERE {{ \"rounds\":{ROUND}, \"players\": {string.Join(',', ScoreBoard.Values.Select(x => x.ToJson()))} }}");
        Environment.Exit(0);
    }

    // get the point one step forward
    static (int x, int y) GetForward((int x, int y) Position, int Rotation)
    {
        return Rotation switch
        {
            0 => (Position.x, Position.y - 1),
            1 => (Position.x + 1, Position.y),
            2 => (Position.x, Position.y + 1),
            3 => (Position.x - 1, Position.y),
            // should not be possible
            _ => Position,
        };
    }
    
    // check if position is inside the map
    static bool IsOutOfBounds((int x, int y) Position) => !(Position.x >= 0 && Position.x < MAP_WIDTH && Position.y >= 0 && Position.y < MAP_HEIGHT);

    // check if a position is valid
    static bool IsPositionValid((int x, int y) Position) => !IsOutOfBounds(Position) && !IsWall(Position);

    // check if players are at a position
    static bool AreTherePlayersHere((int x, int y) Position) {
        foreach (IPlayer Player in Players.Values)
            if (Player.Position == Position) return true;
        return false;
    }

    // check if the position is a map
    static bool IsWall((int x, int y) Position) => Map.ContainsKey(Position);
    // check if a point is inside a rectangular area
    static bool IsPointInside((int x, int y) Center, (int x, int y) Point, int Range)
    {
        return Point.x >= Center.x - Range && Point.x <= Center.x + Range && Point.y >= Center.y - Range && Point.y <= Center.y + Range;
    }

    // mod operator (for negative values too)
    static int Modulus(int a, int b) => ((a % b) + b) % b;
    static readonly ConcurrentDictionary<(int x, int y), List<int>> ProposedSteps = new ConcurrentDictionary<(int x, int y), List<int>>();
    static readonly ConcurrentDictionary<int, IPlayer> Players = new ConcurrentDictionary<int, IPlayer>() 
    { 
        [0] = new IPlayer("0", 0, "sany", 4, 4, 0),
        [1] = new IPlayer("1", 1, "karex", 6, 6, 0)
    }; // TODO: add players from template here
    static readonly ConcurrentDictionary<int, Score> ScoreBoard = new ConcurrentDictionary<int, Score>(); 
    // add player data to scoreboard
    static void KillPlayer(int Place, int Round, bool Survived, IPlayer Player, string Reason)
    {
        Console.WriteLine($"afaafsafsafsafsaf");
        ScoreBoard.TryAdd(Player.Index, new Score()
        {
            ID = Player.ID,
            Death = Reason,
            Placement = Place,
            Name = Player.Name,
            RoundsAlive = Round,
            Survived = Survived,
            Steps = Player.Steps,
            StartState = Player.StartState,
            RocksPlaced = Player.RocksPlaced,
            RocksPickedUp = Player.RocksPickedUp,
        });
    }

    public struct Score
    {
        public string ID;
        public string Name;
        public string Death;
        public int Placement;
        public bool Survived;
        public int RoundsAlive;
        public List<int> Steps;
        public int RocksPlaced;
        public int RocksPickedUp;
        public (int x, int y, int rotation) StartState;
        public Score(string ID, int Placement, string Name, List<int> Steps, bool Survived, string Death, int RoundsAlive, int RocksPlaced, int RocksPickedUp, (int x, int y, int rotation) StartState) 
        {
            this.ID = ID;
            this.Name = Name;
            this.Death = Death;
            this.Steps = Steps;
            this.Survived = Survived;
            this.Placement = Placement;
            this.StartState = StartState;
            this.RoundsAlive = RoundsAlive;
            this.RocksPlaced = RocksPlaced;
            this.RocksPickedUp = RocksPickedUp;
        }
        public string ToJson()
        {
            return $"\"{ID}\": {{ \"placement\":{Placement}, \"name\":\"{Name}\", \"started\": {{ \"x\":{StartState.x}, \"y\":{StartState.y}, \"rotation\":{StartState.rotation} }}, \"survived\":{(Survived ? "true" : "false")}, \"death\":\"{Death}\",  \"alive\":{RoundsAlive}, \"rocks\":{{ \"placed\":{RocksPlaced}, \"picked_up\":{RocksPickedUp} }}, \"steps\":[{string.Join(',', Steps)}] }}";
        }
    }

    public struct IPlayer
    {
        public int Index; // same as key
        public string ID;
        public string Name;
        public int Rotation;
        public List<int> Steps;
        public int RocksPlaced; // number of times place was called
        public int RocksPickedUp; // number of times pick up was called
        public (int x, int y) Position;
        public (int x, int y, int rotation) StartState;

        public IPlayer(string ID, int PlayerIndex, string PlayerName, int StartingPointX, int StartingPointY, int StartingRotation)
        {
            this.ID = ID;
            RocksPlaced = 0;
            Index = PlayerIndex;
            RocksPickedUp = 0;
            Name = PlayerName;
            Steps = new List<int>();
            Rotation = StartingRotation;
            Position = (StartingPointX, StartingPointY);
            StartState = (StartingPointX, StartingPointY, Rotation);
        }

        public void Save()
        {
            Players[Index] = this;
        }

        // put own position on proposed steps
        public void Step()
        {
            (int x, int y) OneStepForward = GetForward(Position, Rotation);
            // check if position is valid
            if(IsWall(OneStepForward))
            {
                KillPlayer(Players.Count, ROUND, false, this, $"{Name} ran into a wall");
                Players.TryRemove(Index, out IPlayer _);
                return;
            } else if (IsOutOfBounds(OneStepForward)) 
            {
                KillPlayer(Players.Count, ROUND, false, this, $"{Name} attempted to step out of the map");
                Players.TryRemove(Index, out IPlayer _);
                return;
            }

            if (ProposedSteps.ContainsKey(OneStepForward))
            {
                ProposedSteps.TryGetValue(OneStepForward, out List<int> PlayersHere);
                PlayersHere.Add(Index);
            }
            else ProposedSteps.TryAdd(OneStepForward, new List<int>() { Index });
            Steps.Add(0);
        }

        // turn left or right
        public void Turn(int Direction)
        {
            Rotation = Modulus(Rotation + Direction, 4);
            Steps.Add(Direction == -1 ? 2 : 3);
            Save();
        }

        // check if there's a wall in front
        public bool IsWallAhead()
        {
            Steps.Add(3);
            Save();
            return Map.TryGetValue(GetForward(Position, Rotation), out uint Field) && Field == 1;
        }

        // check if a step forward is out of bounds
        public bool SteppingOut() {
            Steps.Add(4);
            Save();
            return IsOutOfBounds(GetForward(Position, Rotation));
        }

        // place a rock
        public void PlaceRock(uint Color)
        {
            Steps.Add(20 + (int)Color);
            RocksPlaced++;
            Save();
            Map.TryAdd(Position, 20 + Color);
        }

        // pick up rock
        public void PickUpRock()
        {
            Steps.Add(7);
            RocksPickedUp++;
            Save();
            Map.TryRemove(Position, out uint _);
        }

        // check current field
        public int WhatIsUnder()
        {
            Steps.Add(8);
            Save();
            return Map.TryGetValue(Position, out uint Result)  ? (int)Result : 0;
        }

        // check if there is a rock under karesz
        public bool IsThereAnyThingUnder()
        {
            Steps.Add(9);
            Save();
            return Map.TryGetValue(Position, out uint Field) && Field > 1;
        }

        // check direction
        public int WhereAmILooking() {
            Steps.Add(6);
            Save();
            return Rotation;
        }

        // check if looking at a specific direction
        public bool AmILookingAt(int Direction)
        {
            Steps.Add(6);
            Save();
            return Direction == Rotation;
        }

        // radar -> number of steps forward until closest wall or player
        public int Radar()
        {
            this.Steps.Add(10);
            Save();
            (int x, int y) P = GetForward(Position, Rotation);
            int Steps = 0;
            while (!AreTherePlayersHere(P) || !IsWall(P))
            {
                // if position is outside of the map, return the default range
                if (IsOutOfBounds(P)) return RadarRange;
                // else move forward
                P = GetForward(P, Rotation);
                Steps++;
            }
            return Steps;
        }

        // check the number of players nearby
        public int Scan()
        {
            Steps.Add(11);
            Save();
            int Found = 0;
            foreach (IPlayer Player in Players.Values)
                if (IsPointInside(Player.Position, Position, ScanRange)) Found++;
            return Found;
        }

        // Do nothing
        public void OmitStep() 
        { 
            Steps.Add(-1);
            Save();
        } 
    }

    static int ROUND = 0;
    static readonly Barrier Bar = new Barrier(/* Number of threads here */2, (b) =>
    {
        // Console.WriteLine($"---- {ProposedSteps.Count}");
        // iteration is over -> actually make steps
        List<int> ToRemove = new List<int>();
        foreach(KeyValuePair<(int x, int y), List<int>> PlayersHere in ProposedSteps)
        {
            // Console.WriteLine($"At {PlayersHere.Key} is {string.Join(',', PlayersHere.Value)}");
            // more than one players stepping on the same field -> everyone dies
            if(PlayersHere.Value.Count > 1) {
                foreach(int PlayerID in PlayersHere.Value)
                {
                    if (Players.TryGetValue(PlayerID, out IPlayer Player))
                    {
                        KillPlayer(Players.Count, ROUND, false, Player, $"{Player.Name} attempted to step on the same field as {PlayersHere.Value.Count - 1} others.");
                        ToRemove.Add(PlayerID);
                    }
                }
                break;
            }
            // one player stepping on another
            if (Players.TryGetValue(PlayersHere.Value[0], out IPlayer Current))
            {
                foreach (IPlayer Player in Players.Values)
                {
                    if (Player.Position == PlayersHere.Key && Player.Steps.Last() != 0) 
                    {
                        KillPlayer(Players.Count, ROUND, false, Player, $"{Player.Name} was stepped on by {Current.Name}");
                        ToRemove.Add(Player.Index);
                    }
                }
                // make step
                Current.Position = PlayersHere.Key;
                Current.Save();
            }
            else Console.WriteLine($"Could not find player {PlayersHere.Value[0]}");
        }
        // remove players
        foreach (int ID in ToRemove) Players.TryRemove(ID, out IPlayer _);

        // check remainder -> add everyone to scoreboard and finish game
        if(Players.Count <= MIN_PLAYER_COUNT)
        {
            foreach (IPlayer Player in Players.Values) KillPlayer(1, ROUND, true, Player, "");
            FinishGame();
        }

        ProposedSteps.Clear();
        ROUND++;
        if (ROUND > MAX_ITERATIONS) FinishGame();
    });

    static bool SIGNAL()
    {
        Bar.SignalAndWait();
        return true;
    }

    // wrapper functions called by players' codes
    static void Step(int P) 
    {
        if (Players.TryGetValue(P, out IPlayer Player)) Player.Step();
        SIGNAL();
    }

    static void Turn(int P, int Direction)
    {
        if (Players.TryGetValue(P, out IPlayer Player)) Player.Turn(Direction);
        SIGNAL();
    }

    static bool AmISteppingOut(int P) => SIGNAL() && Players.TryGetValue(P, out IPlayer Player) && Player.SteppingOut();

    static (int x, int y) WhereAmI(int P) => SIGNAL() && Players.TryGetValue(P, out IPlayer Player) ? Player.Position : (-1, -1);

    static int WhereAmILooking(int P) => SIGNAL() && Players.TryGetValue(P, out IPlayer Player) ? Player.WhereAmILooking() : -1;

    static void PickUpRock(int P)
    {
        if (SIGNAL() && Players.TryGetValue(P, out IPlayer Player)) Player.PickUpRock();
    }
    static void PlaceRock(int P, int Color)
    {
        if (SIGNAL() && Players.TryGetValue(P, out IPlayer Player)) Player.PlaceRock((uint)Color);
    }

    static int WhatIsUnder(int P) => SIGNAL() && Players.TryGetValue(P, out IPlayer Player) ? Player.WhatIsUnder() : -1;

    static bool IsAnyThingUnder(int P) => SIGNAL() && Players.TryGetValue(P, out IPlayer Player) && Player.IsThereAnyThingUnder();

    static int Radar(int P) => SIGNAL() && Players.TryGetValue(P, out IPlayer Player) ? Player.Radar() : RadarRange;

    static int Scan(int P) => SIGNAL() && Players.TryGetValue(P, out IPlayer Player) ? Player.Scan() : -1;

    // -----------------------------------------------------------------
    
    static void Kill()
    {
        Thread.Sleep(5000);
        Environment.Exit(0);
    }
    static void Main()
    {
        // new Thread(Kill).Start();
        Parallel.Invoke(Thread1, Thread2);
        // Bar.Dispose();
    }

    /* USER CODE */
    static void Thread1()
    {
        while (true) Turn(0, -1);
    }

    static void Thread2()
    {
        while (true) Step(1);
    }
}