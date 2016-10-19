import { Component, Input 	} from "@angular/core";
import {CommService, DataInit, MediaServer, MediaRenderer, Media} from "../Services/CommService";

const htmlTemplate = `

<header>
        <div class="container">
            <div class="intro-text">
                <div class="intro-lead-in">Open Source Home Theater Software</div>
                <div class="intro-heading"> Gerer vos médias sur les serveurs distants</div>
                <a href="#services" class="btn btn-primary btn-large">Démarrez !</a>
            </div>
        </div>
    </header>
	<section id="services">
        <div class="container">
            <div class="row  text-center">
				<h1>Composant de gestion des ressources multimédias</h1>
				<h1>{{title}}</h1>
			</div>
			
			<hr/>
            <div class="row text-center">
                <div class="col-md-6">
                   
                    <section>
                <h3>Liste des lecteurs UPnP/DLNA</h3>
                <ul>
                    <li *ngFor="let renderer of mediaRenderers">
                        <p>{{renderer.name}}</p>
                        <m1m-pilote [nf]="renderer"></m1m-pilote>
                    </li>
                </ul>
            </section>
                </div>
                <div class="col-md-6">
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
    </section>
   
`;

@Component({
    selector		: "comp-multimedia-manager",
    template		: htmlTemplate,
    providers       : [CommService],
    styleUrls: [
        'css/css.css'
    ]
})
export class CompMultimediaManager {
    @Input() title	: string;
    mediaRenderers  : MediaRenderer[];
    mediaServers    : MediaServer  [];
    medias          : Media[];
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