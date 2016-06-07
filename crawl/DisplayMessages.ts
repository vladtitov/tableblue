///<reference path="../js/base.ts"/>


module movingtext {
     export class Messages{
        private interval:number=200000;
        $el:JQuery;
        url:string;
        messages:Array<string>;
        private speed:number=1;

        static sendError (message) {
         $.post ("crawl/log.php", message);
        }

        constructor(options:any){
            for(var str in options)this[str]=options[str];
            this.$el=$(options.selector);
            this.start();
        }

        start():void {
            var that = this;
            that.loadData();
            setInterval(()=>{
                that.loadData();
            },this.interval);
        }

        loadData():void{
            var that = this;
            $.get(this.url, (result:any [] ) =>{
                this.messages = result;
                that.render();
            });
        }

        private render(){
            var mov =  $("<marquee behavior='scroll' direction='up' scrollamount='" + this.speed + "' height='560px'>");
            if (!this.messages) {
                movingtext.Messages.sendError ("this messages null");
                return;
            }
            this.messages.forEach( function (item ) {
                $('<p>').html(item).appendTo(mov);
            });
            this.$el.empty();
            this.$el.append(mov);
        }
    }
}
var MTROptions={
    selector:"#message-template",
    url:"crawl/gettext.php",
    interval:25000,
    speed:3
}

var movingText = new movingtext.Messages(MTROptions);

