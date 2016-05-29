/**
 * Created by Vlad on 4/27/2016.
 */
    ///<reference path="../base.ts"/>

module table{

    export  class VOAgent {
        id:number;
        name:string;
        icon:string;
        old_icon:string;
        Dial:number;
        Prescriber:number;
        non_prescriber:number;
    }


    export class AgentModel extends Backbone.Model {
        defaults():VOAgent {
            return {
                id: 0,
                name: '',
                icon: '',
                old_icon: 'great',
                Dial: 0,
                Prescriber: 0,
                non_prescriber: 0
            }
        }
        initialize(){
            this.on('change:icon', (evt)=> this.onIcon(evt));
        }
        onIcon(evt):void {
            // console.log(evt);
            this.set('old_icon', this.previous('icon'));
        }
    }
}