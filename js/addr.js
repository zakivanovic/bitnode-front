$(document).ready(function () {
    $('#title').html(i18n('addrInfo'));
    fetchAddrData(routeParams.id);
});

/**
 * fetches Address Data
 */
function fetchAddrData(addr) {
    $.ajax({
        url: '/api/explorer/addr/' + addr,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            updateView(data);
            $('body').addClass('loaded');
        },
        error: function (response) {
            console.log(response);
            if (response.responseJSON) {
                toastr.error('Error fetching address data : ['+ response.responseJSON.code +'] ' + response.responseJSON.message)
            } else {
                toastr.error('Error fetching address data : ['+ response.status +'] ' + response.statusText)
            }
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
            $('#addr-'+key).html(format(key, data[key]));
            $('#addr-'+key+'-lbl').html(i18n(key));
        }
    }

    $('#addr-tx-count').html(data['tx'].length);
    $('#addr-tx-count-lbl').html(i18n('tx-count'));
}

/**
 * formats values with Formater
 * @param {*} key 
 * @param {*} value 
 */
function format(key, value) {
    var formater = new AddrFormater();
    if(formater[key]) {
        return formater[key](value);
    }
    return value;
}

/**
 * Data value formater
 */
function AddrFormater() {
    /**
     * coinbase formater
     */
    this.coinbase = function(data) {
        if(typeof(data) === 'string') {
            var parts = data.split('/');
            var coinbase = parts[1] ? parts[1] : data;
            return '<span class="badge badge-info">'+coinbase+'</span>';
        }
        return '-';
    }
    /**
     * time formater
     */
    this.time = function(data) {
        const time = new Date(data*1000);
        return time.toLocaleString();
    }

    this.block = function(data) {
        return '<a href="#/explorer/block/'+data+'">Block</a>';
    }

    this.hash = function(data) {
        return '<a href="#/explorer/tx/'+data+'">'+data+'</a>';
    }
}