// allowed imports
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Collections.Concurrent;

class Program
{
    // the number of steps each player can do
    static readonly int MAX_ITERATIONS = 5000;
    // termination timeout in ms
    static readonly int TIMEOUT = 5000;
    // the number of players to stop the game (the game finishes if this many players are alive)
    static readonly int MIN_PLAYER_COUNT = 1;
    // add map dimensions from template here
    static readonly int MAP_WIDTH = 20;
    static readonly int MAP_HEIGHT = 20;
    // to look up map objects
    static readonly ConcurrentDictionary<(int x, int y), uint> Map_3918395a = new ConcurrentDictionary<(int x, int y), uint>()
    {
        // Assign map points from template here
        
    };

    static readonly int RadarRange = 10;
    static readonly int ScanRange = 3;

    static void FinishGame_3918395a()
    {
        Console.WriteLine($"_3918395a {{ "rounds":{ROUND_3918395a}, "players": {string.Join(',', ScoreBoard_3918395a.Values.Select(x => x.ToJson()))} }}");
        Environment.Exit(0);
    }

    // get the point one step forward
    static (int x, int y) GetForward_3918395a((int x, int y) Position, int Rotation)
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
    static bool IsOutOfBounds_3918395a((int x, int y) Position) => !(Position.x >= 0 && Position.x < MAP_WIDTH && Position.y >= 0 && Position.y < MAP_HEIGHT);

    // check if players are at a position
    static bool AreTherePlayersHere_3918395a((int x, int y) Position)
    {
        foreach (IPlayer_3918395a Player in Players_3918395a.Values)
            if (Player.Position == Position) return true;
        return false;
    }

    // check if the position is a map
    static bool IsWall_3918395a((int x, int y) Position) => Map_3918395a.TryGetValue(Position, out uint Value) && Value == 1;
    // check if a point is inside a rectangular area
    static bool IsPointInside_3918395a((int x, int y) Center, (int x, int y) Point, int Range)
    {
        return Point.x >= Center.x - Range && Point.x <= Center.x + Range && Point.y >= Center.y - Range && Point.y <= Center.y + Range;
    }

    // mod operator (for negative values)
    static int Modulus_3918395a(int a, int b) => ((a % b) + b) % b;
    static readonly ConcurrentDictionary<(int x, int y), List<int>> ProposedSteps_3918395a = new ConcurrentDictionary<(int x, int y), List<int>>();
    static readonly ConcurrentDictionary<int, IPlayer_3918395a> Players_3918395a = new ConcurrentDictionary<int, IPlayer_3918395a>()
    {
        // add players here
        
    };
    static readonly ConcurrentDictionary<int, Score_3918395a> ScoreBoard_3918395a = new ConcurrentDictionary<int, Score_3918395a>();
    // add player data to scoreboard
    static void KillPlayer_3918395a(int Place, int Round, bool Survived, IPlayer_3918395a Player, string Reason)
    {
        ScoreBoard_3918395a.TryAdd(Player.Index, new Score_3918395a()
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

    public struct Score_3918395a
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
        public Score_3918395a(string ID, int Placement, string Name, List<int> Steps, bool Survived, string Death, int RoundsAlive, int RocksPlaced, int RocksPickedUp, (int x, int y, int rotation) StartState)
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
            return $""{ID}": {{ "placement":{Placement}, "name":"{Name}", "started": {{ "x":{StartState.x}, "y":{StartState.y}, "rotation":{StartState.rotation} }}, "survived":{(Survived ? "true" : "false")}, "death":"{Death}",  "alive":{RoundsAlive}, "rocks":{{ "placed":{RocksPlaced}, "picked_up":{RocksPickedUp} }}, "steps":[{string.Join(',', Steps)}] }}";
        }
    }

    public struct IPlayer_3918395a
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

        public IPlayer_3918395a(string ID, int PlayerIndex, string PlayerName, int StartingPointX, int StartingPointY, int StartingRotation)
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
            Players_3918395a[Index] = this;
        }

        // put own position on proposed steps
        public void Step()
        {
            (int x, int y) OneStepForward = GetForward_3918395a(Position, Rotation);
            // check if position is valid
            if (IsWall_3918395a(OneStepForward))
            {
                KillPlayer_3918395a(Players_3918395a.Count, ROUND_3918395a, false, this, $"{Name} ran into a wall");
                Players_3918395a.TryRemove(Index, out IPlayer_3918395a _);
                return;
            }
            else if (IsOutOfBounds_3918395a(OneStepForward))
            {
                KillPlayer_3918395a(Players_3918395a.Count, ROUND_3918395a, false, this, $"{Name} attempted to step out of the map");
                Players_3918395a.TryRemove(Index, out IPlayer_3918395a _);
                return;
            }

            if (ProposedSteps_3918395a.ContainsKey(OneStepForward))
            {
                ProposedSteps_3918395a.TryGetValue(OneStepForward, out List<int> PlayersHere);
                PlayersHere.Add(Index);
            }
            else ProposedSteps_3918395a.TryAdd(OneStepForward, new List<int>() { Index });
            Steps.Add(0);
        }

        // turn left or right
        public void Turn(int Direction)
        {
            Rotation = Modulus_3918395a(Rotation + Direction, 4);
            Steps.Add(Direction == -1 ? 2 : 3);
            Save();
        }

        // check if there's a wall in front
        public bool IsWallAhead()
        {
            Steps.Add(3);
            Save();
            return Map_3918395a.TryGetValue(GetForward_3918395a(Position, Rotation), out uint Field) && Field == 1;
        }

        // check if a step forward is out of bounds
        public bool SteppingOut()
        {
            Steps.Add(4);
            Save();
            return IsOutOfBounds_3918395a(GetForward_3918395a(Position, Rotation));
        }

        // place a rock
        public void PlaceRock(uint Color)
        {
            Steps.Add(20 + (int)Color);
            RocksPlaced++;
            Save();
            Map_3918395a.TryAdd(Position, 20 + Color);
        }

        // pick up rock
        public void PickUpRock()
        {
            Steps.Add(7);
            RocksPickedUp++;
            Save();
            Map_3918395a.TryRemove(Position, out uint _);
        }

        // check current field
        public int WhatIsUnder()
        {
            Steps.Add(8);
            Save();
            return Map_3918395a.TryGetValue(Position, out uint Result) ? (int)Result : 0;
        }

        // check if there is a rock under karesz
        public bool IsThereAnyThingUnder()
        {
            Steps.Add(9);
            Save();
            return Map_3918395a.TryGetValue(Position, out uint Field) && Field > 1;
        }

        // check direction
        public int WhereAmILooking()
        {
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
            (int x, int y) P = GetForward_3918395a(Position, Rotation);
            int Steps = 0;
            while (!AreTherePlayersHere_3918395a(P) || !IsWall_3918395a(P))
            {
                // if position is outside of the map, return the default range
                if (IsOutOfBounds_3918395a(P)) return -1;
                // else move forward
                P = GetForward_3918395a(P, Rotation);
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
            foreach (IPlayer_3918395a Player in Players_3918395a.Values)
                if (IsPointInside_3918395a(Player.Position, Position, ScanRange)) Found++;
            return Found;
        }

        // Do nothing
        public void OmitStep()
        {
            Steps.Add(-1);
            Save();
        }
    }

    static int ROUND_3918395a = 0;
    static readonly Barrier Bar_3918395a = new Barrier(/* Number of threads here */2, (b) =>
    {
        // iteration is over -> actually make steps
        List<int> ToRemove = new List<int>();
        foreach (KeyValuePair<(int x, int y), List<int>> PlayersHere in ProposedSteps_3918395a)
        {
            // more than one players stepping on the same field -> everyone dies
            if (PlayersHere.Value.Count > 1)
            {
                foreach (int PlayerID in PlayersHere.Value)
                {
                    if (Players_3918395a.TryGetValue(PlayerID, out IPlayer_3918395a Player))
                    {
                        KillPlayer_3918395a(Players_3918395a.Count, ROUND_3918395a, false, Player, $"{Player.Name} attempted to step on the same field as {PlayersHere.Value.Count - 1} others.");
                        ToRemove.Add(PlayerID);
                    }
                }
                break;
            }
            // one player stepping on another
            if (Players_3918395a.TryGetValue(PlayersHere.Value[0], out IPlayer_3918395a Current))
            {
                foreach (IPlayer_3918395a Player in Players_3918395a.Values)
                {
                    if (Player.Position == PlayersHere.Key && Player.Steps.Last() != 0)
                    {
                        KillPlayer_3918395a(Players_3918395a.Count, ROUND_3918395a, false, Player, $"{Player.Name} was stepped on by {Current.Name}");
                        ToRemove.Add(Player.Index);
                    }
                }
                // make step
                Current.Position = PlayersHere.Key;
                Current.Save();
            }
        }
        // remove players
        foreach (int ID in ToRemove) Players_3918395a.TryRemove(ID, out IPlayer_3918395a _);

        // check remainder -> add everyone to scoreboard and finish game
        if (Players_3918395a.Count <= MIN_PLAYER_COUNT)
        {
            foreach (IPlayer_3918395a Player in Players_3918395a.Values) KillPlayer_3918395a(1, ROUND_3918395a, true, Player, "");
            FinishGame_3918395a();
        }

        ProposedSteps_3918395a.Clear();
        if (ROUND_3918395a > MAX_ITERATIONS) FinishGame_3918395a();
        ROUND_3918395a++;
    });

    static bool SIGNAL_3918395a()
    {
        Bar_3918395a.SignalAndWait();
        return true;
    }

    // wrapper functions called by players' codes
    static void Step_3918395a(int P)
    {
        if (Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player)) Player.Step();
        SIGNAL_3918395a();
    }

    static void Turn_3918395a(int P, int Direction)
    {
        if (Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player)) Player.Turn(Direction);
        SIGNAL_3918395a();
    }

    static bool AmISteppingOut_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) && Player.SteppingOut();

    static (int x, int y) WhereAmI_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) ? Player.Position : (-1, -1);

    static int WhereAmILooking_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) ? Player.WhereAmILooking() : -1;

    static bool AmILookingAt_3918395a(int P, int Direction) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) && Player.AmILookingAt(Direction);

    static bool IsThereAWall_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) && Player.IsWallAhead();

    static void PickUpRock_3918395a(int P)
    {
        if (SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player)) Player.PickUpRock();
    }
    static void PlaceRock_3918395a(int P, int Color)
    {
        if (SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player)) Player.PlaceRock((uint)Math.Clamp(Color, 2, 100));
    }

    static int WhatIsUnder_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) ? Player.WhatIsUnder() : -1;

    static bool IsAnyThingUnder_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) && Player.IsThereAnyThingUnder();

    static int Radar_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) ? Player.Radar() : RadarRange;

    static int Scan_3918395a(int P) => SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player) ? Player.Scan() : -1;

    static void Omit_3918395a(int P)
    {
        if (SIGNAL_3918395a() && Players_3918395a.TryGetValue(P, out IPlayer_3918395a Player)) Player.OmitStep();
    }

    // -----------------------------------------------------------------

    static void Main()
    {
        new Thread(() => { Thread.Sleep(TIMEOUT); Environment.Exit(0); }).Start();
        Parallel.Invoke();
    }

    /* USER CODE */
    
    
}