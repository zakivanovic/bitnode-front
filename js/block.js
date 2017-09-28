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
                $('#block-'+key+'-count-lbl').html(i18n(key+'-count'));
                $('#block-'+key+'-count').html(data[key].length);

                for(var i = 0; i < arrayLgth; ++i) {
                    $('#tx').append('<div class="col-12 border-top"><a href="#/explorer/tx/'+ data[key][i] +'">'+ data[key][i] +'</a></div>');
                }

            } else {
                $('#block-'+key).html(format(key, data[key]));
                $('#block-'+key+'-lbl').html(i18n(key));
            }
        }
    }
}

/**
 * formats values with Formater
 * @param {*} key 
 * @param {*} value 
 */
function format(key, value) {
    var formater = new Formater();
    if(formater[key]) {
        return formater[key](value);
    }
    return value;
}

/**
 * Data value formater
 */
function Formater() {
    this.time = function(data) {
        const time = new Date(data*1000);
        return time.toLocaleString();
    }

    this.hash = function(data) {
        return '<a href="#/explorer/block/'+data+'">'+data+'</a>';
    }

    this.previous = this.next = this.hash;

    this.coinbase = function(data) {
        var parts = data.split('/');
        return '<span class="badge badge-info">'+parts[1]+'</span>';
    }
}