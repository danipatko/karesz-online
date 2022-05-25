import { PlayerStartState, TemplateSettings } from '../types';
import { MULITPLAYER_IMPORTS } from '../config';
import { stringToPoint } from '../../shared/util';

const getMultiPlayerTemplate = (
    rand: string,
    settings: TemplateSettings,
    players: PlayerStartState[]
) => `// allowed imports
${MULITPLAYER_IMPORTS.map((x) => `using ${x};`).join('\n')}

class Program
{
    // the number of steps each player can do
    static readonly int MAX_ITERATIONS = ${settings.MAX_ITERATIONS};
    // termination timeout in ms
    static readonly int TIMEOUT = ${settings.TIMEOUT};
    // the number of players to stop the game (the game finishes if this many players are alive)
    static readonly int MIN_PLAYER_COUNT = ${settings.MIN_PLAYERS};
    // add map dimensions from template here
    static readonly int MAP_WIDTH = ${settings.MAP_WIDTH};
    static readonly int MAP_HEIGHT = ${settings.MAP_HEIGHT};
    // to look up map objects
    static readonly ConcurrentDictionary<(int x, int y), uint> Map${rand} = new ConcurrentDictionary<(int x, int y), uint>()
    {
        // Assign map points from template here
        ${Array.from(settings.MAP_OBJECTS.entries())
            .map(([key, value]) => {
                const [x, y] = stringToPoint(key);
                return `[(${x},${y})]=${value}`;
            })
            .join(',')}
    };

    static readonly int RadarRange = 10;
    static readonly int ScanRange = 3;

    static void FinishGame${rand}()
    {
        foreach (IPlayer${rand} Player in Players${rand}.Values) KillPlayer${rand}(1, ROUND${rand}, true, Player, "");
        System.Console.WriteLine($"{{ \\"rounds\\":{ROUND${rand}}, \\"players\\": {{ {string.Join(',', ScoreBoard${rand}.Values.Select(x => x.ToJson()).ToArray())} }} }}");
        System.Environment.Exit(0);
    }

    // get the point one step forward
    static (int x, int y) GetForward${rand}((int x, int y) Position, int Rotation)
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
    static bool IsOutOfBounds${rand}((int x, int y) Position) => !(Position.x >= 0 && Position.x < MAP_WIDTH && Position.y >= 0 && Position.y < MAP_HEIGHT);

    // check if players are at a position
    static bool AreTherePlayersHere${rand}((int x, int y) Position)
    {
        foreach (IPlayer${rand} Player in Players${rand}.Values)
            if (Player.Position == Position) return true;
        return false;
    }

    // check if the position is a map
    static bool IsWall${rand}((int x, int y) Position) => Map${rand}.TryGetValue(Position, out uint Value) && Value == 1;
    // check if a point is inside a rectangular area
    static bool IsPointInside${rand}((int x, int y) Center, (int x, int y) Point, int Range)
    {
        return Point.x >= Center.x - Range && Point.x <= Center.x + Range && Point.y >= Center.y - Range && Point.y <= Center.y + Range;
    }

    // mod operator (for negative values)
    static int Modulus${rand}(int a, int b) => ((a % b) + b) % b;
    static readonly ConcurrentDictionary<(int x, int y), List<int>> ProposedSteps${rand} = new ConcurrentDictionary<(int x, int y), List<int>>();
    static readonly ConcurrentDictionary<int, IPlayer${rand}> Players${rand} = new ConcurrentDictionary<int, IPlayer${rand}>()
    {
        // add players here
        ${players
            .map(
                (p, i) =>
                    `[${i}] = new IPlayer${rand}("${p.id}", ${i}, "${p.name}", ${p.x}, ${p.y}, ${p.rotation})`
            )
            .join(',')}
    };
    static readonly ConcurrentDictionary<int, Score${rand}> ScoreBoard${rand} = new ConcurrentDictionary<int, Score${rand}>();
    // add player data to scoreboard
    static void KillPlayer${rand}(int Place, int Round, bool Survived, IPlayer${rand} Player, string Reason)
    {
        ScoreBoard${rand}.TryAdd(Player.Index, new Score${rand}()
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

    public struct Score${rand}
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
        public Score${rand}(string ID, int Placement, string Name, List<int> Steps, bool Survived, string Death, int RoundsAlive, int RocksPlaced, int RocksPickedUp, (int x, int y, int rotation) StartState)
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
            return $"\\"{ID}\\": {{ \\"placement\\":{Placement}, \\"name\\":\\"{Name}\\", \\"started\\": {{ \\"x\\":{StartState.x}, \\"y\\":{StartState.y}, \\"rotation\\":{StartState.rotation} }}, \\"survived\\":{(Survived ? "true" : "false")}, \\"death\\":\\"{Death}\\",  \\"alive\\":{RoundsAlive}, \\"rocks\\":{{ \\"placed\\":{RocksPlaced}, \\"picked_up\\":{RocksPickedUp} }}, \\"steps\\":[{string.Join(',', Steps)}] }}";
        }
    }

    public struct IPlayer${rand}
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

        public IPlayer${rand}(string ID, int PlayerIndex, string PlayerName, int StartingPointX, int StartingPointY, int StartingRotation)
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
            Players${rand}[Index] = this;
        }

        // put own position on proposed steps
        public void Step()
        {
            (int x, int y) OneStepForward = GetForward${rand}(Position, Rotation);
            // check if position is valid
            if (IsWall${rand}(OneStepForward))
            {
                KillPlayer${rand}(Players${rand}.Count, ROUND${rand}, false, this, $"{Name} ran into a wall");
                Players${rand}.TryRemove(Index, out IPlayer${rand} _);
                return;
            }
            else if (IsOutOfBounds${rand}(OneStepForward))
            {
                KillPlayer${rand}(Players${rand}.Count, ROUND${rand}, false, this, $"{Name} attempted to step out of the map");
                Players${rand}.TryRemove(Index, out IPlayer${rand} _);
                return;
            }

            if (ProposedSteps${rand}.ContainsKey(OneStepForward))
            {
                ProposedSteps${rand}.TryGetValue(OneStepForward, out List<int> PlayersHere);
                PlayersHere.Add(Index);
            }
            else ProposedSteps${rand}.TryAdd(OneStepForward, new List<int>() { Index });
            Steps.Add(0);
        }

        // turn left or right
        public void Turn(int Direction)
        {
            Rotation = Modulus${rand}(Rotation + Direction, 4);
            Steps.Add(Direction == -1 ? 2 : 3);
            Save();
        }

        // check if there's a wall in front
        public bool IsWallAhead()
        {
            Steps.Add(3);
            Save();
            return Map${rand}.TryGetValue(GetForward${rand}(Position, Rotation), out uint Field) && Field == 1;
        }

        // check if a step forward is out of bounds
        public bool SteppingOut()
        {
            Steps.Add(4);
            Save();
            return IsOutOfBounds${rand}(GetForward${rand}(Position, Rotation));
        }

        // place a rock
        public void PlaceRock(uint Color)
        {
            Steps.Add(20 + (int)Color);
            RocksPlaced++;
            Save();
            Map${rand}.TryAdd(Position, 20 + Color);
        }

        // pick up rock
        public void PickUpRock()
        {
            Steps.Add(7);
            RocksPickedUp++;
            Save();
            Map${rand}.TryRemove(Position, out uint _);
        }

        // check current field
        public int WhatIsUnder()
        {
            Steps.Add(8);
            Save();
            return Map${rand}.TryGetValue(Position, out uint Result) ? (int)Result : 0;
        }

        // check if there is a rock under karesz
        public bool IsThereAnyThingUnder()
        {
            Steps.Add(9);
            Save();
            return Map${rand}.TryGetValue(Position, out uint Field) && Field > 1;
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
            (int x, int y) P = GetForward${rand}(Position, Rotation);
            int Steps = 0;
            while (!AreTherePlayersHere${rand}(P) || !IsWall${rand}(P) || Steps <= RadarRange)
            {
                // if position is outside of the map, return the default range
                if (IsOutOfBounds${rand}(P)) return -1;
                // else move forward
                P = GetForward${rand}(P, Rotation);
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
            foreach (IPlayer${rand} Player in Players${rand}.Values)
                if (IsPointInside${rand}(Player.Position, Position, ScanRange)) Found++;
            return Found;
        }

        // check the number of players nearby
        public (int x, int y) WhereAmI()
        {
            Steps.Add(12);
            Save();
            return Position;
        }

        // Do nothing
        public void OmitStep()
        {
            Steps.Add(-1);
            Save();
        }
    }

    static int ROUND${rand} = 0;
    static readonly Barrier Bar${rand} = new Barrier(/* Number of threads here */2, (b) =>
    {
        // iteration is over -> actually make steps
        List<int> ToRemove = new List<int>();
        foreach (KeyValuePair<(int x, int y), List<int>> PlayersHere in ProposedSteps${rand})
        {
            // more than one players stepping on the same field -> everyone dies
            if (PlayersHere.Value.Count > 1)
            {
                foreach (int PlayerID in PlayersHere.Value)
                {
                    if (Players${rand}.TryGetValue(PlayerID, out IPlayer${rand} Player))
                    {
                        KillPlayer${rand}(Players${rand}.Count, ROUND${rand}, false, Player, $"{Player.Name} attempted to step on the same field as {PlayersHere.Value.Count - 1} others.");
                        ToRemove.Add(PlayerID);
                    }
                }
                break;
            }
            // one player stepping on another
            if (Players${rand}.TryGetValue(PlayersHere.Value[0], out IPlayer${rand} Current))
            {
                foreach (IPlayer${rand} Player in Players${rand}.Values)
                {
                    if (Player.Position == PlayersHere.Key && Player.Steps.Last() != 0)
                    {
                        KillPlayer${rand}(Players${rand}.Count, ROUND${rand}, false, Player, $"{Player.Name} was stepped on by {Current.Name}");
                        ToRemove.Add(Player.Index);
                    }
                }
                // make step
                Current.Position = PlayersHere.Key;
                Current.Save();
            }
        }
        // remove players
        foreach (int ID in ToRemove) Players${rand}.TryRemove(ID, out IPlayer${rand} _);

        // check remainder -> add everyone to scoreboard and finish game
        if (Players${rand}.Count <= MIN_PLAYER_COUNT)
            FinishGame${rand}();

        ProposedSteps${rand}.Clear();
        if (ROUND${rand} > MAX_ITERATIONS) FinishGame${rand}();
        ROUND${rand}++;
    });

    static bool SIGNAL${rand}()
    {
        Bar${rand}.SignalAndWait();
        return true;
    }

    // wrapper functions called by players' codes
    static void Step${rand}(int P)
    {
        if (Players${rand}.TryGetValue(P, out IPlayer${rand} Player)) Player.Step();
        SIGNAL${rand}();
    }

    static void Turn${rand}(int P, int Direction)
    {
        if (Players${rand}.TryGetValue(P, out IPlayer${rand} Player)) Player.Turn(Direction);
        SIGNAL${rand}();
    }

    static bool AmISteppingOut${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) && Player.SteppingOut();

    static (int x, int y) WhereAmI${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) ? Player.WhereAmI() : (-1, -1);

    static int WhereAmILooking${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) ? Player.WhereAmILooking() : -1;

    static bool AmILookingAt${rand}(int P, int Direction) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) && Player.AmILookingAt(Direction);

    static bool IsThereAWall${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) && Player.IsWallAhead();

    static void PickUpRock${rand}(int P)
    {
        if (SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player)) Player.PickUpRock();
    }
    static void PlaceRock${rand}(int P, int Color)
    {
        if (SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player)) Player.PlaceRock((uint)System.Math.Clamp(Color, 2, 100));
    }

    static int WhatIsUnder${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) ? Player.WhatIsUnder() : -1;

    static bool IsAnyThingUnder${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) && Player.IsThereAnyThingUnder();

    static int Radar${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) ? Player.Radar() : -1;

    static int Scan${rand}(int P) => SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player) ? Player.Scan() : -1;

    static void Omit${rand}(int P)
    {
        if (SIGNAL${rand}() && Players${rand}.TryGetValue(P, out IPlayer${rand} Player)) Player.OmitStep();
    }

    // -----------------------------------------------------------------

    static void Main()
    {
        new Thread(() => { Thread.Sleep(TIMEOUT); FinishGame${rand}(); }).Start();
        System.Threading.Tasks.Parallel.Invoke(${Object.keys(players).map(
            (_, i) => `Thread${i}${rand}`
        )});
    }

    /* USER CODE */
    ${players
        .map((player) => `/* --- ${player.name}'s code --- */\n${player.code}`)
        .join('\n')}
    
}`;

export default getMultiPlayerTemplate;
