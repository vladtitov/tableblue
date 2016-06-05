/**
 * Created by yrik6 on 18.04.2016.
 */
///<reference path="../js/base.ts"/>

    
module Table {
    interface People {
        date: number;
        start: number;
        end: number;
        myevent: string;
        selected: boolean;
        location: string;
        editable: boolean;
    }

    export class Person extends Backbone.Model{
        defaults() : People{
            return {
                date: 0,
                start: 0,
                end: 0,
                myevent: '',
                selected: false,
                location: '',
                editable: false
            }
        }
    }


    export class PersonView extends Backbone.View<Person> {
        static template:any = _.template( $('#row-template').html() );
        constructor (options: any) {
            super(options);
            this.model.on('remove', ()=>this.remove());
            this.$el.on('click', (evt)=>this.edit(evt));

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
                    this.$el.find('.location').attr('contenteditable', false);
                }
            })
        }

        edit(evt): void {
            if(!this.model.get('selected')) {
                this.model.trigger('selectedModel', this.model);
            }
            else {
                this.model.set('editable', true);
            }
        }

        makeEditable():void{
            this.$el.removeClass('warning').addClass('info');
            var myevent:JQuery = this.$el.find('.myevent').attr('contenteditable', true);
            var mylocation:JQuery = this.$el.find('.location').attr('contenteditable', true);
            myevent.blur( ()=>{
                console.log(myevent.text());
                this.model.set('myevent', myevent.children().text());
            })
            mylocation.blur( ()=>{
                this.model.set('location', mylocation.children().text());
            })
        }

        remove (): PersonView  {
            this.$el.remove();
            return this;
        }
        
        render (): PersonView {
            // var data = this.model.toJSON();
            // data.date = moment.unix(data.date).format('MM DD YYYY');
            // data.start = moment.unix(data.start).format('h:mm a');
            // data.end = moment.unix(data.end).format('h:mm a');
            // this.$el.html( PersonView.template(data) );
            return this;
        }
    }

    export class AllPersonCollection extends Backbone.Collection<Person> {
        selectedModel:Person;

        constructor(options:any) {
            super(options);
            for (var str in options) this[str] = options [str];
            this.listenTo(this, 'selectedModel', this.ModelSelected);
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

    export class AllPersonView extends Backbone.View<Person> {
        private options:any;

        constructor(options:any) {
            super(options);
            this.options = options;
            this.setElement($('#tablebody'));
            this.collection.bind("add", this.ModelAdded, this);
        }

        ModelAdded(person):any {
            var row:PersonView = new PersonView({tagName: 'tr', model: person});
            this.$el.append(row.render().el);
            return this;
        }
    }
}
