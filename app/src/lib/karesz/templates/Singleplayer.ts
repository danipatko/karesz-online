import { TemplateSettings } from '../types';
import { stringToPoint } from '../../shared/util';
import { SINGLEPLAYER_IMPORTS } from '../config';

const getSinglePlayerTemplate = (
    rand: string,
    settings: TemplateSettings,
    player: {
        x: number;
        y: number;
        rotation: number;
        code: string;
    },
    map?: string
) => `// allowed imports
${SINGLEPLAYER_IMPORTS.map((x) => `using ${x};`).join('\n')}

class Program
{
    // termination timeout in ms
    static readonly int TIMEOUT = ${settings.TIMEOUT};
    // add map dimensions from template here
    static readonly int MAP_WIDTH = ${settings.MAP_WIDTH};
    static readonly int MAP_HEIGHT = ${settings.MAP_HEIGHT};
    static int ROUNDS${rand} = 0;

    static bool _i${rand}() {
        ROUNDS${rand}++;
        if(ROUNDS${rand} > ${
    settings.MAX_ITERATIONS
}) FinishGame${rand}("Reached maximum number of rounds");
        return true;
    }

    // to look up map objects
    static readonly Dictionary<(int x, int y), uint> Map${rand} = new Dictionary<(int x, int y), uint>()
    {
        // Assign map points from template here
        ${
            map
                ? map
                : Array.from(settings.MAP_OBJECTS.entries())
                      .map(([key, value]) => {
                          const [x, y] = stringToPoint(key);
                          return `[(${x},${y})]=${value}`;
                      })
                      .join(',')
        }
    };

    static readonly int RadarRange = 10;

    // data about self
    static int Rotation${rand} = ${player.rotation}; // starting rotation
    static (int x, int y) Position${rand} = (${player.x}, ${
    player.y
}); // starting position
    static int RocksPickedUp${rand} = 0;
    static int RocksPlaced${rand} = 0;
    static readonly List<int> Steps${rand} = new List<int>();

    static void FinishGame${rand}(string Reason)
    {
        System.Console.WriteLine($"{{ \\"ended\\":\\"{Reason}\\", \\"steps\\":[{string.Join(',', Steps${rand}.ToArray())}], \\"rocks\\": {{ \\"placed\\":{RocksPlaced${rand}}, \\"picked_up\\":{RocksPickedUp${rand}} }}, \\"start\\": {{ \\"x\\":${
    player.x
}, \\"y\\":${player.y}, \\"rotation\\":${player.rotation} }} }}");
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
    static bool IsOutOfBounds${rand}((int x, int y) Position) => _i${rand}() && !(Position.x >= 0 && Position.x < MAP_WIDTH && Position.y >= 0 && Position.y < MAP_HEIGHT);

    // check if the position is a map
    static bool IsWall${rand}((int x, int y) Position) => _i${rand}() && Map${rand}.TryGetValue(Position, out uint Value) && Value == 1;
    
    // mod operator (for negative values)
    static int Modulus${rand}(int a, int b) => ((a % b) + b) % b;

    // wrapper functions called by players' codes
    static void Step${rand}()
    {
        _i${rand}();
        (int x, int y) OneStepForward = GetForward${rand}(Position${rand}, Rotation${rand});
        // check if position is valid
        if (IsWall${rand}(OneStepForward)) FinishGame${rand}("ran into a wall");
        else if (IsOutOfBounds${rand}(OneStepForward)) FinishGame${rand}("stepped out of bounds");
        else { 
            Steps${rand}.Add(0);
            Position${rand} = OneStepForward;
        }
    }

    static void Turn${rand}(int Direction)
    {
        _i${rand}();
        Steps${rand}.Add(Direction < 0 ? 1 : 2);
        Rotation${rand} = Modulus${rand}(Rotation${rand} + Direction, 4);
    }

    static bool AmISteppingOut${rand}() {
        _i${rand}();
        Steps${rand}.Add(4);
        return IsOutOfBounds${rand}(GetForward${rand}(Position${rand}, Rotation${rand}));
    }

    static (int x, int y) WhereAmI${rand}() {
        _i${rand}();
        Steps${rand}.Add(12);
        return Position${rand};
    }

    static int WhereAmILooking${rand}() {
        _i${rand}();
        Steps${rand}.Add(6);
        return Rotation${rand};
    }

    static bool AmILookingAt${rand}(int Direction) {
        _i${rand}();
        Steps${rand}.Add(6);
        return Rotation${rand} == Direction;
    }

    static bool IsThereAWall${rand}() {
        _i${rand}();
        Steps${rand}.Add(3);
        return IsWall${rand}(GetForward${rand}(Position${rand}, Rotation${rand}));
    }  

    static void PickUpRock${rand}()
    {
        _i${rand}();
        RocksPickedUp${rand}++;
        Steps${rand}.Add(7);
        Map${rand}.Remove(Position${rand});
    }

    static void PlaceRock${rand}(int Color = 2)
    {
        _i${rand}();
        RocksPlaced${rand}++;
        Color = System.Math.Clamp(Color, 2, 100);
        Steps${rand}.Add(20 + Color);
        if(!Map${rand}.ContainsKey(Position${rand}))
            Map${rand}.Add(Position${rand}, (uint)Color);
        else 
            Map${rand}[Position${rand}] = (uint)Color;
    }

    static int WhatIsUnder${rand}() {
        _i${rand}();
        Steps${rand}.Add(8);
        return Map${rand}.TryGetValue(Position${rand}, out uint Value) ? (int)Value : 0;
    }

    static bool IsAnyThingUnder${rand}() 
    {
        _i${rand}();
        Steps${rand}.Add(9);
        return Map${rand}.ContainsKey(Position${rand});
    }

    static int Radar${rand}() 
    {
        _i${rand}();
        Steps${rand}.Add(10);
        (int x, int y) P = GetForward${rand}(Position${rand}, Rotation${rand});
        int Steps = 0;
        while (!IsWall${rand}(P) && Steps <= RadarRange)
        {
            if (IsOutOfBounds${rand}(P)) return -1;
            P = GetForward${rand}(P, Rotation${rand});
            Steps++;
        }
        return Steps;
    }

    static void Omit${rand}() { 
        Steps${rand}.Add(-1); 
        _i${rand}(); 
    }     

    /* Player code here */
    ${player.code}
}`;

export default getSinglePlayerTemplate;
