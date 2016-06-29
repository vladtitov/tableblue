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
            this.fetch();
        }

        parse(res) {
            _.map(res.list, function (item:any) {
                var mass = item.name.split(',');
                var pos1 = mass[0].indexOf('*');
                if (pos1 != -1) pos1 = pos1 + 8;
                else pos1 = 0;
                var out = mass[0].slice(pos1);
                var pos2 = out.indexOf('~');
                if (pos2 != -1) pos2 = pos1 + 1;
                else pos2 = 0;

                item.name = out.slice(pos2);
                item.id = item.id;
                item.time = item.time||0;
                item.icon = '' + item.state;
            });
            return res.list;
        }

        createName(name:string):string{
            var mass = name.split(',');
            var out = mass[0];

            return out;
        }
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

   

    setInterval(function(){
        collectionTwo.fetch();
    }, 10000);
})
