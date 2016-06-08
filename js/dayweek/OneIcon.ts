/**
 * Created by Vlad on 4/27/2016.
 */
    ///<reference path="../base.ts"/>


module tables{
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
                old_icon: 'icons/great.png',
                Dial: 0,
                Prescriber: 0,
                non_prescriber: 0
            }
        }
        initialize(){
            this.on('change:icon', (evt)=> this.onIcon(evt));
        }
        onIcon(evt):void {
            this.set('old_icon', this.previous('icon'));
        }
    }

  export class RowView extends Backbone.View<AgentModel>{
        model:AgentModel;
        static template:any;

        private $icon:JQuery;
        private $icon_child:JQuery;
        
        constructor(options:any){
            super(options);
            this.model.on('change', ()=> this.render());
            this.model.bind('remove',()=>this.remove());
        }

        render() {
            this.$el.html(RowView.template(this.model.toJSON()));
            setTimeout(()=>{
                this.$el.find('.icon > div:first').addClass('out');
                this.$el.find('.in').removeClass('in');
            }, 20);
            return this;
        }

        remove():RowView {
            this.$el.fadeOut(()=>{
                super.remove();
            })
            return this;
        }
    }
}