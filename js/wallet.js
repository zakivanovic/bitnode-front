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

    $('#validate-btn').click(function(event) {
        $('#validate-btn').hide();
        event.preventDefault();
        var addr = $('#send-address').val();
        var amount = $('#send-amount').val();
        var fees = $('#send-fees').val();
        var label = $('#send-label').val();
        var url = '/api/wallet/send/' + amount + '/' + addr + '/' + fees + '/' + label;

        sendTransaction(url);
    });

    $('.more-btn').click(function(){
        if($(this).val() == '+') {
            $(this).val('-');
        } else {
            $(this).val('+');
        }
        console.log($(this).val());
    });

    $('#receive-validate-btn').click(function () {
        $('#validate-btn').hide();
        event.preventDefault();
        var amount = $('#receive-amount').val();
        var label = $('#receive-label').val();
        sendReceiveRequest('/api/wallet/receive/'+parseFloat(amount).toFixed(8)+'/'+label);
    });

    var labels = [
        'send-btn', 
        'receive-btn', 
        'address-lbl', 
        'amount-lbl', 
        'fees-lbl', 
        'label-lbl', 
        'send-validate-btn', 
        'receive-validate-btn',
        'receive-amount-lbl',
        'receive-label-lbl',
        'message-lbl'];
    
    labels.forEach(function(lbl) {
        $('#'+lbl).html(i18n(lbl));
    }, this);
});

/**
 * Sends transaction
 * @param {string} url 
 */
function sendTransaction(url) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            toastr.success('Transaction sent! ' + data);
            $('#validate-btn').show();
            fetchWalletData();
        },
        error: function (response) {
            if (response.responseJSON) {
                toastr.error('Error sending transaction : ['+ response.responseJSON.code +'] ' + response.responseJSON.message)
            } else {
                toastr.error('Error sending transaction : ['+ response.status +'] ' + response.statusText)
            }
            $('#validate-btn').show();
        }
    });
}

/**
 * Sends transaction
 * @param {string} url 
 */
function sendReceiveRequest(url) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#validate-btn').show();
            $('#qrcode').html('<img alt="qrcode receive bitcoin" src="'+data.qrcode+'" />');
            $('#new-address').html(data.addr);
            $('#uri').html(data.link);
        },
        error: function (response) {
            if (response.responseJSON) {
                toastr.error('Error sending transaction : ['+ response.responseJSON.code +'] ' + response.responseJSON.message)
            } else {
                toastr.error('Error sending transaction : ['+ response.status +'] ' + response.statusText)
            }
            $('#validate-btn').show();
        }
    });
}

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
            if(!$('body').hasClass('loaded')) {
                $('body').addClass('loaded');
            }
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
    $('#send-fees').val(data.fee);
}

/**
 * formats values with Formater
 * @param {string} key 
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

    this.tx = function(data) {
        var html = '';
        for (var i = data.length-1; i >= 0; --i) {
            var tx = data[i];
            html += '<div class="row border-top">';
            html += '<div class="col-md-4">' + this.time(tx.time) + '</div>';
            html += '<div class="col-md-4 right ' + (tx.amount < 0 ? 'sent' : 'received') + '">' + tx.amount + ' ฿ </div>';
            html += '<div class="col-md-4 right sm-grey">(<span>' + i18n('confirm') + '</span> ' + tx.confirmations + ')</div>';
            html += '<div class="col-md-10 sm-grey">' + tx.addr + '</div>';
            html += '<div class="col-md-2"><button class="more-btn btn btn-outline-dark btn-sm" type="button" data-toggle="collapse" data-target="#clps-'+tx.time+'" aria-expanded="false" aria-controls="collapseExample">+</button></div>';

            var moreContent = '<div class="sm-grey"><p>' + i18n('block') + '<a href="#/explorer/block/'+tx.block+'">' + tx.block + '</a>' + '</p></div>'
                            + '<div class="sm-grey"><p>' + i18n('hash') + tx.hash + '</p></div>';

            html += '<div class="col-md-12"><div id="clps-'+tx.time+'" class="collapse">'+moreContent+'</div></div>';
            html += '</div>'
        };
        return html;
    }

    this.hash = function(data) {
        return '<a href="#/explorer/tx/'+data+'">'+data+'</a>';
    }
}