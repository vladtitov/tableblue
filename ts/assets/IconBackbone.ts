/**
 * Created by yrik6 on 08.06.2016.
 */
///<reference path="com.ts"/>

module iconsAdmin{
    export  class VOIcon {
        id:string;
        icon:string;
        name:string;
        filename:string;
    }

    export class RowModel extends Backbone.Model {
        defaults():VOIcon {
            return {
                id:'',
                icon: '',
                name:'',
                filename:''
            }
        }
        constructor(obj:any){
            super(obj);
        }
    }

    export class RowView extends Backbone.View<RowModel> {

        static template:any = _.template( $('#row-template').html() );
        constructor (options: any) {
            super(options);
            this.model.on('change', ()=>this.render());
        }
        render (): RowView {
            var data = this.model.toJSON();
            this.$el.html( RowView.template(data) );
            this.$el.find('.btn').change((evt)=>this.reuploadImage(evt));
            return this;
        }

        uploadFile(url:string) {
            this.model.set('icon', url + '?' + Date.now());
        }

        reuploadImage(evt:JQueryEventObject):void{
            var input:any = evt.target;
            var file= input.files[0];
            var form = new FormData();
            form.append('file',file);
            $.ajax({
                url:'assets/assets.php?filename=' + this.model.get('filename'),
                type: 'POST',
                dataType: 'json',
                data: form,
                cache: false,
                contentType: false,
                processData: false
            }).done((res)=>{
                if(res.error){
                    alert(res.error);
                    return;
                }
                else if(res.success == 'success'){
                    this.uploadFile(res.result);
                }
            }).fail((res)=>{
                console.log('fail',res);
            });
        }
    }

    export class AllIconCollection extends Backbone.Collection<RowModel> {
        selectedModel:RowModel;

        constructor(options:any) {
            super(options);
            for (var str in options) this[str] = options [str];
            this.fetch();
        }

        parse(res){
            return res.assets;
        }
    }

    export class TableView extends Backbone.View<RowModel> {
        private options:any;

        constructor(options:any) {
            super(options);
            this.options = options;
            this.setElement($('#tablebody'));
            this.collection.bind("add", this.ModelAdded, this);
        }

        ModelAdded(icon:RowModel):TableView {
            var row:RowView = new RowView({tagName: 'tr', model: icon});
            this.$el.append(row.render().el);
            return this;
        }
    }
}

$(document).ready(function(){
    var collection = new iconsAdmin.AllIconCollection({
        url:'assets/assets.php',
    });

    var t = new iconsAdmin.TableView({collection:collection});
})