///<reference path="../base.ts"/>


module tablesTwo {
    import AgentModel = tableTwo.AgentModel;
    import RowView = tablesTwo.RowViewTwo;
    
    export class AgentsCollection extends Backbone.Collection<AgentModel> {
        model:any = AgentModel;
        data:any;
        params:any;         

        constructor(options:any) {
            super(options)
            this.url = options.url;
            this.params = options.params;
            this.fetch({data: this.params});
            setInterval(()=> {
                this.fetch({data: this.params});
            }, 5000);
        }

        parse(res) {
            var d:string = res.stamp;
            this.params.date = d.replace(' ', 'T');
            var stamp = Date.now();
            _.map(res.result.list, function (item:any) {
                item.id = item.id;
                item.time = item.t||0;
                item.icon = '' + item.icon;
            });
            return res.result.list;
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
                console.log(this);
                return this;
            }
        }

        render():TableView {
            console.log('render');
            return this;
        }
    }
}


