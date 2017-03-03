/**
 * jQuery plugin paroller.js v1.0
 * https://github.com/tgomilar/paroller.js
 * preview: https://tgomilar.github.io/paroller/
 **/

(function ($) {
    'use strict';

    var elem = $('[data-paroller-ratio]');

    $.fn.paroller = function(el, options) {
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();

        // default options
        var options = $.extend({
            ratio: 0, // - to +
            type: 'background', // foreground
            direction: 'vertical' // horizontal
        }, options);

        elem.each(function(){
            var $this = $(this);
            var offset = $this.offset().top;
            var height = $this.outerHeight();
            var dataRatio = $this.data('paroller-ratio');
            var dataType = $this.data('paroller-type');
            var dataDirection = $this.data('paroller-direction');

            var ratio = (dataRatio) ? dataRatio : options.ratio;
            var type = (dataType) ? dataType : options.type;
            var direction = (dataDirection) ? dataDirection : options.direction;

            var bgY = Math.round(offset * ratio);
            var transform = Math.round((offset - (windowHeight / 2) + height) * ratio);

            if(type == 'background') {
                if(direction == 'vertical') {
                    $this.css({
                        'background-position': 'center ' + -bgY + 'px'
                    });
                }
                else if(direction == 'horizontal') {
                    $this.css({
                        'background-position': -bgY + 'px' + ' center'
                    });
                }
            }
            else if(type == 'foreground') {
                // vertical offset
                if(direction == 'vertical') {
                    $this.css({
                        '-webkit-transform': 'translateY(' + transform + 'px)',
                        '-moz-transform': 'translateY(' + transform + 'px)',
                        'transform': 'translateY(' + transform + 'px)'
                    });
                }
                // horizontal offset
                else if(direction == 'horizontal') {
                    $this.css({
                        '-webkit-transform': 'translateX(' + transform + 'px)',
                        '-moz-transform': 'translateX(' + transform + 'px)',
                        'transform': 'translate(' + transform + 'px, ' + transform + 'px)'
                    });
                }
                // // XY-diagonal offset
                // else if(direction == 'diagonal') {
                //     $this.css({
                //         '-webkit-transform': 'translate(' + transform + 'px, ' + transform + 'px)',
                //         '-moz-transform': 'translate(' + transform + 'px, ' + transform + 'px)',
                //         'transform': 'translate(' + -transform + 'px, ' + transform + 'px)'
                //     });
                // }
            }

            $(window).on('scroll', function(){
                var scrolling = $(this).scrollTop();
                bgY = Math.round((offset - scrolling) * ratio);
                transform = Math.round(((offset - (windowHeight / 2) + height) - scrolling) * ratio);

                if(type == 'background') {
                    if(direction == 'vertical') {
                        $this.css({
                            'background-position': 'center ' + -bgY + 'px'
                        });
                    }
                    else if(direction == 'horizontal') {
                        $this.css({
                            'background-position': -bgY + 'px' + ' center'
                        });
                    }
                }
                else if((type == 'foreground') && (scrolling < documentHeight)) {
                    if(direction == 'vertical') {
                        $this.css({
                            '-webkit-transform': 'translateY(' + transform + 'px)',
                            '-moz-transform': 'translateY(' + transform + 'px)',
                            'transform': 'translateY(' + transform + 'px)'
                        });
                    }
                    else if(direction == 'horizontal') {
                        $this.css({
                            '-webkit-transform': 'translateX(' + transform + 'px)',
                            '-moz-transform': 'translateX(' + transform + 'px)',
                            'transform': 'translateX(' + transform + 'px)'
                        });
                    }
                }
            });
        });
    };
})(jQuery);
