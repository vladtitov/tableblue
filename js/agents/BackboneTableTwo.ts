///<reference path="../base.ts"/>


module tablesTwo {
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
                item.id = item.id;
                item.time = item.t||0;
                item.icon = '' + item.icon;
            });
            return res.list;
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