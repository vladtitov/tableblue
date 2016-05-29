///<reference path="../base.ts"/>


module tables {
    import AgentModel = table.AgentModel;
    import RowView = tables.OneIcon;
    // import RowView = tables.RowViewNested;
    // import RowView = Table.PersonView;

    // import RowView = tables.RowViewSimple;
    
    export class AgentsCollection extends Backbone.Collection<AgentModel> {
        model:any = AgentModel;
        data:any;
        params:any;         

        constructor(options:any) {
            super(options)
            this.url = options.url;
            this.params = options.params;
            this.fetch({data: this.params});
            // console.log(this.params);
            
            setInterval(()=>{
                if(this.params.report == 'd') {
                    this.params.report ='w';
                    $('#DailyWeekly').text('Weekly Report');
                }
                else {
                    this.params.report = 'd';
                    $('#DailyWeekly').text('Daily Report');
                }
                this.fetch({data: this.params});
            },5000);
        }

        parse(res) {
            _.map(res.agents, function (item:any) {
                item.id = item.AGENT_POSITION_ID;
                item.non_prescriber = item['Non- prescriber'];
                item.icon = '' + item.icon;
            });
            return res.agents;
        }
    }


    export class TableView extends Backbone.View<AgentModel> {
        collectionAgentsC;

        container:JQuery;

        constructor(options) {
            super(options);
            this.container = $(options.container);
            this.setElement(this.container.find('tbody').first(), true);
            RowView.template = _.template($(options.rowTempalete).html());
            this.collection = options.collection;
            this.collection.bind('remove', (evt)=> {
                // console.log('remove', evt);
            }, this);

            this.collection.bind("add", (evt)=> {
                //  console.log('add',evt);
                var row = new RowView({model: evt, tagName: 'tr'});
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


