/*!
 * jQuery serialcursor
 * https://github.com/kevinmeunier/jquery-serialcursor
 *
 * Copyright 2022 Meunier Kévin
 * https://www.meunierkevin.com
 *
 * Released under the MIT license
 */
(function ($) {
    "use strict";

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    $.fn.serialcursor = function (options) {
        // Disable the plugin for touch devices
        if (isTouchDevice) return;

        const settings = $.extend({}, $.fn.serialcursor.defaults, options);
        const root = this;
        const $body = $("body");
        const $serialcursorState = $("[" + settings.stateDataAttr + "]");
        const noiseScale = settings.noiseScale; // Speed
        const noiseRange = settings.noiseRange; // Range of distortion
        let polygon;
        let noiseObjects;
        let bigCoordinates = [];
        let group;
        let $cursor;
        let $cursorInner;
        let $cursorPointer;
        let timer;
        let state;

        $.extend(this, {
            init: function () {
                // Create DOM elements
                this.createElements();

                // Initialisation of the canvas
                this.setupCanvas();

                // Changing the cursor when entering/leaving elements
                $serialcursorState.on("mouseenter", this.eventMouseenter);
                $serialcursorState.on("mouseleave", this.eventMouseleave);

                // Click animation
                window.addEventListener("click", this.eventClick);

                // Default animation on mouse move
                window.addEventListener("mousemove", this.eventMousemove);
            },

            createElements: function () {
                // Creation of the wrapping element
                $cursor = $(settings.htmlCursor).appendTo($body);

                // Creation of the outer element
                $cursorInner = $(settings.htmlInner).appendTo($cursor);

                // Creation of the pointer
                $cursorPointer = $(settings.htmlPointer).appendTo($cursor);

                // Add of the grab template
                $(settings.htmlGrab).appendTo($cursorPointer);
            },

            setupCanvas: function () {
                // Credit goes to Codrops for the canvas animation
                paper.setup($cursorInner[0]);

                // Creation of the path with 8 segments and 15 radius
                polygon = new paper.Path.RegularPolygon(new paper.Point(0, 0), 8, 15);
                polygon.strokeColor = settings.strokeColor;
                polygon.strokeWidth = settings.strokeWidth;

                // Creation of the group
                group = new paper.Group([polygon]);
                group.applyMatrix = false;

                // Initialisation of the noise
                noiseObjects = polygon.segments.map(function () {
                    return new SimplexNoise();
                });

                paper.view.onFrame = function (event) {
                    // Fixed position
                    group.position = new paper.Point(40, 40);

                    // Scale up the shape
                    polygon.scale(2.5);

                    // First get coordinates of large circle
                    if (bigCoordinates.length === 0) {
                        polygon.segments.forEach(function (segment, i) {
                            bigCoordinates[i] = [segment.point.x, segment.point.y];
                        });
                    }

                    // Calculate noise value for each point at that frame
                    polygon.segments.forEach(function (segment, i) {
                        const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
                        const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);

                        const distortionX = root.map(noiseX, -1, 1, -noiseRange, noiseRange);
                        const distortionY = root.map(noiseY, -1, 1, -noiseRange, noiseRange);

                        const newX = bigCoordinates[i][0] + distortionX;
                        const newY = bigCoordinates[i][1] + distortionY;

                        segment.point.set(newX, newY);
                    });

                    // Convert straight corners to rounded corners
                    polygon.smooth();
                };
            },

            eventMousemove: function (event) {
                // Clear the timer for the animateEnd fn
                if (timer !== undefined) {
                    $cursor.addClass("on-mousemove");
                    clearTimeout(timer);
                }

                // Set a timer to detect mousemove end
                timer = setTimeout(function () {
                    root.animateEnd();
                }, 100);

                // Start the animation
                root.animate(event);
            },

            animate: function (event) {
                const clientY = event.clientY;
                const clientX = event.clientX;

                // Animation of the inner element separately to provide a different delay
                TweenMax.to($cursorInner, 0.6, { top: clientY, left: clientX, ease: Power2.easeOut, delay: 0.06 });

                // Animation of the pointer with a delay (setTimeout)
                TweenMax.to($cursorPointer, 0.6, { top: clientY, left: clientX, ease: Power2.easeOut, delay: 0.02 });
            },

            animateEnd: function () {
                // Removing the class
                $cursor.removeClass("on-mousemove");
            },

            map: function (value, in_min, in_max, out_min, out_max) {
                return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
            },

            eventMouseenter: function () {
                state = $(this).attr(settings.stateDataAttr);

                // Add the state
                $cursor.addClass("is-" + state);
            },

            eventMouseleave: function () {
                // Remove the state
                $cursor.removeClass("is-" + state);
            },

            eventClick: function () {
                $cursor.addClass("is-click");

                setTimeout(function () {
                    $cursor.removeClass("is-click");
                }, 200);
            },
        });

        // Initialisation
        this.init();
        return this;
    };

    $.fn.serialcursor.defaults = {
        stateDataAttr: "data-serialcursor-state",
        strokeColor: "rgba(255, 255, 255, .4)",
        strokeWidth: 1,
        noiseScale: 150,
        noiseRange: 4,
        htmlCursor: '<div id="serialcursor"></div>',
        htmlInner: '<canvas id="serialcursor-inner"></canvas>',
        htmlPointer: '<div id="serialcursor-pointer"></div>',
        htmlGrab:
            '<div id="serialcursor-pointer-grab">' +
            '<svg class="sub-icon is-left" xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15">' +
            '<path d="M6.42,14.68A1,1,0,1,0,7.9,13.27L2.43,7.5,7.9,1.73a1,1,0,0,0,0-1.45,1,1,0,0,0-1.44,0L.28,6.8a1,1,0,0,0,0,1.4Z"/>' +
            "</svg>" +
            '<svg class="sub-icon is-right" xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15">' +
            '<path d="M1.77.32A1,1,0,0,0,.28,1.73L5.75,7.5.28,13.27a1,1,0,1,0,1.49,1.41L7.9,8.2a1,1,0,0,0,0-1.4Z"/>' +
            "</svg>" +
            "</div>",
    };
})(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 */
$.easing.easeOutExpo = function (x, t, b, c, d) {
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
};
