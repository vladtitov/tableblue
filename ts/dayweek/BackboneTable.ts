///<reference path="../com.ts"/>

///<reference path="DayWeekRow.ts"/>

module tables {
    
    
    export class AgentsCollection extends Backbone.Collection<AgentModel> {
        model:any = AgentModel;
        data:any;
        params:any;         

        myInterval:number;
     agentsTotal:number;
        constructor(options:any) {
            
            super(options)
            this.url = options.url;
            this.params = options.params;
            this.sendRequest();
            /*setInterval(()=>{

                this.fetch({data: this.params});
            },30000);*/
        }

        sendRequest():void{
            if(this.params.report == 'd')   this.params.report ='w';
            else  this.params.report = 'd';

            var self=this;
            this.fetch({
                data: this.params,
                error:function(){
                    self.setMyTimeout(30)
                }
                ,success: function(){
                   // console.log('on success  data');
                }
            });
        }

        setHeaders():void{

            if(this.params.report == 'w')  $('#DailyWeekly').text('Weekly Report');
            else  $('#DailyWeekly').text('Daily Report');
        }

        mytimeout:number;
        setMyTimeout(num):void{
            // d 180, w 60
           // console.log('setMyTimeout '+num);
            // if(isNaN(num) || num<6)num=6;
            // var delay = (num-6)*5+15;
            var delay;
            if(this.params.report == 'd')  delay = 180;
            else  delay = 60;
            console.log('refreshDayweek  in '+delay);
         this.mytimeout =   setTimeout(()=>this.sendRequest(),delay*1000);
        }

        parse(res) {
           // console.log('parse resulte ',res);
                if(res && res.agents){
                    this.setHeaders();
                    this.setMyTimeout(res.agents.length)
                    _.map(res.agents, function (item:any) {
                        item.non_prescriber = item['Nonprescriber'];
                        if(isNaN(item.non_prescriber)) item.non_prescriber =0;
                        item.connects = item.non_prescriber + item.Prescriber;
                        if(isNaN(item.connects)) item.connects =0;
                        item.total = item.Dial + item.connects;
                        if(isNaN(item.total))item.total =0;

                    });
                    this.trigger('myParse', res.agents, this.params.report);
                    return res.agents;
                }else {

                    this.setMyTimeout(60000);
                    return [];
                }
        }
    }


    export class TableView extends Backbone.View<AgentModel> {
        container:JQuery;

        constructor(options) {
            super(options);
            this.container = $(options.container);
            this.setElement(this.container.find('.agents-list').first(), true);
            DayWeekRowView.template = _.template($(options.rowTempalete).html());
            this.collection = options.collection;
            this.collection.bind('remove', (evt)=> {
            }, this);

            this.collection.bind("add", (evt)=> {
                var row = new DayWeekRowView({model: evt, tagName: 'tr'});
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
    console.log('Table 1 ready');
    var collection = new tables.AgentsCollection({
        url:'dayweek/bsd.php',
        params:{
            report:'d'
        }
    });

    var t = new tables.TableView({
        container:'#AgentsList1',
        rowTempalete:'#row-template',
        collection:collection
    });

    var scrollerDay:utilsDay.AutoScroller = new utilsDay.AutoScroller({
        scrollWindow:'#AgentsList1 .scroll-window',
        scrollContent:'#AgentsList1 .scroll-content',
        list:'#AgentsList1 .scroll-window tbody',
        delay:2,
        speed:0.7
    })

    var controller = new tables.SummaryController(collection);
})