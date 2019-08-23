'use strict';

/**
 * jQuery plugin paroller.js v1.4.6
 * https://github.com/tgomilar/paroller.js
 * preview: https://tgomilar.github.io/paroller/
 **/
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define('parollerjs', ['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
})(function ($) {
    'use strict';

    let working = false;
    let scrollAction = function() {
        working = false;
    };

    let setDirection = {
        bgVertical: function (elem, bgOffset) {
            return elem.css({'background-position': 'center ' + -bgOffset + 'px'});
        },
        bgHorizontal: function (elem, bgOffset) {
            return elem.css({'background-position': -bgOffset + 'px' + ' center'});
        },
        vertical: function (elem, elemOffset, transition, oldTransform) {
            (oldTransform === 'none' ? oldTransform = '' : true);
            return elem.css({
                '-webkit-transform': 'translateY(' + elemOffset + 'px)' + oldTransform,
                '-moz-transform': 'translateY(' + elemOffset + 'px)' + oldTransform,
                'transform': 'translate(0,' + elemOffset + 'px)' + oldTransform,
                'transition': transition,
                'will-change': 'transform'
            });
        },
        horizontal: function (elem, elemOffset, transition, oldTransform) {
            (oldTransform === 'none' ? oldTransform = '' : true);
            return elem.css({
                '-webkit-transform': 'translateX(' + elemOffset + 'px)' + oldTransform,
                '-moz-transform': 'translateX(' + elemOffset + 'px)' + oldTransform,
                'transform': 'translate(' + elemOffset + 'px, 0)' + oldTransform,
                'transition': transition,
                'will-change': 'transform'
            });
        }
    };

    let setMovement = {
        factor: function (elem, width, options) {
            let dataFactor = elem.data('paroller-factor');
            let factor = (dataFactor) ? dataFactor : options.factor;
            if (width < 576) {
                let dataFactorXs = elem.data('paroller-factor-xs');
                let factorXs = (dataFactorXs) ? dataFactorXs : options.factorXs;
                return (factorXs) ? factorXs : factor;
            }
            else if (width <= 768) {
                let dataFactorSm = elem.data('paroller-factor-sm');
                let factorSm = (dataFactorSm) ? dataFactorSm : options.factorSm;
                return (factorSm) ? factorSm : factor;
            }
            else if (width <= 1024) {
                let dataFactorMd = elem.data('paroller-factor-md');
                let factorMd = (dataFactorMd) ? dataFactorMd : options.factorMd;
                return (factorMd) ? factorMd : factor;
            }
            else if (width <= 1200) {
                let dataFactorLg = elem.data('paroller-factor-lg');
                let factorLg = (dataFactorLg) ? dataFactorLg : options.factorLg;
                return (factorLg) ? factorLg : factor;
            } else if (width <= 1920) {
                let dataFactorXl = elem.data('paroller-factor-xl');
                let factorXl = (dataFactorXl) ? dataFactorXl : options.factorXl;
                return (factorXl) ? factorXl : factor;
            } else {
                return factor;
            }
        },
        bgOffset: function (offset, factor) {
            return Math.round(offset * factor);
        },
        transform: function (offset, factor, windowHeight, height) {
            return Math.round((offset - (windowHeight / 2) + height) * factor);
        }
    };

    let clearPositions = {
        background: function (elem) {
            return elem.css({'background-position': 'unset'});
        },
        foreground: function (elem) {
            return elem.css({
                'transform' : 'unset',
                'transition' : 'unset'
            });
        }
    };

    $.fn.paroller = function (options) {
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();

        // default options
        options = $.extend({
            factor: 0, // - to +
            factorXs: 0, // - to +
            factorSm: 0, // - to +
            factorMd: 0, // - to +
            factorLg: 0, // - to +
            factorXl: 0, // - to +
            transition: 'transform .1s ease', // CSS transition
            type: 'background', // foreground
            direction: 'vertical' // horizontal
        }, options);

        return this.each(function () {
            const $this = $(this);
            let height = $this.outerHeight();
            let width = $(window).width();
            let elemTop = $this.offset().top;
            let scrollOffset = 0;

            let withScrollOffset = function(scrollTop, transform) {
                if (! scrollTop) {
                    scrollOffset = transform;
                }
                // console.log(`offset ${scrollOffset} => ${transform - scrollOffset}`)
                return transform - scrollOffset;
            }

            const dataType = $this.data('paroller-type');
            const dataDirection = $this.data('paroller-direction');
            const dataTransition = $this.data('paroller-transition');
            const oldTransform = $this.css('transform');

            const transition = (dataTransition) ? dataTransition : options.transition;
            const type = (dataType) ? dataType : options.type;
            const direction = (dataDirection) ? dataDirection : options.direction;
            let factor = 0;
            let bgOffset = setMovement.bgOffset(elemTop, factor);
            let transform = setMovement.transform(elemTop, factor, windowHeight, height);

            if (type === 'background') {
                if (direction === 'vertical') {
                    setDirection.bgVertical($this, bgOffset);
                }
                else if (direction === 'horizontal') {
                    setDirection.bgHorizontal($this, bgOffset);
                }
            }
            else if (type === 'foreground') {
                if (direction === 'vertical') {
                    setDirection.vertical($this, transform, transition, oldTransform);
                }
                else if (direction === 'horizontal') {
                    setDirection.horizontal($this, transform, transition, oldTransform);
                }
            }

            $(window).on('resize', function () {
                let scrolling = $(this).scrollTop();
                width = $(window).width();
                elemTop = $this.offset().top;
                height = $this.outerHeight();
                factor = setMovement.factor($this, width, options);

                bgOffset = Math.round(elemTop * factor);
                let transform = withScrollOffset($(document).scrollTop(), Math.round((elemTop - (windowHeight / 2) + height) * factor));

                if (! working) {
                    window.requestAnimationFrame(scrollAction);
                    working = true;
                }

                if (type === 'background') {
                    clearPositions.background($this);
                    if (direction === 'vertical') {
                        setDirection.bgVertical($this, bgOffset);
                    }
                    else if (direction === 'horizontal') {
                        setDirection.bgHorizontal($this, bgOffset);
                    }
                }
                else if ((type === 'foreground') && (scrolling <= documentHeight)) {
                    clearPositions.foreground($this);
                    if (direction === 'vertical') {
                        setDirection.vertical($this, transform, transition);
                    }
                    else if (direction === 'horizontal') {
                        setDirection.horizontal($this, transform, transition);
                    }
                }
            });

            $(window).on('load scroll', function () {
                let scrolling = $(this).scrollTop();
                let scrollTop = $(document).scrollTop();
                factor = setMovement.factor($this, width, options);
                let transform = withScrollOffset(scrollTop, Math.round(((elemTop - (windowHeight / 2) + height) - scrolling) * factor));

                if (! working) {
                    window.requestAnimationFrame(scrollAction);
                    working = true;
                }

                if (type === 'background') {
                    if (direction === 'vertical') {
                        setDirection.bgVertical($this, bgOffset);
                    }
                    else if (direction === 'horizontal') {
                        setDirection.bgHorizontal($this, bgOffset);
                    }
                }
                else if ((type === 'foreground') && (scrolling <= documentHeight)) {
                    if (direction === 'vertical') {
                        setDirection.vertical($this, transform, transition, oldTransform);
                    }
                    else if (direction === 'horizontal') {
                        setDirection.horizontal($this, transform, transition, oldTransform);
                    }
                }
            });
        });
    };
});
