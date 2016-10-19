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
                <p>{{renderer.name}}</p>
            </li>
        </ul>
    </section>
`;

@Component({
    selector		: "player",
    template		: htmlTemplate,
    providers       : []
})
export class CompPlayer {
    mediaRenderers  : MediaRenderer[];
    mediaServers    : MediaServer  [];
    constructor(private comm: CommService) {
        console.log( "CommService:", comm);
        comm.init().subscribe( (data: DataInit) => {
            console.log( "init =>", data );
            this.mediaRenderers = data.mediaRenderers;
            this.mediaServers   = data.mediaServers;
        });
    }
};
