import { Injectable } from "@angular/core";
import {Http} from "@angular/http";
import { utils } from "./utils";
import {Observable} from "rxjs";
// import "rxjs/Rx";
import "rxjs/add/operator/map";

// export
export interface Brick {
    id      : string;
    name    : string;
    type    : string[];
}
export interface MediaRenderer extends Brick {
    iconURL : string;
}
export interface MediaServer   extends Brick {
    iconURL     : string;
    directories : Directory[];
}
export interface DataInit {
    mediaRenderers  : MediaRenderer[];
    mediaServers    : MediaServer  [];
};

export interface Directory {
    serverId    : string;
    name        : string;
    iconURL     : string;
    directory   : string;
}
export interface Media {
    serverId        : string;
    date            : string;
    title           : string;
    icon            : string;
    mediaId         : string;
    creator         : string;
    actors          : string[];
    genres          : string[];
    albumarturi     : string;
    description     : string;
    longdescription : string;
    ressource       : string;
    classe          : string;
}
export interface DataBrowse {
    parentDirectory : string;
    directories     : Directory[];
    medias          : Media[];
    error           : string;
};

let initDone = false;
@Injectable()
export class CommService {
    mediaRenderers  : MediaRenderer[] = [];
    mediaServers    : MediaServer  [] = [];
    onupdate        : (operation: string, type: string, brick: MediaRenderer | MediaServer) => void;
    private parser	: DOMParser;
    constructor(private _http: Http) {
        this.parser = new DOMParser();
    }
    init() : Observable<DataInit> {
        if(initDone) {throw "Cannot instantiate CommService multiple times...";} else {initDone = true;}
        utils.initIO( location.hostname + ":" + location.port + "/m2m" );
        return this._http.get("/getContext").map( (response) => {
            if(response.status !== 200) {console.error("Impossible to get context:", response); return;}
            let context = JSON.parse( response.text() );
            for(let i in context.bricks ) {
                this.onbrickAppear( context.bricks[i] );
            }
            utils.io.on	( "brickAppears", (brick: MediaRenderer | MediaServer) => {
                console.log( "brickAppears", brick );
                this.onbrickAppear( brick );
            });
            utils.io.on	( "brickDisappears", ( data ) => {
                console.log("brick brickDisappears", data.brickId);
                let index, hasId = function(brick, i) {index = i; return brick.id === data.brickId;};
                if( this.mediaRenderers.find( hasId ) ) {
                    this.mediaRenderers.splice(index, 1);
                    if(this.onupdate) {
                        this.onupdate("disappear", "BrickUPnP_MediaRenderer", data.brickId);
                    }
                }
                if( this.mediaServers.find  ( hasId ) ) {
                    this.mediaServers.splice(index, 1);
                    if(this.onupdate) {
                        this.onupdate( "disappear", "BrickUPnP_MediaServer"  , data.brickId );
                    }
                }
            });
            return {mediaRenderers: this.mediaRenderers, mediaServers: this.mediaServers};
        });
    }
    onbrickAppear(brick: MediaRenderer | MediaServer) : void {
        if( brick.type.indexOf("BrickUPnP_MediaRenderer") >= 0 ) {
            this.mediaRenderers.push( <MediaRenderer>brick );
            if(this.onupdate) {this.onupdate( "appear", "BrickUPnP_MediaRenderer", brick );}
        }
        if( brick.type.indexOf("BrickUPnP_MediaServer") >= 0 ) {
            this.mediaServers.push( <MediaServer>brick );
            if(this.onupdate) {this.onupdate( "appear", "BrickUPnP_MediaServer", brick );}
        }
    }
    play(mediaRendererId: string) : Promise<any> {
        return utils.call(mediaRendererId, "Play" , []);
    }
    pause(mediaRendererId: string) : Promise<any> {
        return utils.call(mediaRendererId, "Pause", []);
    }
    stop(mediaRendererId: string) : Promise<any> {
        return utils.call(mediaRendererId, "Stop", []);
    }
    setVolume(mediaRendererId: string, volume: number) : Promise<any> {
        return utils.call(mediaRendererId, "setVolume", [volume]);
    }
    loadMedia(mediaRendererId: string, mediaServerId: string, itemId: string) : Promise<any> {
        return utils.call(mediaRendererId, "loadMedia", [mediaServerId, itemId]);
    }
    browse(mediaServerId, directoryId) : Promise<DataBrowse> {
        directoryId = directoryId || 0;
        return utils.call( mediaServerId, "Browse", [directoryId] ).then( (dataString) => {
            let dataBrowse : DataBrowse = {
                parentDirectory : directoryId,
                directories     : [],
                medias          : [],
                error           : null
            };
            try {
                let doc         = this.parser.parseFromString( dataString, "text/xml" );
                let Result      = doc.querySelector("Result");
                let ResultDoc   = this.parser.parseFromString(Result.textContent, "text/xml");

                // Parse containers
                for(let container of ResultDoc.querySelectorAll("container")) {
                    let node    : Node;
                    dataBrowse.directories.push( {
                        serverId    : mediaServerId,
                        name        : (node=container.querySelector("title"))?node.textContent:"inconnu",
                        iconURL     : (node=container.querySelector("albumArtURI"))?node.textContent:"",
                        directory   : container.getAttribute("id")} );
                } // End of containers parsing

                // Parse item
                for(let item of ResultDoc.querySelectorAll("item")) {
                    let node    : Node;
                    let media   : Media;
                    dataBrowse.medias.push( media = {
                        // xmlItem         : item,
                        serverId        : mediaServerId,
                        date            : (node=item.querySelector("date"))?node.textContent:"inconnue",
                        title           : (node=item.querySelector("title"))?node.textContent:"inconnu",
                        icon            : (node=item.querySelector("icon"))?node.textContent:"images/media_icon.jpg",
                        mediaId         : item.getAttribute("id"),
                        creator         : (node=item.querySelector("creator"))?node.textContent:"inconnu",
                        actors          : [],
                        genres          : [],
                        albumarturi     : (node=item.querySelector("albumarturi, albumArtURI, albumArtUri"))?node.textContent:"",
                        description     : (node=item.querySelector("description"))?node.textContent:"",
                        longdescription : (node=item.querySelector("longdescription, longDescription"))?node.textContent:"",
                        ressource       : (node=item.querySelector("res"))?node.textContent:"",
                        classe          : (node=item.querySelector("class"))?node.textContent:""
                    } );
                    for(let actor of item.querySelectorAll( "actor" )) {
                        media.actors.push( actor.textContent );
                    }
                    for(let genre of item.querySelectorAll( "genre" )) {
                        media.genres.push( genre.textContent );
                    }
                } // End of items parsing
            } catch(err) {dataBrowse.error = err;}
            return dataBrowse;
    });
}};
