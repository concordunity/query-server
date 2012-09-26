$(function () {
    $('#backTop').mouseover(function () {
        $(this).css('backgroundImage', 'url(Image/backTop_1.gif)');
    }).mouseout(function () {
        $(this).css('backgroundImage', 'url(Image/backTop_0.gif)');
    }).click(function () {
        $(this).blur();
    });
});