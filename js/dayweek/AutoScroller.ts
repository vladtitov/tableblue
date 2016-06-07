///<reference path="../base.ts"/>

module utilsDay{
   export class AutoScroller{
       private isRunning:boolean;
       
       scrollWindow:string;
       scrollContent:string;
       list:string;
       
       $scrollWindow:JQuery;
       $scrollContent:JQuery;       
       $list:JQuery;
       windowHeight:number;
       scrollHeight:number=0;
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

       private checkScroll(){
           var scroll:number =  this.$scrollWindow.scrollTop();
           this.actualScroll = scroll;

           if(this.$scrollWindow.height() < this.$scrollContent.height()) {
               if (this.step == 2) {
                   this.step = 0;
                   this.currentScroll = 0;
                   this.$list.append(this.$list.children().first());
                   this.$list.append(this.$list.children().first());
                   this.$scrollWindow.scrollTop(0);
               }
           }
       }

       private nextStep():void{
           if(this.$scrollWindow.height() > this.$scrollContent.height()) {
               return;
           }
           var h:number = this.$list.children(this.step).height();
           this.step++;
           this.currentScroll+=h;
           this.$scrollWindow.animate({
               scrollTop:this.currentScroll
           },this.speed,()=>{
               this.checkScroll();
           })
       }

       setHeight():void{
           this.windowHeight = this.$scrollWindow.height();
       }

       init():void{
           this.delay = this.delay*1000;
           this.speed = this.speed*1000;
           // this.$scrollWindow.on('mouseover',(evt)=>this.stop(evt));
           // this.$scrollWindow.on('mouseleave',(evt)=>this.start(evt));
           this.setHeight();
       }

       start(evt:JQueryEventObject):void {
           if(this.isRunning) return;
           this.timerId = setInterval(()=>{this.nextStep()},this.delay);
       }

       stop(evt:JQueryEventObject):void{
           clearInterval(this.timerId);
           this.isRunning=false;
           // $(".nano").nanoScroller();
       }
   }
}