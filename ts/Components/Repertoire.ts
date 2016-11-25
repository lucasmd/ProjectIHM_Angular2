import {Component, Input, OnInit}   from "@angular/core";
import { DataBrowse, MediaServer, CommService }           from "../Services/CommService";

const htmlTemplate = `
	<section *ngIf="dataBrowse">
	    <!--<h5>Contenu</h5>-->
	    <p class="label label-default" align="center" style="font-style: italic;color: black;margin-left: 5%">{{filAriane}}</p><hr id="filArianne"/>
        <ul class="list-group">
            <li class="list-group-item active" style="color: darkblue; width: 50%; margin-left: 20%">
                <section (dblclick)="retour()">
                    Retour                
                </section>
            </li>
            <li *ngFor="let directory of dataBrowse.directories" class="list-group-item list-group-item-action" style="color: darkblue; width: 50%; margin-left: 20% ">
                <section (dblclick)="avant(directory.directory,directory.name)">
                    {{directory.name}}                
                </section>
            </li>
            <li *ngFor="let media of dataBrowse.medias" class="list-group-item list-group-item-action" style="color: darkblue; width: 50%; margin-left: 20%">
                <section [alx-draggable]="{serverId: ms.id, mediaId: media.mediaId}">
                    {{media.title}}
                </section>
            </li>
        </ul>
	</section>
`;

// Composant chargé de représenter un dossier
@Component({
    selector		: "component-data-browse",
    template		: htmlTemplate,
    providers       : [CommService]
})
export class ComponentDataBrowse implements OnInit  {
    @Input() ms: MediaServer;
    directories         : string[] = [];
    directoriesName     : string[] = [];
    filAriane           : string = "Acceuil ";
    dataBrowse          : DataBrowse;
    cs                  : CommService;
    constructor(cs : CommService) {
        this.cs = cs;
    }
    ngOnInit(): void {
        this.browse( "0" );
    }
    browse( directoryId: string) {
        return this.cs.browse( this.ms.id, directoryId ).then( (data) => {
            console.log( "Browse", this.ms.id, directoryId, "=>", data );
            this.dataBrowse = data;
            console.log("browse", directoryId, this.dataBrowse);
            console.log(this.directories);
        });
    }
    avant(directoryId: string, directoryName : string ) {
        this.directories.push( directoryId );
        this.directoriesName.push( directoryName );
        console.log("directories id",this.directories);
        console.log("directories name",this.directoriesName);
        this.miseAJourFilAriane();
        return this.browse(directoryId);
    }
    retour() {
        this.directories.pop();
        this.directoriesName.pop();
        /*splice(this.directories.length-1,1);*/
        console.log("directories id",this.directories);
        console.log("directories name",this.directoriesName);
        this.miseAJourFilAriane();
        if(this.directories.length >= 1 )
        {
            return this.browse( this.directories[this.directories.length-1] );
        }
        else {
            return this.browse( this.directories[0] );
        }
    }
    miseAJourFilAriane(){
        this.filAriane = "Acceuil ";
        for(let i = 0; i < this.directoriesName.length; i++) {
            this.filAriane += " > " + this.directoriesName[i];
        }
    }
    loadAndPlay(mediaRendererId: string, itemId: string) {
        console.log("loadAndPlay de ",itemId,"depuis", this.ms.id,"sur",mediaRendererId);
        return this.cs.loadMedia(mediaRendererId,this.ms.id,itemId).then( () => {
            console.log("fin de chargement, je play");
            this.cs.play(mediaRendererId);
        });
    }
}
