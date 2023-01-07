$(document).ready(function () {
    $(".slide").slick({
        autoplay: false,
        fade: true,
        dots: true,
    });

    if (window.innerWidth > 992) {
        new WOW().init();
    }

    $(".team-img").slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false,
        dots: true,
        autoplay: true,
        responsive: [
            {
                breakpoint: 992,
                settings: { slidesToShow: 2, slidesToScroll: 2 },
            },
            {
                breakpoint: 575,
                settings: { slidesToShow: 1, slidesToScroll: 1, dots: false, arrows: true },
            },
        ],
    });

    $(".clients .slick").slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 800,
    });
});

$(function () {
    $("#scroller2").simplyScroll({
        direction: "backwards",
        speed: 3,
    });
    $(".scroller").simplyScroll({
        speed: 3,
    });
});
