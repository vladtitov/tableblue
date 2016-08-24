/**
 * Created by Vlad on 6/29/2016.
 */
    ///<reference path="../com.ts"/>

module rating{
    interface VOData {
        icon: string;
        Dial: number;
        Prescriber: number;
        Non_prescriber: number;
        COUNTER_ready_eff: number;
        time:number;
        calculated:string;
        calc:number;
        total:number;
        rating:number;
    }


    export class DataModel extends Backbone.Model{
        static timeK:number=3600;
        static percentOf:number;
        static criteria:Criteria[];
        initialize(){
            this.updateData();
            this.on('change',()=>this.updateData());
        }

        updateData():void{
            this.attributes.total = this.get('Dial')+this.get('Prescriber')+this.get('Non_prescriber');
            this.attributes.time =  Math.round(this.attributes.COUNTER_ready_eff/DataModel.timeK);
            this.attributes.calculated = (this.attributes.total/this.attributes.time).toPrecision(2);

            this.attributes.rating = (this.attributes.calculated/DataModel.percentOf*100).toPrecision(3);
           var ar:Criteria[] = DataModel.criteria;;
            if(ar)for(var i=0,n=ar.length;i<n;i++)if(this.attributes.rating<ar[i].max){
                this.attributes.icon = ar[i].icon;
                break;
            }
            this.trigger('render');
        }

        constructor(obj:any){
            super(obj);

        }
        defaults() : VOData{
            return {
                icon: '',
                Dial: 0,
                Prescriber:0,
                Non_prescriber:0,
                COUNTER_ready_eff: 0,
                calculated:'',
                calc:0,
                total:0,
                time:0,
                rating:0
            }
        }
    }


    export class RowView extends Backbone.View<DataModel> {
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

            this.model.on('render',()=>{
                this.render();
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
            var myevent:JQuery = this.$el.find('.myevent').attr('contenteditable', 'true');
            myevent.blur( ()=>{
                this.model.set('msg', myevent.text());
            })
        }

        remove (): RowView  {
            this.$el.remove();
            return this;
        }

        render (): RowView {
            var data = this.model.toJSON();
            this.$el.html( RowView.template(data) );
            return this;
        }
    }

    export class DataCollection extends Backbone.Collection<DataModel> {
        selectedModel:DataModel;
        model:any = DataModel;        
        
       
        constructor(options:any) {
            super(options);
            for (var str in options) this[str] = options [str];
            this.listenTo(this, 'selectedModel', this.ModelSelected);

        }
        
        setK(num:number){
            DataModel.timeK = num;

            this.each(function (item:DataModel) {
                item.updateData()
            })
        }
        onPrecentCnenge(num):void{
            DataModel.percentOf = num;
            if(this.length>1){
               this.each(function (item:DataModel) {
                   item.updateData()
                })
            }

        }

        parse(res):any{
            var ar:VOData[] = []
              _.map(res.agents,function(item:VOData){
                  item.Non_prescriber = item['Nonprescriber'];
                  item.calculated='';
                  ar.push(item);
            })
            return ar
        }
        setRow():void{
            this.add(new DataModel({}));
        }

        setEditable():void{
            if(this.selectedModel){
                this.selectedModel.set('editable',true);
            }
        }


        setCriteria(ar:Criteria[]):void{
            DataModel.criteria = ar;
            if(this.models.length>1){
                this.each(function(item:DataModel){
                    item.updateData();
                })
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

    


    export class TableView extends Backbone.View<DataModel> {
        private options:any;

        collection:DataCollection;
        private $tools:JQuery;

        onDeviderChanged(num):void{
            this.collection.setK(num);
            $('#Devider').text(num);
        }
        onPercentChange(num:number):void{
            console.log(num);
            this.collection.onPrecentCnenge(num);
        }

        dayWeekSettings:DayWeekSettings
        constructor(options:any) {
            super(options);
            this.dayWeekSettings = new DayWeekSettings();
            this.dayWeekSettings.onPercent = (num)=>this.onPercentChange(num);
            this.dayWeekSettings.loadData().then(()=>{
                this.collection.fetch({data:{report:'d'}});
            })

            this.dayWeekSettings.onCahange = (ar:Criteria[])=>{
                    this.collection.setCriteria(ar)
            }
            this.collection = new DataCollection(options);

            var radios:JQuery = $('[name=WeeklyDayly]').change(()=>{
                radios.each((i,item)=>{
                    if($(item).prop('checked'))  this.collection.fetch(
                        {
                        data: {
                            report: $(item).val()
                        }
                        }
                );
                })

            })


            $('#Devider').text(DataModel.timeK);


            RowView.template = _.template(document.getElementById('DataRow').innerHTML);


            this.options = options;
            this.setElement($('#tablebody'));

            this.collection.bind("add", this.ModelAdded, this);

        }

        ModelAdded(model):any {
          ///  console.log(model);
          var row:RowView = new RowView({tagName: 'tr', model: model});
           this.$el.append(row.render().el);
            return this;
        }
    }



    interface Criteria{
        max:number;
        state:string;
        icon:string;
    }

class DayWeekSettings{
    private settings:any
    criteria:Criteria[];
    percentOf:number;
    $view:JQuery;
    $list:JQuery;
    onCahange:Function;
    onPercent:Function;
    constructor(){
        this.$view = $('#Calculator');
        this.$list = $('#IconsList');
        $('#btnSave').click(()=>{
            if(confirm('You want to save a new Settings file?'))this.saveData();
        })
        $('#PercentOf').change( ()=> {
           var num:number = Number($('#PercentOf').val());
            if(isNaN(num))return;
            this.percentOf = num;
            if(this.onPercent)this.onPercent(this.percentOf);
        });
    }
    loadData():JQueryPromise<any>{
     return  $.get('dayweek/admin.php').done((res)=>{
            this.criteria = res.criteria;
            this.percentOf = res.percentOf;
         $('#PercentOf').val(this.percentOf);
         if(this.onPercent)this.onPercent(this.percentOf);
         if(this.onCahange)this.onCahange(this.criteria);
         this.render();
        })
    }


    setCriteria(ar:number[]):void{
        if(this.criteria.length !==ar.length) return;
       for(var i=0,n=this.criteria.length;i<n;i++){
           this.criteria[i].max = ar[i];
       }

        if(this.onCahange)this.onCahange(this.criteria);
    }
    addListeners():void{
        var inputs = this.$list.find('input').change(()=>{
            var ar:number[]=[];
            var valid=true;
            inputs.each(function(i,el){
                var val:number = Number($(el).val());
                ar.push(val)
                if(isNaN(val))  valid= false
            })
            if(valid) this.setCriteria(ar)
        })

    }

    render():void{
        var out:string = '';
        var i=0;
        this.criteria.forEach((item:Criteria)=>{
            out+='<div>' +
                '<div class="text-center">'+item.state+'</div>' +
                '<div class="text-center"><img src="'+item.icon+'" /></div>' +
                'to <input type="text" value="'+item.max+'" size="1" data-i="'+(i++)+'" /> ' +
                '</div>';
        })
        this.$list.html(out);
        this.addListeners();
    }
    saveData():void{
        $.post('dayweek/admin.php',JSON.stringify({percentOf:this.percentOf,criteria:this.criteria})).done((res)=>{
            if(res.success) alert('Settings saved on server');
            else alert('Error '+res);
        })
    }
}


    export class RaitingManager{

      /*  $agent['ready_eff'] = (int) $agent['COUNTER_ready_eff']/3600;
        $agent['calc'] = ($agent['Dial']+$agent['Prescriber']+$agent['Non- prescriber'])/($agent['ready_eff']/12);
*/
        


        constructor(){

            var table:TableView = new TableView({
                    url:'dayweek/bsd.php'
           })

        }

    }


    $(document).ready(function(){
        new RaitingManager();

    })


}


