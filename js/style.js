$(document).ready(function () {
    $(".technology .button button").click(function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");

        $id = $(this).attr("dataid");
        $(".technology").find($id).addClass("active");
        $(".technology").find($id).siblings().removeClass("active");
    });

    $(".project2 ul li").click(function () {
        $id = $(this).find("a").attr("href");
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $(".project2 .content").find($id).addClass("active");
        $(".project2 .content").find($id).siblings().removeClass("active");
    });

    $(window).scroll(function () {
        var sticky = $(".headerfix"),
            scroll = $(window).scrollTop();

        if (scroll >= 200) sticky.addClass("fixed");
        else sticky.removeClass("fixed");
    });

    $("#serialcursor").serialcursor();

    //backtop
    $(window).scroll(function () {
        var wScroll = $(window).scrollTop();
        if (wScroll > 400) {
            $(".ft-backtop").addClass("is-show");
        } else {
            $(".ft-backtop").removeClass("is-show");
        }
    });
    $(".ft-backtop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });

    $(".header .icon").click(function () {
        $(this).toggleClass("active");
        $(".header .menu").toggleClass("active");
    });

    $(".clickScroll").click(function () {
        $id = $(this).attr("dataid");
        $("html, body").animate({
            scrollTop: $($id).offset().top - 100,
        });
    });
});
