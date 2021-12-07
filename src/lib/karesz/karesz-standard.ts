import { field, instruction } from './karesz-utils';
import type { karesz } from './karesz';

/*
POSSIBLE INSTRUCTIONS: 

-/O   step
-/O   turn 1
-/O   turn -1
-/O   pickup
-/O   place
I/-   up
I/-   down
I/-   left
I/-   right
I/-    look
I/-    isrock
I/-    under
I/-    wallahead
I/-    outofbounds
-/O    turn :x:
*/

export const parseCommand = (L:string, k:karesz):number|boolean => {
    if(!L) return;

    const [command, value] = L.split(' ');

    switch(command.trim().toLocaleLowerCase()) {
        case 'step': 
            k.Lépj();
        break;
        case 'turn': 
            k.turn(parseInt(value || '0'));
        break;
        case 'pickup': 
            k.Vegyél_fel_egy_kavicsot();
        break;
        case 'place': 
            k.Tegyél_le_egy_kavicsot(parseInt(value) || field.rock_black);
        break; 
        case 'left': return k.Nyugatra_néz();
        case 'right': return k.Keletre_néz();
        case 'up': return k.Északra_néz();
        case 'down': return k.Délre_néz();
        case 'look': return k.Merre_néz();
        case 'isrock': return k.isRockUnder();
        case 'under': return k.whatIsUnder();
        case 'wallahead': return k.Van_e_előttem_fal();
        case 'outofbounds': return k.Kilépek_e_a_pályáról();
        default:
            console.log('COMMAND NOT FOUND');
            break;
    }
    
    return undefined;
}
