import {Component, Input, OnInit}   from "@angular/core";
import { DataBrowse, MediaServer, CommService }           from "../Services/CommService";

const htmlTemplate = `
	<section *ngIf="dataBrowse">
	    <h3>Contenu</h3>
	    <p></p>
        <ul>
            <li>
                <section (dblclick)="retour()">
                    Retour                
                </section>
            </li>
            <li *ngFor="let directory of dataBrowse.directories">
                <section (dblclick)="avant(directory.directory,directory.name)">
                    {{directory.name}}                
                </section>
            </li>
            <li *ngFor="let media of dataBrowse.medias">
                <section [alx-draggable]="{serverId: ms.id, mediaId: media.mediaId}">
                    {{media.title}}
                    {{media.mediaId}}
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
    directoriesName     : string[] = [">"];
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
        return this.browse(directoryId);
    }
    retour() {
        this.directories.pop();
        this.directoriesName.pop();
        /*splice(this.directories.length-1,1);*/
        console.log("directories id",this.directories);
        console.log("directories name",this.directoriesName);
        if(this.directories.length >= 1 )
        {
            return this.browse( this.directories[this.directories.length-1] );
        }
        else {
            return this.browse( this.directories[0] );
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
