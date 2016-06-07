///<reference path="../base.ts"/>
 
 
module utils{
   export class AutoScroller{
       private isRunning:boolean;
       
       scrollWindow:string;
       scrollContent:string;
       list:string;
       
       $scrollWindow:JQuery;      
       $scrollContent:JQuery;       
       $list:JQuery;
       windowWidtht:number;
       // scrollWidtht:number=0;
       timerId:number;
       step:number=0;
       delay:number=1;
       speed:number=0.5;
       private currentScroll:number=0;
       private actualScroll:number;

        constructor(options:any){
            for(var str in options)this[str] = options[str];
            this.$scrollWindow = $(this.scrollWindow).first();
            this.$scrollContent = $(this.scrollContent).first();
            this.$list = $(this.list).first();

            this.init();
            setTimeout(()=>this.start(null),2000);
        }

       private onScrollEnd():void{
           console.log('scrollend');
           this.stop(null)
       }

       private checkScroll(){
           var scroll:number =  this.$scrollWindow.scrollLeft();
           // if(scroll == this.actualScroll)this.onScrollEnd();
           // this.actualScroll = scroll;

           // console.log(this.$scrollWindow.width());
           // console.log(this.$scrollContent.width());

           if(this.$scrollWindow.width() > this.$scrollContent.width()) {
               if (this.step == 1) {
                   this.step = 0;
                   this.currentScroll = 0;
                   this.$list.append(this.$list.children().first());
                   // this.$list.append(this.$list.children().first());
                   this.$scrollWindow.scrollLeft(0);
               }
           }
       }
       private nextStep():void{
           //TODO from one to lines broken
           if(this.$scrollWindow.width() < this.$scrollContent.width()) {
               console.log("No scroll");
               return;
           }
           var h:number = this.$list.children(this.step).width();
           this.step++;
           this.currentScroll+=h;
           this.$scrollWindow.animate({
               scrollLeft:this.currentScroll
           },this.speed,()=>{
               this.checkScroll();
           })
       }
       setWidth():void{
           this.windowWidtht = this.$scrollWindow.width();
       }

       init():void{
           this.delay = this.delay*1000;
           this.speed = this.speed*1000;
           this.$scrollWindow.on('mouseover',(evt)=>this.stop(evt));
           this.$scrollWindow.on('mouseleave',(evt)=>this.start(evt));
           this.setWidth();
       }
        start(evt:JQueryEventObject):void{
           // console.log('starting',this);
            if(this.isRunning) return;
            $(".scroll-window").css('overflow-x', 'hidden');
            this.timerId = setInterval(()=>{this.nextStep()},this.delay);
        }
        stop(evt:JQueryEventObject):void{

            //console.log('stopping',this);
            clearInterval(this.timerId);

            this.isRunning=false;
            $(".scroll-window").css('overflow-x', 'auto');
            // $(".nano").nanoScroller();
        }
    }
}

