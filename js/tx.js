$(document).ready(function () {
    $('#title').html(i18n('txInfo'));
    fetchTxData(routeParams.id);
});

/**
 * fetches Explorer Data
 */
function fetchTxData(tx) {
    $.ajax({
        url: '/api/explorer/tx/' + tx,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            updateView(data);
            $('body').addClass('loaded');
        },
        error: function (response) {
            console.log(response);
            if (response.responseJSON) {
                toastr.error('Error fetching transaction data : ['+ response.responseJSON.code +'] ' + response.responseJSON.message)
            } else {
                toastr.error('Error fetching transaction data : ['+ response.status +'] ' + response.statusText)
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
            $('#tx-'+key).html(format(key, data[key]));
            $('#tx-'+key+'-lbl').html(i18n(key));
        }
    }
}

/**
 * formats values with Formater
 * @param {*} key 
 * @param {*} value 
 */
function format(key, value) {
    var formater = new TxFormater();
    if(formater[key]) {
        return formater[key](value);
    }
    return value;
}

/**
 * Data value formater
 */
function TxFormater() {
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

    this.inputs = function(data) {
        data.forEach(function(element) {
            if(element.addr) {
                $('#tx-inputs').append('<div class="row"><a href="#/explorer/addr/'+element.addr+'">'+element.addr+'</a></div>');
            } else {
                $('#tx-inputs').append('<div class="row">'+this.coinbase(element.coinbase)+'</div>');
            }
        }, this);
    }

    this.outputs = function(data) {
        var total = 0;
        data.forEach(function(element) {
            if(element.addr) {
                $('#tx-outputs').append(
                '<div class="row">\
                    <div class="col-8 left"><a href="#/explorer/addr/'+element.addr+'">'+element.addr+'</a></div>\
                    <div class="col-4 right">'+element.value+'</div>\
                </div>');
                total += element.value;
            }
        }, this);
        $('#tx-total').html(total + ' <span class="text-muted">BTC</span>');
    }
}