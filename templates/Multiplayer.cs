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
    static readonly ConcurrentDictionary<(int x, int y), uint> Map__ = new ConcurrentDictionary<(int x, int y), uint>()
    {
        // Assign map points from template here
        [(0, 0)] = 1,
        [(0, 1)] = 1,
        [(4, 3)] = 4,
    };

    static readonly int RadarRange = 10;
    static readonly int ScanRange = 3;

    static void FinishGame__()
    {
        Console.WriteLine($"KEYHERE {{ \"rounds\":{ROUND__}, \"players\": {{ {string.Join(',', ScoreBoard__.Values.Select(x => x.ToJson()))} }} }}");
        Environment.Exit(0);
    }

    // get the point one step forward
    static (int x, int y) GetForward__((int x, int y) Position, int Rotation)
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
    static bool IsOutOfBounds__((int x, int y) Position) => !(Position.x >= 0 && Position.x < MAP_WIDTH && Position.y >= 0 && Position.y < MAP_HEIGHT);

    // check if players are at a position
    static bool AreTherePlayersHere__((int x, int y) Position)
    {
        foreach (IPlayer__ Player in Players__.Values)
            if (Player.Position == Position) return true;
        return false;
    }

    // check if the position is a map
    static bool IsWall__((int x, int y) Position) => Map__.TryGetValue(Position, out uint Value) && Value == 1;
    // check if a point is inside a rectangular area
    static bool IsPointInside__((int x, int y) Center, (int x, int y) Point, int Range)
    {
        return Point.x >= Center.x - Range && Point.x <= Center.x + Range && Point.y >= Center.y - Range && Point.y <= Center.y + Range;
    }

    // mod operator (for negative values too)
    static int Modulus__(int a, int b) => ((a % b) + b) % b;
    static readonly ConcurrentDictionary<(int x, int y), List<int>> ProposedSteps__ = new ConcurrentDictionary<(int x, int y), List<int>>();
    static readonly ConcurrentDictionary<int, IPlayer__> Players__ = new ConcurrentDictionary<int, IPlayer__>()
    {
        [0] = new IPlayer__("0", 0, "sany", 4, 4, 0),
        [1] = new IPlayer__("1", 1, "karex", 6, 6, 0)
    };
    static readonly ConcurrentDictionary<int, Score__> ScoreBoard__ = new ConcurrentDictionary<int, Score__>();
    // add player data to scoreboard
    static void KillPlayer__(int Place, int Round, bool Survived, IPlayer__ Player, string Reason)
    {
        ScoreBoard__.TryAdd(Player.Index, new Score__()
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

    public struct Score__
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
        public Score__(string ID, int Placement, string Name, List<int> Steps, bool Survived, string Death, int RoundsAlive, int RocksPlaced, int RocksPickedUp, (int x, int y, int rotation) StartState)
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

    public struct IPlayer__
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

        public IPlayer__(string ID, int PlayerIndex, string PlayerName, int StartingPointX, int StartingPointY, int StartingRotation)
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
            Players__[Index] = this;
        }

        // put own position on proposed steps
        public void Step()
        {
            (int x, int y) OneStepForward = GetForward__(Position, Rotation);
            // check if position is valid
            if (IsWall__(OneStepForward))
            {
                KillPlayer__(Players__.Count, ROUND__, false, this, $"{Name} ran into a wall");
                Players__.TryRemove(Index, out IPlayer__ _);
                return;
            }
            else if (IsOutOfBounds__(OneStepForward))
            {
                KillPlayer__(Players__.Count, ROUND__, false, this, $"{Name} attempted to step out of the map");
                Players__.TryRemove(Index, out IPlayer__ _);
                return;
            }

            if (ProposedSteps__.ContainsKey(OneStepForward))
            {
                ProposedSteps__.TryGetValue(OneStepForward, out List<int> PlayersHere);
                PlayersHere.Add(Index);
            }
            else ProposedSteps__.TryAdd(OneStepForward, new List<int>() { Index });
            Steps.Add(0);
        }

        // turn left or right
        public void Turn(int Direction)
        {
            Rotation = Modulus__(Rotation + Direction, 4);
            Steps.Add(Direction == -1 ? 2 : 3);
            Save();
        }

        // check if there's a wall in front
        public bool IsWallAhead()
        {
            Steps.Add(3);
            Save();
            return Map__.TryGetValue(GetForward__(Position, Rotation), out uint Field) && Field == 1;
        }

        // check if a step forward is out of bounds
        public bool SteppingOut()
        {
            Steps.Add(4);
            Save();
            return IsOutOfBounds__(GetForward__(Position, Rotation));
        }

        // place a rock
        public void PlaceRock(uint Color)
        {
            Steps.Add(20 + (int)Color);
            RocksPlaced++;
            Save();
            Map__.TryAdd(Position, 20 + Color);
        }

        // pick up rock
        public void PickUpRock()
        {
            Steps.Add(7);
            RocksPickedUp++;
            Save();
            Map__.TryRemove(Position, out uint _);
        }

        // check current field
        public int WhatIsUnder()
        {
            Steps.Add(8);
            Save();
            return Map__.TryGetValue(Position, out uint Result) ? (int)Result : 0;
        }

        // check if there is a rock under karesz
        public bool IsThereAnyThingUnder()
        {
            Steps.Add(9);
            Save();
            return Map__.TryGetValue(Position, out uint Field) && Field > 1;
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
            (int x, int y) P = GetForward__(Position, Rotation);
            int Steps = 0;
            while (!AreTherePlayersHere__(P) || !IsWall__(P))
            {
                // if position is outside of the map, return the default range
                if (IsOutOfBounds__(P)) return -1;
                // else move forward
                P = GetForward__(P, Rotation);
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
            foreach (IPlayer__ Player in Players__.Values)
                if (IsPointInside__(Player.Position, Position, ScanRange)) Found++;
            return Found;
        }

        // Do nothing
        public void OmitStep()
        {
            Steps.Add(-1);
            Save();
        }
    }

    static int ROUND__ = 0;
    static readonly Barrier Bar__ = new Barrier(/* Number of threads here */2, (b) =>
    {
        // iteration is over -> actually make steps
        List<int> ToRemove = new List<int>();
        foreach (KeyValuePair<(int x, int y), List<int>> PlayersHere in ProposedSteps__)
        {
            // more than one players stepping on the same field -> everyone dies
            if (PlayersHere.Value.Count > 1)
            {
                foreach (int PlayerID in PlayersHere.Value)
                {
                    if (Players__.TryGetValue(PlayerID, out IPlayer__ Player))
                    {
                        KillPlayer__(Players__.Count, ROUND__, false, Player, $"{Player.Name} attempted to step on the same field as {PlayersHere.Value.Count - 1} others.");
                        ToRemove.Add(PlayerID);
                    }
                }
                break;
            }
            // one player stepping on another
            if (Players__.TryGetValue(PlayersHere.Value[0], out IPlayer__ Current))
            {
                foreach (IPlayer__ Player in Players__.Values)
                {
                    if (Player.Position == PlayersHere.Key && Player.Steps.Last() != 0)
                    {
                        KillPlayer__(Players__.Count, ROUND__, false, Player, $"{Player.Name} was stepped on by {Current.Name}");
                        ToRemove.Add(Player.Index);
                    }
                }
                // make step
                Current.Position = PlayersHere.Key;
                Current.Save();
            }
        }
        // remove players
        foreach (int ID in ToRemove) Players__.TryRemove(ID, out IPlayer__ _);

        // check remainder -> add everyone to scoreboard and finish game
        if (Players__.Count <= MIN_PLAYER_COUNT)
        {
            foreach (IPlayer__ Player in Players__.Values) KillPlayer__(1, ROUND__, true, Player, "");
            FinishGame__();
        }

        ProposedSteps__.Clear();
        if (ROUND__ > MAX_ITERATIONS) FinishGame__();
        ROUND__++;
    });

    static bool SIGNAL__()
    {
        Bar__.SignalAndWait();
        return true;
    }

    // wrapper functions called by players' codes
    static void Step__(int P)
    {
        if (Players__.TryGetValue(P, out IPlayer__ Player)) Player.Step();
        SIGNAL__();
    }

    static void Turn__(int P, int Direction)
    {
        if (Players__.TryGetValue(P, out IPlayer__ Player)) Player.Turn(Direction);
        SIGNAL__();
    }

    static bool AmISteppingOut__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) && Player.SteppingOut();

    static (int x, int y) WhereAmI__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) ? Player.Position : (-1, -1);

    static int WhereAmILooking__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) ? Player.WhereAmILooking() : -1;

    static bool AmILookingAt__(int P, int Direction) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) && Player.AmILookingAt(Direction);

    static bool IsThereAWall__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) && Player.IsWallAhead();

    static void PickUpRock__(int P)
    {
        if (SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player)) Player.PickUpRock();
    }
    static void PlaceRock__(int P, int Color)
    {
        if (SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player)) Player.PlaceRock((uint)Math.Clamp(Color, 2, 100));
    }

    static int WhatIsUnder__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) ? Player.WhatIsUnder() : -1;

    static bool IsAnyThingUnder__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) && Player.IsThereAnyThingUnder();

    static int Radar__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) ? Player.Radar() : RadarRange;

    static int Scan__(int P) => SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player) ? Player.Scan() : -1;

    static void Omit__(int P)
    {
        if (SIGNAL__() && Players__.TryGetValue(P, out IPlayer__ Player)) Player.OmitStep();
    }

    // -----------------------------------------------------------------

    static void Main()
    {
        new Thread(() => { Thread.Sleep(TIMEOUT); FinishGame__(); }).Start();
        Parallel.Invoke(Thread1, Thread2);
    }

    /* USER CODE */
    static void Thread1()
    {
        while (true) Step__(0);
    }

    static void Thread2()
    {
        while (true) Turn__(1, 1);
    }
}