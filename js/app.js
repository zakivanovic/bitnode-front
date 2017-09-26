var intervals = [];
var routeParams;

$(document).ready(function ()
{
    var app = $.sammy('#main', function() {
        /* Node route */
        this.get('#/', function(context) {
            resetIntervals(intervals);
            loadLayout('node');
            this.load('views/node.html').swap();
        });

        /* Explorer route */
        this.get('#/explorer', function() {
            resetIntervals(intervals);
            loadLayout('explorer');
            this.load('views/explorer.html').swap();
        });

        /* Block route */
        this.get('#/explorer/block/:id', function(data) {
            routeParams = data.params;
            resetIntervals(intervals);
            loadLayout('explorer');
            this.load('views/block.html').swap();
        });

        /* Wallet route */
        this.get('#/wallet', function() {
            resetIntervals(intervals);
            loadLayout('wallet');
            this.load('views/wallet.html').swap();
        });
    });
    
    $(function() {
        app.run('#/');
    });

    toastr.options = {
        "positionClass": "toast-top-full-width",
    }
});

function resetIntervals(intervals) {
    intervals.forEach(function(interval) {
        clearInterval(interval);
    }, this);
    intervals = [];
}