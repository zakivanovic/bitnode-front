$(document).ready(function () {
    $('#title').html(i18n('blockInfo'));
    fetchBlockData(routeParams.id);
});

/**
 * fetches Explorer Data
 */
function fetchBlockData(block) {
    $.ajax({
        url: '/api/explorer/block/' + block,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            updateView(data);
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
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if(key == 'tx') {
                $('#block-'+key+'-count').html(data[key].length);
            } else {
                $('#block-'+key).html(data[key]);
            }
        }
    }
}