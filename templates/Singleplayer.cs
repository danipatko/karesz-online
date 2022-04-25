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
    static readonly ConcurrentDictionary<(int x, int y), uint> Map_430d0008 = new ConcurrentDictionary<(int x, int y), uint>()
    {
        // Assign map points from template here
        
    };

    static readonly int RadarRange = 10;
    static readonly int ScanRange = 3;

    static void FinishGame_430d0008()
    {
        foreach (IPlayer_430d0008 Player in Players_430d0008.Values) KillPlayer_430d0008(1, ROUND_430d0008, true, Player, "");
        Console.WriteLine(ScoreBoard_430d0008.Count);
        Console.WriteLine($"_430d0008 {{ \"rounds\":{ROUND_430d0008}, \"players\": {string.Join(',', ScoreBoard_430d0008.Values.Select(x => x.ToJson()).ToArray())} }}");
        Environment.Exit(0);
    }

    // get the point one step forward
    static (int x, int y) GetForward_430d0008((int x, int y) Position, int Rotation)
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
    static bool IsOutOfBounds_430d0008((int x, int y) Position) => !(Position.x >= 0 && Position.x < MAP_WIDTH && Position.y >= 0 && Position.y < MAP_HEIGHT);

    // check if players are at a position
    static bool AreTherePlayersHere_430d0008((int x, int y) Position)
    {
        foreach (IPlayer_430d0008 Player in Players_430d0008.Values)
            if (Player.Position == Position) return true;
        return false;
    }

    // check if the position is a map
    static bool IsWall_430d0008((int x, int y) Position) => Map_430d0008.TryGetValue(Position, out uint Value) && Value == 1;
    // check if a point is inside a rectangular area
    static bool IsPointInside_430d0008((int x, int y) Center, (int x, int y) Point, int Range)
    {
        return Point.x >= Center.x - Range && Point.x <= Center.x + Range && Point.y >= Center.y - Range && Point.y <= Center.y + Range;
    }

    // mod operator (for negative values)
    static int Modulus_430d0008(int a, int b) => ((a % b) + b) % b;
    static readonly ConcurrentDictionary<(int x, int y), List<int>> ProposedSteps_430d0008 = new ConcurrentDictionary<(int x, int y), List<int>>();
    static readonly ConcurrentDictionary<int, IPlayer_430d0008> Players_430d0008 = new ConcurrentDictionary<int, IPlayer_430d0008>()
    {
        // add players here
        [0] = new IPlayer_430d0008("vr8-httoyjezci4XAAAB", 0, "sadf", 8, 2, 1)
    };
    static readonly ConcurrentDictionary<int, Score_430d0008> ScoreBoard_430d0008 = new ConcurrentDictionary<int, Score_430d0008>();
    // add player data to scoreboard
    static void KillPlayer_430d0008(int Place, int Round, bool Survived, IPlayer_430d0008 Player, string Reason)
    {
        ScoreBoard_430d0008.TryAdd(Player.Index, new Score_430d0008()
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

    public struct Score_430d0008
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
        public Score_430d0008(string ID, int Placement, string Name, List<int> Steps, bool Survived, string Death, int RoundsAlive, int RocksPlaced, int RocksPickedUp, (int x, int y, int rotation) StartState)
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

    public struct IPlayer_430d0008
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

        public IPlayer_430d0008(string ID, int PlayerIndex, string PlayerName, int StartingPointX, int StartingPointY, int StartingRotation)
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
            Players_430d0008[Index] = this;
        }

        // put own position on proposed steps
        public void Step()
        {
            (int x, int y) OneStepForward = GetForward_430d0008(Position, Rotation);
            // check if position is valid
            if (IsWall_430d0008(OneStepForward))
            {
                KillPlayer_430d0008(Players_430d0008.Count, ROUND_430d0008, false, this, $"{Name} ran into a wall");
                Players_430d0008.TryRemove(Index, out IPlayer_430d0008 _);
                return;
            }
            else if (IsOutOfBounds_430d0008(OneStepForward))
            {
                KillPlayer_430d0008(Players_430d0008.Count, ROUND_430d0008, false, this, $"{Name} attempted to step out of the map");
                Players_430d0008.TryRemove(Index, out IPlayer_430d0008 _);
                return;
            }

            if (ProposedSteps_430d0008.ContainsKey(OneStepForward))
            {
                ProposedSteps_430d0008.TryGetValue(OneStepForward, out List<int> PlayersHere);
                PlayersHere.Add(Index);
            }
            else ProposedSteps_430d0008.TryAdd(OneStepForward, new List<int>() { Index });
            Steps.Add(0);
        }

        // turn left or right
        public void Turn(int Direction)
        {
            Rotation = Modulus_430d0008(Rotation + Direction, 4);
            Steps.Add(Direction == -1 ? 2 : 3);
            Save();
        }

        // check if there's a wall in front
        public bool IsWallAhead()
        {
            Steps.Add(3);
            Save();
            return Map_430d0008.TryGetValue(GetForward_430d0008(Position, Rotation), out uint Field) && Field == 1;
        }

        // check if a step forward is out of bounds
        public bool SteppingOut()
        {
            Steps.Add(4);
            Save();
            return IsOutOfBounds_430d0008(GetForward_430d0008(Position, Rotation));
        }

        // place a rock
        public void PlaceRock(uint Color)
        {
            Steps.Add(20 + (int)Color);
            RocksPlaced++;
            Save();
            Map_430d0008.TryAdd(Position, 20 + Color);
        }

        // pick up rock
        public void PickUpRock()
        {
            Steps.Add(7);
            RocksPickedUp++;
            Save();
            Map_430d0008.TryRemove(Position, out uint _);
        }

        // check current field
        public int WhatIsUnder()
        {
            Steps.Add(8);
            Save();
            return Map_430d0008.TryGetValue(Position, out uint Result) ? (int)Result : 0;
        }

        // check if there is a rock under karesz
        public bool IsThereAnyThingUnder()
        {
            Steps.Add(9);
            Save();
            return Map_430d0008.TryGetValue(Position, out uint Field) && Field > 1;
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
            (int x, int y) P = GetForward_430d0008(Position, Rotation);
            int Steps = 0;
            while (!AreTherePlayersHere_430d0008(P) || !IsWall_430d0008(P))
            {
                // if position is outside of the map, return the default range
                if (IsOutOfBounds_430d0008(P)) return -1;
                // else move forward
                P = GetForward_430d0008(P, Rotation);
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
            foreach (IPlayer_430d0008 Player in Players_430d0008.Values)
                if (IsPointInside_430d0008(Player.Position, Position, ScanRange)) Found++;
            return Found;
        }

        // Do nothing
        public void OmitStep()
        {
            Steps.Add(-1);
            Save();
        }
    }

    static int ROUND_430d0008 = 0;
    static readonly Barrier Bar_430d0008 = new Barrier(/* Number of threads here */2, (b) =>
    {
        // iteration is over -> actually make steps
        List<int> ToRemove = new List<int>();
        foreach (KeyValuePair<(int x, int y), List<int>> PlayersHere in ProposedSteps_430d0008)
        {
            // more than one players stepping on the same field -> everyone dies
            if (PlayersHere.Value.Count > 1)
            {
                foreach (int PlayerID in PlayersHere.Value)
                {
                    if (Players_430d0008.TryGetValue(PlayerID, out IPlayer_430d0008 Player))
                    {
                        KillPlayer_430d0008(Players_430d0008.Count, ROUND_430d0008, false, Player, $"{Player.Name} attempted to step on the same field as {PlayersHere.Value.Count - 1} others.");
                        ToRemove.Add(PlayerID);
                    }
                }
                break;
            }
            // one player stepping on another
            if (Players_430d0008.TryGetValue(PlayersHere.Value[0], out IPlayer_430d0008 Current))
            {
                foreach (IPlayer_430d0008 Player in Players_430d0008.Values)
                {
                    if (Player.Position == PlayersHere.Key && Player.Steps.Last() != 0)
                    {
                        KillPlayer_430d0008(Players_430d0008.Count, ROUND_430d0008, false, Player, $"{Player.Name} was stepped on by {Current.Name}");
                        ToRemove.Add(Player.Index);
                    }
                }
                // make step
                Current.Position = PlayersHere.Key;
                Current.Save();
            }
        }
        // remove players
        foreach (int ID in ToRemove) Players_430d0008.TryRemove(ID, out IPlayer_430d0008 _);

        // check remainder -> add everyone to scoreboard and finish game
        if (Players_430d0008.Count <= MIN_PLAYER_COUNT)
            FinishGame_430d0008();

        ProposedSteps_430d0008.Clear();
        if (ROUND_430d0008 > MAX_ITERATIONS) FinishGame_430d0008();
        ROUND_430d0008++;
    });

    static bool SIGNAL_430d0008()
    {
        Bar_430d0008.SignalAndWait();
        return true;
    }

    // wrapper functions called by players' codes
    static void Step_430d0008(int P)
    {
        if (Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player)) Player.Step();
        SIGNAL_430d0008();
    }

    static void Turn_430d0008(int P, int Direction)
    {
        if (Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player)) Player.Turn(Direction);
        SIGNAL_430d0008();
    }

    static bool AmISteppingOut_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) && Player.SteppingOut();

    static (int x, int y) WhereAmI_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) ? Player.Position : (-1, -1);

    static int WhereAmILooking_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) ? Player.WhereAmILooking() : -1;

    static bool AmILookingAt_430d0008(int P, int Direction) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) && Player.AmILookingAt(Direction);

    static bool IsThereAWall_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) && Player.IsWallAhead();

    static void PickUpRock_430d0008(int P)
    {
        if (SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player)) Player.PickUpRock();
    }
    static void PlaceRock_430d0008(int P, int Color)
    {
        if (SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player)) Player.PlaceRock((uint)Math.Clamp(Color, 2, 100));
    }

    static int WhatIsUnder_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) ? Player.WhatIsUnder() : -1;

    static bool IsAnyThingUnder_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) && Player.IsThereAnyThingUnder();

    static int Radar_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) ? Player.Radar() : RadarRange;

    static int Scan_430d0008(int P) => SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player) ? Player.Scan() : -1;

    static void Omit_430d0008(int P)
    {
        if (SIGNAL_430d0008() && Players_430d0008.TryGetValue(P, out IPlayer_430d0008 Player)) Player.OmitStep();
    }

    // -----------------------------------------------------------------

    static void Main()
    {
        new Thread(() => { Thread.Sleep(TIMEOUT); FinishGame_430d0008(); }).Start();
        Parallel.Invoke(Thread0_430d0008);
    }

    /* USER CODE */
    /* --- sadf's code --- */
// Start your code here...
static void Thread0_430d0008() {
    while(true) Step_430d0008(0);
}

    
}