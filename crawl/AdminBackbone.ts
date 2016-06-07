/**
 * Created by yrik6 on 18.04.2016.
 */
///<reference path="../js/base.ts"/>

    
module Table {
    interface TextMess {
        msg: string;
        active: boolean;
        selected: boolean;
        location: string;
        editable: boolean;
    }

    export class Message extends Backbone.Model{
        defaults() : TextMess{
            return {
                msg: '',
                active: false,
                selected: false,
                location: '',
                editable: false
            }
        }
    }


    export class MessageView extends Backbone.View<Message> {
        static template:any = _.template( $('#row-template').html() );
        constructor (options: any) {
            super(options);
            this.model.on('remove', ()=>this.remove());
            this.$el.on('click', (evt)=>this.edit(evt));

            this.model.on('change:active', ()=>{
                if(this.model.get('active')) {
                    this.$el.find('.mychecked').attr('checked', true);
                }
                else{
                    this.$el.find('.mychecked').attr('checked', false);
                }
            });

            this.model.on('change:selected', ()=>{
                if(this.model.get('selected')){
                    this.$el.addClass('warning');
                }
                else {
                    this.$el.removeClass();
                    this.model.set('editable', false);
                }
            });

            this.model.on('change:editable', ()=>{
                if(this.model.get('editable')) {
                    this.makeEditable();
                }
                else{
                    this.$el.find('.myevent').attr('contenteditable', false);
                }
            })
        }

        edit(evt): void {
            if (evt.target.localName != 'input') {
                if (!this.model.get('selected')) {
                    this.model.trigger('selectedModel', this.model);
                }
                else {
                    this.model.set('editable', true);
                }
            }
            else {
                this.model.get('active') ? this.model.set('active', false): this.model.set('active', true);
            }
        }

        makeEditable():void{
            this.$el.removeClass('warning').addClass('info');
            var myevent:JQuery = this.$el.find('.myevent').attr('contenteditable', true);
            myevent.blur( ()=>{
                this.model.set('msg', myevent.text());
            })
        }

        remove (): MessageView  {
            this.$el.remove();
            return this;
        }
        
        render (): MessageView {
            var data = this.model.toJSON();
            if (data.active) data.active = "checked";
            else data.active = "";
            this.$el.html( MessageView.template(data) );
            return this;
        }
    }

    export class AllMessageCollection extends Backbone.Collection<Message> {
        selectedModel:Message;

        constructor(options:any) {
            super(options);
            for (var str in options) this[str] = options [str];
            this.listenTo(this, 'selectedModel', this.ModelSelected);
        }
        
        setRow():void{
            this.add(new Message());
        }
        
        setEditable():void{
            if(this.selectedModel){
                this.selectedModel.set('editable',true);
            }
        }

        setDestroy():void{
            if(this.selectedModel){
                this.remove(this.selectedModel);
            }
        }

        ModelSelected(model):void {
            if(this.selectedModel){
                this.selectedModel.set('selected', false);
            }
            model.set('selected', true);
            this.selectedModel = model;
        }
    }

    export class AllMessageView extends Backbone.View<Message> {
        private options:any;

        constructor(options:any) {
            super(options);
            this.options = options;
            this.setElement($('#tablebody'));
            this.collection.bind("add", this.ModelAdded, this);
        }

        ModelAdded(message):any {
            var row:MessageView = new MessageView({tagName: 'tr', model: message});
            this.$el.append(row.render().el);
            return this;
        }
    }
}