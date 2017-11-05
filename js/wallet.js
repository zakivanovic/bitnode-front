$(document).ready(function () {
    $('#title').html(i18n('wallet'));
    fetchWalletData();

    $('#send-btn').click(function(){
        $('#receive-form').addClass('hidden');
        $('#send-form').removeClass('hidden');
    });

    $('#receive-btn').click(function(){
        $('#send-form').addClass('hidden');
        $('#receive-form').removeClass('hidden');
    });
});

/**
 * fetches Wallet Data
 */
function fetchWalletData() {
    $.ajax({
        url: '/api/wallet',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            updateView(data);
            $('body').addClass('loaded');
        },
        error: function (response) {
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
            $('#wlt-'+key).html(format(key, data[key]));
            $('#wlt-'+key+'-lbl').html(i18n(key));
        }
    }
}

/**
 * formats values with Formater
 * @param {*} key 
 * @param {*} value 
 */
function format(key, value) {
    var formater = new WalletFormater();
    if(formater[key]) {
        return formater[key](value);
    }
    return value;
}

/**
 * Data value formater
 */
function WalletFormater() {
    /**
     * time formater
     */
    this.time = function(data) {
        const time = new Date(data*1000);
        return time.toLocaleString();
    }

    this.hash = function(data) {
        return '<a href="#/explorer/tx/'+data+'">'+data+'</a>';
    }
}