/**
 * Created by Vlad on 4/27/2016.
 */
    ///<reference path="../com.ts"/>



module tablesTwo{
    'use strict'
    export  class VOAgent {
        id:number;
        icon:string;
        time:number;
        old_icon:string;
        name:string;

        
    }

    
    export class AgentModel extends Backbone.Model {
        
        
        initialize(){
            if (this.get('time')>0) {
                setInterval(()=> {
                    var t:number = +this.get('time') + 1;
                    this.set('time', t);
                }, 1000)
            }
        }
        defaults():VOAgent {
            return {
                id: 0,
                icon: '',
                old_icon: '',
                time: 0,
                name: ''
            }
        }
    }

    export class RowViewTwo extends Backbone.View<AgentModel>{
        model:AgentModel;
        static template:any;
        private $icon:JQuery;
        private $icon_child:JQuery;
        private $time:JQuery;
        
        constructor(options:any){
            super(options);

            this.model.bind('change:icon', ()=>this.changeIcon());
            this.model.bind('change:time', ()=>this.onTimeChange());
            this.model.bind('destroy',()=>this.destroy());
            this.model.bind('remove',()=>this.remove());
        }

        private onTimeChange():void{
            var t:number = this.model.get("time");
            if(t == 0) this.$time.text(' ');
            else this.$time.text(moment.unix(t).format('m:ss'));
        //else this.$time.text(Formatter.formatTime(t));
        }

        changeIcon():void{
            var $icon:JQuery = this.$icon;
            var old = this.$icon_child.addClass('out');
            setTimeout(function(){
                old.remove();
            },2000);
            
            var newdiv= $('<div>').addClass('in').css('background-image', 'url("'+this.model.get('icon')+'")').appendTo($icon);
            setTimeout(function (){
                newdiv.removeClass('in');
            },10);
            this.$icon_child = newdiv;
        }

        initialize() {
            this.$el.html(RowViewTwo.template(this.model.toJSON()));
            this.$icon = this.$el.find('.icon2').first();
            this.$icon_child = this.$icon.children();
            this.$time = this.$el.find('.time').first();

            this.onTimeChange();
        }
        
        render() {
            return this;
        }

        remove():RowViewTwo {
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