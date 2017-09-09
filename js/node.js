var nodeData;
$(document).ready(function () {

    $.mockjax({
        url: "/api/node",
        responseText: nodeModel /* ./model/nodeModel.js */
    });


    $.ajax({
        url: '/api/node',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            nodeData = data;
            updateView(nodeData);
            console.log(tab);
        },
        error: function (data) {
            alert('Error fetching node data!');
        }
    });
});

const viewPartial = {
    'node' : ["versions.node", "versions.protocol", "versions.wallet", "versions.userAgent", "errors", "mempool.size", "mempool.usage", "mempool.max", "mempool.fee", "disk.path","memory.used", "memory.free", "memory.total"],
    'network' : ["connections", "difficulty", "proxy", "hashrate", "network", "block", "medianTime",  "pruned"],
    'system' : ["sys.hostname", "sys.cpus", "sys.uptime", "sys.os.platform", "sys.os.arch", "sys.os.release"],
    'sync' : ["verificationProgress","height", "timeOffset"],
};

const progressBars = []

var tab = [];

/**
 * updates html view with json data
 * @param {object} data 
 */
function updateView(data, parent = "") {
    
    for (var key in data) {
        
        if (data.hasOwnProperty(key)) {
            var fullKey = ((parent != '')?(parent+'.'):('')) + key;
            if(typeof data[key] === 'object') {
                updateView(data[key], fullKey);
            } else {
                appendHtml(data[key], fullKey);
            }
        }
    }
}

/**
 * appendHtml
 * @param {*} data 
 * @param {*} fullKey 
 */
function appendHtml(data, fullKey) {

    if(fullKey == 'verificationProgress') {
        data = getProgressBarHtml(data*100, (data*100)+' %');
    }
    if(fullKey == 'memory.used') {
        data = getProgressBarHtml((data/nodeData.memory.total * 100), data + '/' + nodeData.memory.total);
    }

    var container = getContainerName(fullKey);

    $('#' + container + '-container').append('\
    <div class="row">\
        <div class="col-md-6 left">'+ i18n(fullKey) +'</div>\
        <div class="col-md-6 right">'+ data +'</div>\
    </div>');
}

/**
 * getRowHtml
 * @param {*} data 
 * @param {*} fullKey 
 */
function getContainerName(fullKey) {
    for (var key in viewPartial) {
        if (viewPartial.hasOwnProperty(key)) {
            if($.inArray(fullKey, viewPartial[key]) != -1) {
                return key;
            }
        }
    }
    return;
}

/**
 * getRowHtml
 * @param {*} data 
 * @param {*} fullKey 
 */
function getProgressBarHtml(value, text) {
    var html = '\
    <div class="progress">\
      <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="'+value+'" aria-valuemin="0" aria-valuemax="100" style="width: '+value+'%;">\
        '+text+'\
      </div>\
    </div>';
    return html;
}