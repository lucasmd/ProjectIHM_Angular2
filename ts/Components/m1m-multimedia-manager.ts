import { Component, Input 	} from "@angular/core";
import {CommService, DataInit, MediaServer, MediaRenderer, Media} from "../Services/CommService";

const htmlTemplate = `
	<section alx-dragdrop id="services">
        <div class="container">
            <div class="row  text-center" style="background-color: black; font-family: 'Helvetica Neue'; font-style: italic;color: aqua">
				<h1>Composant de gestion des ressources multimédias</h1>
				<h1>{{title}}</h1>
			</div>
			
			<hr/>
            <div class="row text-center">
                <div class="col-md-6" style="background-color: black;color: white;">
                   
                    <section>
                        <h3>Liste des lecteurs UPnP/DLNA</h3>
                        <ul>
                            <li *ngFor="let renderer of mediaRenderers">
                                <p alx-dropzone (On-drop)="loadAndPlay(renderer.id,$event.mediaId,$event.serverId)">{{renderer.name}}</p>
                                <m1m-pilote [nf]="renderer"></m1m-pilote>
                            </li>
                        </ul>
                    </section>
                    <div class="col-md-6">
                        <player [mediaRenderers]="mediaRenderers"></player>
                    </div>
                    <div class="col-md-6" style="background-color: darkslategrey;color: white;">
                        <section>
                        
                            <h3>Liste des serveurs UPnP/DLNA</h3>
                            <ul>
                                <li *ngFor="let server of mediaServers">
                                    <h3>{{server.name}}</h3>                        
                                    <img src="{{server.iconURL}}" height="42" width="42"/>
                                    <h4>{{server.class}}</h4>
                                    <p (dblclick)="browse(server)">
                                        {{server | json}}
                                    </p>
                                    <component-data-browse [ms]="server"></component-data-browse>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

@Component({
    selector		: "comp-multimedia-manager",
    template		: htmlTemplate,
    providers       : [CommService],
    styleUrls: [
        "css/css.css"
    ]
})
export class CompMultimediaManager {
    @Input() title	: string;
    mediaRenderers  : MediaRenderer[];
    mediaServers    : MediaServer  [];
    medias          : Media[];
    cs              : CommService;
    constructor(private comm: CommService) {
        console.log( "CommService:", comm);
        comm.init().subscribe( (data: DataInit) => {
            console.log( "init =>", data );
            this.mediaRenderers = data.mediaRenderers;
            this.mediaServers   = data.mediaServers;
        });
    }
    browse( ms: MediaServer, directoryId :string ) {
        return this.comm.browse( ms.id, directoryId ).then( (data) => {
            console.log( "Browse", ms.id, directoryId, "=>", data );
            ms.directories  = data.directories;
            this.medias     = data.medias;
        });
    }
};
