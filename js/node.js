var nodeData;
$(document).ready(function () {

    console.log('nodeData');

    fetchNodeData();

    intervals.push(setInterval(fetchNodeData, 10000)); // refreshes data every 10 seconds
});

const viewPartial = {
    'node' : ["versions.node", "versions.protocol", "versions.wallet", "versions.userAgent", "errors", "mempool.size", "mempool.usage", "mempool.max", "mempool.fee", "disk.path","memory.used", "memory.free", "memory.total", "uptime"],
    'network' : ["connections", "difficulty", "proxy", "hashrate", "network", "block", "medianTime",  "pruned"],
    'system' : ["sys.hostname", "sys.cpus", "sys.uptime", "sys.os.platform", "sys.os.arch", "sys.os.release"],
    'sync' : ["verificationProgress","height", "timeOffset"],
};

const progressBars = []

var tab = [];

/**
 * fetches node data
 */
function fetchNodeData() {
    $.ajax({
        url: '/api/node',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            nodeData = data;
            emptyContainers()
            updateView(nodeData);
            $('body').addClass('loaded');
        },
        error: function (response) {
            toastr.error('Error fetching node data : ['+ response.status +'] ' + response.statusText)
        }
    });
}

/**
 * updates html view with json data
 * @param {object} data
 * @param {string} parent
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
        var percent = Math.round(data*100);
        data = getProgressBarHtml(percent, percent + ' %');
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
 * getContainerName
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
 * empty containers html
 */
function emptyContainers() {
    for (var key in viewPartial) {
        if (viewPartial.hasOwnProperty(key)) {
            $('#' + key + '-container div').remove();
        }
    }
}

/**
 * getProgressBarHtml
 * @param {*} value 
 * @param {*} text 
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