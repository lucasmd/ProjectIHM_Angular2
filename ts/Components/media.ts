import { Component, Input 	} from "@angular/core";
import { Media } from "../Services/CommService";

const htmlTemplate = `
	<section>
	    mon média : {{nf.name}}
	</section>
	<p>
	    {{nf | json}}
    </p>
`;

@Component({
    selector		: "m1m-media",
    template		: htmlTemplate,
    providers       : []
})
export class M1mMedia {
    @Input() nf	: Media;
    //constructor() {}
};
