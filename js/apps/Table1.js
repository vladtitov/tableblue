/**
 * Created by Vlad on 4/27/2016.
 */
///<reference path="../base.ts"/>
$(document).ready(function () {
    console.log('ready');
    var collectionTwo = new tablesTwo.AgentsCollection({
        url: 'agents/getagents.php'
    });
    var dd = new tablesTwo.TableView({
        container: '#AgentsList2',
        rowTempalete: '#row-template2',
        collection: collectionTwo
    });
    var scroller = new utils.AutoScroller({
        scrollWindow: '#AgentsList2 .scroll-window',
        scrollContent: '#AgentsList2 .scroll-content',
        list: '#AgentsList2 .scroll-window ul',
        delay: 3,
        speed: 0.7
    });
});
//# sourceMappingURL=Table1.js.map