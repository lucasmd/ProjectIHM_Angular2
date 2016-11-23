import { Component, Input 	} from "@angular/core";
import {CommService, MediaRenderer} from "../Services/CommService";

const htmlTemplate = `
	<button class="pilotage" type="button" (click)="play()"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>
	<button class="pilotage" type="button" (click)="pause()"><span class="glyphicon glyphicon-pause" aria-hidden="true"></span></button>
    <button class="pilotage" type="button" (click)="stop ()"><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button>
`;

@Component({
    selector		: "m1m-pilote",
    template		: htmlTemplate,
    providers       : [CommService]
})
export class M1mPilotage {
    @Input() nf    : MediaRenderer;
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

};
