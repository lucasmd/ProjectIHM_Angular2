/**
 * Created by pauzec on 14/09/16.
 */
import { Component, Input 	} from "@angular/core";
import {CommService, DataInit, MediaServer, Directory, MediaRenderer} from "../Services/CommService";

const htmlTemplate = `
    <section>
        <h3>Liste des lecteurs UPnP/DLNA</h3>
        <ul>
            <li *ngFor="let renderer of mediaRenderers">
                <p alx-dropzone (on-drop)="loadAndPlay(renderer,$event.mediaId,$event.serverId)">{{renderer.name}}</p>
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
    mediaRenderers  : MediaRenderer[];
    mediaServers    : MediaServer  [];
    cs                  : CommService;
    constructor(private comm: CommService) {
        console.log( "CommService:", comm);
        comm.init().subscribe( (data: DataInit) => {
            console.log( "init =>", data );
            this.mediaRenderers = data.mediaRenderers;
            this.mediaServers   = data.mediaServers;
        });
    }
    loadAndPlay(mediaRendererId: string, itemId: string, serverId: string) {
        console.log("loadAndPlay de ",itemId,"depuis", serverId,"sur",mediaRendererId);
        return this.cs.loadMedia(mediaRendererId, serverId,itemId).then( () => {
            console.log("fin de chargement, je play");
            this.cs.play(mediaRendererId);
        });
    }
};
