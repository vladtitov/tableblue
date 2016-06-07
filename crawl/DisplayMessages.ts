///<reference path="../js/base.ts"/>

module movingtext {
     export class Messages{
        private interval:number=200000;
        private width:number;
        private isFirstTime:boolean=true;
        $el:JQuery;
        url:string;
        requestParams:any;
        messages:Array<string>;
        private position:number =0;
        private speed:number=1;
         
         sendError (message) {
             $.post ("crawl/log.php", message);
         }

        isRuning:boolean

        constructor(options:any){
            for(var str in options)this[str]=options[str];
            this.$el=$(options.selector);
            this.start();
            this.loadData();
        }


        private onScrollEnd():void{
            this.render();
            this.stop();
            this.position = 0;
            setTimeout(()=>{
                this.start();
                this.scroll();
            },5000);
        }

        private prev:number;

        scroll():void{
            if(this.isRuning)requestAnimationFrame(()=>{  this.scroll(); });
        }
         
        start():void {
            this.isRuning = true
        }

        loadData():void{
            $.get(this.url, (result:any [] ) =>{
                this.messages = result;
                console.log(this.messages);
                if (this.isFirstTime) {
                    this.render();
                    this.isFirstTime = false;
                    this.scroll();
                }
            });
        }

        stop(){
            this.isRuning = false;
        }

        private render(){
            var mov =  $('<marquee behavior="scroll" direction="up" height="655px">');
            if (!this.messages) {
                this.sendError ("this messages null");
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
    speed:1
}

var movingText = new movingtext.Messages(MTROptions);

