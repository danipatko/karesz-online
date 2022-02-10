import KareszRenderer from './render';
import type { IKaresz, KareszMap, Point, State } from '$lib/karesz/core/types';

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

    public calculateSteps(index:number):void {

    }

    /* -------- */ 

    public update():void {
        this.state.currentStep++;
        this.players.forEach(player => {
            player.steps[this.state.currentStep]
            
        });
    }

    public reset():void {
        this.state.lastStep = 0;
        this.state.currentStep = 0;
    }

    public play():void {
        this.interval = setInterval(this.update, this.state.playbackSpeed);
    }

    public stop():void {
        clearInterval(this.interval);
        this.state.lastStep = this.state.currentStep;
    }

}
