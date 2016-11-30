import { Component, Input 	} from "@angular/core";
import {CommService, MediaRenderer} from "../Services/CommService";

const htmlTemplate = `
    <div class="row" style="margin-left: 15%; margin-top: 8%">
	<button class="pilotage" type="button" (click)="play()"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>
	<button class="pilotage" type="button" (click)="pause()"><span class="glyphicon glyphicon-pause" aria-hidden="true"></span></button>
    <button class="pilotage" type="button" (click)="stop()"><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button>
    <button style="position:relative;right: 12px;margin-left: 35%" class="pilotage" type="button" (click)="increaseVolume()"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
    <button style="position:relative;right: 12px" class="pilotage" type="button" (click)="decreaseVolume()"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>
    </div>
`;

@Component({
    selector		: "m1m-pilote",
    template		: htmlTemplate,
    providers       : [CommService]
})
export class M1mPilotage {
    @Input() nf     : MediaRenderer;
    volume          : number = 80;
    constructor(private cs: CommService) {
        console.log( "CommService:", cs);
    }
    play() : Promise<any> {
        return this.cs.play( this.nf.id );
    }
    pause() : Promise<any> {
        return this.cs.pause( this.nf.id );
    }
    stop() : Promise<any> {
        return this.cs.stop( this.nf.id );
    }
    increaseVolume() : Promise<any> {
        this.volume = this.volume + 10;
        console.log("Augmentation");
        return this.cs.setVolume( this.nf.id, this.volume );
    }
    decreaseVolume() : Promise<any> {
        this.volume = this.volume - 10;
        console.log("Diminution");
        return this.cs.setVolume( this.nf.id, this.volume );
    }
};
