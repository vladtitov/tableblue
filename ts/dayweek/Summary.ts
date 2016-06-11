/**
 * Created by yrik6 on 11.06.2016.
 */
module tables {
    export class SummaryModel extends Backbone.Model{
        defaults():any {
            return {
                id: 0,
                dial: 0,
                connections: 0,
                type: 'Weekly'
            }
        }
        constructor (obj:any) {
            super(obj);
        }
    }
    
    export class SummaryView extends Backbone.View<SummaryModel> {
        constructor(options, collection:Backbone.Collection<SummaryModel>){
            super(options);
            console.log(this.model);
            this.listenTo(collection, 'myParse', (evt, par)=>{
                console.log(evt, par);
                // console.log(this.params);

                // console.log(collection.models);
            })
        }
    }
}
