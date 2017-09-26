var explorerData;
$(document).ready(function () {

    $('#title').html(i18n('lastBlocks'));

    fetchExplorerData();

    intervals.push(setInterval(fetchExplorerData, 10000)); // refreshes data every 10 seconds
});

/**
 * fetches Explorer Data
 */
function fetchExplorerData() {
    $.ajax({
        url: '/api/explorer',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            explorerData = data;
            $('#block-list div').remove()
            updateView(explorerData);
        },
        error: function (response) {
            toastr.error('Error fetching explorer data : ['+ response.status +'] ' + response.statusText)
        }
    });
}

/**
 * updates html view with json data
 * @param {object} data
 */
function updateView(data) {
    $('#block-list').append('\
    <div class="row">\
        <div class="col-lg-4">'+ i18n('height') +'</div>\
        <div class="col-lg-8">'+ i18n('hash') +'</div>\
    </div>\
    <div class="row">\
        <div class="col-lg-4"><a href="#/explorer/block/'+data.height+'">'+ data.height +'</a></div>\
        <div class="col-lg-8"><a href="#/explorer/block/'+data.hash+'">'+ data.hash +'</a></div>\
    </div>');
}