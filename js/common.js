/* Common script */

$(document).ready(function () {
    $('#navbar').load('../common/navbar.html', function () {
        $('#'+currentPage+'-nav').addClass('active');
        $('#'+currentPage+'-nav a').append('<span class="sr-only">(current)</span>');
    });

    $('#footer').load('../common/footer.html');
});
