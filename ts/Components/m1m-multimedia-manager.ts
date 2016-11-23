import { Component, Input 	} from "@angular/core";
import {CommService, DataInit, MediaServer, MediaRenderer, Media} from "../Services/CommService";

const htmlTemplate = `
	<section alx-dragdrop id="services">
        <div class="container">
            <div class="row" style="background-color: black; font-family: 'Helvetica Neue';color: darkgrey">
				<h1>Composant de gestion des ressources multimédias</h1>
				<h1>{{title}}</h1>
			</div>
			<hr/>
            <div class="row text-center">
                <div class="col-md-6" style="background-color: lightskyblue;color: white;">
                    <section>
                    
                        <h3>Liste des serveurs UPnP/DLNA</h3>
                        <ul>
                            <li *ngFor="let server of mediaServers">
                                <h5 align="left">{{server.name}}</h5><img align="center" src="{{server.iconURL}}" height="21" width="21"/>
                                <p (dblclick)="browse(server)"></p>
                                <component-data-browse id="toto"  [ms]="server"></component-data-browse>
                            </li>
                        </ul>
                    </section>
                </div>
                <div class="col-md-6" style="background-color: lightsalmon;color: white;">
                        <player [mediaRenderers]="mediaRenderers"></player>
                </div>
            </div>
        </div>
    </section>
`;
/*(dblclick)="toto.classList.toggle('visible')"*/
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
