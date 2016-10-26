/**
 * Created by pauzec on 14/09/16.
 */
import { Component, Input 	} from "@angular/core";
import {CommService, MediaRenderer} from "../Services/CommService";

const htmlTemplate = `
    <section>
        <h3>Liste des lecteurs UPnP/DLNA</h3>
        <ul>
            <li *ngFor="let renderer of mediaRenderers">
                <p alx-dropzone (alx-ondrop)="loadAndPlay(renderer.id,$event.mediaId,$event.serverId)">{{renderer.name}}</p>
                <m1m-pilote [nf]="renderer"></m1m-pilote>
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
