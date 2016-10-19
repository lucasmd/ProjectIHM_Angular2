import { Component, Input 	} from "@angular/core";
import {CommService, MediaRenderer} from "../Services/CommService";

const htmlTemplate = `
	<button type="button" (click)="play()"> Play  </button> 
	<button (click)="pause()"> Pause</button>
    <button (click)="stop ()"> Stop </button>
	nf : {{nf.id}}
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
