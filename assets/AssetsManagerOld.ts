/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="../ts/typings/jquery.d.ts"/>

module upload {

    class R_C {
        $texts:_.Dictionary<JQuery>;
        $visible:_.Dictionary<JQuery>;
        $imgs:_.Dictionary<JQuery>;
        $chk:_.Dictionary<JQuery>;
        item:any;

        constructor($view:JQuery) {
            this.$texts = this.createCollection('data-text', $view);
            this.$visible = this.createCollection('data-vis', $view);
            this.$imgs = this.createCollection('data-img', $view);
            this.$chk = this.createCollection('data-chk', $view);
        }

        createCollection(type:string, $view:JQuery):_.Dictionary<JQuery> {
            var obj:any = {}
            $view.find('[' + type + ']').each(function (i, el) {
                obj[String(el.getAttribute(type))] = $(el);
            })
            return obj;
        }

        getObject(str:string) {
            return this.$texts[str] || this.$visible[str] || this.$imgs[str] || this.$chk[str];
        }


        getData():any {
            var item = {};
            for (var str in this.$texts)item[str] = this.$texts[str].text();
           // for (var str in this.$visible)item[str] = this.$visible[str].visible();
            for (var str in this.$imgs)item[str] = this.item[str];
            for (var str in this.$chk)item[str] = this.$chk[str].prop('checked');

            return item;

        }

        setData(item:any) {
            //  console.log(item);
            this.item = item;
            for (var str in this.$texts)this.$texts[str].text(item[str]);
            //for (var str in this.$visible)item[str] ? this.$visible[str].show() : this.$visible[str].hide();
            for (var str in this.$imgs)this.$imgs[str].css('background-image', 'url(' + item[str] + ')');
            for (var str in this.$chk)this.$chk[str].prop('checked', item[str]);

        }
    }


    class ListItem5 {
        static onSelect = function (itrm:ListItem5) {
        };
        $icon:JQuery;
        $view:JQuery;
        $msg:JQuery;
        $id:JQuery;
        id:number;
        stamp:number;
        $timeout:JQuery;
        current:string = '';
        timer:number = 0;
        rc:R_C;

        constructor(item:any, template:string) {

            this.id = item.id;
            this.$view = $(template);
            this.rc = new R_C(this.$view);
            this.setData(item);
            this.$view.click(()=>{ListItem5.onSelect(this)});
        }

        setData(item:VOAgent):void {
            this.rc.setData(item);
        }

        getDaata():any {
            return this.rc.getData();
        }

        appendTo($cont:JQuery) {
            $cont.append(this.$view);
        }

        lastTime:number;
        currentTime:number;

        remove():void {
            this.$view.fadeOut(()=> {
                this.$view.remove()
            })
        }


    }


   export  class ListUpload {
        $view:JQuery;
        $tbody:JQuery;
        $nano:JQuery;
        data:ListItem5[];
        private template:string;
       onData:Function;
       onDelete:Function;
       onEdit:Function;

       private btnUpload:string;
       private btnDelete:string;
       private btnEdit:string;


        constructor(private listid:string, private options:any) {
            for (var str in options)this[str] = options[str];

        }
        init():void {
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
            this.template = this.$view.find('[data-id=template]').html();
            ListItem5.onSelect = (item)=>{
              //  console.log(item);
                if(this.selected) this.selected.$view.removeClass('selected');
                this.selected = item;
                this.selected.$view.addClass('selected');
            }

            if(this.btnUpload)$(this.listid+' '+this.btnUpload).change((evt)=>this.uploadFile(evt))
            if(this.btnDelete) $(this.listid+' '+this.btnDelete).click((evt)=>this.deleteFile(evt));
           if(this.btnEdit) $(this.listid+' '+this.btnEdit).click((evt)=>this.openEditPanel(evt));

        }

       getSelected():any{
           return this.selected?this.selected.getDaata():0;
       }
       selected:ListItem5

        getparams:string = '2016-03-15T7:58:34';
        postparams:string = '';

        // collection:_.Dictionary<ListItem2> ={};
        stamp:number;
        saveurl:string = '';
        serviceUrl:string;

        loadData(params?:string):void {
            if(params)this.getparams = params;
            $.get(this.serviceUrl + this.getparams).done((data)=> {
                this.onData(data);
            }).fail((reason)=> {
                console.log(reason);
            })
        }

        setData(data:any[]) {
            var out:ListItem5[] = []
            var ar:any[] = data;
            this.$tbody.empty();
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = new ListItem5(ar[i], this.template);
                item.appendTo(this.$tbody);
                out.push(item);
            }
            this.data = out;
            this.selected = null;
            if (this.$nano.length)this.$nano.nanoScroller();
        }

        getData():any[] {
            var out:any[] = [];
            var ar:any[] = this.data;
            for (var i = 0, n = ar.length; i < n; i++) {
                out.push(ar[i].getDaata());
            }
            return out;
        }

       $editPanel:JQuery;
       $editImasge:JQuery;
       $editInput:JQuery;
       private initEditPanel():void{
           this.$editPanel =  $(this.listid+' [data-id=editpanel]:first');
          // console.log(  this.$editPanel);
           this.$editImasge =   this.$editPanel.find('[data-img=icon]');
           this.$editInput = this.$editPanel.find('[data-text=filename]');
           this.$editPanel.find('[data-id=close]').click(()=>{  this.$editPanel.fadeOut();});
           this.$editPanel.find('[data-id=save]:first').click(()=>this.saveEditImage())
           this.$editPanel.find('[data-id=reupload]:first').change((evt)=>this.reuploadImage(evt));

       }

       reuploadImage(evt:JQueryEventObject):void{
           console.log('reupload');
           var filename:string = this.$editInput.val();
           var input:any = evt.target;
           var file= input.files[0];
           var form = new FormData();
           form.append('file',file);
           $.ajax({
               url:this.serviceUrl+'a=upload',
               type: 'POST',
               dataType: 'json',
               data: form,
               cache: false,
               contentType: false,
               processData: false
           }).done((res)=>{
               console.log(res);
               if(res.error){
                   alert(res.error);
                   return;
               }

               this.$editImasge.attr('src',res.result);
               this.$editImasge.data('newimg',res.filename);
              // this.$editPanel.fadeOut();
               this.loadData();
           }).fail((res)=>{
               console.log('fail',res);
           });
       }

      newimage:string;
       saveEditImage():void{
           var input  = this.$editInput;
           var oldname = input.data('oldname');
           var newname = input.val();
           var newimg = this.$editImasge.data('newimg');
           if(newimg)oldname = newimg;

           var out = {oldname:oldname,newname:newname};

           $.post(this.serviceUrl+'a=rename',JSON.stringify(out)).done((res)=>{
               if(res.error){
                   alert(res.error);
                   return;
               }
               console.log(res);
               if(res.success) {
                 if(res.replaced) this.newimage = res.newname;
                   else this.newimage = null;
                   this.$editPanel.fadeOut();
                   this.loadData();
               }else if(res.error) alert(res.error);

           }).fail(function(err){ console.log(err)});


       }
        openEditPanel(evt:JQueryEventObject):void{
            var sel= this.getSelected();
            if(!sel)  return;

            console.log(sel);
            if(!this.$editPanel) this.initEditPanel()
            this.$editImasge.attr('src',sel.icon);
            this.$editImasge.data('oldimg',sel.icon);
            this.$editImasge.data('newimg',null);
          //  $(this.listid+' '+this.btnUpload).val('');

            this.$editInput.data('oldname',sel.filename).val(sel.filename);

            this.$editPanel.show();
        }

       uploadFile(evt:JQueryEventObject):void{
               var input:any = evt.target;
               var file= input.files[0];
               var form = new FormData();
               form.append('file',file);
               $.ajax({
                   url:this.serviceUrl+'a=upload',
                   type: 'POST',
                   dataType: 'json',
                   data: form,
                   cache: false,
                   contentType: false,
                   processData: false
               }).done((res)=>{
                   console.log(res);
                   if(res.error) alert(res.error)
                   else this.loadData();
               }).fail((res)=>{
                   console.log('fail',res);
               });
       }
       deleteFile(evt:JQueryEventObject):void{
               var sel = this.getSelected();
               if(!sel) return;
               var filename = sel.filename;
               var conf = confirm('You want to delete '+filename);
               if(conf){
                   $.get(this.serviceUrl+'a=delete&filename='+filename).done((res)=>{
                       this.loadData();
                       console.log(res);
                   }).fail(()=>{
                       this.loadData();
                   });
               }
       }

        saveData(data:any):void {
            var out:any = {};
            out.data = data;
            console.log(data);
            var user:any = {}
            user.user = this.$view.find('[data-id=user]:first').val();
            user.pass = this.$view.find('[data-id=pass]:first').val();
            out.user = user;
            var url:string = this.saveurl + this.postparams;
            console.log(url);
            $.post(url, JSON.stringify(out)).done((res)=> {
                console.log(res);
                if (res.result == 'SAVED') alert('Data saved on server');
                else alert('Error ' + res.result);

            }).fail((fail)=> {
                console.log(fail);
                alert('Error ' + fail);
            })
        }

    }
}
