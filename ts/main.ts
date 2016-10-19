/// <reference path="../typings/index.d.ts" />

import { platformBrowserDynamic }   from "@angular/platform-browser-dynamic";
import {Component}                  from "@angular/core";
import { BrowserModule }    		from "@angular/platform-browser";
import { NgModule } 				from "@angular/core";
import { FormsModule }   			from "@angular/forms";
import {HttpModule} 				from "@angular/http";

import { CompMultimediaManager } from "./Components/m1m-multimedia-manager";

@Component({
	selector	: "root-manager",
	template	: `<comp-multimedia-manager title="Gestion des services UPnP/DLNA"></comp-multimedia-manager>
				  `,
	providers	: []
})
class RootManager {
}

//enableProdMode();
@NgModule({
	imports     : [BrowserModule, FormsModule, HttpModule],
	declarations: [RootManager, CompMultimediaManager],
	bootstrap   : [RootManager]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
