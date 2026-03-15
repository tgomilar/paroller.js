/**
 * jQuery plugin paroller.js v1.5.0
 * https://github.com/tgomilar/paroller.js
 * preview: https://tgomilar.github.io/paroller/
 * author: Tanja Gomilar
 **/
(function (factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define("parollerjs", ["jquery"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function ($) {
  "use strict";

  var setDirection = {
    bgVertical: function (elem, bgOffset) {
      return elem.css({ "background-position": "center " + -bgOffset + "px" });
    },
    bgHorizontal: function (elem, bgOffset) {
      return elem.css({ "background-position": -bgOffset + "px" + " center" });
    },
    vertical: function (elem, elemOffset, transition, oldTransform) {
      oldTransform === "none" ? (oldTransform = "") : true;
      return elem.css({
        "-webkit-transform": "translateY(" + elemOffset + "px)" + oldTransform,
        "-moz-transform": "translateY(" + elemOffset + "px)" + oldTransform,
        transform: "translateY(" + elemOffset + "px)" + oldTransform,
        transition: transition,
        "will-change": "transform",
      });
    },
    horizontal: function (elem, elemOffset, transition, oldTransform) {
      oldTransform === "none" ? (oldTransform = "") : true;
      return elem.css({
        "-webkit-transform": "translateX(" + elemOffset + "px)" + oldTransform,
        "-moz-transform": "translateX(" + elemOffset + "px)" + oldTransform,
        transform: "translateX(" + elemOffset + "px)" + oldTransform,
        transition: transition,
        "will-change": "transform",
      });
    },
  };

  var setMovement = {
    factor: function (elem, width, options) {
      var dataFactor = elem.data("paroller-factor");
      var factor = dataFactor !== undefined && dataFactor !== null ? dataFactor : options.factor;
      if (width < 576) {
        var dataFactorXs = elem.data("paroller-factor-xs");
        var factorXs = dataFactorXs !== undefined && dataFactorXs !== null ? dataFactorXs : options.factorXs;
        return factorXs !== undefined && factorXs !== null ? factorXs : factor;
      } else if (width <= 768) {
        var dataFactorSm = elem.data("paroller-factor-sm");
        var factorSm = dataFactorSm !== undefined && dataFactorSm !== null ? dataFactorSm : options.factorSm;
        return factorSm !== undefined && factorSm !== null ? factorSm : factor;
      } else if (width <= 1024) {
        var dataFactorMd = elem.data("paroller-factor-md");
        var factorMd = dataFactorMd !== undefined && dataFactorMd !== null ? dataFactorMd : options.factorMd;
        return factorMd !== undefined && factorMd !== null ? factorMd : factor;
      } else if (width <= 1200) {
        var dataFactorLg = elem.data("paroller-factor-lg");
        var factorLg = dataFactorLg !== undefined && dataFactorLg !== null ? dataFactorLg : options.factorLg;
        return factorLg !== undefined && factorLg !== null ? factorLg : factor;
      } else if (width <= 1920) {
        var dataFactorXl = elem.data("paroller-factor-xl");
        var factorXl = dataFactorXl !== undefined && dataFactorXl !== null ? dataFactorXl : options.factorXl;
        return factorXl !== undefined && factorXl !== null ? factorXl : factor;
      } else {
        return factor;
      }
    },
    bgOffset: function (offset, factor) {
      return Math.round(offset * factor);
    },
    transform: function (offset, factor, windowHeight, height) {
      return Math.round((offset - windowHeight / 2 + height) * factor);
    },
  };

  var clearPositions = {
    background: function (elem) {
      return elem.css({ "background-position": "unset" });
    },
    foreground: function (elem) {
      return elem.css({
        transform: "unset",
        transition: "unset",
      });
    },
  };

  var working = false;

  $.fn.paroller = function (options) {
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();

    // default options
    var options = $.extend(
      {
        factor: 0, // - to +
        factorXs: null, // - to +
        factorSm: null, // - to +
        factorMd: null, // - to +
        factorLg: null, // - to +
        factorXl: null, // - to +
        transition: "translate 0.1s ease", // CSS transition
        type: "background", // foreground
        direction: "vertical", // horizontal
      },
      options,
    );

    return this.each(function () {
      var $this = $(this);
      var width = $(window).width();
      var offset = $this.offset().top;
      var height = $this.outerHeight();

      var dataType = $this.data("paroller-type");
      var dataDirection = $this.data("paroller-direction");
      var dataTransition = $this.data("paroller-transition");
      var oldTransform = $this.css("transform");

      var transition = dataTransition ? dataTransition : options.transition;
      var type = dataType ? dataType : options.type;
      var direction = dataDirection ? dataDirection : options.direction;
      var initialScrollTop = $(window).scrollTop();
      var factor = setMovement.factor($this, width, options);
      var bgOffset = 0; // background starts at natural CSS position
      var transform = Math.round((offset - windowHeight / 2 + height - initialScrollTop) * factor);

      if (type === "background") {
        if (direction === "vertical") {
          setDirection.bgVertical($this, bgOffset);
        } else if (direction === "horizontal") {
          setDirection.bgHorizontal($this, bgOffset);
        }
      } else if (type === "foreground") {
        if (direction === "vertical") {
          setDirection.vertical($this, transform, transition, oldTransform);
        } else if (direction === "horizontal") {
          setDirection.horizontal($this, transform, transition, oldTransform);
        }
      }

      var resizeAction = function (scrolling) {
        if (type === "background") {
          clearPositions.background($this);
          if (direction === "vertical") {
            setDirection.bgVertical($this, bgOffset);
          } else if (direction === "horizontal") {
            setDirection.bgHorizontal($this, bgOffset);
          }
        } else if (type === "foreground" && scrolling <= documentHeight) {
          clearPositions.foreground($this);
          if (direction === "vertical") {
            setDirection.vertical($this, transform, transition);
          } else if (direction === "horizontal") {
            setDirection.horizontal($this, transform, transition);
          }
        }
        working = false;
      };

      var scrollAction = function (scrolling, inViewport) {
        if (type === "background" && inViewport) {
          if (direction === "vertical") {
            setDirection.bgVertical($this, bgOffset);
          } else if (direction === "horizontal") {
            setDirection.bgHorizontal($this, bgOffset);
          }
        } else if (type === "foreground" && inViewport && scrolling <= documentHeight) {
          if (direction === "vertical") {
            setDirection.vertical($this, transform, transition, oldTransform);
          } else if (direction === "horizontal") {
            setDirection.horizontal($this, transform, transition, oldTransform);
          }
        }
        working = false;
      };

      $(window).on("resize", function () {
        if (working) return;
        working = true;

        var scrolling = $(this).scrollTop();
        width = $(window).width();
        offset = $this.offset().top;
        height = $this.outerHeight();
        factor = setMovement.factor($this, width, options);
        bgOffset = Math.round((offset - scrolling) * factor);
        transform = Math.round((offset - windowHeight / 2 + height - scrolling) * factor);

        window.requestAnimationFrame(function () {
          resizeAction(scrolling);
        });
      });

      $(window).on("scroll", function () {
        if (working) return;
        working = true;

        var scrolling = $(this).scrollTop();
        var inViewport = offset < scrolling + windowHeight && offset + height > scrolling;

        if (type === "background" && scrolling === 0) {
          factor = 0;
        } else {
          factor = setMovement.factor($this, width, options);
        }

        bgOffset = Math.round((offset - scrolling) * factor);
        transform = Math.round((offset - windowHeight / 2 + height - scrolling) * factor);

        window.requestAnimationFrame(function () {
          scrollAction(scrolling, inViewport);
        });
      });
    });
  };
});
