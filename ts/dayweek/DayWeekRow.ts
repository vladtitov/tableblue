/**
 * Created by Vlad on 4/27/2016.
 */
    ///<reference path="../com.ts"/>


module tables{
    export  class VOAgent {
        id:number;
        name:string;
        icon:string;
        old_icon:string;
        Dial:number;
        Prescriber:number;
        non_prescriber:number;
        connects:number;
        total:number;
        COUNTER_ready_eff:number;
        ready_eff:number;
        ready_time:string;
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
                non_prescriber: 0,
                connects:0,
                total:0,
                COUNTER_ready_eff:0,
                ready_eff:0,
                ready_time:''

            }
        }
        initialize(){

            this.on('change:icon', (evt)=> this.onIcon(evt));
        }
        onIcon(evt):void {
            this.set('old_icon', this.previous('icon'));
        }
    }



  export class DayWeekRowView extends Backbone.View<AgentModel>{
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
            this.$el.html(DayWeekRowView.template(this.model.toJSON()));
            setTimeout(()=>{
                this.$el.find('.icon > div:first').addClass('out');
                this.$el.find('.in').removeClass('in');
            }, 20);
            return this;
        }

        remove():DayWeekRowView {
            this.$el.fadeOut(()=>{
                super.remove();
            })
            return this;
        }
    }
}