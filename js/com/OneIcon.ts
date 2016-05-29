/**
 * Created by Vlad on 4/27/2016.
 */
    ///<reference path="../base.ts"/>


module tables{

    import AgentModel = table.AgentModel;

    export class OneIcon extends Backbone.View<AgentModel>{
        model:AgentModel;
        static template:any

        private $icon:JQuery;
        private $icon_child:JQuery;
        
        constructor(options:any){
            super(options);
            this.model.on('change', ()=> this.render());
            this.model.bind('destroy',()=>this.destroy());
            this.model.bind('remove',()=>this.remove());
        }

        render() {
            this.$el.html(OneIcon.template(this.model.toJSON()));
            setTimeout(()=>{
                this.$el.find('.icon > div:first').addClass('out');
                this.$el.find('.in').removeClass('in');
            }, 20);
            return this;
        }

        remove():OneIcon {
            this.$el.fadeOut(()=>{
                super.remove();
            })
            return this;

        }
        add():void{
            console.log('add');
        }
        destroy():void{
            console.log('destroy');
        }
    }
}