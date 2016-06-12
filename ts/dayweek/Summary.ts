/**
 * Created by yrik6 on 11.06.2016.
 */
module tables {
    export class SummaryModel extends Backbone.Model{
        defaults():any {
            return {
                id: 0,
                dials: 0,
                connects: 0,
                type: 'Weekly'
            }
        }
        constructor (obj:any) {
            super(obj);
        }
    }

    export class SummaryView extends Backbone.View<SummaryModel> {
        template:any;

        constructor(options){
            super(options);
            this.setElement('#Summary');
            this.template = options.template;
            this.model.on('change', ()=>this.render());
           this.template = _.template( $(this.template).html() );
        }

        render(){
            this.$el.html(this.template( this.model.toJSON() ));
            return this;
        }
    }

    export class SummaryController{
        model:SummaryModel;
        view:SummaryView;
        constructor(collection:Backbone.Collection<SummaryModel>){
            this.model = new SummaryModel({}),
            this.view = new SummaryView({
                model: this.model,
                template:'#row-template4'
            });
            collection.on('myParse', (evt, par)=>{
                var dials = 0;
                var connects = 0;
                _.map(evt, function (item:any) {
                    dials += item.Dial;
                    connects += item.connects;
                })
                if(par == 'w') this.model.set({type:'Weekly', dials:dials, connects:connects});
                else this.model.set({type:'Daily', dials:dials, connects:connects});
            })
        }
    }
}