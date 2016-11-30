import { Component, Input 	} from "@angular/core";
import {CommService, DataInit, MediaServer, MediaRenderer, Media} from "../Services/CommService";

const htmlTemplate = `
	<section alx-dragdrop id="services" >
        <div class="container">
            <div id="header" class="row">
				<!--<h1>Composant de gestion des ressources multimédias</h1>
				<h1>{{title}}</h1>
				<h1 align="center" style="margin-left: 45%"> DA - Player </h1-->
				
                    <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
                  <!-- Indicators -->
                  <ol class="carousel-indicators">
                    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                    <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                  </ol>
                
                  <!-- Wrapper for slides -->
                  <div class="carousel-inner" role="listbox">
                    <div class="item active">
                      <img src="src/banniere.png" alt="...">
                      <div class="carousel-caption">
                      </div>
                    </div>
                    <div class="item">
                      <img src="src/background.jpg" alt="...">
                      <div class="carousel-caption">
                      </div>
                    </div>
                  </div>
                
                  <!-- Controls -->
                  <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                  </a>
                </div>
                			
			</div>
			<!--img src="src/logo.png" height="100" width="100"/-->
            <div class="row">
                <div id="serveurs" class="col-md-6" >
                    <section >
                        <div class="row" >
                        <img align="center" src="src/servericon.png" height="80" width="80"/>
                        <h3 style="margin-left: 5%; font-family: Impact" align="center">Centres de données</h3>
                        </div>
                        <ul>
                            <hr>
                            <li *ngFor="let server of mediaServers" id="elementListeServeur">
                                <div class="modal-content" style="color: darkblue; background-color: transparent">
                                    <div class="row list-group-item active" style="box-shadow: 1px 1px 12px #555; border-bottom: thin;">
                                        <h5 style="color: black" align="left">{{server.name}}</h5>&nbsp;&nbsp;
                                        <img id="logoServeur" src="{{server.iconURL}}" height="40" width="40"/>
                                    </div>
                                    <p (dblclick)="browse(server)"></p>
                                    <component-data-browse [ms]="server"></component-data-browse>
                                    <hr id="hrServeurs"/>
                                </div>
                                <hr/>
                            </li>
                        </ul>
                    </section>
                </div>
                <div id="players" class="col-md-6">
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
