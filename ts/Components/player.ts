/**
 * Created by pauzec on 14/09/16.
 */
import { Component, Input 	} from "@angular/core";
import {CommService, MediaRenderer} from "../Services/CommService";

const htmlTemplate = `
    <section>
        <div class="row">
        <img align="center" src="src/playericon.png" height="80" width="80"/>
        <h3 style="margin-left: 5%" align="center">Lecteurs</h3>
        </div>
        <hr/>
        <ul>
            <li id="player1" *ngFor="let renderer of mediaRenderers">
                <h4 alx-dropzone (alx-ondrop)="loadAndPlay(renderer.id,$event.mediaId,$event.serverId)">{{renderer.name}}</h4>
                <m1m-pilote [nf]="renderer"></m1m-pilote>
                <hr width="65%">
            </li>
        </ul>
    </section>
`;

@Component({
    selector		: "player",
    template		: htmlTemplate,
    providers       : [CommService]
})
export class CompPlayer {
    @Input() mediaRenderers    : MediaRenderer[];
    state                      : string;
    constructor(private cs : CommService) {
    }
    loadAndPlay(mediaRendererId: string, itemId: string, serverId: string) {
        console.log("loadAndPlay de ",itemId,"depuis", serverId,"sur",mediaRendererId);
        return this.cs.loadMedia(mediaRendererId, serverId,itemId).then( () => {
            console.log("fin de chargement, je play");
            this.cs.play(mediaRendererId);
        });
    }
};

// recupération état player
/*
this.cs.call(mediaRendererId, "methode?", []).then(() => {
this.state = state;
});
*/