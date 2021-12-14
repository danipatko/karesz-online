import { field, instruction } from './karesz-utils';
import type karesz from './karesz';

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
            k.Lepj();
        break;
        case 'turn': 
            k.turn(parseInt(value || '0'));
        break;
        case 'pickup': 
            k.Vegyel_fel_egy_kavicsot();
        break;
        case 'place': 
            k.Tegyel_le_egy_kavicsot(parseInt(value) || field.rock_black);
        break; 
        case 'left': return k.Nyugatra_nez();
        case 'right': return k.Keletre_nez();
        case 'up': return k.Eszakra_nez();
        case 'down': return k.Delre_nez();
        case 'look': return k.Merre_nez();
        case 'isrock': return k.isRockUnder();
        case 'under': return k.whatIsUnder();
        case 'wallahead': return k.Van_e_elottem_fal();
        case 'outofbounds': return k.Kilepek_e_a_palyaról();
        default:
            console.log('COMMAND NOT FOUND');
            break;
    }
    
    return undefined;
}
