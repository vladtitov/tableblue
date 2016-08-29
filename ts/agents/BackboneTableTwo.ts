///<reference path="../com.ts"/>
module tablesTwo {
    'use strict'
    
    import AgentModel = tablesTwo.AgentModel;
    import RowView = tablesTwo.RowViewTwo;

    export class AgentsCollection extends Backbone.Collection<AgentModel> {
        model:any = AgentModel;
        data:any;

        constructor(options:any) {
            super(options)
            this.url = options.url;
        }


        refreshData(delay:number):void{
            var self=this;
            setTimeout(()=>this.fetch({
                error:function(){
                    self.refreshData(60)
                }
                ,success: function(){
                    // console.log('on success  data');
                }
            }),delay*1000);

        }
        parse(res) {
            if(res && res.list && res.list.length){
                _.map(res.list, function (item:any) {
                });
                var delay:number = res.list.length*5;

                if(delay<30)delay=30;
               if(delay>60) delay = 60
                this.refreshData(delay);
                return res.list;
            }else{
                this.refreshData(60);
            }

        }

      /*  createName(name:string):string{
            var mass = name.split(',');
            var out = mass[0];

            return out;
        }*/
    }
    
    export class TableView extends Backbone.View<AgentModel> {
        container:JQuery;

        constructor(options) {
            super(options);
            this.container = $(options.container);
            this.setElement(this.container.find('ul').first(), true);
            
            RowView.template = _.template($(options.rowTempalete).html());

            this.collection = options.collection;
            this.collection.bind('remove', (evt)=> {
            }, this);

            this.collection.bind("add", (evt)=> {
                var row = new RowView({model: evt, tagName: 'li'});
                this.$el.append(row.render().el);
            }, this);
            this.render = function () {
                return this;
            }
        }

        render():TableView {
            return this;
        }
    }
}

$(document).ready(function(){

    console.log('TableTwo ready');

    var collectionTwo = new tablesTwo.AgentsCollection({
        url:'agents/getagents.php'
    });

    var dd = new tablesTwo.TableView({
        container:'#AgentsList2',
        rowTempalete:'#row-template2',
        collection:collectionTwo
    });

    var scroller:utils.AutoScroller = new utils.AutoScroller({
        scrollWindow:'#AgentsList2 .scroll-window',
        scrollContent:'#AgentsList2 .scroll-content',
        list:'#AgentsList2 .scroll-window ul',
        delay:3,
        speed:0.7
    });



        collectionTwo.refreshData(0.01);

})
