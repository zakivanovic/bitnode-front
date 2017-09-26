/* Common script */

function loadLayout(currentPage) {
    $('#navbar').load('../common/navbar.html', function () {
        $('#'+currentPage+'-nav').addClass('active');
        $('#'+currentPage+'-nav a').append('<span class="sr-only">(current)</span>');
    });

    $('#footer').load('../common/footer.html');
}
