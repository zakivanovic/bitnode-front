$(document).ready(function () {
    $('#title').html(i18n('blockInfo'));
    $('#tx-title').html(i18n('tx'))
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
            $('body').addClass('loaded');
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
                const arrayLgth = data[key].length;
                $('#block-'+key+'-count').html(data[key].length);

                for(var i = 0; i < arrayLgth; ++i) {
                    $('#tx').append('<div class="row">\
                    <div class="col-12"><a href="#/explorer/tx/'+ data[key][i] +'">'+ data[key][i] +'</a></div>\
                    </div>');
                }

            } else {
                $('#block-'+key).html(data[key]);
                $('#block-'+key+'-label').html(i18n(key));
            }
        }
    }
}