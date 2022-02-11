import KareszRenderer from './render';
import { Command, KareszMap, Point, Rotation } from '$lib/karesz/core/types';
import { compareTo, modulo } from '$lib/karesz/util';

export default class KareszPlayback extends KareszRenderer {

    public state:{
        running:boolean;
        playbackSpeed:number;
        currentStep:number; 
        lastStep:number;
    } = {
        running: false,
        playbackSpeed: 100,
        currentStep: 0,
        lastStep:0
    }

    private interval:NodeJS.Timer;

    constructor({ map, size, canvas, onRender }:{ map?:KareszMap, size?:Point, canvas:HTMLCanvasElement, onRender?:()=>void }){
        super({ map, size, canvas, onRender });
    }

    private forward(position:Point, rotation:Rotation):Point {
        return {
            x: position.x + compareTo(rotation, rotation % 2 + 1),
            y: position.y + compareTo(rotation, rotation % 2 + 1),
        }
    }

    protected calculateSteps(index:number):void {
        const player = this.players.get(index);
        if(player === undefined) return;

        let position:Point = player.position, rotation:Rotation = player.rotation;
        
        for (let i = 0; i < player.steps.length; i++) {
            if(player.steps[i] == Command.forward) 
                position = this.forward(position, rotation);
            else if(player.steps[i] == Command.turn_left)
                rotation = modulo(rotation - 1, 4);
            else if(player.steps[i] == Command.turn_right)
                rotation = modulo(rotation + 1, 4);
            
            player.stepStates.push({ position, rotation, tag:player.steps[i] });
        }

        this.players.set(index, player);
        console.log(player.stepStates);
    }

    /* -------- */ 

    public update():void {
        this.state.currentStep++;
        this.render();
    }

    public reset():void {
        this.state.lastStep = 0;
        this.state.currentStep = 0;
    }

    public play():void {
        if(this.state.running) return;
        this.state.running = true;
        this.interval = setInterval(this.update, this.state.playbackSpeed);
    }

    public stop():void {
        if(!this.state.running) return;
        this.state.running = false;
        clearInterval(this.interval);
        this.state.lastStep = this.state.currentStep;
    }

}
