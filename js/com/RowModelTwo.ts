/**
 * Created by Vlad on 4/27/2016.
 */
    ///<reference path="../base.ts"/>

module tableTwo{

    export  class VOAgent {
        id:number;
        icon:string;
        time:number;
    }


    export class AgentModel extends Backbone.Model {
        initialize(){
            if (this.get('time')>0) {
                setInterval(()=> {
                    var t:number = this.get('time') + 1;
                    this.set('time', t);
                }, 1000)
            }
        }
        defaults():VOAgent {
            return {
                id: 0,
                icon: '',
                time: 0
            }
        }
    }
}