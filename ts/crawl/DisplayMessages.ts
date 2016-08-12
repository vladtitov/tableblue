///<reference path="../com.ts"/>

module movingtext {
    export class Messages{
        private interval:number=200000;
        private height:number;
        private isFirstTime:boolean=true;
        $el:JQuery;
        url:string;
        messages:string;
        private position:number =0;
        private speed:number=1;
        isRuning:boolean;

        static sendError (message) {
            $.post ("crawl/log.php", message);
        }

        private hieght:number;
        constructor(options:any){
            for(var str in options)this[str]=options[str];
            this.$el=$(options.selector);

                this.interval = options.interval;
                this.height = this.$el.height();
                this.loadData();
                setInterval( () =>{
                    this.loadData();
                }, this.interval)

        }




        private onScrollEnd():void{
            this.$el.empty();
            this.render();
            this.stop();
            this.position = 0;
            setTimeout( () => {
                this.start();
            }, 1000);
         }

        private prev:number;
        private evennum:number=0;

        scroll():void{
            if(this.isRuning){
                if(typeof requestAnimationFrame ==='udefined'){
                    setTimeout(()=>this.scroll(),20);
                }else requestAnimationFrame(()=>{  this.scroll(); });
            }

            if (this.evennum===0) {
                this.evennum = 1
                return
            } else {
                this.evennum =0;
            }

            if(this.maxScroll>0 && this.position >this.maxScroll){
              /////  console.log(' scroll ceneter ');
                return;
            }

           this.position+=this.speed;
            this.$el.scrollTop(this.position);


            this.endcount ++;
            if(this.endcount>3){
                this.endcount =0;
                var w = this.$el.scrollTop();
                if(this.prev === w){
                    this.onScrollEnd();
                }
                this.prev = w;
            }



        }



        endcount:number = 0
        start():void {
            if(!this.isRuning){
                console.log('starting '+(typeof requestAnimationFrame) );
                this.prev = -1;
                this.isRuning = true;
                this.endcount =0;
                this.scroll();
            }

        }

        loadData():void{
            $.get(this.url, (result:string [] ) =>{
                var msgs = '<p class="spacer"></p>'+result.join('<br/><br/>')+'<p class="spacer">';
                if(this.messages == msgs){
                    console.log('same data');
                    return;
                }
                console.log('data cahanged');
                this.maxScroll = -1;
                this.messages = msgs;
                if (!this.messages) {
                    movingtext.Messages.sendError ("this messages null");
                    return;
                }
                if (this.isFirstTime){
                    this.render();
                    this.isFirstTime=false;
                    this.start();
                }
            });
        }

        stop(){
            console.log('stop');
            this.isRuning = false;
        }
        private $text:JQuery;
        private maxScroll:number;
        private render(){
            this.$el.scrollTop(0);
            var mov =  $('<div>').html(this.messages);
            this.$el.append(mov);
            setTimeout(()=>{
                var h:number = this.$el.height();
              //  console.log(this.$el.children().height());
                var allH:number = this.$el.children().height();
                var d = h*3 - allH
                if(d>0) this.maxScroll =  (allH-h)/2;
               else this.maxScroll =-1;

            },200);
        }

    }
}

var MTROptions={
    selector:"#message-template",
    url:"crawl/gettext.php",
    interval:25000,
    speed:1
}

if($('#message-template').length)   var movingText = new movingtext.Messages(MTROptions);