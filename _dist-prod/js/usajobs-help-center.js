/*!
 * Modernizr v2.8.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = '';
          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq) && matchMedia(mq).matches || false;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   goo.gl/v3V4Gp
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
              prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /**
     * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;(function(window, document) {
        /*jshint evil:true */
        /** version */
        var version = '3.7.0';

        /** Preset options */
        var options = window.html5 || {};

        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;

        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = '_html5shiv';

        /** The id for the the documents expando */
        var expanID = 0;

        /** Cached data for each document */
        var expandoData = {};

        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function getExpandoData(ownerDocument) {
          var data = expandoData[ownerDocument[expando]];
          if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
          }
          return data;
        }

        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function createElement(nodeName, ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
          }
          if (!data) {
            data = getExpandoData(ownerDocument);
          }
          var node;

          if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
          } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
          } else {
            node = data.createElem(nodeName);
          }

          // Avoid adding some elements to fragments in IE < 9 because
          // * Attributes like `name` or `type` cannot be set/changed once an element
          //   is inserted into a document/fragment
          // * Link elements with `src` attributes that are inaccessible, as with
          //   a 403 response, will cause the tab/window to crash
          // * Script elements appended to fragments will execute when their `src`
          //   or `text` property is set
          return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function createDocumentFragment(ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
          }
          data = data || getExpandoData(ownerDocument);
          var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
          for(;i<l;i++){
            clone.createElement(elems[i]);
          }
          return clone;
        }

        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                          // unroll the `createElement` calls
                                                          getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                          // corrects block display not defined in IE6/7/8/9
                                          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                            // adds styling not present in IE6/7/8/9
                                            'mark{background:#FF0;color:#000}' +
                                            // hides non-rendered elements
                                            'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {

          /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
          'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

          /**
           * current version of html5shiv
           */
          'version': version,

          /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
          'shivCSS': (options.shivCSS !== false),

          /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
          'supportsUnknownElements': supportsUnknownElements,

          /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
          'shivMethods': (options.shivMethods !== false),

          /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
          'type': 'default',

          // shivs the document according to the specified `html5` object options
          'shivDocument': shivDocument,

          //creates a shived element
          createElement: createElement,

          //creates a shived documentFragment
          createDocumentFragment: createDocumentFragment
        };

        /*--------------------------------------------------------------------------*/

        // expose html5
        window.html5 = html5;

        // shiv the document
        shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);

/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */
!function(e,t){"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){function n(e){var t=e.length,n=K.type(e);return"function"===n||K.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e}function r(e,t,n){if(K.isFunction(t))return K.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return K.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(at.test(t))return K.filter(t,e,n);t=K.filter(t,e)}return K.grep(e,function(e){return B.call(t,e)>=0!==n})}function i(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}function o(e){var t=dt[e]={};return K.each(e.match(ft)||[],function(e,n){t[n]=!0}),t}function s(){Z.removeEventListener("DOMContentLoaded",s,!1),e.removeEventListener("load",s,!1),K.ready()}function a(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=K.expando+Math.random()}function u(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(xt,"-$1").toLowerCase(),n=e.getAttribute(r),"string"==typeof n){try{n="true"===n?!0:"false"===n?!1:"null"===n?null:+n+""===n?+n:bt.test(n)?K.parseJSON(n):n}catch(i){}vt.set(e,t,n)}else n=void 0;return n}function l(){return!0}function c(){return!1}function p(){try{return Z.activeElement}catch(e){}}function h(e,t){return K.nodeName(e,"table")&&K.nodeName(11!==t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function f(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function d(e){var t=Lt.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function m(e,t){for(var n=0,r=e.length;r>n;n++)yt.set(e[n],"globalEval",!t||yt.get(t[n],"globalEval"))}function g(e,t){var n,r,i,o,s,a,u,l;if(1===t.nodeType){if(yt.hasData(e)&&(o=yt.access(e),s=yt.set(t,o),l=o.events)){delete s.handle,s.events={};for(i in l)for(n=0,r=l[i].length;r>n;n++)K.event.add(t,i,l[i][n])}vt.hasData(e)&&(a=vt.access(e),u=K.extend({},a),vt.set(t,u))}}function y(e,t){var n=e.getElementsByTagName?e.getElementsByTagName(t||"*"):e.querySelectorAll?e.querySelectorAll(t||"*"):[];return void 0===t||t&&K.nodeName(e,t)?K.merge([e],n):n}function v(e,t){var n=t.nodeName.toLowerCase();"input"===n&&_t.test(e.type)?t.checked=e.checked:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}function b(t,n){var r,i=K(n.createElement(t)).appendTo(n.body),o=e.getDefaultComputedStyle&&(r=e.getDefaultComputedStyle(i[0]))?r.display:K.css(i[0],"display");return i.detach(),o}function x(e){var t=Z,n=Mt[e];return n||(n=b(e,t),"none"!==n&&n||(It=(It||K("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),t=It[0].contentDocument,t.write(),t.close(),n=b(e,t),It.detach()),Mt[e]=n),n}function w(e,t,n){var r,i,o,s,a=e.style;return n=n||zt(e),n&&(s=n.getPropertyValue(t)||n[t]),n&&(""!==s||K.contains(e.ownerDocument,e)||(s=K.style(e,t)),Qt.test(s)&&$t.test(t)&&(r=a.width,i=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=s,s=n.width,a.width=r,a.minWidth=i,a.maxWidth=o)),void 0!==s?s+"":s}function S(e,t){return{get:function(){return e()?void delete this.get:(this.get=t).apply(this,arguments)}}}function T(e,t){if(t in e)return t;for(var n=t[0].toUpperCase()+t.slice(1),r=t,i=Jt.length;i--;)if(t=Jt[i]+n,t in e)return t;return r}function _(e,t,n){var r=Wt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function k(e,t,n,r,i){for(var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;4>o;o+=2)"margin"===n&&(s+=K.css(e,n+St[o],!0,i)),r?("content"===n&&(s-=K.css(e,"padding"+St[o],!0,i)),"margin"!==n&&(s-=K.css(e,"border"+St[o]+"Width",!0,i))):(s+=K.css(e,"padding"+St[o],!0,i),"padding"!==n&&(s+=K.css(e,"border"+St[o]+"Width",!0,i)));return s}function C(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=zt(e),s="border-box"===K.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=w(e,t,o),(0>i||null==i)&&(i=e.style[t]),Qt.test(i))return i;r=s&&(Y.boxSizingReliable()||i===e.style[t]),i=parseFloat(i)||0}return i+k(e,t,n||(s?"border":"content"),r,o)+"px"}function E(e,t){for(var n,r,i,o=[],s=0,a=e.length;a>s;s++)r=e[s],r.style&&(o[s]=yt.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&Tt(r)&&(o[s]=yt.access(r,"olddisplay",x(r.nodeName)))):(i=Tt(r),"none"===n&&i||yt.set(r,"olddisplay",i?n:K.css(r,"display"))));for(s=0;a>s;s++)r=e[s],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"));return e}function A(e,t,n,r,i){return new A.prototype.init(e,t,n,r,i)}function N(){return setTimeout(function(){Yt=void 0}),Yt=K.now()}function D(e,t){var n,r=0,i={height:e};for(t=t?1:0;4>r;r+=2-t)n=St[r],i["margin"+n]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function j(e,t,n){for(var r,i=(nn[t]||[]).concat(nn["*"]),o=0,s=i.length;s>o;o++)if(r=i[o].call(n,t,e))return r}function P(e,t,n){var r,i,o,s,a,u,l,c,p=this,h={},f=e.style,d=e.nodeType&&Tt(e),m=yt.get(e,"fxshow");n.queue||(a=K._queueHooks(e,"fx"),null==a.unqueued&&(a.unqueued=0,u=a.empty.fire,a.empty.fire=function(){a.unqueued||u()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,K.queue(e,"fx").length||a.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[f.overflow,f.overflowX,f.overflowY],l=K.css(e,"display"),c="none"===l?yt.get(e,"olddisplay")||x(e.nodeName):l,"inline"===c&&"none"===K.css(e,"float")&&(f.display="inline-block")),n.overflow&&(f.overflow="hidden",p.always(function(){f.overflow=n.overflow[0],f.overflowX=n.overflow[1],f.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Gt.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(d?"hide":"show")){if("show"!==i||!m||void 0===m[r])continue;d=!0}h[r]=m&&m[r]||K.style(e,r)}else l=void 0;if(K.isEmptyObject(h))"inline"===("none"===l?x(e.nodeName):l)&&(f.display=l);else{m?"hidden"in m&&(d=m.hidden):m=yt.access(e,"fxshow",{}),o&&(m.hidden=!d),d?K(e).show():p.done(function(){K(e).hide()}),p.done(function(){var t;yt.remove(e,"fxshow");for(t in h)K.style(e,t,h[t])});for(r in h)s=j(d?m[r]:0,r,p),r in m||(m[r]=s.start,d&&(s.end=s.start,s.start="width"===r||"height"===r?1:0))}}function F(e,t){var n,r,i,o,s;for(n in e)if(r=K.camelCase(n),i=t[r],o=e[n],K.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),s=K.cssHooks[r],s&&"expand"in s){o=s.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function q(e,t,n){var r,i,o=0,s=tn.length,a=K.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=Yt||N(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,s=0,u=l.tweens.length;u>s;s++)l.tweens[s].run(o);return a.notifyWith(e,[l,o,n]),1>o&&u?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:K.extend({},t),opts:K.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Yt||N(),duration:n.duration,tweens:[],createTween:function(t,n){var r=K.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?a.resolveWith(e,[l,t]):a.rejectWith(e,[l,t]),this}}),c=l.props;for(F(c,l.opts.specialEasing);s>o;o++)if(r=tn[o].call(l,e,c,l.opts))return r;return K.map(c,j,l),K.isFunction(l.opts.start)&&l.opts.start.call(e,l),K.fx.timer(K.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function O(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(ft)||[];if(K.isFunction(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function L(e,t,n,r){function i(a){var u;return o[a]=!0,K.each(e[a]||[],function(e,a){var l=a(t,n,r);return"string"!=typeof l||s||o[l]?s?!(u=l):void 0:(t.dataTypes.unshift(l),i(l),!1)}),u}var o={},s=e===Sn;return i(t.dataTypes[0])||!o["*"]&&i("*")}function H(e,t){var n,r,i=K.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&K.extend(!0,e,r),e}function R(e,t,n){for(var r,i,o,s,a=e.contents,u=e.dataTypes;"*"===u[0];)u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}s||(s=i)}o=o||s}return o?(o!==u[0]&&u.unshift(o),n[o]):void 0}function I(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice();if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s];for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(s=l[u+" "+o]||l["* "+o],!s)for(i in l)if(a=i.split(" "),a[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){s===!0?s=l[i]:l[i]!==!0&&(o=a[0],c.unshift(a[1]));break}if(s!==!0)if(s&&e["throws"])t=s(t);else try{t=s(t)}catch(p){return{state:"parsererror",error:s?p:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}function M(e,t,n,r){var i;if(K.isArray(t))K.each(t,function(t,i){n||Cn.test(e)?r(e,i):M(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==K.type(t))r(e,t);else for(i in t)M(e+"["+i+"]",t[i],n,r)}function $(e){return K.isWindow(e)?e:9===e.nodeType&&e.defaultView}var Q=[],z=Q.slice,U=Q.concat,W=Q.push,B=Q.indexOf,X={},V=X.toString,J=X.hasOwnProperty,Y={},Z=e.document,G="2.1.1",K=function(e,t){return new K.fn.init(e,t)},et=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,tt=/^-ms-/,nt=/-([\da-z])/gi,rt=function(e,t){return t.toUpperCase()};K.fn=K.prototype={jquery:G,constructor:K,selector:"",length:0,toArray:function(){return z.call(this)},get:function(e){return null!=e?0>e?this[e+this.length]:this[e]:z.call(this)},pushStack:function(e){var t=K.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return K.each(this,e,t)},map:function(e){return this.pushStack(K.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(z.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:W,sort:Q.sort,splice:Q.splice},K.extend=K.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[a]||{},a++),"object"==typeof s||K.isFunction(s)||(s={}),a===u&&(s=this,a--);u>a;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(K.isPlainObject(r)||(i=K.isArray(r)))?(i?(i=!1,o=n&&K.isArray(n)?n:[]):o=n&&K.isPlainObject(n)?n:{},s[t]=K.extend(l,o,r)):void 0!==r&&(s[t]=r));return s},K.extend({expando:"jQuery"+(G+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isFunction:function(e){return"function"===K.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){return!K.isArray(e)&&e-parseFloat(e)>=0},isPlainObject:function(e){return"object"!==K.type(e)||e.nodeType||K.isWindow(e)?!1:e.constructor&&!J.call(e.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?X[V.call(e)]||"object":typeof e},globalEval:function(e){var t,n=eval;e=K.trim(e),e&&(1===e.indexOf("use strict")?(t=Z.createElement("script"),t.text=e,Z.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(tt,"ms-").replace(nt,rt)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,r){var i,o=0,s=e.length,a=n(e);if(r){if(a)for(;s>o&&(i=t.apply(e[o],r),i!==!1);o++);else for(o in e)if(i=t.apply(e[o],r),i===!1)break}else if(a)for(;s>o&&(i=t.call(e[o],o,e[o]),i!==!1);o++);else for(o in e)if(i=t.call(e[o],o,e[o]),i===!1)break;return e},trim:function(e){return null==e?"":(e+"").replace(et,"")},makeArray:function(e,t){var r=t||[];return null!=e&&(n(Object(e))?K.merge(r,"string"==typeof e?[e]:e):W.call(r,e)),r},inArray:function(e,t,n){return null==t?-1:B.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;n>r;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,s=e.length,a=!n;s>o;o++)r=!t(e[o],o),r!==a&&i.push(e[o]);return i},map:function(e,t,r){var i,o=0,s=e.length,a=n(e),u=[];if(a)for(;s>o;o++)i=t(e[o],o,r),null!=i&&u.push(i);else for(o in e)i=t(e[o],o,r),null!=i&&u.push(i);return U.apply([],u)},guid:1,proxy:function(e,t){var n,r,i;return"string"==typeof t&&(n=e[t],t=e,e=n),K.isFunction(e)?(r=z.call(arguments,2),i=function(){return e.apply(t||this,r.concat(z.call(arguments)))},i.guid=e.guid=e.guid||K.guid++,i):void 0},now:Date.now,support:Y}),K.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){X["[object "+t+"]"]=t.toLowerCase()});var it=/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
function(e){function t(e,t,n,r){var i,o,s,a,u,l,p,f,d,m;if((t?t.ownerDocument||t:M)!==P&&j(t),t=t||P,n=n||[],!e||"string"!=typeof e)return n;if(1!==(a=t.nodeType)&&9!==a)return[];if(q&&!r){if(i=vt.exec(e))if(s=i[1]){if(9===a){if(o=t.getElementById(s),!o||!o.parentNode)return n;if(o.id===s)return n.push(o),n}else if(t.ownerDocument&&(o=t.ownerDocument.getElementById(s))&&R(t,o)&&o.id===s)return n.push(o),n}else{if(i[2])return K.apply(n,t.getElementsByTagName(e)),n;if((s=i[3])&&w.getElementsByClassName&&t.getElementsByClassName)return K.apply(n,t.getElementsByClassName(s)),n}if(w.qsa&&(!O||!O.test(e))){if(f=p=I,d=t,m=9===a&&e,1===a&&"object"!==t.nodeName.toLowerCase()){for(l=k(e),(p=t.getAttribute("id"))?f=p.replace(xt,"\\$&"):t.setAttribute("id",f),f="[id='"+f+"'] ",u=l.length;u--;)l[u]=f+h(l[u]);d=bt.test(e)&&c(t.parentNode)||t,m=l.join(",")}if(m)try{return K.apply(n,d.querySelectorAll(m)),n}catch(g){}finally{p||t.removeAttribute("id")}}}return E(e.replace(ut,"$1"),t,n,r)}function n(){function e(n,r){return t.push(n+" ")>S.cacheLength&&delete e[t.shift()],e[n+" "]=r}var t=[];return e}function r(e){return e[I]=!0,e}function i(e){var t=P.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function o(e,t){for(var n=e.split("|"),r=e.length;r--;)S.attrHandle[n[r]]=t}function s(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||V)-(~e.sourceIndex||V);if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function a(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function u(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function l(e){return r(function(t){return t=+t,r(function(n,r){for(var i,o=e([],n.length,t),s=o.length;s--;)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}function c(e){return e&&typeof e.getElementsByTagName!==X&&e}function p(){}function h(e){for(var t=0,n=e.length,r="";n>t;t++)r+=e[t].value;return r}function f(e,t,n){var r=t.dir,i=n&&"parentNode"===r,o=Q++;return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||i)return e(t,n,o)}:function(t,n,s){var a,u,l=[$,o];if(s){for(;t=t[r];)if((1===t.nodeType||i)&&e(t,n,s))return!0}else for(;t=t[r];)if(1===t.nodeType||i){if(u=t[I]||(t[I]={}),(a=u[r])&&a[0]===$&&a[1]===o)return l[2]=a[2];if(u[r]=l,l[2]=e(t,n,s))return!0}}}function d(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0}:e[0]}function m(e,n,r){for(var i=0,o=n.length;o>i;i++)t(e,n[i],r);return r}function g(e,t,n,r,i){for(var o,s=[],a=0,u=e.length,l=null!=t;u>a;a++)(o=e[a])&&(!n||n(o,r,i))&&(s.push(o),l&&t.push(a));return s}function y(e,t,n,i,o,s){return i&&!i[I]&&(i=y(i)),o&&!o[I]&&(o=y(o,s)),r(function(r,s,a,u){var l,c,p,h=[],f=[],d=s.length,y=r||m(t||"*",a.nodeType?[a]:a,[]),v=!e||!r&&t?y:g(y,h,e,a,u),b=n?o||(r?e:d||i)?[]:s:v;if(n&&n(v,b,a,u),i)for(l=g(b,f),i(l,[],a,u),c=l.length;c--;)(p=l[c])&&(b[f[c]]=!(v[f[c]]=p));if(r){if(o||e){if(o){for(l=[],c=b.length;c--;)(p=b[c])&&l.push(v[c]=p);o(null,b=[],l,u)}for(c=b.length;c--;)(p=b[c])&&(l=o?tt.call(r,p):h[c])>-1&&(r[l]=!(s[l]=p))}}else b=g(b===s?b.splice(d,b.length):b),o?o(null,s,b,u):K.apply(s,b)})}function v(e){for(var t,n,r,i=e.length,o=S.relative[e[0].type],s=o||S.relative[" "],a=o?1:0,u=f(function(e){return e===t},s,!0),l=f(function(e){return tt.call(t,e)>-1},s,!0),c=[function(e,n,r){return!o&&(r||n!==A)||((t=n).nodeType?u(e,n,r):l(e,n,r))}];i>a;a++)if(n=S.relative[e[a].type])c=[f(d(c),n)];else{if(n=S.filter[e[a].type].apply(null,e[a].matches),n[I]){for(r=++a;i>r&&!S.relative[e[r].type];r++);return y(a>1&&d(c),a>1&&h(e.slice(0,a-1).concat({value:" "===e[a-2].type?"*":""})).replace(ut,"$1"),n,r>a&&v(e.slice(a,r)),i>r&&v(e=e.slice(r)),i>r&&h(e))}c.push(n)}return d(c)}function b(e,n){var i=n.length>0,o=e.length>0,s=function(r,s,a,u,l){var c,p,h,f=0,d="0",m=r&&[],y=[],v=A,b=r||o&&S.find.TAG("*",l),x=$+=null==v?1:Math.random()||.1,w=b.length;for(l&&(A=s!==P&&s);d!==w&&null!=(c=b[d]);d++){if(o&&c){for(p=0;h=e[p++];)if(h(c,s,a)){u.push(c);break}l&&($=x)}i&&((c=!h&&c)&&f--,r&&m.push(c))}if(f+=d,i&&d!==f){for(p=0;h=n[p++];)h(m,y,s,a);if(r){if(f>0)for(;d--;)m[d]||y[d]||(y[d]=Z.call(u));y=g(y)}K.apply(u,y),l&&!r&&y.length>0&&f+n.length>1&&t.uniqueSort(u)}return l&&($=x,A=v),m};return i?r(s):s}var x,w,S,T,_,k,C,E,A,N,D,j,P,F,q,O,L,H,R,I="sizzle"+-new Date,M=e.document,$=0,Q=0,z=n(),U=n(),W=n(),B=function(e,t){return e===t&&(D=!0),0},X="undefined",V=1<<31,J={}.hasOwnProperty,Y=[],Z=Y.pop,G=Y.push,K=Y.push,et=Y.slice,tt=Y.indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(this[t]===e)return t;return-1},nt="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",rt="[\\x20\\t\\r\\n\\f]",it="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ot=it.replace("w","w#"),st="\\["+rt+"*("+it+")(?:"+rt+"*([*^$|!~]?=)"+rt+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+ot+"))|)"+rt+"*\\]",at=":("+it+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+st+")*)|.*)\\)|)",ut=new RegExp("^"+rt+"+|((?:^|[^\\\\])(?:\\\\.)*)"+rt+"+$","g"),lt=new RegExp("^"+rt+"*,"+rt+"*"),ct=new RegExp("^"+rt+"*([>+~]|"+rt+")"+rt+"*"),pt=new RegExp("="+rt+"*([^\\]'\"]*?)"+rt+"*\\]","g"),ht=new RegExp(at),ft=new RegExp("^"+ot+"$"),dt={ID:new RegExp("^#("+it+")"),CLASS:new RegExp("^\\.("+it+")"),TAG:new RegExp("^("+it.replace("w","w*")+")"),ATTR:new RegExp("^"+st),PSEUDO:new RegExp("^"+at),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+rt+"*(even|odd|(([+-]|)(\\d*)n|)"+rt+"*(?:([+-]|)"+rt+"*(\\d+)|))"+rt+"*\\)|)","i"),bool:new RegExp("^(?:"+nt+")$","i"),needsContext:new RegExp("^"+rt+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+rt+"*((?:-\\d)?\\d*)"+rt+"*\\)|)(?=[^-]|$)","i")},mt=/^(?:input|select|textarea|button)$/i,gt=/^h\d$/i,yt=/^[^{]+\{\s*\[native \w/,vt=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,bt=/[+~]/,xt=/'|\\/g,wt=new RegExp("\\\\([\\da-f]{1,6}"+rt+"?|("+rt+")|.)","ig"),St=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)};try{K.apply(Y=et.call(M.childNodes),M.childNodes),Y[M.childNodes.length].nodeType}catch(Tt){K={apply:Y.length?function(e,t){G.apply(e,et.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}w=t.support={},_=t.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},j=t.setDocument=function(e){var t,n=e?e.ownerDocument||e:M,r=n.defaultView;return n!==P&&9===n.nodeType&&n.documentElement?(P=n,F=n.documentElement,q=!_(n),r&&r!==r.top&&(r.addEventListener?r.addEventListener("unload",function(){j()},!1):r.attachEvent&&r.attachEvent("onunload",function(){j()})),w.attributes=i(function(e){return e.className="i",!e.getAttribute("className")}),w.getElementsByTagName=i(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),w.getElementsByClassName=yt.test(n.getElementsByClassName)&&i(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),w.getById=i(function(e){return F.appendChild(e).id=I,!n.getElementsByName||!n.getElementsByName(I).length}),w.getById?(S.find.ID=function(e,t){if(typeof t.getElementById!==X&&q){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},S.filter.ID=function(e){var t=e.replace(wt,St);return function(e){return e.getAttribute("id")===t}}):(delete S.find.ID,S.filter.ID=function(e){var t=e.replace(wt,St);return function(e){var n=typeof e.getAttributeNode!==X&&e.getAttributeNode("id");return n&&n.value===t}}),S.find.TAG=w.getElementsByTagName?function(e,t){return typeof t.getElementsByTagName!==X?t.getElementsByTagName(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},S.find.CLASS=w.getElementsByClassName&&function(e,t){return typeof t.getElementsByClassName!==X&&q?t.getElementsByClassName(e):void 0},L=[],O=[],(w.qsa=yt.test(n.querySelectorAll))&&(i(function(e){e.innerHTML="<select msallowclip=''><option selected=''></option></select>",e.querySelectorAll("[msallowclip^='']").length&&O.push("[*^$]="+rt+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||O.push("\\["+rt+"*(?:value|"+nt+")"),e.querySelectorAll(":checked").length||O.push(":checked")}),i(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&O.push("name"+rt+"*[*^$|!~]?="),e.querySelectorAll(":enabled").length||O.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),O.push(",.*:")})),(w.matchesSelector=yt.test(H=F.matches||F.webkitMatchesSelector||F.mozMatchesSelector||F.oMatchesSelector||F.msMatchesSelector))&&i(function(e){w.disconnectedMatch=H.call(e,"div"),H.call(e,"[s!='']:x"),L.push("!=",at)}),O=O.length&&new RegExp(O.join("|")),L=L.length&&new RegExp(L.join("|")),t=yt.test(F.compareDocumentPosition),R=t||yt.test(F.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},B=t?function(e,t){if(e===t)return D=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r?r:(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1,1&r||!w.sortDetached&&t.compareDocumentPosition(e)===r?e===n||e.ownerDocument===M&&R(M,e)?-1:t===n||t.ownerDocument===M&&R(M,t)?1:N?tt.call(N,e)-tt.call(N,t):0:4&r?-1:1)}:function(e,t){if(e===t)return D=!0,0;var r,i=0,o=e.parentNode,a=t.parentNode,u=[e],l=[t];if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:N?tt.call(N,e)-tt.call(N,t):0;if(o===a)return s(e,t);for(r=e;r=r.parentNode;)u.unshift(r);for(r=t;r=r.parentNode;)l.unshift(r);for(;u[i]===l[i];)i++;return i?s(u[i],l[i]):u[i]===M?-1:l[i]===M?1:0},n):P},t.matches=function(e,n){return t(e,null,null,n)},t.matchesSelector=function(e,n){if((e.ownerDocument||e)!==P&&j(e),n=n.replace(pt,"='$1']"),!(!w.matchesSelector||!q||L&&L.test(n)||O&&O.test(n)))try{var r=H.call(e,n);if(r||w.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(i){}return t(n,P,null,[e]).length>0},t.contains=function(e,t){return(e.ownerDocument||e)!==P&&j(e),R(e,t)},t.attr=function(e,t){(e.ownerDocument||e)!==P&&j(e);var n=S.attrHandle[t.toLowerCase()],r=n&&J.call(S.attrHandle,t.toLowerCase())?n(e,t,!q):void 0;return void 0!==r?r:w.attributes||!q?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},t.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},t.uniqueSort=function(e){var t,n=[],r=0,i=0;if(D=!w.detectDuplicates,N=!w.sortStable&&e.slice(0),e.sort(B),D){for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)e.splice(n[r],1)}return N=null,e},T=t.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=T(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r++];)n+=T(t);return n},S=t.selectors={cacheLength:50,createPseudo:r,match:dt,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(wt,St),e[3]=(e[3]||e[4]||e[5]||"").replace(wt,St),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||t.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&t.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return dt.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&ht.test(n)&&(t=k(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(wt,St).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=z[e+" "];return t||(t=new RegExp("(^|"+rt+")"+e+"("+rt+"|$)"))&&z(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==X&&e.getAttribute("class")||"")})},ATTR:function(e,n,r){return function(i){var o=t.attr(i,e);return null==o?"!="===n:n?(o+="","="===n?o===r:"!="===n?o!==r:"^="===n?r&&0===o.indexOf(r):"*="===n?r&&o.indexOf(r)>-1:"$="===n?r&&o.slice(-r.length)===r:"~="===n?(" "+o+" ").indexOf(r)>-1:"|="===n?o===r||o.slice(0,r.length+1)===r+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,p,h,f,d,m=o!==s?"nextSibling":"previousSibling",g=t.parentNode,y=a&&t.nodeName.toLowerCase(),v=!u&&!a;if(g){if(o){for(;m;){for(p=t;p=p[m];)if(a?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;d=m="only"===e&&!d&&"nextSibling"}return!0}if(d=[s?g.firstChild:g.lastChild],s&&v){for(c=g[I]||(g[I]={}),l=c[e]||[],f=l[0]===$&&l[1],h=l[0]===$&&l[2],p=f&&g.childNodes[f];p=++f&&p&&p[m]||(h=f=0)||d.pop();)if(1===p.nodeType&&++h&&p===t){c[e]=[$,f,h];break}}else if(v&&(l=(t[I]||(t[I]={}))[e])&&l[0]===$)h=l[1];else for(;(p=++f&&p&&p[m]||(h=f=0)||d.pop())&&((a?p.nodeName.toLowerCase()!==y:1!==p.nodeType)||!++h||(v&&((p[I]||(p[I]={}))[e]=[$,h]),p!==t)););return h-=i,h===r||h%r===0&&h/r>=0}}},PSEUDO:function(e,n){var i,o=S.pseudos[e]||S.setFilters[e.toLowerCase()]||t.error("unsupported pseudo: "+e);return o[I]?o(n):o.length>1?(i=[e,e,"",n],S.setFilters.hasOwnProperty(e.toLowerCase())?r(function(e,t){for(var r,i=o(e,n),s=i.length;s--;)r=tt.call(e,i[s]),e[r]=!(t[r]=i[s])}):function(e){return o(e,0,i)}):o}},pseudos:{not:r(function(e){var t=[],n=[],i=C(e.replace(ut,"$1"));return i[I]?r(function(e,t,n,r){for(var o,s=i(e,null,r,[]),a=e.length;a--;)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,r,o){return t[0]=e,i(t,null,o,n),!n.pop()}}),has:r(function(e){return function(n){return t(e,n).length>0}}),contains:r(function(e){return function(t){return(t.textContent||t.innerText||T(t)).indexOf(e)>-1}}),lang:r(function(e){return ft.test(e||"")||t.error("unsupported lang: "+e),e=e.replace(wt,St).toLowerCase(),function(t){var n;do if(n=q?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===F},focus:function(e){return e===P.activeElement&&(!P.hasFocus||P.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!S.pseudos.empty(e)},header:function(e){return gt.test(e.nodeName)},input:function(e){return mt.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:l(function(){return[0]}),last:l(function(e,t){return[t-1]}),eq:l(function(e,t,n){return[0>n?n+t:n]}),even:l(function(e,t){for(var n=0;t>n;n+=2)e.push(n);return e}),odd:l(function(e,t){for(var n=1;t>n;n+=2)e.push(n);return e}),lt:l(function(e,t,n){for(var r=0>n?n+t:n;--r>=0;)e.push(r);return e}),gt:l(function(e,t,n){for(var r=0>n?n+t:n;++r<t;)e.push(r);return e})}},S.pseudos.nth=S.pseudos.eq;for(x in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})S.pseudos[x]=a(x);for(x in{submit:!0,reset:!0})S.pseudos[x]=u(x);return p.prototype=S.filters=S.pseudos,S.setFilters=new p,k=t.tokenize=function(e,n){var r,i,o,s,a,u,l,c=U[e+" "];if(c)return n?0:c.slice(0);for(a=e,u=[],l=S.preFilter;a;){(!r||(i=lt.exec(a)))&&(i&&(a=a.slice(i[0].length)||a),u.push(o=[])),r=!1,(i=ct.exec(a))&&(r=i.shift(),o.push({value:r,type:i[0].replace(ut," ")}),a=a.slice(r.length));for(s in S.filter)!(i=dt[s].exec(a))||l[s]&&!(i=l[s](i))||(r=i.shift(),o.push({value:r,type:s,matches:i}),a=a.slice(r.length));if(!r)break}return n?a.length:a?t.error(e):U(e,u).slice(0)},C=t.compile=function(e,t){var n,r=[],i=[],o=W[e+" "];if(!o){for(t||(t=k(e)),n=t.length;n--;)o=v(t[n]),o[I]?r.push(o):i.push(o);o=W(e,b(i,r)),o.selector=e}return o},E=t.select=function(e,t,n,r){var i,o,s,a,u,l="function"==typeof e&&e,p=!r&&k(e=l.selector||e);if(n=n||[],1===p.length){if(o=p[0]=p[0].slice(0),o.length>2&&"ID"===(s=o[0]).type&&w.getById&&9===t.nodeType&&q&&S.relative[o[1].type]){if(t=(S.find.ID(s.matches[0].replace(wt,St),t)||[])[0],!t)return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}for(i=dt.needsContext.test(e)?0:o.length;i--&&(s=o[i],!S.relative[a=s.type]);)if((u=S.find[a])&&(r=u(s.matches[0].replace(wt,St),bt.test(o[0].type)&&c(t.parentNode)||t))){if(o.splice(i,1),e=r.length&&h(o),!e)return K.apply(n,r),n;break}}return(l||C(e,p))(r,t,!q,n,bt.test(e)&&c(t.parentNode)||t),n},w.sortStable=I.split("").sort(B).join("")===I,w.detectDuplicates=!!D,j(),w.sortDetached=i(function(e){return 1&e.compareDocumentPosition(P.createElement("div"))}),i(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||o("type|href|height|width",function(e,t,n){return n?void 0:e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),w.attributes&&i(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||o("value",function(e,t,n){return n||"input"!==e.nodeName.toLowerCase()?void 0:e.defaultValue}),i(function(e){return null==e.getAttribute("disabled")})||o(nt,function(e,t,n){var r;return n?void 0:e[t]===!0?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),t}(e);K.find=it,K.expr=it.selectors,K.expr[":"]=K.expr.pseudos,K.unique=it.uniqueSort,K.text=it.getText,K.isXMLDoc=it.isXML,K.contains=it.contains;var ot=K.expr.match.needsContext,st=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,at=/^.[^:#\[\.,]*$/;K.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?K.find.matchesSelector(r,e)?[r]:[]:K.find.matches(e,K.grep(t,function(e){return 1===e.nodeType}))},K.fn.extend({find:function(e){var t,n=this.length,r=[],i=this;if("string"!=typeof e)return this.pushStack(K(e).filter(function(){for(t=0;n>t;t++)if(K.contains(i[t],this))return!0}));for(t=0;n>t;t++)K.find(e,i[t],r);return r=this.pushStack(n>1?K.unique(r):r),r.selector=this.selector?this.selector+" "+e:e,r},filter:function(e){return this.pushStack(r(this,e||[],!1))},not:function(e){return this.pushStack(r(this,e||[],!0))},is:function(e){return!!r(this,"string"==typeof e&&ot.test(e)?K(e):e||[],!1).length}});var ut,lt=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,ct=K.fn.init=function(e,t){var n,r;if(!e)return this;if("string"==typeof e){if(n="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:lt.exec(e),!n||!n[1]&&t)return!t||t.jquery?(t||ut).find(e):this.constructor(t).find(e);if(n[1]){if(t=t instanceof K?t[0]:t,K.merge(this,K.parseHTML(n[1],t&&t.nodeType?t.ownerDocument||t:Z,!0)),st.test(n[1])&&K.isPlainObject(t))for(n in t)K.isFunction(this[n])?this[n](t[n]):this.attr(n,t[n]);return this}return r=Z.getElementById(n[2]),r&&r.parentNode&&(this.length=1,this[0]=r),this.context=Z,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):K.isFunction(e)?"undefined"!=typeof ut.ready?ut.ready(e):e(K):(void 0!==e.selector&&(this.selector=e.selector,this.context=e.context),K.makeArray(e,this))};ct.prototype=K.fn,ut=K(Z);var pt=/^(?:parents|prev(?:Until|All))/,ht={children:!0,contents:!0,next:!0,prev:!0};K.extend({dir:function(e,t,n){for(var r=[],i=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(i&&K(e).is(n))break;r.push(e)}return r},sibling:function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}}),K.fn.extend({has:function(e){var t=K(e,this),n=t.length;return this.filter(function(){for(var e=0;n>e;e++)if(K.contains(this,t[e]))return!0})},closest:function(e,t){for(var n,r=0,i=this.length,o=[],s=ot.test(e)||"string"!=typeof e?K(e,t||this.context):0;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(s?s.index(n)>-1:1===n.nodeType&&K.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?K.unique(o):o)},index:function(e){return e?"string"==typeof e?B.call(K(e),this[0]):B.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(K.unique(K.merge(this.get(),K(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),K.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return K.dir(e,"parentNode")},parentsUntil:function(e,t,n){return K.dir(e,"parentNode",n)},next:function(e){return i(e,"nextSibling")},prev:function(e){return i(e,"previousSibling")},nextAll:function(e){return K.dir(e,"nextSibling")},prevAll:function(e){return K.dir(e,"previousSibling")},nextUntil:function(e,t,n){return K.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return K.dir(e,"previousSibling",n)},siblings:function(e){return K.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return K.sibling(e.firstChild)},contents:function(e){return e.contentDocument||K.merge([],e.childNodes)}},function(e,t){K.fn[e]=function(n,r){var i=K.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=K.filter(r,i)),this.length>1&&(ht[e]||K.unique(i),pt.test(e)&&i.reverse()),this.pushStack(i)}});var ft=/\S+/g,dt={};K.Callbacks=function(e){e="string"==typeof e?dt[e]||o(e):K.extend({},e);var t,n,r,i,s,a,u=[],l=!e.once&&[],c=function(o){for(t=e.memory&&o,n=!0,a=i||0,i=0,s=u.length,r=!0;u&&s>a;a++)if(u[a].apply(o[0],o[1])===!1&&e.stopOnFalse){t=!1;break}r=!1,u&&(l?l.length&&c(l.shift()):t?u=[]:p.disable())},p={add:function(){if(u){var n=u.length;!function o(t){K.each(t,function(t,n){var r=K.type(n);"function"===r?e.unique&&p.has(n)||u.push(n):n&&n.length&&"string"!==r&&o(n)})}(arguments),r?s=u.length:t&&(i=n,c(t))}return this},remove:function(){return u&&K.each(arguments,function(e,t){for(var n;(n=K.inArray(t,u,n))>-1;)u.splice(n,1),r&&(s>=n&&s--,a>=n&&a--)}),this},has:function(e){return e?K.inArray(e,u)>-1:!(!u||!u.length)},empty:function(){return u=[],s=0,this},disable:function(){return u=l=t=void 0,this},disabled:function(){return!u},lock:function(){return l=void 0,t||p.disable(),this},locked:function(){return!l},fireWith:function(e,t){return!u||n&&!l||(t=t||[],t=[e,t.slice?t.slice():t],r?l.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!n}};return p},K.extend({Deferred:function(e){var t=[["resolve","done",K.Callbacks("once memory"),"resolved"],["reject","fail",K.Callbacks("once memory"),"rejected"],["notify","progress",K.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return K.Deferred(function(n){K.each(t,function(t,o){var s=K.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&K.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[o[0]+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?K.extend(e,r):r}},i={};return r.pipe=r.then,K.each(t,function(e,o){var s=o[2],a=o[3];r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t,n,r,i=0,o=z.call(arguments),s=o.length,a=1!==s||e&&K.isFunction(e.promise)?s:0,u=1===a?e:K.Deferred(),l=function(e,n,r){return function(i){n[e]=this,r[e]=arguments.length>1?z.call(arguments):i,r===t?u.notifyWith(n,r):--a||u.resolveWith(n,r)}};if(s>1)for(t=new Array(s),n=new Array(s),r=new Array(s);s>i;i++)o[i]&&K.isFunction(o[i].promise)?o[i].promise().done(l(i,r,o)).fail(u.reject).progress(l(i,n,t)):--a;return a||u.resolveWith(r,o),u.promise()}});var mt;K.fn.ready=function(e){return K.ready.promise().done(e),this},K.extend({isReady:!1,readyWait:1,holdReady:function(e){e?K.readyWait++:K.ready(!0)},ready:function(e){(e===!0?--K.readyWait:K.isReady)||(K.isReady=!0,e!==!0&&--K.readyWait>0||(mt.resolveWith(Z,[K]),K.fn.triggerHandler&&(K(Z).triggerHandler("ready"),K(Z).off("ready"))))}}),K.ready.promise=function(t){return mt||(mt=K.Deferred(),"complete"===Z.readyState?setTimeout(K.ready):(Z.addEventListener("DOMContentLoaded",s,!1),e.addEventListener("load",s,!1))),mt.promise(t)},K.ready.promise();var gt=K.access=function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n;if("object"===K.type(n)){i=!0;for(a in n)K.access(e,t,a,n[a],!0,o,s)}else if(void 0!==r&&(i=!0,K.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(K(e),n)})),t))for(;u>a;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)));return i?e:l?t.call(e):u?t(e[0],n):o};K.acceptData=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType},a.uid=1,a.accepts=K.acceptData,a.prototype={key:function(e){if(!a.accepts(e))return 0;var t={},n=e[this.expando];if(!n){n=a.uid++;try{t[this.expando]={value:n},Object.defineProperties(e,t)}catch(r){t[this.expando]=n,K.extend(e,t)}}return this.cache[n]||(this.cache[n]={}),n},set:function(e,t,n){var r,i=this.key(e),o=this.cache[i];if("string"==typeof t)o[t]=n;else if(K.isEmptyObject(o))K.extend(this.cache[i],t);else for(r in t)o[r]=t[r];return o},get:function(e,t){var n=this.cache[this.key(e)];return void 0===t?n:n[t]},access:function(e,t,n){var r;return void 0===t||t&&"string"==typeof t&&void 0===n?(r=this.get(e,t),void 0!==r?r:this.get(e,K.camelCase(t))):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r,i,o=this.key(e),s=this.cache[o];if(void 0===t)this.cache[o]={};else{K.isArray(t)?r=t.concat(t.map(K.camelCase)):(i=K.camelCase(t),t in s?r=[t,i]:(r=i,r=r in s?[r]:r.match(ft)||[])),n=r.length;for(;n--;)delete s[r[n]]}},hasData:function(e){return!K.isEmptyObject(this.cache[e[this.expando]]||{})},discard:function(e){e[this.expando]&&delete this.cache[e[this.expando]]}};var yt=new a,vt=new a,bt=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,xt=/([A-Z])/g;K.extend({hasData:function(e){return vt.hasData(e)||yt.hasData(e)},data:function(e,t,n){return vt.access(e,t,n)},removeData:function(e,t){vt.remove(e,t)},_data:function(e,t,n){return yt.access(e,t,n)},_removeData:function(e,t){yt.remove(e,t)}}),K.fn.extend({data:function(e,t){var n,r,i,o=this[0],s=o&&o.attributes;if(void 0===e){if(this.length&&(i=vt.get(o),1===o.nodeType&&!yt.get(o,"hasDataAttrs"))){for(n=s.length;n--;)s[n]&&(r=s[n].name,0===r.indexOf("data-")&&(r=K.camelCase(r.slice(5)),u(o,r,i[r])));yt.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){vt.set(this,e)}):gt(this,function(t){var n,r=K.camelCase(e);if(o&&void 0===t){if(n=vt.get(o,e),void 0!==n)return n;if(n=vt.get(o,r),void 0!==n)return n;if(n=u(o,r,void 0),void 0!==n)return n}else this.each(function(){var n=vt.get(this,r);vt.set(this,r,t),-1!==e.indexOf("-")&&void 0!==n&&vt.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){vt.remove(this,e)})}}),K.extend({queue:function(e,t,n){var r;return e?(t=(t||"fx")+"queue",r=yt.get(e,t),n&&(!r||K.isArray(n)?r=yt.access(e,t,K.makeArray(n)):r.push(n)),r||[]):void 0},dequeue:function(e,t){t=t||"fx";var n=K.queue(e,t),r=n.length,i=n.shift(),o=K._queueHooks(e,t),s=function(){K.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,s,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return yt.get(e,n)||yt.access(e,n,{empty:K.Callbacks("once memory").add(function(){yt.remove(e,[t+"queue",n])})})}}),K.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?K.queue(this[0],e):void 0===t?this:this.each(function(){var n=K.queue(this,e,t);K._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&K.dequeue(this,e)})},dequeue:function(e){return this.each(function(){K.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=K.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";s--;)n=yt.get(o[s],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(a));return a(),i.promise(t)}});var wt=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,St=["Top","Right","Bottom","Left"],Tt=function(e,t){return e=t||e,"none"===K.css(e,"display")||!K.contains(e.ownerDocument,e)},_t=/^(?:checkbox|radio)$/i;!function(){var e=Z.createDocumentFragment(),t=e.appendChild(Z.createElement("div")),n=Z.createElement("input");n.setAttribute("type","radio"),n.setAttribute("checked","checked"),n.setAttribute("name","t"),t.appendChild(n),Y.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,t.innerHTML="<textarea>x</textarea>",Y.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue}();var kt="undefined";Y.focusinBubbles="onfocusin"in e;var Ct=/^key/,Et=/^(?:mouse|pointer|contextmenu)|click/,At=/^(?:focusinfocus|focusoutblur)$/,Nt=/^([^.]*)(?:\.(.+)|)$/;K.event={global:{},add:function(e,t,n,r,i){var o,s,a,u,l,c,p,h,f,d,m,g=yt.get(e);if(g)for(n.handler&&(o=n,n=o.handler,i=o.selector),n.guid||(n.guid=K.guid++),(u=g.events)||(u=g.events={}),(s=g.handle)||(s=g.handle=function(t){return typeof K!==kt&&K.event.triggered!==t.type?K.event.dispatch.apply(e,arguments):void 0}),t=(t||"").match(ft)||[""],l=t.length;l--;)a=Nt.exec(t[l])||[],f=m=a[1],d=(a[2]||"").split(".").sort(),f&&(p=K.event.special[f]||{},f=(i?p.delegateType:p.bindType)||f,p=K.event.special[f]||{},c=K.extend({type:f,origType:m,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&K.expr.match.needsContext.test(i),namespace:d.join(".")},o),(h=u[f])||(h=u[f]=[],h.delegateCount=0,p.setup&&p.setup.call(e,r,d,s)!==!1||e.addEventListener&&e.addEventListener(f,s,!1)),p.add&&(p.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?h.splice(h.delegateCount++,0,c):h.push(c),K.event.global[f]=!0)},remove:function(e,t,n,r,i){var o,s,a,u,l,c,p,h,f,d,m,g=yt.hasData(e)&&yt.get(e);if(g&&(u=g.events)){for(t=(t||"").match(ft)||[""],l=t.length;l--;)if(a=Nt.exec(t[l])||[],f=m=a[1],d=(a[2]||"").split(".").sort(),f){for(p=K.event.special[f]||{},f=(r?p.delegateType:p.bindType)||f,h=u[f]||[],a=a[2]&&new RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=h.length;o--;)c=h[o],!i&&m!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(h.splice(o,1),c.selector&&h.delegateCount--,p.remove&&p.remove.call(e,c));s&&!h.length&&(p.teardown&&p.teardown.call(e,d,g.handle)!==!1||K.removeEvent(e,f,g.handle),delete u[f])}else for(f in u)K.event.remove(e,f+t[l],n,r,!0);K.isEmptyObject(u)&&(delete g.handle,yt.remove(e,"events"))}},trigger:function(t,n,r,i){var o,s,a,u,l,c,p,h=[r||Z],f=J.call(t,"type")?t.type:t,d=J.call(t,"namespace")?t.namespace.split("."):[];if(s=a=r=r||Z,3!==r.nodeType&&8!==r.nodeType&&!At.test(f+K.event.triggered)&&(f.indexOf(".")>=0&&(d=f.split("."),f=d.shift(),d.sort()),l=f.indexOf(":")<0&&"on"+f,t=t[K.expando]?t:new K.Event(f,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=d.join("."),t.namespace_re=t.namespace?new RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=r),n=null==n?[t]:K.makeArray(n,[t]),p=K.event.special[f]||{},i||!p.trigger||p.trigger.apply(r,n)!==!1)){if(!i&&!p.noBubble&&!K.isWindow(r)){for(u=p.delegateType||f,At.test(u+f)||(s=s.parentNode);s;s=s.parentNode)h.push(s),a=s;a===(r.ownerDocument||Z)&&h.push(a.defaultView||a.parentWindow||e)}for(o=0;(s=h[o++])&&!t.isPropagationStopped();)t.type=o>1?u:p.bindType||f,c=(yt.get(s,"events")||{})[t.type]&&yt.get(s,"handle"),c&&c.apply(s,n),c=l&&s[l],c&&c.apply&&K.acceptData(s)&&(t.result=c.apply(s,n),t.result===!1&&t.preventDefault());return t.type=f,i||t.isDefaultPrevented()||p._default&&p._default.apply(h.pop(),n)!==!1||!K.acceptData(r)||l&&K.isFunction(r[f])&&!K.isWindow(r)&&(a=r[l],a&&(r[l]=null),K.event.triggered=f,r[f](),K.event.triggered=void 0,a&&(r[l]=a)),t.result}},dispatch:function(e){e=K.event.fix(e);
var t,n,r,i,o,s=[],a=z.call(arguments),u=(yt.get(this,"events")||{})[e.type]||[],l=K.event.special[e.type]||{};if(a[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){for(s=K.event.handlers.call(this,e,u),t=0;(i=s[t++])&&!e.isPropagationStopped();)for(e.currentTarget=i.elem,n=0;(o=i.handlers[n++])&&!e.isImmediatePropagationStopped();)(!e.namespace_re||e.namespace_re.test(o.namespace))&&(e.handleObj=o,e.data=o.data,r=((K.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a),void 0!==r&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()));return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target;if(a&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!==this;u=u.parentNode||this)if(u.disabled!==!0||"click"!==e.type){for(r=[],n=0;a>n;n++)o=t[n],i=o.selector+" ",void 0===r[i]&&(r[i]=o.needsContext?K(i,this).index(u)>=0:K.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&s.push({elem:u,handlers:r})}return a<t.length&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,o=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||Z,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||void 0===o||(e.which=1&o?1:2&o?3:4&o?2:0),e}},fix:function(e){if(e[K.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];for(s||(this.fixHooks[i]=s=Et.test(i)?this.mouseHooks:Ct.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new K.Event(o),t=r.length;t--;)n=r[t],e[n]=o[n];return e.target||(e.target=Z),3===e.target.nodeType&&(e.target=e.target.parentNode),s.filter?s.filter(e,o):e},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==p()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===p()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&K.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(e){return K.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=K.extend(new K.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?K.event.trigger(i,null,t):K.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},K.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)},K.Event=function(e,t){return this instanceof K.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&e.returnValue===!1?l:c):this.type=e,t&&K.extend(this,t),this.timeStamp=e&&e.timeStamp||K.now(),void(this[K.expando]=!0)):new K.Event(e,t)},K.Event.prototype={isDefaultPrevented:c,isPropagationStopped:c,isImmediatePropagationStopped:c,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=l,e&&e.preventDefault&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=l,e&&e.stopPropagation&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=l,e&&e.stopImmediatePropagation&&e.stopImmediatePropagation(),this.stopPropagation()}},K.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){K.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!K.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),Y.focusinBubbles||K.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){K.event.simulate(t,e.target,K.event.fix(e),!0)};K.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=yt.access(r,t);i||r.addEventListener(e,n,!0),yt.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=yt.access(r,t)-1;i?yt.access(r,t,i):(r.removeEventListener(e,n,!0),yt.remove(r,t))}}}),K.fn.extend({on:function(e,t,n,r,i){var o,s;if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=void 0);for(s in e)this.on(s,t,n,e[s],i);return this}if(null==n&&null==r?(r=t,n=t=void 0):null==r&&("string"==typeof t?(r=n,n=void 0):(r=n,n=t,t=void 0)),r===!1)r=c;else if(!r)return this;return 1===i&&(o=r,r=function(e){return K().off(e),o.apply(this,arguments)},r.guid=o.guid||(o.guid=K.guid++)),this.each(function(){K.event.add(this,e,r,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,K(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return(t===!1||"function"==typeof t)&&(n=t,t=void 0),n===!1&&(n=c),this.each(function(){K.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){K.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?K.event.trigger(e,t,n,!0):void 0}});var Dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,jt=/<([\w:]+)/,Pt=/<|&#?\w+;/,Ft=/<(?:script|style|link)/i,qt=/checked\s*(?:[^=]|=\s*.checked.)/i,Ot=/^$|\/(?:java|ecma)script/i,Lt=/^true\/(.*)/,Ht=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,Rt={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};Rt.optgroup=Rt.option,Rt.tbody=Rt.tfoot=Rt.colgroup=Rt.caption=Rt.thead,Rt.th=Rt.td,K.extend({clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=K.contains(e.ownerDocument,e);if(!(Y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||K.isXMLDoc(e)))for(s=y(a),o=y(e),r=0,i=o.length;i>r;r++)v(o[r],s[r]);if(t)if(n)for(o=o||y(e),s=s||y(a),r=0,i=o.length;i>r;r++)g(o[r],s[r]);else g(e,a);return s=y(a,"script"),s.length>0&&m(s,!u&&y(e,"script")),a},buildFragment:function(e,t,n,r){for(var i,o,s,a,u,l,c=t.createDocumentFragment(),p=[],h=0,f=e.length;f>h;h++)if(i=e[h],i||0===i)if("object"===K.type(i))K.merge(p,i.nodeType?[i]:i);else if(Pt.test(i)){for(o=o||c.appendChild(t.createElement("div")),s=(jt.exec(i)||["",""])[1].toLowerCase(),a=Rt[s]||Rt._default,o.innerHTML=a[1]+i.replace(Dt,"<$1></$2>")+a[2],l=a[0];l--;)o=o.lastChild;K.merge(p,o.childNodes),o=c.firstChild,o.textContent=""}else p.push(t.createTextNode(i));for(c.textContent="",h=0;i=p[h++];)if((!r||-1===K.inArray(i,r))&&(u=K.contains(i.ownerDocument,i),o=y(c.appendChild(i),"script"),u&&m(o),n))for(l=0;i=o[l++];)Ot.test(i.type||"")&&n.push(i);return c},cleanData:function(e){for(var t,n,r,i,o=K.event.special,s=0;void 0!==(n=e[s]);s++){if(K.acceptData(n)&&(i=n[yt.expando],i&&(t=yt.cache[i]))){if(t.events)for(r in t.events)o[r]?K.event.remove(n,r):K.removeEvent(n,r,t.handle);yt.cache[i]&&delete yt.cache[i]}delete vt.cache[n[vt.expando]]}}}),K.fn.extend({text:function(e){return gt(this,function(e){return void 0===e?K.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=e)})},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=h(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=h(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){for(var n,r=e?K.filter(e,this):this,i=0;null!=(n=r[i]);i++)t||1!==n.nodeType||K.cleanData(y(n)),n.parentNode&&(t&&K.contains(n.ownerDocument,n)&&m(y(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(K.cleanData(y(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return K.clone(this,e,t)})},html:function(e){return gt(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ft.test(e)&&!Rt[(jt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(Dt,"<$1></$2>");try{for(;r>n;n++)t=this[n]||{},1===t.nodeType&&(K.cleanData(y(t,!1)),t.innerHTML=e);t=0}catch(i){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=arguments[0];return this.domManip(arguments,function(t){e=this.parentNode,K.cleanData(y(this)),e&&e.replaceChild(t,this)}),e&&(e.length||e.nodeType)?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t){e=U.apply([],e);var n,r,i,o,s,a,u=0,l=this.length,c=this,p=l-1,h=e[0],m=K.isFunction(h);if(m||l>1&&"string"==typeof h&&!Y.checkClone&&qt.test(h))return this.each(function(n){var r=c.eq(n);m&&(e[0]=h.call(this,n,r.html())),r.domManip(e,t)});if(l&&(n=K.buildFragment(e,this[0].ownerDocument,!1,this),r=n.firstChild,1===n.childNodes.length&&(n=r),r)){for(i=K.map(y(n,"script"),f),o=i.length;l>u;u++)s=n,u!==p&&(s=K.clone(s,!0,!0),o&&K.merge(i,y(s,"script"))),t.call(this[u],s,u);if(o)for(a=i[i.length-1].ownerDocument,K.map(i,d),u=0;o>u;u++)s=i[u],Ot.test(s.type||"")&&!yt.access(s,"globalEval")&&K.contains(a,s)&&(s.src?K._evalUrl&&K._evalUrl(s.src):K.globalEval(s.textContent.replace(Ht,"")))}return this}}),K.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){K.fn[e]=function(e){for(var n,r=[],i=K(e),o=i.length-1,s=0;o>=s;s++)n=s===o?this:this.clone(!0),K(i[s])[t](n),W.apply(r,n.get());return this.pushStack(r)}});var It,Mt={},$t=/^margin/,Qt=new RegExp("^("+wt+")(?!px)[a-z%]+$","i"),zt=function(e){return e.ownerDocument.defaultView.getComputedStyle(e,null)};!function(){function t(){s.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",s.innerHTML="",i.appendChild(o);var t=e.getComputedStyle(s,null);n="1%"!==t.top,r="4px"===t.width,i.removeChild(o)}var n,r,i=Z.documentElement,o=Z.createElement("div"),s=Z.createElement("div");s.style&&(s.style.backgroundClip="content-box",s.cloneNode(!0).style.backgroundClip="",Y.clearCloneStyle="content-box"===s.style.backgroundClip,o.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",o.appendChild(s),e.getComputedStyle&&K.extend(Y,{pixelPosition:function(){return t(),n},boxSizingReliable:function(){return null==r&&t(),r},reliableMarginRight:function(){var t,n=s.appendChild(Z.createElement("div"));return n.style.cssText=s.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",n.style.marginRight=n.style.width="0",s.style.width="1px",i.appendChild(o),t=!parseFloat(e.getComputedStyle(n,null).marginRight),i.removeChild(o),t}}))}(),K.swap=function(e,t,n,r){var i,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=s[o];return i};var Ut=/^(none|table(?!-c[ea]).+)/,Wt=new RegExp("^("+wt+")(.*)$","i"),Bt=new RegExp("^([+-])=("+wt+")","i"),Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:"0",fontWeight:"400"},Jt=["Webkit","O","Moz","ms"];K.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=w(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=K.camelCase(t),u=e.style;return t=K.cssProps[a]||(K.cssProps[a]=T(u,a)),s=K.cssHooks[t]||K.cssHooks[a],void 0===n?s&&"get"in s&&void 0!==(i=s.get(e,!1,r))?i:u[t]:(o=typeof n,"string"===o&&(i=Bt.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(K.css(e,t)),o="number"),null!=n&&n===n&&("number"!==o||K.cssNumber[a]||(n+="px"),Y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&void 0===(n=s.set(e,n,r))||(u[t]=n)),void 0)}},css:function(e,t,n,r){var i,o,s,a=K.camelCase(t);return t=K.cssProps[a]||(K.cssProps[a]=T(e.style,a)),s=K.cssHooks[t]||K.cssHooks[a],s&&"get"in s&&(i=s.get(e,!0,n)),void 0===i&&(i=w(e,t,r)),"normal"===i&&t in Vt&&(i=Vt[t]),""===n||n?(o=parseFloat(i),n===!0||K.isNumeric(o)?o||0:i):i}}),K.each(["height","width"],function(e,t){K.cssHooks[t]={get:function(e,n,r){return n?Ut.test(K.css(e,"display"))&&0===e.offsetWidth?K.swap(e,Xt,function(){return C(e,t,r)}):C(e,t,r):void 0},set:function(e,n,r){var i=r&&zt(e);return _(e,n,r?k(e,t,r,"border-box"===K.css(e,"boxSizing",!1,i),i):0)}}}),K.cssHooks.marginRight=S(Y.reliableMarginRight,function(e,t){return t?K.swap(e,{display:"inline-block"},w,[e,"marginRight"]):void 0}),K.each({margin:"",padding:"",border:"Width"},function(e,t){K.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];4>r;r++)i[e+St[r]+t]=o[r]||o[r-2]||o[0];return i}},$t.test(e)||(K.cssHooks[e+t].set=_)}),K.fn.extend({css:function(e,t){return gt(this,function(e,t,n){var r,i,o={},s=0;if(K.isArray(t)){for(r=zt(e),i=t.length;i>s;s++)o[t[s]]=K.css(e,t[s],!1,r);return o}return void 0!==n?K.style(e,t,n):K.css(e,t)},e,t,arguments.length>1)},show:function(){return E(this,!0)},hide:function(){return E(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){Tt(this)?K(this).show():K(this).hide()})}}),K.Tween=A,A.prototype={constructor:A,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(K.cssNumber[n]?"":"px")},cur:function(){var e=A.propHooks[this.prop];return e&&e.get?e.get(this):A.propHooks._default.get(this)},run:function(e){var t,n=A.propHooks[this.prop];return this.pos=t=this.options.duration?K.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):A.propHooks._default.set(this),this}},A.prototype.init.prototype=A.prototype,A.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=K.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){K.fx.step[e.prop]?K.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[K.cssProps[e.prop]]||K.cssHooks[e.prop])?K.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},A.propHooks.scrollTop=A.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},K.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},K.fx=A.prototype.init,K.fx.step={};var Yt,Zt,Gt=/^(?:toggle|show|hide)$/,Kt=new RegExp("^(?:([+-])=|)("+wt+")([a-z%]*)$","i"),en=/queueHooks$/,tn=[P],nn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Kt.exec(t),o=i&&i[3]||(K.cssNumber[e]?"":"px"),s=(K.cssNumber[e]||"px"!==o&&+r)&&Kt.exec(K.css(n.elem,e)),a=1,u=20;if(s&&s[3]!==o){o=o||s[3],i=i||[],s=+r||1;do a=a||".5",s/=a,K.style(n.elem,e,s+o);while(a!==(a=n.cur()/r)&&1!==a&&--u)}return i&&(s=n.start=+s||+r||0,n.unit=o,n.end=i[1]?s+(i[1]+1)*i[2]:+i[2]),n}]};K.Animation=K.extend(q,{tweener:function(e,t){K.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");for(var n,r=0,i=e.length;i>r;r++)n=e[r],nn[n]=nn[n]||[],nn[n].unshift(t)},prefilter:function(e,t){t?tn.unshift(e):tn.push(e)}}),K.speed=function(e,t,n){var r=e&&"object"==typeof e?K.extend({},e):{complete:n||!n&&t||K.isFunction(e)&&e,duration:e,easing:n&&t||t&&!K.isFunction(t)&&t};return r.duration=K.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in K.fx.speeds?K.fx.speeds[r.duration]:K.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){K.isFunction(r.old)&&r.old.call(this),r.queue&&K.dequeue(this,r.queue)},r},K.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Tt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=K.isEmptyObject(e),o=K.speed(t,n,r),s=function(){var t=q(this,K.extend({},e),o);(i||yt.get(this,"finish"))&&t.stop(!0)};return s.finish=s,i||o.queue===!1?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=K.timers,s=yt.get(this);if(i)s[i]&&s[i].stop&&r(s[i]);else for(i in s)s[i]&&s[i].stop&&en.test(i)&&r(s[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));(t||!n)&&K.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=yt.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=K.timers,s=r?r.length:0;for(n.finish=!0,K.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;s>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),K.each(["toggle","show","hide"],function(e,t){var n=K.fn[t];K.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(D(t,!0),e,r,i)}}),K.each({slideDown:D("show"),slideUp:D("hide"),slideToggle:D("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){K.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),K.timers=[],K.fx.tick=function(){var e,t=0,n=K.timers;for(Yt=K.now();t<n.length;t++)e=n[t],e()||n[t]!==e||n.splice(t--,1);n.length||K.fx.stop(),Yt=void 0},K.fx.timer=function(e){K.timers.push(e),e()?K.fx.start():K.timers.pop()},K.fx.interval=13,K.fx.start=function(){Zt||(Zt=setInterval(K.fx.tick,K.fx.interval))},K.fx.stop=function(){clearInterval(Zt),Zt=null},K.fx.speeds={slow:600,fast:200,_default:400},K.fn.delay=function(e,t){return e=K.fx?K.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},function(){var e=Z.createElement("input"),t=Z.createElement("select"),n=t.appendChild(Z.createElement("option"));e.type="checkbox",Y.checkOn=""!==e.value,Y.optSelected=n.selected,t.disabled=!0,Y.optDisabled=!n.disabled,e=Z.createElement("input"),e.value="t",e.type="radio",Y.radioValue="t"===e.value}();var rn,on,sn=K.expr.attrHandle;K.fn.extend({attr:function(e,t){return gt(this,K.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){K.removeAttr(this,e)})}}),K.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(e&&3!==o&&8!==o&&2!==o)return typeof e.getAttribute===kt?K.prop(e,t,n):(1===o&&K.isXMLDoc(e)||(t=t.toLowerCase(),r=K.attrHooks[t]||(K.expr.match.bool.test(t)?on:rn)),void 0===n?r&&"get"in r&&null!==(i=r.get(e,t))?i:(i=K.find.attr(e,t),null==i?void 0:i):null!==n?r&&"set"in r&&void 0!==(i=r.set(e,n,t))?i:(e.setAttribute(t,n+""),n):void K.removeAttr(e,t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(ft);if(o&&1===e.nodeType)for(;n=o[i++];)r=K.propFix[n]||n,K.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)},attrHooks:{type:{set:function(e,t){if(!Y.radioValue&&"radio"===t&&K.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}}}),on={set:function(e,t,n){return t===!1?K.removeAttr(e,n):e.setAttribute(n,n),n}},K.each(K.expr.match.bool.source.match(/\w+/g),function(e,t){var n=sn[t]||K.find.attr;sn[t]=function(e,t,r){var i,o;return r||(o=sn[t],sn[t]=i,i=null!=n(e,t,r)?t.toLowerCase():null,sn[t]=o),i}});var an=/^(?:input|select|textarea|button)$/i;K.fn.extend({prop:function(e,t){return gt(this,K.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[K.propFix[e]||e]})}}),K.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(e,t,n){var r,i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return o=1!==s||!K.isXMLDoc(e),o&&(t=K.propFix[t]||t,i=K.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){return e.hasAttribute("tabindex")||an.test(e.nodeName)||e.href?e.tabIndex:-1}}}}),Y.optSelected||(K.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null}}),K.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){K.propFix[this.toLowerCase()]=this});var un=/[\t\r\n\f]/g;K.fn.extend({addClass:function(e){var t,n,r,i,o,s,a="string"==typeof e&&e,u=0,l=this.length;if(K.isFunction(e))return this.each(function(t){K(this).addClass(e.call(this,t,this.className))});if(a)for(t=(e||"").match(ft)||[];l>u;u++)if(n=this[u],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(un," "):" ")){for(o=0;i=t[o++];)r.indexOf(" "+i+" ")<0&&(r+=i+" ");s=K.trim(r),n.className!==s&&(n.className=s)}return this},removeClass:function(e){var t,n,r,i,o,s,a=0===arguments.length||"string"==typeof e&&e,u=0,l=this.length;if(K.isFunction(e))return this.each(function(t){K(this).removeClass(e.call(this,t,this.className))});if(a)for(t=(e||"").match(ft)||[];l>u;u++)if(n=this[u],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(un," "):"")){for(o=0;i=t[o++];)for(;r.indexOf(" "+i+" ")>=0;)r=r.replace(" "+i+" "," ");s=e?K.trim(r):"",n.className!==s&&(n.className=s)}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):this.each(K.isFunction(e)?function(n){K(this).toggleClass(e.call(this,n,this.className,t),t)}:function(){if("string"===n)for(var t,r=0,i=K(this),o=e.match(ft)||[];t=o[r++];)i.hasClass(t)?i.removeClass(t):i.addClass(t);else(n===kt||"boolean"===n)&&(this.className&&yt.set(this,"__className__",this.className),this.className=this.className||e===!1?"":yt.get(this,"__className__")||"")})},hasClass:function(e){for(var t=" "+e+" ",n=0,r=this.length;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(un," ").indexOf(t)>=0)return!0;return!1}});var ln=/\r/g;K.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=K.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,K(this).val()):e,null==i?i="":"number"==typeof i?i+="":K.isArray(i)&&(i=K.map(i,function(e){return null==e?"":e+""})),t=K.valHooks[this.type]||K.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return t=K.valHooks[i.type]||K.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:(n=i.value,"string"==typeof n?n.replace(ln,""):null==n?"":n)}}}),K.extend({valHooks:{option:{get:function(e){var t=K.find.attr(e,"value");return null!=t?t:K.trim(K.text(e))}},select:{get:function(e){for(var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,s=o?null:[],a=o?i+1:r.length,u=0>i?a:o?i:0;a>u;u++)if(n=r[u],!(!n.selected&&u!==i||(Y.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&K.nodeName(n.parentNode,"optgroup"))){if(t=K(n).val(),o)return t;s.push(t)}return s},set:function(e,t){for(var n,r,i=e.options,o=K.makeArray(t),s=i.length;s--;)r=i[s],(r.selected=K.inArray(r.value,o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),K.each(["radio","checkbox"],function(){K.valHooks[this]={set:function(e,t){return K.isArray(t)?e.checked=K.inArray(K(e).val(),t)>=0:void 0}},Y.checkOn||(K.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),K.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){K.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),K.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var cn=K.now(),pn=/\?/;K.parseJSON=function(e){return JSON.parse(e+"")},K.parseXML=function(e){var t,n;if(!e||"string"!=typeof e)return null;try{n=new DOMParser,t=n.parseFromString(e,"text/xml")}catch(r){t=void 0}return(!t||t.getElementsByTagName("parsererror").length)&&K.error("Invalid XML: "+e),t};var hn,fn,dn=/#.*$/,mn=/([?&])_=[^&]*/,gn=/^(.*?):[ \t]*([^\r\n]*)$/gm,yn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,bn=/^\/\//,xn=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,wn={},Sn={},Tn="*/".concat("*");try{fn=location.href}catch(_n){fn=Z.createElement("a"),fn.href="",fn=fn.href}hn=xn.exec(fn.toLowerCase())||[],K.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:fn,type:"GET",isLocal:yn.test(hn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Tn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":K.parseJSON,"text xml":K.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?H(H(e,K.ajaxSettings),t):H(K.ajaxSettings,e)},ajaxPrefilter:O(wn),ajaxTransport:O(Sn),ajax:function(e,t){function n(e,t,n,s){var u,c,y,v,x,S=t;2!==b&&(b=2,a&&clearTimeout(a),r=void 0,o=s||"",w.readyState=e>0?4:0,u=e>=200&&300>e||304===e,n&&(v=R(p,w,n)),v=I(p,v,w,u),u?(p.ifModified&&(x=w.getResponseHeader("Last-Modified"),x&&(K.lastModified[i]=x),x=w.getResponseHeader("etag"),x&&(K.etag[i]=x)),204===e||"HEAD"===p.type?S="nocontent":304===e?S="notmodified":(S=v.state,c=v.data,y=v.error,u=!y)):(y=S,(e||!S)&&(S="error",0>e&&(e=0))),w.status=e,w.statusText=(t||S)+"",u?d.resolveWith(h,[c,S,w]):d.rejectWith(h,[w,S,y]),w.statusCode(g),g=void 0,l&&f.trigger(u?"ajaxSuccess":"ajaxError",[w,p,u?c:y]),m.fireWith(h,[w,S]),l&&(f.trigger("ajaxComplete",[w,p]),--K.active||K.event.trigger("ajaxStop")))}"object"==typeof e&&(t=e,e=void 0),t=t||{};var r,i,o,s,a,u,l,c,p=K.ajaxSetup({},t),h=p.context||p,f=p.context&&(h.nodeType||h.jquery)?K(h):K.event,d=K.Deferred(),m=K.Callbacks("once memory"),g=p.statusCode||{},y={},v={},b=0,x="canceled",w={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!s)for(s={};t=gn.exec(o);)s[t[1].toLowerCase()]=t[2];t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?o:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)g[t]=[g[t],e[t]];else w.always(e[w.status]);return this},abort:function(e){var t=e||x;return r&&r.abort(t),n(0,t),this}};if(d.promise(w).complete=m.add,w.success=w.done,w.error=w.fail,p.url=((e||p.url||fn)+"").replace(dn,"").replace(bn,hn[1]+"//"),p.type=t.method||t.type||p.method||p.type,p.dataTypes=K.trim(p.dataType||"*").toLowerCase().match(ft)||[""],null==p.crossDomain&&(u=xn.exec(p.url.toLowerCase()),p.crossDomain=!(!u||u[1]===hn[1]&&u[2]===hn[2]&&(u[3]||("http:"===u[1]?"80":"443"))===(hn[3]||("http:"===hn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=K.param(p.data,p.traditional)),L(wn,p,t,w),2===b)return w;l=p.global,l&&0===K.active++&&K.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!vn.test(p.type),i=p.url,p.hasContent||(p.data&&(i=p.url+=(pn.test(i)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=mn.test(i)?i.replace(mn,"$1_="+cn++):i+(pn.test(i)?"&":"?")+"_="+cn++)),p.ifModified&&(K.lastModified[i]&&w.setRequestHeader("If-Modified-Since",K.lastModified[i]),K.etag[i]&&w.setRequestHeader("If-None-Match",K.etag[i])),(p.data&&p.hasContent&&p.contentType!==!1||t.contentType)&&w.setRequestHeader("Content-Type",p.contentType),w.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Tn+"; q=0.01":""):p.accepts["*"]);for(c in p.headers)w.setRequestHeader(c,p.headers[c]);if(p.beforeSend&&(p.beforeSend.call(h,w,p)===!1||2===b))return w.abort();x="abort";for(c in{success:1,error:1,complete:1})w[c](p[c]);if(r=L(Sn,p,t,w)){w.readyState=1,l&&f.trigger("ajaxSend",[w,p]),p.async&&p.timeout>0&&(a=setTimeout(function(){w.abort("timeout")},p.timeout));try{b=1,r.send(y,n)}catch(S){if(!(2>b))throw S;n(-1,S)}}else n(-1,"No Transport");return w},getJSON:function(e,t,n){return K.get(e,t,n,"json")},getScript:function(e,t){return K.get(e,void 0,t,"script")}}),K.each(["get","post"],function(e,t){K[t]=function(e,n,r,i){return K.isFunction(n)&&(i=i||r,r=n,n=void 0),K.ajax({url:e,type:t,dataType:i,data:n,success:r})}}),K.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){K.fn[t]=function(e){return this.on(t,e)}}),K._evalUrl=function(e){return K.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},K.fn.extend({wrapAll:function(e){var t;return K.isFunction(e)?this.each(function(t){K(this).wrapAll(e.call(this,t))}):(this[0]&&(t=K(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return this.each(K.isFunction(e)?function(t){K(this).wrapInner(e.call(this,t))}:function(){var t=K(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=K.isFunction(e);return this.each(function(n){K(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){K.nodeName(this,"body")||K(this).replaceWith(this.childNodes)}).end()}}),K.expr.filters.hidden=function(e){return e.offsetWidth<=0&&e.offsetHeight<=0},K.expr.filters.visible=function(e){return!K.expr.filters.hidden(e)};var kn=/%20/g,Cn=/\[\]$/,En=/\r?\n/g,An=/^(?:submit|button|image|reset|file)$/i,Nn=/^(?:input|select|textarea|keygen)/i;K.param=function(e,t){var n,r=[],i=function(e,t){t=K.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(void 0===t&&(t=K.ajaxSettings&&K.ajaxSettings.traditional),K.isArray(e)||e.jquery&&!K.isPlainObject(e))K.each(e,function(){i(this.name,this.value)});else for(n in e)M(n,e[n],t,i);return r.join("&").replace(kn,"+")},K.fn.extend({serialize:function(){return K.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=K.prop(this,"elements");return e?K.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!K(this).is(":disabled")&&Nn.test(this.nodeName)&&!An.test(e)&&(this.checked||!_t.test(e))}).map(function(e,t){var n=K(this).val();return null==n?null:K.isArray(n)?K.map(n,function(e){return{name:t.name,value:e.replace(En,"\r\n")}}):{name:t.name,value:n.replace(En,"\r\n")}}).get()}}),K.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}};var Dn=0,jn={},Pn={0:200,1223:204},Fn=K.ajaxSettings.xhr();e.ActiveXObject&&K(e).on("unload",function(){for(var e in jn)jn[e]()}),Y.cors=!!Fn&&"withCredentials"in Fn,Y.ajax=Fn=!!Fn,K.ajaxTransport(function(e){var t;return Y.cors||Fn&&!e.crossDomain?{send:function(n,r){var i,o=e.xhr(),s=++Dn;if(o.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)o[i]=e.xhrFields[i];e.mimeType&&o.overrideMimeType&&o.overrideMimeType(e.mimeType),e.crossDomain||n["X-Requested-With"]||(n["X-Requested-With"]="XMLHttpRequest");for(i in n)o.setRequestHeader(i,n[i]);t=function(e){return function(){t&&(delete jn[s],t=o.onload=o.onerror=null,"abort"===e?o.abort():"error"===e?r(o.status,o.statusText):r(Pn[o.status]||o.status,o.statusText,"string"==typeof o.responseText?{text:o.responseText}:void 0,o.getAllResponseHeaders()))
}},o.onload=t(),o.onerror=t("error"),t=jn[s]=t("abort");try{o.send(e.hasContent&&e.data||null)}catch(a){if(t)throw a}},abort:function(){t&&t()}}:void 0}),K.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return K.globalEval(e),e}}}),K.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),K.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=K("<script>").prop({async:!0,charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),Z.head.appendChild(t[0])},abort:function(){n&&n()}}}});var qn=[],On=/(=)\?(?=&|$)|\?\?/;K.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=qn.pop()||K.expando+"_"+cn++;return this[e]=!0,e}}),K.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=t.jsonp!==!1&&(On.test(t.url)?"url":"string"==typeof t.data&&!(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&On.test(t.data)&&"data");return a||"jsonp"===t.dataTypes[0]?(i=t.jsonpCallback=K.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(On,"$1"+i):t.jsonp!==!1&&(t.url+=(pn.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||K.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,qn.push(i)),s&&K.isFunction(o)&&o(s[0]),s=o=void 0}),"script"):void 0}),K.parseHTML=function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||Z;var r=st.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=K.buildFragment([e],t,i),i&&i.length&&K(i).remove(),K.merge([],r.childNodes))};var Ln=K.fn.load;K.fn.load=function(e,t,n){if("string"!=typeof e&&Ln)return Ln.apply(this,arguments);var r,i,o,s=this,a=e.indexOf(" ");return a>=0&&(r=K.trim(e.slice(a)),e=e.slice(0,a)),K.isFunction(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),s.length>0&&K.ajax({url:e,type:i,dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?K("<div>").append(K.parseHTML(e)).find(r):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},K.expr.filters.animated=function(e){return K.grep(K.timers,function(t){return e===t.elem}).length};var Hn=e.document.documentElement;K.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l,c=K.css(e,"position"),p=K(e),h={};"static"===c&&(e.style.position="relative"),a=p.offset(),o=K.css(e,"top"),u=K.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=p.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),K.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(h.top=t.top-a.top+s),null!=t.left&&(h.left=t.left-a.left+i),"using"in t?t.using.call(e,h):p.css(h)}},K.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){K.offset.setOffset(this,e,t)});var t,n,r=this[0],i={top:0,left:0},o=r&&r.ownerDocument;if(o)return t=o.documentElement,K.contains(t,r)?(typeof r.getBoundingClientRect!==kt&&(i=r.getBoundingClientRect()),n=$(o),{top:i.top+n.pageYOffset-t.clientTop,left:i.left+n.pageXOffset-t.clientLeft}):i},position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===K.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),K.nodeName(e[0],"html")||(r=e.offset()),r.top+=K.css(e[0],"borderTopWidth",!0),r.left+=K.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-K.css(n,"marginTop",!0),left:t.left-r.left-K.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent||Hn;e&&!K.nodeName(e,"html")&&"static"===K.css(e,"position");)e=e.offsetParent;return e||Hn})}}),K.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,n){var r="pageYOffset"===n;K.fn[t]=function(i){return gt(this,function(t,i,o){var s=$(t);return void 0===o?s?s[n]:t[i]:void(s?s.scrollTo(r?e.pageXOffset:o,r?o:e.pageYOffset):t[i]=o)},t,i,arguments.length,null)}}),K.each(["top","left"],function(e,t){K.cssHooks[t]=S(Y.pixelPosition,function(e,n){return n?(n=w(e,t),Qt.test(n)?K(e).position()[t]+"px":n):void 0})}),K.each({Height:"height",Width:"width"},function(e,t){K.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){K.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(r===!0||i===!0?"margin":"border");return gt(this,function(t,n,r){var i;return K.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===r?K.css(t,n,s):K.style(t,n,r,s)},t,o?r:void 0,o,null)}})}),K.fn.size=function(){return this.length},K.fn.andSelf=K.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return K});var Rn=e.jQuery,In=e.$;return K.noConflict=function(t){return e.$===K&&(e.$=In),t&&e.jQuery===K&&(e.jQuery=Rn),K},typeof t===kt&&(e.jQuery=e.$=K),K}),/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
function(e,t){if("object"==typeof exports&&exports)t(exports);else{var n={};t(n),"function"==typeof define&&define.amd?define(n):e.Mustache=n}}(this,function(e){function t(e,t){return f.call(e,t)}function n(e){return!t(d,e)}function r(e){return"function"==typeof e}function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function o(e){return String(e).replace(/[&<>"'\/]/g,function(e){return y[e]})}function s(e){if(!g(e)||2!==e.length)throw new Error("Invalid tags: "+e);return[new RegExp(i(e[0])+"\\s*"),new RegExp("\\s*"+i(e[1]))]}function a(t,r){function o(){if(C&&!E)for(;k.length;)delete _[k.pop()];else k=[];C=!1,E=!1}r=r||e.tags,t=t||"","string"==typeof r&&(r=r.split(b));for(var a,p,h,f,d,m,g=s(r),y=new c(t),T=[],_=[],k=[],C=!1,E=!1;!y.eos();){if(a=y.pos,h=y.scanUntil(g[0]))for(var A=0,N=h.length;N>A;++A)f=h.charAt(A),n(f)?k.push(_.length):E=!0,_.push(["text",f,a,a+1]),a+=1,"\n"===f&&o();if(!y.scan(g[0]))break;if(C=!0,p=y.scan(S)||"name",y.scan(v),"="===p?(h=y.scanUntil(x),y.scan(x),y.scanUntil(g[1])):"{"===p?(h=y.scanUntil(new RegExp("\\s*"+i("}"+r[1]))),y.scan(w),y.scanUntil(g[1]),p="&"):h=y.scanUntil(g[1]),!y.scan(g[1]))throw new Error("Unclosed tag at "+y.pos);if(d=[p,h,a,y.pos],_.push(d),"#"===p||"^"===p)T.push(d);else if("/"===p){if(m=T.pop(),!m)throw new Error('Unopened section "'+h+'" at '+a);if(m[1]!==h)throw new Error('Unclosed section "'+m[1]+'" at '+a)}else"name"===p||"{"===p||"&"===p?E=!0:"="===p&&(g=s(r=h.split(b)))}if(m=T.pop())throw new Error('Unclosed section "'+m[1]+'" at '+y.pos);return l(u(_))}function u(e){for(var t,n,r=[],i=0,o=e.length;o>i;++i)t=e[i],t&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(r.push(t),n=t));return r}function l(e){for(var t,n,r=[],i=r,o=[],s=0,a=e.length;a>s;++s)switch(t=e[s],t[0]){case"#":case"^":i.push(t),o.push(t),i=t[4]=[];break;case"/":n=o.pop(),n[5]=t[2],i=o.length>0?o[o.length-1][4]:r;break;default:i.push(t)}return r}function c(e){this.string=e,this.tail=e,this.pos=0}function p(e,t){this.view=null==e?{}:e,this.cache={".":this.view},this.parent=t}function h(){this.cache={}}var f=RegExp.prototype.test,d=/\S/,m=Object.prototype.toString,g=Array.isArray||function(e){return"[object Array]"===m.call(e)},y={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},v=/\s*/,b=/\s+/,x=/\s*=/,w=/\s*\}/,S=/#|\^|\/|>|\{|&|=|!/;c.prototype.eos=function(){return""===this.tail},c.prototype.scan=function(e){var t=this.tail.match(e);if(t&&0===t.index){var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n}return""},c.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},p.prototype.push=function(e){return new p(e,this)},p.prototype.lookup=function(e){var t;if(e in this.cache)t=this.cache[e];else{for(var n=this;n;){if(e.indexOf(".")>0){t=n.view;for(var i=e.split("."),o=0;null!=t&&o<i.length;)t=t[i[o++]]}else t=n.view[e];if(null!=t)break;n=n.parent}this.cache[e]=t}return r(t)&&(t=t.call(this.view)),t},h.prototype.clearCache=function(){this.cache={}},h.prototype.parse=function(e,t){var n=this.cache,r=n[e];return null==r&&(r=n[e]=a(e,t)),r},h.prototype.render=function(e,t,n){var r=this.parse(e),i=t instanceof p?t:new p(t);return this.renderTokens(r,i,n,e)},h.prototype.renderTokens=function(t,n,i,o){function s(e){return c.render(e,n,i)}for(var a,u,l="",c=this,p=0,h=t.length;h>p;++p)switch(a=t[p],a[0]){case"#":if(u=n.lookup(a[1]),!u)continue;if(g(u))for(var f=0,d=u.length;d>f;++f)l+=this.renderTokens(a[4],n.push(u[f]),i,o);else if("object"==typeof u||"string"==typeof u)l+=this.renderTokens(a[4],n.push(u),i,o);else if(r(u)){if("string"!=typeof o)throw new Error("Cannot use higher-order sections without the original template");u=u.call(n.view,o.slice(a[3],a[5]),s),null!=u&&(l+=u)}else l+=this.renderTokens(a[4],n,i,o);break;case"^":u=n.lookup(a[1]),(!u||g(u)&&0===u.length)&&(l+=this.renderTokens(a[4],n,i,o));break;case">":if(!i)continue;u=r(i)?i(a[1]):i[a[1]],null!=u&&(l+=this.renderTokens(this.parse(u),n,i,u));break;case"&":u=n.lookup(a[1]),null!=u&&(l+=u);break;case"name":u=n.lookup(a[1]),null!=u&&(l+=e.escape(u));break;case"text":l+=a[1]}return l},e.name="mustache.js",e.version="0.8.1",e.tags=["{{","}}"];var T=new h;e.clearCache=function(){return T.clearCache()},e.parse=function(e,t){return T.parse(e,t)},e.render=function(e,t,n){return T.render(e,t,n)},e.to_html=function(t,n,i,o){var s=e.render(t,n,i);return r(o)?void o(s):s},e.escape=o,e.Scanner=c,e.Context=p,e.Writer=h});var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,r=function(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e};return function(i,o,s){var a=dateFormat;if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(i)||/\d/.test(i)||(o=i,i=void 0),i=i?new Date(i):new Date,isNaN(i))throw SyntaxError("invalid date");o=String(a.masks[o]||o||a.masks["default"]),"UTC:"==o.slice(0,4)&&(o=o.slice(4),s=!0);var u=s?"getUTC":"get",l=i[u+"Date"](),c=i[u+"Day"](),p=i[u+"Month"](),h=i[u+"FullYear"](),f=i[u+"Hours"](),d=i[u+"Minutes"](),m=i[u+"Seconds"](),g=i[u+"Milliseconds"](),y=s?0:i.getTimezoneOffset(),v={d:l,dd:r(l),ddd:a.i18n.dayNames[c],dddd:a.i18n.dayNames[c+7],m:p+1,mm:r(p+1),mmm:a.i18n.monthNames[p],mmmm:a.i18n.monthNames[p+12],yy:String(h).slice(2),yyyy:h,h:f%12||12,hh:r(f%12||12),H:f,HH:r(f),M:d,MM:r(d),s:m,ss:r(m),l:r(g,3),L:r(g>99?Math.round(g/10):g),t:12>f?"a":"p",tt:12>f?"am":"pm",T:12>f?"A":"P",TT:12>f?"AM":"PM",Z:s?"UTC":(String(i).match(t)||[""]).pop().replace(n,""),o:(y>0?"-":"+")+r(100*Math.floor(Math.abs(y)/60)+Math.abs(y)%60,4),S:["th","st","nd","rd"][l%10>3?0:(l%100-l%10!=10)*l%10]};return o.replace(e,function(e){return e in v?v[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"},dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},Date.prototype.format=function(e,t){return dateFormat(this,e,t)},/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.12.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
function(e,t){"object"==typeof exports?module.exports=t(require("./punycode"),require("./IPv6"),require("./SecondLevelDomains")):"function"==typeof define&&define.amd?define(["./punycode","./IPv6","./SecondLevelDomains"],t):e.URI=t(e.punycode,e.IPv6,e.SecondLevelDomains,e)}(this,function(e,t,n,r){"use strict";function i(e,t){return this instanceof i?(void 0===e&&(e="undefined"!=typeof location?location.href+"":""),this.href(e),void 0!==t?this.absoluteTo(t):this):new i(e,t)}function o(e){return e.replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")}function s(e){return void 0===e?"Undefined":String(Object.prototype.toString.call(e)).slice(8,-1)}function a(e){return"Array"===s(e)}function u(e,t){var n,r,i={};if(a(t))for(n=0,r=t.length;r>n;n++)i[t[n]]=!0;else i[t]=!0;for(n=0,r=e.length;r>n;n++)void 0!==i[e[n]]&&(e.splice(n,1),r--,n--);return e}function l(e,t){var n,r;if(a(t)){for(n=0,r=t.length;r>n;n++)if(!l(e,t[n]))return!1;return!0}var i=s(t);for(n=0,r=e.length;r>n;n++)if("RegExp"===i){if("string"==typeof e[n]&&e[n].match(t))return!0}else if(e[n]===t)return!0;return!1}function c(e,t){if(!a(e)||!a(t))return!1;if(e.length!==t.length)return!1;e.sort(),t.sort();for(var n=0,r=e.length;r>n;n++)if(e[n]!==t[n])return!1;return!0}function p(e){return escape(e)}function h(e){return encodeURIComponent(e).replace(/[!'()*]/g,p).replace(/\*/g,"%2A")}var f=r&&r.URI;i.version="1.12.1";var d=i.prototype,m=Object.prototype.hasOwnProperty;i._parts=function(){return{protocol:null,username:null,password:null,hostname:null,urn:null,port:null,path:null,query:null,fragment:null,duplicateQueryParameters:i.duplicateQueryParameters,escapeQuerySpace:i.escapeQuerySpace}},i.duplicateQueryParameters=!1,i.escapeQuerySpace=!0,i.protocol_expression=/^[a-z][a-z0-9.+-]*$/i,i.idn_expression=/[^a-z0-9\.-]/i,i.punycode_expression=/(xn--)/i,i.ip4_expression=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,i.ip6_expression=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,i.find_uri_expression=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))/gi,i.findUri={start:/\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,end:/[\s\r\n]|$/,trim:/[`!()\[\]{};:'".,<>?\xab\xbb\u201c\u201d\u201e\u2018\u2019]+$/},i.defaultPorts={http:"80",https:"443",ftp:"21",gopher:"70",ws:"80",wss:"443"},i.invalid_hostname_characters=/[^a-zA-Z0-9\.-]/,i.domAttributes={a:"href",blockquote:"cite",link:"href",base:"href",script:"src",form:"action",img:"src",area:"href",iframe:"src",embed:"src",source:"src",track:"src",input:"src"},i.getDomAttribute=function(e){if(!e||!e.nodeName)return void 0;var t=e.nodeName.toLowerCase();return"input"===t&&"image"!==e.type?void 0:i.domAttributes[t]},i.encode=h,i.decode=decodeURIComponent,i.iso8859=function(){i.encode=escape,i.decode=unescape},i.unicode=function(){i.encode=h,i.decode=decodeURIComponent},i.characters={pathname:{encode:{expression:/%(24|26|2B|2C|3B|3D|3A|40)/gi,map:{"%24":"$","%26":"&","%2B":"+","%2C":",","%3B":";","%3D":"=","%3A":":","%40":"@"}},decode:{expression:/[\/\?#]/g,map:{"/":"%2F","?":"%3F","#":"%23"}}},reserved:{encode:{expression:/%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/gi,map:{"%3A":":","%2F":"/","%3F":"?","%23":"#","%5B":"[","%5D":"]","%40":"@","%21":"!","%24":"$","%26":"&","%27":"'","%28":"(","%29":")","%2A":"*","%2B":"+","%2C":",","%3B":";","%3D":"="}}}},i.encodeQuery=function(e,t){var n=i.encode(e+"");return void 0===t&&(t=i.escapeQuerySpace),t?n.replace(/%20/g,"+"):n},i.decodeQuery=function(e,t){e+="",void 0===t&&(t=i.escapeQuerySpace);try{return i.decode(t?e.replace(/\+/g,"%20"):e)}catch(n){return e}},i.recodePath=function(e){for(var t=(e+"").split("/"),n=0,r=t.length;r>n;n++)t[n]=i.encodePathSegment(i.decode(t[n]));return t.join("/")},i.decodePath=function(e){for(var t=(e+"").split("/"),n=0,r=t.length;r>n;n++)t[n]=i.decodePathSegment(t[n]);return t.join("/")};var g,y={encode:"encode",decode:"decode"},v=function(e,t){return function(n){return i[t](n+"").replace(i.characters[e][t].expression,function(n){return i.characters[e][t].map[n]})}};for(g in y)i[g+"PathSegment"]=v("pathname",y[g]);i.encodeReserved=v("reserved","encode"),i.parse=function(e,t){var n;return t||(t={}),n=e.indexOf("#"),n>-1&&(t.fragment=e.substring(n+1)||null,e=e.substring(0,n)),n=e.indexOf("?"),n>-1&&(t.query=e.substring(n+1)||null,e=e.substring(0,n)),"//"===e.substring(0,2)?(t.protocol=null,e=e.substring(2),e=i.parseAuthority(e,t)):(n=e.indexOf(":"),n>-1&&(t.protocol=e.substring(0,n)||null,t.protocol&&!t.protocol.match(i.protocol_expression)?t.protocol=void 0:"file"===t.protocol?e=e.substring(n+3):"//"===e.substring(n+1,n+3)?(e=e.substring(n+3),e=i.parseAuthority(e,t)):(e=e.substring(n+1),t.urn=!0))),t.path=e,t},i.parseHost=function(e,t){var n,r,i=e.indexOf("/");return-1===i&&(i=e.length),"["===e.charAt(0)?(n=e.indexOf("]"),t.hostname=e.substring(1,n)||null,t.port=e.substring(n+2,i)||null):e.indexOf(":")!==e.lastIndexOf(":")?(t.hostname=e.substring(0,i)||null,t.port=null):(r=e.substring(0,i).split(":"),t.hostname=r[0]||null,t.port=r[1]||null),t.hostname&&"/"!==e.substring(i).charAt(0)&&(i++,e="/"+e),e.substring(i)||"/"},i.parseAuthority=function(e,t){return e=i.parseUserinfo(e,t),i.parseHost(e,t)},i.parseUserinfo=function(e,t){var n,r=e.indexOf("/"),o=r>-1?e.lastIndexOf("@",r):e.indexOf("@");return o>-1&&(-1===r||r>o)?(n=e.substring(0,o).split(":"),t.username=n[0]?i.decode(n[0]):null,n.shift(),t.password=n[0]?i.decode(n.join(":")):null,e=e.substring(o+1)):(t.username=null,t.password=null),e},i.parseQuery=function(e,t){if(!e)return{};if(e=e.replace(/&+/g,"&").replace(/^\?*&*|&+$/g,""),!e)return{};for(var n,r,o,s={},a=e.split("&"),u=a.length,l=0;u>l;l++)n=a[l].split("="),r=i.decodeQuery(n.shift(),t),o=n.length?i.decodeQuery(n.join("="),t):null,s[r]?("string"==typeof s[r]&&(s[r]=[s[r]]),s[r].push(o)):s[r]=o;return s},i.build=function(e){var t="";return e.protocol&&(t+=e.protocol+":"),e.urn||!t&&!e.hostname||(t+="//"),t+=i.buildAuthority(e)||"","string"==typeof e.path&&("/"!==e.path.charAt(0)&&"string"==typeof e.hostname&&(t+="/"),t+=e.path),"string"==typeof e.query&&e.query&&(t+="?"+e.query),"string"==typeof e.fragment&&e.fragment&&(t+="#"+e.fragment),t},i.buildHost=function(e){var t="";return e.hostname?(i.ip6_expression.test(e.hostname)?t+=e.port?"["+e.hostname+"]:"+e.port:e.hostname:(t+=e.hostname,e.port&&(t+=":"+e.port)),t):""},i.buildAuthority=function(e){return i.buildUserinfo(e)+i.buildHost(e)},i.buildUserinfo=function(e){var t="";return e.username&&(t+=i.encode(e.username),e.password&&(t+=":"+i.encode(e.password)),t+="@"),t},i.buildQuery=function(e,t,n){var r,o,s,u,l="";for(o in e)if(m.call(e,o)&&o)if(a(e[o]))for(r={},s=0,u=e[o].length;u>s;s++)void 0!==e[o][s]&&void 0===r[e[o][s]+""]&&(l+="&"+i.buildQueryParameter(o,e[o][s],n),t!==!0&&(r[e[o][s]+""]=!0));else void 0!==e[o]&&(l+="&"+i.buildQueryParameter(o,e[o],n));return l.substring(1)},i.buildQueryParameter=function(e,t,n){return i.encodeQuery(e,n)+(null!==t?"="+i.encodeQuery(t,n):"")},i.addQuery=function(e,t,n){if("object"==typeof t)for(var r in t)m.call(t,r)&&i.addQuery(e,r,t[r]);else{if("string"!=typeof t)throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");if(void 0===e[t])return void(e[t]=n);"string"==typeof e[t]&&(e[t]=[e[t]]),a(n)||(n=[n]),e[t]=e[t].concat(n)}},i.removeQuery=function(e,t,n){var r,o,s;if(a(t))for(r=0,o=t.length;o>r;r++)e[t[r]]=void 0;else if("object"==typeof t)for(s in t)m.call(t,s)&&i.removeQuery(e,s,t[s]);else{if("string"!=typeof t)throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");void 0!==n?e[t]===n?e[t]=void 0:a(e[t])&&(e[t]=u(e[t],n)):e[t]=void 0}},i.hasQuery=function(e,t,n,r){if("object"==typeof t){for(var o in t)if(m.call(t,o)&&!i.hasQuery(e,o,t[o]))return!1;return!0}if("string"!=typeof t)throw new TypeError("URI.hasQuery() accepts an object, string as the name parameter");switch(s(n)){case"Undefined":return t in e;case"Boolean":var u=Boolean(a(e[t])?e[t].length:e[t]);return n===u;case"Function":return!!n(e[t],t,e);case"Array":if(!a(e[t]))return!1;var p=r?l:c;return p(e[t],n);case"RegExp":return a(e[t])?r?l(e[t],n):!1:Boolean(e[t]&&e[t].match(n));case"Number":n=String(n);case"String":return a(e[t])?r?l(e[t],n):!1:e[t]===n;default:throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter")}},i.commonPath=function(e,t){var n,r=Math.min(e.length,t.length);for(n=0;r>n;n++)if(e.charAt(n)!==t.charAt(n)){n--;break}return 1>n?e.charAt(0)===t.charAt(0)&&"/"===e.charAt(0)?"/":"":(("/"!==e.charAt(n)||"/"!==t.charAt(n))&&(n=e.substring(0,n).lastIndexOf("/")),e.substring(0,n+1))},i.withinString=function(e,t,n){n||(n={});var r=n.start||i.findUri.start,o=n.end||i.findUri.end,s=n.trim||i.findUri.trim,a=/[a-z0-9-]=["']?$/i;for(r.lastIndex=0;;){var u=r.exec(e);if(!u)break;var l=u.index;if(n.ignoreHtml){var c=e.slice(Math.max(l-3,0),l);if(c&&a.test(c))continue}var p=l+e.slice(l).search(o),h=e.slice(l,p).replace(s,"");if(!n.ignore||!n.ignore.test(h)){p=l+h.length;var f=t(h,l,p,e);e=e.slice(0,l)+f+e.slice(p),r.lastIndex=l+f.length}}return r.lastIndex=0,e},i.ensureValidHostname=function(t){if(t.match(i.invalid_hostname_characters)){if(!e)throw new TypeError("Hostname '"+t+"' contains characters other than [A-Z0-9.-] and Punycode.js is not available");if(e.toASCII(t).match(i.invalid_hostname_characters))throw new TypeError("Hostname '"+t+"' contains characters other than [A-Z0-9.-]")}},i.noConflict=function(e){if(e){var n={URI:this.noConflict()};return URITemplate&&"function"==typeof URITemplate.noConflict&&(n.URITemplate=URITemplate.noConflict()),t&&"function"==typeof t.noConflict&&(n.IPv6=t.noConflict()),SecondLevelDomains&&"function"==typeof SecondLevelDomains.noConflict&&(n.SecondLevelDomains=SecondLevelDomains.noConflict()),n}return r.URI===this&&(r.URI=f),this},d.build=function(e){return e===!0?this._deferred_build=!0:(void 0===e||this._deferred_build)&&(this._string=i.build(this._parts),this._deferred_build=!1),this},d.clone=function(){return new i(this)},d.valueOf=d.toString=function(){return this.build(!1)._string},y={protocol:"protocol",username:"username",password:"password",hostname:"hostname",port:"port"},v=function(e){return function(t,n){return void 0===t?this._parts[e]||"":(this._parts[e]=t||null,this.build(!n),this)}};for(g in y)d[g]=v(y[g]);y={query:"?",fragment:"#"},v=function(e,t){return function(n,r){return void 0===n?this._parts[e]||"":(null!==n&&(n+="",n.charAt(0)===t&&(n=n.substring(1))),this._parts[e]=n,this.build(!r),this)}};for(g in y)d[g]=v(g,y[g]);y={search:["?","query"],hash:["#","fragment"]},v=function(e,t){return function(n,r){var i=this[e](n,r);return"string"==typeof i&&i.length?t+i:i}};for(g in y)d[g]=v(y[g][1],y[g][0]);d.pathname=function(e,t){if(void 0===e||e===!0){var n=this._parts.path||(this._parts.hostname?"/":"");return e?i.decodePath(n):n}return this._parts.path=e?i.recodePath(e):"/",this.build(!t),this},d.path=d.pathname,d.href=function(e,t){var n;if(void 0===e)return this.toString();this._string="",this._parts=i._parts();var r=e instanceof i,o="object"==typeof e&&(e.hostname||e.path||e.pathname);if(e.nodeName){var s=i.getDomAttribute(e);e=e[s]||"",o=!1}if(!r&&o&&void 0!==e.pathname&&(e=e.toString()),"string"==typeof e)this._parts=i.parse(e,this._parts);else{if(!r&&!o)throw new TypeError("invalid input");var a=r?e._parts:e;for(n in a)m.call(this._parts,n)&&(this._parts[n]=a[n])}return this.build(!t),this},d.is=function(e){var t=!1,r=!1,o=!1,s=!1,a=!1,u=!1,l=!1,c=!this._parts.urn;switch(this._parts.hostname&&(c=!1,r=i.ip4_expression.test(this._parts.hostname),o=i.ip6_expression.test(this._parts.hostname),t=r||o,s=!t,a=s&&n&&n.has(this._parts.hostname),u=s&&i.idn_expression.test(this._parts.hostname),l=s&&i.punycode_expression.test(this._parts.hostname)),e.toLowerCase()){case"relative":return c;case"absolute":return!c;case"domain":case"name":return s;case"sld":return a;case"ip":return t;case"ip4":case"ipv4":case"inet4":return r;case"ip6":case"ipv6":case"inet6":return o;case"idn":return u;case"url":return!this._parts.urn;case"urn":return!!this._parts.urn;case"punycode":return l}return null};var b=d.protocol,x=d.port,w=d.hostname;d.protocol=function(e,t){if(void 0!==e&&e&&(e=e.replace(/:(\/\/)?$/,""),!e.match(i.protocol_expression)))throw new TypeError("Protocol '"+e+"' contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");return b.call(this,e,t)},d.scheme=d.protocol,d.port=function(e,t){if(this._parts.urn)return void 0===e?"":this;if(void 0!==e&&(0===e&&(e=null),e&&(e+="",":"===e.charAt(0)&&(e=e.substring(1)),e.match(/[^0-9]/))))throw new TypeError("Port '"+e+"' contains characters other than [0-9]");return x.call(this,e,t)},d.hostname=function(e,t){if(this._parts.urn)return void 0===e?"":this;if(void 0!==e){var n={};i.parseHost(e,n),e=n.hostname}return w.call(this,e,t)},d.host=function(e,t){return this._parts.urn?void 0===e?"":this:void 0===e?this._parts.hostname?i.buildHost(this._parts):"":(i.parseHost(e,this._parts),this.build(!t),this)},d.authority=function(e,t){return this._parts.urn?void 0===e?"":this:void 0===e?this._parts.hostname?i.buildAuthority(this._parts):"":(i.parseAuthority(e,this._parts),this.build(!t),this)},d.userinfo=function(e,t){if(this._parts.urn)return void 0===e?"":this;if(void 0===e){if(!this._parts.username)return"";var n=i.buildUserinfo(this._parts);return n.substring(0,n.length-1)}return"@"!==e[e.length-1]&&(e+="@"),i.parseUserinfo(e,this._parts),this.build(!t),this},d.resource=function(e,t){var n;return void 0===e?this.path()+this.search()+this.hash():(n=i.parse(e),this._parts.path=n.path,this._parts.query=n.query,this._parts.fragment=n.fragment,this.build(!t),this)},d.subdomain=function(e,t){if(this._parts.urn)return void 0===e?"":this;if(void 0===e){if(!this._parts.hostname||this.is("IP"))return"";var n=this._parts.hostname.length-this.domain().length-1;return this._parts.hostname.substring(0,n)||""}var r=this._parts.hostname.length-this.domain().length,s=this._parts.hostname.substring(0,r),a=new RegExp("^"+o(s));return e&&"."!==e.charAt(e.length-1)&&(e+="."),e&&i.ensureValidHostname(e),this._parts.hostname=this._parts.hostname.replace(a,e),this.build(!t),this},d.domain=function(e,t){if(this._parts.urn)return void 0===e?"":this;if("boolean"==typeof e&&(t=e,e=void 0),void 0===e){if(!this._parts.hostname||this.is("IP"))return"";var n=this._parts.hostname.match(/\./g);if(n&&n.length<2)return this._parts.hostname;var r=this._parts.hostname.length-this.tld(t).length-1;return r=this._parts.hostname.lastIndexOf(".",r-1)+1,this._parts.hostname.substring(r)||""}if(!e)throw new TypeError("cannot set domain empty");if(i.ensureValidHostname(e),!this._parts.hostname||this.is("IP"))this._parts.hostname=e;else{var s=new RegExp(o(this.domain())+"$");this._parts.hostname=this._parts.hostname.replace(s,e)}return this.build(!t),this},d.tld=function(e,t){if(this._parts.urn)return void 0===e?"":this;if("boolean"==typeof e&&(t=e,e=void 0),void 0===e){if(!this._parts.hostname||this.is("IP"))return"";var r=this._parts.hostname.lastIndexOf("."),i=this._parts.hostname.substring(r+1);return t!==!0&&n&&n.list[i.toLowerCase()]?n.get(this._parts.hostname)||i:i}var s;if(!e)throw new TypeError("cannot set TLD empty");if(e.match(/[^a-zA-Z0-9-]/)){if(!n||!n.is(e))throw new TypeError("TLD '"+e+"' contains characters other than [A-Z0-9]");s=new RegExp(o(this.tld())+"$"),this._parts.hostname=this._parts.hostname.replace(s,e)}else{if(!this._parts.hostname||this.is("IP"))throw new ReferenceError("cannot set TLD on non-domain host");s=new RegExp(o(this.tld())+"$"),this._parts.hostname=this._parts.hostname.replace(s,e)}return this.build(!t),this},d.directory=function(e,t){if(this._parts.urn)return void 0===e?"":this;if(void 0===e||e===!0){if(!this._parts.path&&!this._parts.hostname)return"";if("/"===this._parts.path)return"/";var n=this._parts.path.length-this.filename().length-1,r=this._parts.path.substring(0,n)||(this._parts.hostname?"/":"");return e?i.decodePath(r):r}var s=this._parts.path.length-this.filename().length,a=this._parts.path.substring(0,s),u=new RegExp("^"+o(a));return this.is("relative")||(e||(e="/"),"/"!==e.charAt(0)&&(e="/"+e)),e&&"/"!==e.charAt(e.length-1)&&(e+="/"),e=i.recodePath(e),this._parts.path=this._parts.path.replace(u,e),this.build(!t),this},d.filename=function(e,t){if(this._parts.urn)return void 0===e?"":this;if(void 0===e||e===!0){if(!this._parts.path||"/"===this._parts.path)return"";var n=this._parts.path.lastIndexOf("/"),r=this._parts.path.substring(n+1);return e?i.decodePathSegment(r):r}var s=!1;"/"===e.charAt(0)&&(e=e.substring(1)),e.match(/\.?\//)&&(s=!0);var a=new RegExp(o(this.filename())+"$");return e=i.recodePath(e),this._parts.path=this._parts.path.replace(a,e),s?this.normalizePath(t):this.build(!t),this},d.suffix=function(e,t){if(this._parts.urn)return void 0===e?"":this;if(void 0===e||e===!0){if(!this._parts.path||"/"===this._parts.path)return"";var n,r,s=this.filename(),a=s.lastIndexOf(".");return-1===a?"":(n=s.substring(a+1),r=/^[a-z0-9%]+$/i.test(n)?n:"",e?i.decodePathSegment(r):r)}"."===e.charAt(0)&&(e=e.substring(1));var u,l=this.suffix();if(l)u=new RegExp(e?o(l)+"$":o("."+l)+"$");else{if(!e)return this;this._parts.path+="."+i.recodePath(e)}return u&&(e=i.recodePath(e),this._parts.path=this._parts.path.replace(u,e)),this.build(!t),this},d.segment=function(e,t,n){var r=this._parts.urn?":":"/",i=this.path(),o="/"===i.substring(0,1),s=i.split(r);if(void 0!==e&&"number"!=typeof e&&(n=t,t=e,e=void 0),void 0!==e&&"number"!=typeof e)throw new Error("Bad segment '"+e+"', must be 0-based integer");if(o&&s.shift(),0>e&&(e=Math.max(s.length+e,0)),void 0===t)return void 0===e?s:s[e];if(null===e||void 0===s[e])if(a(t)){s=[];for(var u=0,l=t.length;l>u;u++)(t[u].length||s.length&&s[s.length-1].length)&&(s.length&&!s[s.length-1].length&&s.pop(),s.push(t[u]))}else(t||"string"==typeof t)&&(""===s[s.length-1]?s[s.length-1]=t:s.push(t));else t||"string"==typeof t&&t.length?s[e]=t:s.splice(e,1);return o&&s.unshift(""),this.path(s.join(r),n)},d.segmentCoded=function(e,t,n){var r,o,s;if("number"!=typeof e&&(n=t,t=e,e=void 0),void 0===t){if(r=this.segment(e,t,n),a(r))for(o=0,s=r.length;s>o;o++)r[o]=i.decode(r[o]);else r=void 0!==r?i.decode(r):void 0;return r}if(a(t))for(o=0,s=t.length;s>o;o++)t[o]=i.decode(t[o]);else t="string"==typeof t?i.encode(t):t;return this.segment(e,t,n)};var S=d.query;return d.query=function(e,t){if(e===!0)return i.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("function"==typeof e){var n=i.parseQuery(this._parts.query,this._parts.escapeQuerySpace),r=e.call(this,n);return this._parts.query=i.buildQuery(r||n,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),this.build(!t),this}return void 0!==e&&"string"!=typeof e?(this._parts.query=i.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),this.build(!t),this):S.call(this,e,t)},d.setQuery=function(e,t,n){var r=i.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("object"==typeof e)for(var o in e)m.call(e,o)&&(r[o]=e[o]);else{if("string"!=typeof e)throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");r[e]=void 0!==t?t:null}return this._parts.query=i.buildQuery(r,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),"string"!=typeof e&&(n=t),this.build(!n),this},d.addQuery=function(e,t,n){var r=i.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return i.addQuery(r,e,void 0===t?null:t),this._parts.query=i.buildQuery(r,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),"string"!=typeof e&&(n=t),this.build(!n),this},d.removeQuery=function(e,t,n){var r=i.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return i.removeQuery(r,e,t),this._parts.query=i.buildQuery(r,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),"string"!=typeof e&&(n=t),this.build(!n),this},d.hasQuery=function(e,t,n){var r=i.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return i.hasQuery(r,e,t,n)},d.setSearch=d.setQuery,d.addSearch=d.addQuery,d.removeSearch=d.removeQuery,d.hasSearch=d.hasQuery,d.normalize=function(){return this._parts.urn?this.normalizeProtocol(!1).normalizeQuery(!1).normalizeFragment(!1).build():this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()},d.normalizeProtocol=function(e){return"string"==typeof this._parts.protocol&&(this._parts.protocol=this._parts.protocol.toLowerCase(),this.build(!e)),this},d.normalizeHostname=function(n){return this._parts.hostname&&(this.is("IDN")&&e?this._parts.hostname=e.toASCII(this._parts.hostname):this.is("IPv6")&&t&&(this._parts.hostname=t.best(this._parts.hostname)),this._parts.hostname=this._parts.hostname.toLowerCase(),this.build(!n)),this},d.normalizePort=function(e){return"string"==typeof this._parts.protocol&&this._parts.port===i.defaultPorts[this._parts.protocol]&&(this._parts.port=null,this.build(!e)),this},d.normalizePath=function(e){if(this._parts.urn)return this;if(!this._parts.path||"/"===this._parts.path)return this;var t,n,r,o=this._parts.path,s="";for("/"!==o.charAt(0)&&(t=!0,o="/"+o),o=o.replace(/(\/(\.\/)+)|(\/\.$)/g,"/").replace(/\/{2,}/g,"/"),t&&(s=o.substring(1).match(/^(\.\.\/)+/)||"",s&&(s=s[0]));;){if(n=o.indexOf("/.."),-1===n)break;0!==n?(r=o.substring(0,n).lastIndexOf("/"),-1===r&&(r=n),o=o.substring(0,r)+o.substring(n+3)):o=o.substring(3)}return t&&this.is("relative")&&(o=s+o.substring(1)),o=i.recodePath(o),this._parts.path=o,this.build(!e),this},d.normalizePathname=d.normalizePath,d.normalizeQuery=function(e){return"string"==typeof this._parts.query&&(this._parts.query.length?this.query(i.parseQuery(this._parts.query,this._parts.escapeQuerySpace)):this._parts.query=null,this.build(!e)),this},d.normalizeFragment=function(e){return this._parts.fragment||(this._parts.fragment=null,this.build(!e)),this},d.normalizeSearch=d.normalizeQuery,d.normalizeHash=d.normalizeFragment,d.iso8859=function(){var e=i.encode,t=i.decode;return i.encode=escape,i.decode=decodeURIComponent,this.normalize(),i.encode=e,i.decode=t,this},d.unicode=function(){var e=i.encode,t=i.decode;return i.encode=h,i.decode=unescape,this.normalize(),i.encode=e,i.decode=t,this},d.readable=function(){var t=this.clone();t.username("").password("").normalize();var n="";if(t._parts.protocol&&(n+=t._parts.protocol+"://"),t._parts.hostname&&(t.is("punycode")&&e?(n+=e.toUnicode(t._parts.hostname),t._parts.port&&(n+=":"+t._parts.port)):n+=t.host()),t._parts.hostname&&t._parts.path&&"/"!==t._parts.path.charAt(0)&&(n+="/"),n+=t.path(!0),t._parts.query){for(var r="",o=0,s=t._parts.query.split("&"),a=s.length;a>o;o++){var u=(s[o]||"").split("=");r+="&"+i.decodeQuery(u[0],this._parts.escapeQuerySpace).replace(/&/g,"%26"),void 0!==u[1]&&(r+="="+i.decodeQuery(u[1],this._parts.escapeQuerySpace).replace(/&/g,"%26"))}n+="?"+r.substring(1)}return n+=i.decodeQuery(t.hash(),!0)},d.absoluteTo=function(e){var t,n,r,o=this.clone(),s=["protocol","username","password","hostname","port"];if(this._parts.urn)throw new Error("URNs do not have any generally defined hierarchical components");if(e instanceof i||(e=new i(e)),o._parts.protocol||(o._parts.protocol=e._parts.protocol),this._parts.hostname)return o;for(n=0;r=s[n];n++)o._parts[r]=e._parts[r];return o._parts.path?".."===o._parts.path.substring(-2)&&(o._parts.path+="/"):(o._parts.path=e._parts.path,o._parts.query||(o._parts.query=e._parts.query)),"/"!==o.path().charAt(0)&&(t=e.directory(),o._parts.path=(t?t+"/":"")+o._parts.path,o.normalizePath()),o.build(),o},d.relativeTo=function(e){var t,n,r,o,s,a=this.clone().normalize();if(a._parts.urn)throw new Error("URNs do not have any generally defined hierarchical components");if(e=new i(e).normalize(),t=a._parts,n=e._parts,o=a.path(),s=e.path(),"/"!==o.charAt(0))throw new Error("URI is already relative");if("/"!==s.charAt(0))throw new Error("Cannot calculate a URI relative to another relative URI");if(t.protocol===n.protocol&&(t.protocol=null),t.username!==n.username||t.password!==n.password)return a.build();if(null!==t.protocol||null!==t.username||null!==t.password)return a.build();if(t.hostname!==n.hostname||t.port!==n.port)return a.build();if(t.hostname=null,t.port=null,o===s)return t.path="",a.build();if(r=i.commonPath(a.path(),e.path()),!r)return a.build();var u=n.path.substring(r.length).replace(/[^\/]*$/,"").replace(/.*?\//g,"../");return t.path=u+t.path.substring(r.length),a.build()},d.equals=function(e){var t,n,r,o=this.clone(),s=new i(e),u={},l={},p={};if(o.normalize(),s.normalize(),o.toString()===s.toString())return!0;if(t=o.query(),n=s.query(),o.query(""),s.query(""),o.toString()!==s.toString())return!1;if(t.length!==n.length)return!1;u=i.parseQuery(t,this._parts.escapeQuerySpace),l=i.parseQuery(n,this._parts.escapeQuerySpace);for(r in u)if(m.call(u,r)){if(a(u[r])){if(!c(u[r],l[r]))return!1}else if(u[r]!==l[r])return!1;p[r]=!0}for(r in l)if(m.call(l,r)&&!p[r])return!1;return!0},d.duplicateQueryParameters=function(e){return this._parts.duplicateQueryParameters=!!e,this},d.escapeQuerySpace=function(e){return this._parts.escapeQuerySpace=!!e,this},i});/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 0.4.5
 * Copyright (C) 2014 Oliver Nightingale
 * MIT Licensed
 * @license
 */
var lunr=function(e){var t=new lunr.Index;return t.pipeline.add(lunr.stopWordFilter,lunr.stemmer),e&&e.call(t,t),t};lunr.version="0.4.5","undefined"!=typeof module&&(module.exports=lunr),lunr.utils={},lunr.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),lunr.utils.zeroFillArray=function(){var e=[0];return function(t){for(;t>e.length;)e=e.concat(e);return e.slice(0,t)}}(),lunr.EventEmitter=function(){this.events={}},lunr.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),n=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");n.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},lunr.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var n=this.events[e].indexOf(t);this.events[e].splice(n,1),this.events[e].length||delete this.events[e]}},lunr.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)})}},lunr.EventEmitter.prototype.hasHandler=function(e){return e in this.events},lunr.tokenizer=function(e){if(!arguments.length||null==e||void 0==e)return[];if(Array.isArray(e))return e.map(function(e){return e.toLowerCase()});for(var t=(""+e).replace(/^\s+/,""),n=t.length-1;n>=0;n--)if(/\S/.test(t.charAt(n))){t=t.substring(0,n+1);break}return t.split(/\s+/).map(function(e){return e.replace(/^\W+/,"").replace(/\W+$/,"").toLowerCase()})},lunr.Pipeline=function(){this._stack=[]},lunr.Pipeline.registeredFunctions={},lunr.Pipeline.registerFunction=function(e,t){t in this.registeredFunctions&&lunr.utils.warn("Overwriting existing registered function: "+t),e.label=t,lunr.Pipeline.registeredFunctions[e.label]=e},lunr.Pipeline.warnIfFunctionNotRegistered=function(e){var t=e.label&&e.label in this.registeredFunctions;t||lunr.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},lunr.Pipeline.load=function(e){var t=new lunr.Pipeline;return e.forEach(function(e){var n=lunr.Pipeline.registeredFunctions[e];if(!n)throw Error("Cannot load un-registered function: "+e);t.add(n)}),t},lunr.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){lunr.Pipeline.warnIfFunctionNotRegistered(e),this._stack.push(e)},this)},lunr.Pipeline.prototype.after=function(e,t){lunr.Pipeline.warnIfFunctionNotRegistered(t);var n=this._stack.indexOf(e)+1;this._stack.splice(n,0,t)},lunr.Pipeline.prototype.before=function(e,t){lunr.Pipeline.warnIfFunctionNotRegistered(t);var n=this._stack.indexOf(e);this._stack.splice(n,0,t)},lunr.Pipeline.prototype.remove=function(e){var t=this._stack.indexOf(e);this._stack.splice(t,1)},lunr.Pipeline.prototype.run=function(e){for(var t=[],n=e.length,r=this._stack.length,i=0;n>i;i++){for(var o=e[i],s=0;r>s&&(o=this._stack[s](o,i,e),void 0!==o);s++);void 0!==o&&t.push(o)}return t},lunr.Pipeline.prototype.toJSON=function(){return this._stack.map(function(e){return lunr.Pipeline.warnIfFunctionNotRegistered(e),e.label})},lunr.Vector=function(e){this.elements=e},lunr.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude;for(var e,t=0,n=this.elements,r=n.length,i=0;r>i;i++)e=n[i],t+=e*e;return this._magnitude=Math.sqrt(t)},lunr.Vector.prototype.dot=function(e){for(var t=this.elements,n=e.elements,r=t.length,i=0,o=0;r>o;o++)i+=t[o]*n[o];return i},lunr.Vector.prototype.similarity=function(e){return this.dot(e)/(this.magnitude()*e.magnitude())},lunr.Vector.prototype.toArray=function(){return this.elements},lunr.SortedSet=function(){this.length=0,this.elements=[]},lunr.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},lunr.SortedSet.prototype.add=function(){Array.prototype.slice.call(arguments).forEach(function(e){~this.indexOf(e)||this.elements.splice(this.locationFor(e),0,e)},this),this.length=this.elements.length},lunr.SortedSet.prototype.toArray=function(){return this.elements.slice()},lunr.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},lunr.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},lunr.SortedSet.prototype.indexOf=function(e,t,n){var t=t||0,n=n||this.elements.length,r=n-t,i=t+Math.floor(r/2),o=this.elements[i];return 1>=r?o===e?i:-1:e>o?this.indexOf(e,i,n):o>e?this.indexOf(e,t,i):o===e?i:void 0},lunr.SortedSet.prototype.locationFor=function(e,t,n){var t=t||0,n=n||this.elements.length,r=n-t,i=t+Math.floor(r/2),o=this.elements[i];if(1>=r){if(o>e)return i;if(e>o)return i+1}return e>o?this.locationFor(e,i,n):o>e?this.locationFor(e,t,i):void 0},lunr.SortedSet.prototype.intersect=function(e){for(var t=new lunr.SortedSet,n=0,r=0,i=this.length,o=e.length,s=this.elements,a=e.elements;!(n>i-1||r>o-1);)s[n]!==a[r]?s[n]<a[r]?n++:s[n]>a[r]&&r++:(t.add(s[n]),n++,r++);return t},lunr.SortedSet.prototype.clone=function(){var e=new lunr.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},lunr.SortedSet.prototype.union=function(e){var t,n,r;return this.length>=e.length?(t=this,n=e):(t=e,n=this),r=t.clone(),r.add.apply(r,n.toArray()),r},lunr.SortedSet.prototype.toJSON=function(){return this.toArray()},lunr.Index=function(){this._fields=[],this._ref="id",this.pipeline=new lunr.Pipeline,this.documentStore=new lunr.Store,this.tokenStore=new lunr.TokenStore,this.corpusTokens=new lunr.SortedSet,this.eventEmitter=new lunr.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},lunr.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},lunr.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},lunr.Index.load=function(e){e.version!==lunr.version&&lunr.utils.warn("version mismatch: current "+lunr.version+" importing "+e.version);var t=new this;return t._fields=e.fields,t._ref=e.ref,t.documentStore=lunr.Store.load(e.documentStore),t.tokenStore=lunr.TokenStore.load(e.tokenStore),t.corpusTokens=lunr.SortedSet.load(e.corpusTokens),t.pipeline=lunr.Pipeline.load(e.pipeline),t},lunr.Index.prototype.field=function(e,t){var t=t||{},n={name:e,boost:t.boost||1};return this._fields.push(n),this},lunr.Index.prototype.ref=function(e){return this._ref=e,this},lunr.Index.prototype.add=function(e,t){var n={},r=new lunr.SortedSet,i=e[this._ref],t=void 0===t?!0:t;this._fields.forEach(function(t){var i=this.pipeline.run(lunr.tokenizer(e[t.name]));n[t.name]=i,lunr.SortedSet.prototype.add.apply(r,i)},this),this.documentStore.set(i,r),lunr.SortedSet.prototype.add.apply(this.corpusTokens,r.toArray());for(var o=0;r.length>o;o++){var s=r.elements[o],a=this._fields.reduce(function(e,t){var r=n[t.name].length;if(!r)return e;var i=n[t.name].filter(function(e){return e===s}).length;return e+i/r*t.boost},0);this.tokenStore.add(s,{ref:i,tf:a})}t&&this.eventEmitter.emit("add",e,this)},lunr.Index.prototype.remove=function(e,t){var n=e[this._ref],t=void 0===t?!0:t;if(this.documentStore.has(n)){var r=this.documentStore.get(n);this.documentStore.remove(n),r.forEach(function(e){this.tokenStore.remove(e,n)},this),t&&this.eventEmitter.emit("remove",e,this)}},lunr.Index.prototype.update=function(e,t){var t=void 0===t?!0:t;this.remove(e,!1),this.add(e,!1),t&&this.eventEmitter.emit("update",e,this)},lunr.Index.prototype.idf=function(e){var t="@"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,t))return this._idfCache[t];var n=this.tokenStore.count(e),r=1;return n>0&&(r=1+Math.log(this.tokenStore.length/n)),this._idfCache[t]=r},lunr.Index.prototype.search=function(e){var t=this.pipeline.run(lunr.tokenizer(e)),n=lunr.utils.zeroFillArray(this.corpusTokens.length),r=[],i=this._fields.reduce(function(e,t){return e+t.boost},0),o=t.some(function(e){return this.tokenStore.has(e)},this);if(!o)return[];t.forEach(function(e,t,o){var s=1/o.length*this._fields.length*i,a=this,u=this.tokenStore.expand(e).reduce(function(t,r){var i=a.corpusTokens.indexOf(r),o=a.idf(r),u=1,l=new lunr.SortedSet;if(r!==e){var c=Math.max(3,r.length-e.length);u=1/Math.log(c)}return i>-1&&(n[i]=s*o*u),Object.keys(a.tokenStore.get(r)).forEach(function(e){l.add(e)}),t.union(l)},new lunr.SortedSet);r.push(u)},this);var s=r.reduce(function(e,t){return e.intersect(t)}),a=new lunr.Vector(n);return s.map(function(e){return{ref:e,score:a.similarity(this.documentVector(e))}},this).sort(function(e,t){return t.score-e.score})},lunr.Index.prototype.documentVector=function(e){for(var t=this.documentStore.get(e),n=t.length,r=lunr.utils.zeroFillArray(this.corpusTokens.length),i=0;n>i;i++){var o=t.elements[i],s=this.tokenStore.get(o)[e].tf,a=this.idf(o);r[this.corpusTokens.indexOf(o)]=s*a}return new lunr.Vector(r)},lunr.Index.prototype.toJSON=function(){return{version:lunr.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),tokenStore:this.tokenStore.toJSON(),corpusTokens:this.corpusTokens.toJSON(),pipeline:this.pipeline.toJSON()}},lunr.Store=function(){this.store={},this.length=0},lunr.Store.load=function(e){var t=new this;return t.length=e.length,t.store=Object.keys(e.store).reduce(function(t,n){return t[n]=lunr.SortedSet.load(e.store[n]),t},{}),t},lunr.Store.prototype.set=function(e,t){this.store[e]=t,this.length=Object.keys(this.store).length},lunr.Store.prototype.get=function(e){return this.store[e]},lunr.Store.prototype.has=function(e){return e in this.store},lunr.Store.prototype.remove=function(e){this.has(e)&&(delete this.store[e],this.length--)},lunr.Store.prototype.toJSON=function(){return{store:this.store,length:this.length}},lunr.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",r="[aeiouy]",i=n+"[^aeiouy]*",o=r+"[aeiou]*",s="^("+i+")?"+o+i,a="^("+i+")?"+o+i+"("+o+")?$",u="^("+i+")?"+o+i+o+i,l="^("+i+")?"+r;return function(n){var o,c,p,h,f,d,m;if(3>n.length)return n;if(p=n.substr(0,1),"y"==p&&(n=p.toUpperCase()+n.substr(1)),h=/^(.+?)(ss|i)es$/,f=/^(.+?)([^s])s$/,h.test(n)?n=n.replace(h,"$1$2"):f.test(n)&&(n=n.replace(f,"$1$2")),h=/^(.+?)eed$/,f=/^(.+?)(ed|ing)$/,h.test(n)){var g=h.exec(n);h=RegExp(s),h.test(g[1])&&(h=/.$/,n=n.replace(h,""))}else if(f.test(n)){var g=f.exec(n);o=g[1],f=RegExp(l),f.test(o)&&(n=o,f=/(at|bl|iz)$/,d=RegExp("([^aeiouylsz])\\1$"),m=RegExp("^"+i+r+"[^aeiouwxy]$"),f.test(n)?n+="e":d.test(n)?(h=/.$/,n=n.replace(h,"")):m.test(n)&&(n+="e"))}if(h=/^(.+?)y$/,h.test(n)){var g=h.exec(n);o=g[1],h=RegExp(l),h.test(o)&&(n=o+"i")}if(h=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,h.test(n)){var g=h.exec(n);o=g[1],c=g[2],h=RegExp(s),h.test(o)&&(n=o+e[c])}if(h=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,h.test(n)){var g=h.exec(n);o=g[1],c=g[2],h=RegExp(s),h.test(o)&&(n=o+t[c])}if(h=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,f=/^(.+?)(s|t)(ion)$/,h.test(n)){var g=h.exec(n);o=g[1],h=RegExp(u),h.test(o)&&(n=o)}else if(f.test(n)){var g=f.exec(n);o=g[1]+g[2],f=RegExp(u),f.test(o)&&(n=o)}if(h=/^(.+?)e$/,h.test(n)){var g=h.exec(n);o=g[1],h=RegExp(u),f=RegExp(a),d=RegExp("^"+i+r+"[^aeiouwxy]$"),(h.test(o)||f.test(o)&&!d.test(o))&&(n=o)}return h=/ll$/,f=RegExp(u),h.test(n)&&f.test(n)&&(h=/.$/,n=n.replace(h,"")),"y"==p&&(n=p.toLowerCase()+n.substr(1)),n}}(),lunr.Pipeline.registerFunction(lunr.stemmer,"stemmer"),lunr.stopWordFilter=function(e){return-1===lunr.stopWordFilter.stopWords.indexOf(e)?e:void 0},lunr.stopWordFilter.stopWords=new lunr.SortedSet,lunr.stopWordFilter.stopWords.length=119,lunr.stopWordFilter.stopWords.elements=["","a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"],lunr.Pipeline.registerFunction(lunr.stopWordFilter,"stopWordFilter"),lunr.TokenStore=function(){this.root={docs:{}},this.length=0},lunr.TokenStore.load=function(e){var t=new this;return t.root=e.root,t.length=e.length,t},lunr.TokenStore.prototype.add=function(e,t,n){var n=n||this.root,r=e[0],i=e.slice(1);return r in n||(n[r]={docs:{}}),0===i.length?(n[r].docs[t.ref]=t,void(this.length+=1)):this.add(i,t,n[r])},lunr.TokenStore.prototype.has=function(e){if(!e)return!1;for(var t=this.root,n=0;e.length>n;n++){if(!t[e[n]])return!1;t=t[e[n]]}return!0},lunr.TokenStore.prototype.getNode=function(e){if(!e)return{};for(var t=this.root,n=0;e.length>n;n++){if(!t[e[n]])return{};t=t[e[n]]}return t},lunr.TokenStore.prototype.get=function(e,t){return this.getNode(e,t).docs||{}},lunr.TokenStore.prototype.count=function(e,t){return Object.keys(this.get(e,t)).length},lunr.TokenStore.prototype.remove=function(e,t){if(e){for(var n=this.root,r=0;e.length>r;r++){if(!(e[r]in n))return;n=n[e[r]]}delete n.docs[t]}},lunr.TokenStore.prototype.expand=function(e,t){var n=this.getNode(e),r=n.docs||{},t=t||[];return Object.keys(r).length&&t.push(e),Object.keys(n).forEach(function(n){"docs"!==n&&t.concat(this.expand(e+n,t))},this),t},lunr.TokenStore.prototype.toJSON=function(){return{root:this.root,length:this.length}},function(e){var t=function(e){var t,n=Array.prototype.slice;return function(){var r=n.call(arguments),i=this;clearTimeout(t),t=setTimeout(function(){e.apply(i,r)},100)}},n=function(e){var t=e.match(/(\d+)/g);return new Date(t[0],t[1]-1,t[2])},r=function(){function r(t,n){this.$elem=t,this.$results=e(n.results),this.$entries=e(n.entries,this.$results),this.indexDataUrl=n.indexUrl,this.template=this.compileTemplate(e(n.template)),this.emptyMsg=n.emptyMsg,this.initialize()}return r.prototype.initialize=function(){var t=this;this.loadIndexData(function(n){t.entries=e.map(n.docs,t.createEntry),t.index=lunr.Index.load(n.index),t.populateSearchFromQuery(),t.bindKeypress()})},r.prototype.compileTemplate=function(e){var t=e.text();return Mustache.parse(t),function(e,n){return Mustache.render(t,e,n)}},r.prototype.loadIndexData=function(t){e.getJSON(this.indexDataUrl,t)},r.prototype.createEntry=function(t,r){var i=e.extend({id:r+1},t);return t.date&&e.extend(i,{date:n(t.date),pubdate:function(){return dateFormat(n(t.date),"yyyy-mm-dd")},displaydate:function(){return dateFormat(n(t.date),"mmm dd, yyyy")}}),i},r.prototype.bindKeypress=function(){var e=this,n=this.$elem.val();this.$elem.bind("keyup",t(function(){var t=e.$elem.val();t!==n&&e.search(t),n=t}))},r.prototype.search=function(t){var n=this.entries;if(t.length<3)this.$results.hide(),this.$entries.empty();else{var r=e.map(this.index.search(t),function(t){return e.grep(n,function(e){return e.id===parseInt(t.ref,10)})[0]});this.displayResults(r)}},r.prototype.displayResults=function(e){var t=this.$entries,n=this.$results;t.empty(),t.append(0===e.length?"<p>"+this.emptyMsg+"</p>":this.template({entries:e})),n.show()},r.prototype.populateSearchFromQuery=function(){var e=new URI(window.location.search.toString()),t=e.search(!0);t.hasOwnProperty("q")&&(this.$elem.val(t.q),this.search(t.q.toString()))},r}();e.fn.lunrSearch=function(t){return t=e.extend({},e.fn.lunrSearch.defaults,t),new r(this,t),this},e.fn.lunrSearch.defaults={indexUrl:"/js/index.json",results:"#search-results",entries:".entries",template:"#search-results-template",emptyMsg:"Nothing found."}}(jQuery);
//# sourceMappingURL=search.js.map
/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);
/*! jQuery UI - v1.11.4 - 2016-02-24
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, autocomplete.js, menu.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function t(t,s){var n,a,o,r=t.nodeName.toLowerCase();return"area"===r?(n=t.parentNode,a=n.name,t.href&&a&&"map"===n.nodeName.toLowerCase()?(o=e("img[usemap='#"+a+"']")[0],!!o&&i(o)):!1):(/^(input|select|textarea|button|object)$/.test(r)?!t.disabled:"a"===r?t.href||s:s)&&i(t)}function i(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}e.ui=e.ui||{},e.extend(e.ui,{version:"1.11.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({scrollParent:function(t){var i=this.css("position"),s="absolute"===i,n=t?/(auto|scroll|hidden)/:/(auto|scroll)/,a=this.parents().filter(function(){var t=e(this);return s&&"static"===t.css("position")?!1:n.test(t.css("overflow")+t.css("overflow-y")+t.css("overflow-x"))}).eq(0);return"fixed"!==i&&a.length?a:e(this[0].ownerDocument||document)},uniqueId:function(){var e=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++e)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(i){return t(i,!isNaN(e.attr(i,"tabindex")))},tabbable:function(i){var s=e.attr(i,"tabindex"),n=isNaN(s);return(n||s>=0)&&t(i,!n)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(t,i){function s(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],a=i.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+i]=function(t){return void 0===t?o["inner"+i].call(this):this.each(function(){e(this).css(a,s(this,t)+"px")})},e.fn["outer"+i]=function(t,n){return"number"!=typeof t?o["outer"+i].call(this,t):this.each(function(){e(this).css(a,s(this,t,!0,n)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),disableSelection:function(){var e="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.bind(e+".ui-disableSelection",function(e){e.preventDefault()})}}(),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(t){if(void 0!==t)return this.css("zIndex",t);if(this.length)for(var i,s,n=e(this[0]);n.length&&n[0]!==document;){if(i=n.css("position"),("absolute"===i||"relative"===i||"fixed"===i)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0}}),e.ui.plugin={add:function(t,i,s){var n,a=e.ui[t].prototype;for(n in s)a.plugins[n]=a.plugins[n]||[],a.plugins[n].push([i,s[n]])},call:function(e,t,i,s){var n,a=e.plugins[t];if(a&&(s||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(n=0;a.length>n;n++)e.options[a[n][0]]&&a[n][1].apply(e.element,i)}};var s=0,n=Array.prototype.slice;e.cleanData=function(t){return function(i){var s,n,a;for(a=0;null!=(n=i[a]);a++)try{s=e._data(n,"events"),s&&s.remove&&e(n).triggerHandler("remove")}catch(o){}t(i)}}(e.cleanData),e.widget=function(t,i,s){var n,a,o,r,h={},l=t.split(".")[0];return t=t.split(".")[1],n=l+"-"+t,s||(s=i,i=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[l]=e[l]||{},a=e[l][t],o=e[l][t]=function(e,t){return this._createWidget?(arguments.length&&this._createWidget(e,t),void 0):new o(e,t)},e.extend(o,a,{version:s.version,_proto:e.extend({},s),_childConstructors:[]}),r=new i,r.options=e.widget.extend({},r.options),e.each(s,function(t,s){return e.isFunction(s)?(h[t]=function(){var e=function(){return i.prototype[t].apply(this,arguments)},n=function(e){return i.prototype[t].apply(this,e)};return function(){var t,i=this._super,a=this._superApply;return this._super=e,this._superApply=n,t=s.apply(this,arguments),this._super=i,this._superApply=a,t}}(),void 0):(h[t]=s,void 0)}),o.prototype=e.widget.extend(r,{widgetEventPrefix:a?r.widgetEventPrefix||t:t},h,{constructor:o,namespace:l,widgetName:t,widgetFullName:n}),a?(e.each(a._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete a._childConstructors):i._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(t){for(var i,s,a=n.call(arguments,1),o=0,r=a.length;r>o;o++)for(i in a[o])s=a[o][i],a[o].hasOwnProperty(i)&&void 0!==s&&(t[i]=e.isPlainObject(s)?e.isPlainObject(t[i])?e.widget.extend({},t[i],s):e.widget.extend({},s):s);return t},e.widget.bridge=function(t,i){var s=i.prototype.widgetFullName||t;e.fn[t]=function(a){var o="string"==typeof a,r=n.call(arguments,1),h=this;return o?this.each(function(){var i,n=e.data(this,s);return"instance"===a?(h=n,!1):n?e.isFunction(n[a])&&"_"!==a.charAt(0)?(i=n[a].apply(n,r),i!==n&&void 0!==i?(h=i&&i.jquery?h.pushStack(i.get()):i,!1):void 0):e.error("no such method '"+a+"' for "+t+" widget instance"):e.error("cannot call methods on "+t+" prior to initialization; "+"attempted to call method '"+a+"'")}):(r.length&&(a=e.widget.extend.apply(null,[a].concat(r))),this.each(function(){var t=e.data(this,s);t?(t.option(a||{}),t._init&&t._init()):e.data(this,s,new i(a,this))})),h}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,i){i=e(i||this.defaultElement||this)[0],this.element=e(i),this.uuid=s++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=e(),this.hoverable=e(),this.focusable=e(),i!==this&&(e.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===i&&this.destroy()}}),this.document=e(i.style?i.ownerDocument:i.document||i),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(t,i){var s,n,a,o=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(o={},s=t.split("."),t=s.shift(),s.length){for(n=o[t]=e.widget.extend({},this.options[t]),a=0;s.length-1>a;a++)n[s[a]]=n[s[a]]||{},n=n[s[a]];if(t=s.pop(),1===arguments.length)return void 0===n[t]?null:n[t];n[t]=i}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=i}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!t),t&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(t,i,s){var n,a=this;"boolean"!=typeof t&&(s=i,i=t,t=!1),s?(i=n=e(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),e.each(s,function(s,o){function r(){return t||a.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?a[o]:o).apply(a,arguments):void 0}"string"!=typeof o&&(r.guid=o.guid=o.guid||r.guid||e.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+a.eventNamespace,u=h[2];u?n.delegate(u,l,r):i.bind(l,r)})},_off:function(t,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(i).undelegate(i),this.bindings=e(this.bindings.not(t).get()),this.focusable=e(this.focusable.not(t).get()),this.hoverable=e(this.hoverable.not(t).get())},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,o=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var o,r=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),o=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),o&&e.effects&&e.effects.effect[r]?s[t](n):r!==t&&s[r]?s[r](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}}),e.widget;var a=!1;e(document).mouseup(function(){a=!1}),e.widget("ui.mouse",{version:"1.11.4",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(t){if(!a){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;var i=this,s=1===t.which,n="string"==typeof this.options.cancel&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;return s&&!n&&this._mouseCapture(t)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(t)!==!1,!this._mouseStarted)?(t.preventDefault(),!0):(!0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return i._mouseMove(e)},this._mouseUpDelegate=function(e){return i._mouseUp(e)},this.document.bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),a=!0,!0)):!0}},_mouseMove:function(t){if(this._mouseMoved){if(e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button)return this._mouseUp(t);if(!t.which)return this._mouseUp(t)}return(t.which||t.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),a=!1,!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),function(){function t(e,t,i){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?i/100:1)]}function i(t,i){return parseInt(e.css(t,i),10)||0}function s(t){var i=t[0];return 9===i.nodeType?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,u=/top|center|bottom/,c=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(void 0!==n)return n;var t,i,s=e("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),a=s.children()[0];return e("body").append(s),t=a.offsetWidth,s.css("overflow","scroll"),i=a.offsetWidth,t===i&&(i=s[0].clientWidth),s.remove(),n=t-i},getScrollInfo:function(t){var i=t.isWindow||t.isDocument?"":t.element.css("overflow-x"),s=t.isWindow||t.isDocument?"":t.element.css("overflow-y"),n="scroll"===i||"auto"===i&&t.width<t.element[0].scrollWidth,a="scroll"===s||"auto"===s&&t.height<t.element[0].scrollHeight;return{width:a?e.position.scrollbarWidth():0,height:n?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=e(t||window),s=e.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:s,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s||n?i.width():i.outerWidth(),height:s||n?i.height():i.outerHeight()}}},e.fn.position=function(n){if(!n||!n.of)return f.apply(this,arguments);n=e.extend({},n);var p,m,g,v,_,b,y=e(n.of),x=e.position.getWithinInfo(n.within),w=e.position.getScrollInfo(x),k=(n.collision||"flip").split(" "),D={};return b=s(y),y[0].preventDefault&&(n.at="left top"),m=b.width,g=b.height,v=b.offset,_=e.extend({},v),e.each(["my","at"],function(){var e,t,i=(n[this]||"").split(" ");1===i.length&&(i=l.test(i[0])?i.concat(["center"]):u.test(i[0])?["center"].concat(i):["center","center"]),i[0]=l.test(i[0])?i[0]:"center",i[1]=u.test(i[1])?i[1]:"center",e=c.exec(i[0]),t=c.exec(i[1]),D[this]=[e?e[0]:0,t?t[0]:0],n[this]=[d.exec(i[0])[0],d.exec(i[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===n.at[0]?_.left+=m:"center"===n.at[0]&&(_.left+=m/2),"bottom"===n.at[1]?_.top+=g:"center"===n.at[1]&&(_.top+=g/2),p=t(D.at,m,g),_.left+=p[0],_.top+=p[1],this.each(function(){var s,l,u=e(this),c=u.outerWidth(),d=u.outerHeight(),f=i(this,"marginLeft"),b=i(this,"marginTop"),T=c+f+i(this,"marginRight")+w.width,S=d+b+i(this,"marginBottom")+w.height,M=e.extend({},_),N=t(D.my,u.outerWidth(),u.outerHeight());"right"===n.my[0]?M.left-=c:"center"===n.my[0]&&(M.left-=c/2),"bottom"===n.my[1]?M.top-=d:"center"===n.my[1]&&(M.top-=d/2),M.left+=N[0],M.top+=N[1],a||(M.left=h(M.left),M.top=h(M.top)),s={marginLeft:f,marginTop:b},e.each(["left","top"],function(t,i){e.ui.position[k[t]]&&e.ui.position[k[t]][i](M,{targetWidth:m,targetHeight:g,elemWidth:c,elemHeight:d,collisionPosition:s,collisionWidth:T,collisionHeight:S,offset:[p[0]+N[0],p[1]+N[1]],my:n.my,at:n.at,within:x,elem:u})}),n.using&&(l=function(e){var t=v.left-M.left,i=t+m-c,s=v.top-M.top,a=s+g-d,h={target:{element:y,left:v.left,top:v.top,width:m,height:g},element:{element:u,left:M.left,top:M.top,width:c,height:d},horizontal:0>i?"left":t>0?"right":"center",vertical:0>a?"top":s>0?"bottom":"middle"};c>m&&m>r(t+i)&&(h.horizontal="center"),d>g&&g>r(s+a)&&(h.vertical="middle"),h.important=o(r(t),r(i))>o(r(s),r(a))?"horizontal":"vertical",n.using.call(this,e,h)}),u.offset(e.extend(M,{using:l}))})},e.ui.position={fit:{left:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=e.left-t.collisionPosition.marginLeft,h=n-r,l=r+t.collisionWidth-a-n;t.collisionWidth>a?h>0&&0>=l?(i=e.left+h+t.collisionWidth-a-n,e.left+=h-i):e.left=l>0&&0>=h?n:h>l?n+a-t.collisionWidth:n:h>0?e.left+=h:l>0?e.left-=l:e.left=o(e.left-r,e.left)},top:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollTop:s.offset.top,a=t.within.height,r=e.top-t.collisionPosition.marginTop,h=n-r,l=r+t.collisionHeight-a-n;t.collisionHeight>a?h>0&&0>=l?(i=e.top+h+t.collisionHeight-a-n,e.top+=h-i):e.top=l>0&&0>=h?n:h>l?n+a-t.collisionHeight:n:h>0?e.top+=h:l>0?e.top-=l:e.top=o(e.top-r,e.top)}},flip:{left:function(e,t){var i,s,n=t.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=e.left-t.collisionPosition.marginLeft,u=l-h,c=l+t.collisionWidth-o-h,d="left"===t.my[0]?-t.elemWidth:"right"===t.my[0]?t.elemWidth:0,p="left"===t.at[0]?t.targetWidth:"right"===t.at[0]?-t.targetWidth:0,f=-2*t.offset[0];0>u?(i=e.left+d+p+f+t.collisionWidth-o-a,(0>i||r(u)>i)&&(e.left+=d+p+f)):c>0&&(s=e.left-t.collisionPosition.marginLeft+d+p+f-h,(s>0||c>r(s))&&(e.left+=d+p+f))},top:function(e,t){var i,s,n=t.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=e.top-t.collisionPosition.marginTop,u=l-h,c=l+t.collisionHeight-o-h,d="top"===t.my[1],p=d?-t.elemHeight:"bottom"===t.my[1]?t.elemHeight:0,f="top"===t.at[1]?t.targetHeight:"bottom"===t.at[1]?-t.targetHeight:0,m=-2*t.offset[1];0>u?(s=e.top+p+f+m+t.collisionHeight-o-a,(0>s||r(u)>s)&&(e.top+=p+f+m)):c>0&&(i=e.top-t.collisionPosition.marginTop+p+f+m-h,(i>0||c>r(i))&&(e.top+=p+f+m))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,s,n,o,r=document.getElementsByTagName("body")[0],h=document.createElement("div");t=document.createElement(r?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},r&&e.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(o in s)t.style[o]=s[o];t.appendChild(h),i=r||document.documentElement,i.insertBefore(t,i.firstChild),h.style.cssText="position: absolute; left: 10.7432222px;",n=e(h).offset().left,a=n>10&&11>n,t.innerHTML="",i.removeChild(t)}()}(),e.ui.position,e.widget("ui.menu",{version:"1.11.4",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},items:"> *",menus:"ul",position:{my:"left-1 top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item":function(e){e.preventDefault()},"click .ui-menu-item":function(t){var i=e(t.target);!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.select(t),t.isPropagationStopped()||(this.mouseHandled=!0),i.has(".ui-menu").length?this.expand(t):!this.element.is(":focus")&&e(this.document[0].activeElement).closest(".ui-menu").length&&(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(t){if(!this.previousFilter){var i=e(t.currentTarget);i.siblings(".ui-state-active").removeClass("ui-state-active"),this.focus(t,i)}},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(e,t){var i=this.active||this.element.find(this.options.items).eq(0);t||this.focus(e,i)},blur:function(t){this._delay(function(){e.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(t)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){this._closeOnDocumentClick(e)&&this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-menu-icons ui-front").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").removeUniqueId().removeClass("ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=e(this);t.data("ui-menu-submenu-carat")&&t.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(t){var i,s,n,a,o=!0;switch(t.keyCode){case e.ui.keyCode.PAGE_UP:this.previousPage(t);break;case e.ui.keyCode.PAGE_DOWN:this.nextPage(t);break;case e.ui.keyCode.HOME:this._move("first","first",t);break;case e.ui.keyCode.END:this._move("last","last",t);break;case e.ui.keyCode.UP:this.previous(t);break;case e.ui.keyCode.DOWN:this.next(t);break;case e.ui.keyCode.LEFT:this.collapse(t);break;case e.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);break;case e.ui.keyCode.ENTER:case e.ui.keyCode.SPACE:this._activate(t);break;case e.ui.keyCode.ESCAPE:this.collapse(t);break;default:o=!1,s=this.previousFilter||"",n=String.fromCharCode(t.keyCode),a=!1,clearTimeout(this.filterTimer),n===s?a=!0:n=s+n,i=this._filterMenuItems(n),i=a&&-1!==i.index(this.active.next())?this.active.nextAll(".ui-menu-item"):i,i.length||(n=String.fromCharCode(t.keyCode),i=this._filterMenuItems(n)),i.length?(this.focus(t,i),this.previousFilter=n,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter}o&&t.preventDefault()},_activate:function(e){this.active.is(".ui-state-disabled")||(this.active.is("[aria-haspopup='true']")?this.expand(e):this.select(e))},refresh:function(){var t,i,s=this,n=this.options.icons.submenu,a=this.element.find(this.options.menus);this.element.toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length),a.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-front").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var t=e(this),i=t.parent(),s=e("<span>").addClass("ui-menu-icon ui-icon "+n).data("ui-menu-submenu-carat",!0);i.attr("aria-haspopup","true").prepend(s),t.attr("aria-labelledby",i.attr("id"))}),t=a.add(this.element),i=t.find(this.options.items),i.not(".ui-menu-item").each(function(){var t=e(this);s._isDivider(t)&&t.addClass("ui-widget-content ui-menu-divider")}),i.not(".ui-menu-item, .ui-menu-divider").addClass("ui-menu-item").uniqueId().attr({tabIndex:-1,role:this._itemRole()}),i.filter(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!e.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(e,t){"icons"===e&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu),"disabled"===e&&this.element.toggleClass("ui-state-disabled",!!t).attr("aria-disabled",t),this._super(e,t)},focus:function(e,t){var i,s;this.blur(e,e&&"focus"===e.type),this._scrollIntoView(t),this.active=t.first(),s=this.active.addClass("ui-state-focus").removeClass("ui-state-active"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").addClass("ui-state-active"),e&&"keydown"===e.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=t.children(".ui-menu"),i.length&&e&&/^mouse/.test(e.type)&&this._startOpening(i),this.activeMenu=t.parent(),this._trigger("focus",e,{item:t})},_scrollIntoView:function(t){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(e.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(e.css(this.activeMenu[0],"paddingTop"))||0,n=t.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=t.outerHeight(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(e,t){t||clearTimeout(this.timer),this.active&&(this.active.removeClass("ui-state-focus"),this.active=null,this._trigger("blur",e,{item:this.active}))},_startOpening:function(e){clearTimeout(this.timer),"true"===e.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(e)},this.delay))},_open:function(t){var i=e.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true"),t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(t,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:e(t&&t.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(t),this.activeMenu=s},this.delay)},_close:function(e){e||(e=this.active?this.active.parent():this.element),e.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find(".ui-state-active").not(".ui-state-focus").removeClass("ui-state-active")},_closeOnDocumentClick:function(t){return!e(t.target).closest(".ui-menu").length},_isDivider:function(e){return!/[^\-\u2014\u2013\s]/.test(e.text())},collapse:function(e){var t=this.active&&this.active.parent().closest(".ui-menu-item",this.element);t&&t.length&&(this._close(),this.focus(e,t))},expand:function(e){var t=this.active&&this.active.children(".ui-menu ").find(this.options.items).first();t&&t.length&&(this._open(t.parent()),this._delay(function(){this.focus(e,t)}))},next:function(e){this._move("next","first",e)},previous:function(e){this._move("prev","last",e)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(e,t,i){var s;this.active&&(s="first"===e||"last"===e?this.active["first"===e?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[e+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.find(this.options.items)[t]()),this.focus(i,s)},nextPage:function(t){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=e(this),0>i.offset().top-s-n}),this.focus(t,i)):this.focus(t,this.activeMenu.find(this.options.items)[this.active?"last":"first"]())),void 0):(this.next(t),void 0)},previousPage:function(t){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=e(this),i.offset().top-s+n>0}),this.focus(t,i)):this.focus(t,this.activeMenu.find(this.options.items).first())),void 0):(this.next(t),void 0)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(t){this.active=this.active||e(t.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(t,!0),this._trigger("select",t,i)},_filterMenuItems:function(t){var i=t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&"),s=RegExp("^"+i,"i");return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function(){return s.test(e.trim(e(this).text()))})}}),e.widget("ui.autocomplete",{version:"1.11.4",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},requestIndex:0,pending:0,_create:function(){var t,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return t=!0,s=!0,i=!0,void 0;t=!1,s=!1,i=!1;var a=e.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:t=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:t=!0,this._move("nextPage",n);break;case a.UP:t=!0,this._keyEvent("previous",n);break;case a.DOWN:t=!0,this._keyEvent("next",n);break;case a.ENTER:this.menu.active&&(t=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this.isMultiLine||this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(t)return t=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),void 0;if(!i){var n=e.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(e){return s?(s=!1,e.preventDefault(),void 0):(this._searchTimeout(e),void 0)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(e){return this.cancelBlur?(delete this.cancelBlur,void 0):(clearTimeout(this.searching),this.close(e),this._change(e),void 0)}}),this._initSource(),this.menu=e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().menu("instance"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];e(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;this.document.one("mousedown",function(s){s.target===t.element[0]||s.target===i||e.contains(i,s.target)||t.close()})})},menufocus:function(t,i){var s,n;return this.isNewMenu&&(this.isNewMenu=!1,t.originalEvent&&/^mouse/.test(t.originalEvent.type))?(this.menu.blur(),this.document.one("mousemove",function(){e(t.target).trigger(t.originalEvent)}),void 0):(n=i.item.data("ui-autocomplete-item"),!1!==this._trigger("focus",t,{item:n})&&t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(n.value),s=i.item.attr("aria-label")||n.value,s&&e.trim(s).length&&(this.liveRegion.children().hide(),e("<div>").text(s).appendTo(this.liveRegion)),void 0)},menuselect:function(e,t){var i=t.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",e,{item:i})&&this._value(i.value),this.term=this._value(),this.close(e),this.selectedItem=i}}),this.liveRegion=e("<span>",{role:"status","aria-live":"assertive","aria-relevant":"additions"}).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")
}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(e,t){this._super(e,t),"source"===e&&this._initSource(),"appendTo"===e&&this.menu.element.appendTo(this._appendTo()),"disabled"===e&&t&&this.xhr&&this.xhr.abort()},_appendTo:function(){var t=this.options.appendTo;return t&&(t=t.jquery||t.nodeType?e(t):this.document.find(t).eq(0)),t&&t[0]||(t=this.element.closest(".ui-front")),t.length||(t=this.document[0].body),t},_initSource:function(){var t,i,s=this;e.isArray(this.options.source)?(t=this.options.source,this.source=function(i,s){s(e.ui.autocomplete.filter(t,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(t,n){s.xhr&&s.xhr.abort(),s.xhr=e.ajax({url:i,data:t,dataType:"json",success:function(e){n(e)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(e){clearTimeout(this.searching),this.searching=this._delay(function(){var t=this.term===this._value(),i=this.menu.element.is(":visible"),s=e.altKey||e.ctrlKey||e.metaKey||e.shiftKey;(!t||t&&!i&&!s)&&(this.selectedItem=null,this.search(null,e))},this.options.delay)},search:function(e,t){return e=null!=e?e:this._value(),this.term=this._value(),e.length<this.options.minLength?this.close(t):this._trigger("search",t)!==!1?this._search(e):void 0},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:e},this._response())},_response:function(){var t=++this.requestIndex;return e.proxy(function(e){t===this.requestIndex&&this.__response(e),this.pending--,this.pending||this.element.removeClass("ui-autocomplete-loading")},this)},__response:function(e){e&&(e=this._normalize(e)),this._trigger("response",null,{content:e}),!this.options.disabled&&e&&e.length&&!this.cancelSearch?(this._suggest(e),this._trigger("open")):this._close()},close:function(e){this.cancelSearch=!0,this._close(e)},_close:function(e){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",e))},_change:function(e){this.previous!==this._value()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return"string"==typeof t?{label:t,value:t}:e.extend({},t,{label:t.label||t.value,value:t.value||t.label})})},_suggest:function(t){var i=this.menu.element.empty();this._renderMenu(i,t),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,i){var s=this;e.each(i,function(e,i){s._renderItemData(t,i)})},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-autocomplete-item",t)},_renderItem:function(t,i){return e("<li>").text(i.label).appendTo(t)},_move:function(e,t){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(e)||this.menu.isLastItem()&&/^next/.test(e)?(this.isMultiLine||this._value(this.term),this.menu.blur(),void 0):(this.menu[e](t),void 0):(this.search(null,t),void 0)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(e,t){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(e,t),t.preventDefault())}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,i){var s=RegExp(e.ui.autocomplete.escapeRegex(i),"i");return e.grep(t,function(e){return s.test(e.label||e.value||e)})}}),e.widget("ui.autocomplete",e.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(e){return e+(e>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var i;this._superApply(arguments),this.options.disabled||this.cancelSearch||(i=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.children().hide(),e("<div>").text(i).appendTo(this.liveRegion))}}),e.ui.autocomplete});
/*global Modernizr */

var USAJOBS = USAJOBS || {};
USAJOBS.Base = USAJOBS.Base || {};

USAJOBS.Base = (function (window) {
  "use strict";

  var $ = window.jQuery,

  svgFallback = function () {
    if (!Modernizr.svg) {
      $("img[src$='.svg']")
        .attr("src", "/" + $(this).attr("src").split("/").pop().replace("svg", "png"));
    }
  },

  initialize = function () {
    svgFallback();
  };
  // end var

  return {
    init: initialize
  };
}(window));

$(document).ready(function () {
  "use strict";

  USAJOBS.Base.init();
});


/*! politespace - v0.1.5 - 2015-07-09
Politely add spaces to input values to increase readability (credit card numbers, phone numbers, etc).
 * https://github.com/filamentgroup/politespace
 * Copyright (c) 2015 Filament Group (@filamentgroup)
 * MIT License */
// TODO when moving to import system, install this with npm install politespace
(function( w ){
  'use strict';

  var Politespace = function( element ) {
    if( !element ) {
      throw new Error('Politespace requires an element argument.');
    }

    if( !element.getAttribute ) {
      // Cut the mustard
      return;
    }

    this.element = element;
    this.type = this.element.getAttribute( 'type' );
    this.delimiter = this.element.getAttribute( 'data-delimiter' ) || ' ';
    // https://en.wikipedia.org/wiki/Decimal_mark
    this.decimalMark = this.element.getAttribute( 'data-decimal-mark' ) || '';
    this.reverse = this.element.getAttribute( 'data-reverse' ) !== null;
    this.groupLength = this.element.getAttribute( 'data-grouplength' ) || 3;
  };

  Politespace.prototype._divideIntoArray = function( value ) {
    var split = ( '' + this.groupLength ).split( ',' ),
      isUniformSplit = split.length === 1,
      dividedValue = [],
      loopIndex = 0,
      groupLength,
      substrStart,
      useCharCount;

    while( split.length && loopIndex < value.length ) {
      if( isUniformSplit ) {
        groupLength = split[ 0 ];
      } else {
        // use the next split or the rest of the string if open ended, ala "3,3,"
        groupLength = split.shift() || value.length - loopIndex;
      }

      // Use min if we’re at the end of a reversed string
      // (substrStart below grows larger than the string length)
      useCharCount = Math.min( parseInt( groupLength, 10 ), value.length - loopIndex );

      if( this.reverse ) {
        substrStart = -1 * (useCharCount + loopIndex);
      } else {
        substrStart = loopIndex;
      }
      dividedValue.push( value.substr( substrStart, useCharCount ) );
      loopIndex += useCharCount;
    }

    if( this.reverse ) {
      dividedValue.reverse();
    }

    return dividedValue;
  };

  Politespace.prototype.format = function( value ) {
    var split,
      val = this.unformat( value ),
      suffix = '';

    if( this.decimalMark ) {
      split = val.split( this.decimalMark );
      suffix = split.length > 1 ? this.decimalMark + split[ 1 ] : '';
      val = split[ 0 ];
    }

    return this._divideIntoArray( val ).join( this.delimiter ) + suffix;
  };

  Politespace.prototype.trimMaxlength = function( value ) {
    var maxlength = this.element.getAttribute('maxlength');
    // Note input type="number" maxlength does nothing
    if( maxlength ) {
      value = value.substr( 0, maxlength );
    }
    return value;
  };

  Politespace.prototype.getValue = function() {
    return this.trimMaxlength( this.element.value );
  };

  Politespace.prototype.update = function() {
    this.element.value = this.useProxy() ? this.getValue() : this.format( this.getValue() );
  };

  Politespace.prototype.unformat = function( value ) {
    return value.replace( new RegExp(  this.delimiter, 'g' ), '' );
  };

  Politespace.prototype.reset = function() {
    this.element.value = this.unformat( this.element.value );
  };

  Politespace.prototype.useProxy = function() {
    return this.type === 'number';
  };

  Politespace.prototype.updateProxy = function() {
    var proxy;
    if( this.useProxy() ) {
      proxy = this.element.parentNode.firstChild;
      proxy.innerHTML = this.format( this.getValue() );
      proxy.style.width = this.element.offsetWidth + 'px';
    }
  };

  Politespace.prototype.createProxy = function() {
    if( !this.useProxy() ) {
      return;
    }

    function getStyle( el, prop ) {
      return window.getComputedStyle( el, null ).getPropertyValue( prop );
    }

    function sumStyles( el, props ) {
      var total = 0,
        j;

      for (j=0, k=props.length; j<k; j++ ) {
        total += parseFloat( getStyle( el, props[ j ] ) );
      }

      return total;
    }

    var parent = this.element.parentNode,
      el = document.createElement('div'),
      proxy = document.createElement('div'),
      formEl;

    proxy.style.font = getStyle(this.element, 'font');
    proxy.style.paddingLeft = sumStyles( this.element, [ 'padding-left', 'border-left-width' ] ) + 'px';
    proxy.style.paddingRight = sumStyles( this.element, [ 'padding-right', 'border-right-width' ] ) + 'px';
    proxy.style.top = sumStyles( this.element, [ 'padding-top', 'border-top-width', 'margin-top' ] ) + 'px';

    el.appendChild( proxy );
    el.className = 'politespace-proxy active';
    formEl = parent.replaceChild( el, this.element );
    el.appendChild( formEl );

    this.updateProxy();
  };

  w.Politespace = Politespace;

}( this ));

(function( $ ) {
  'use strict';

  // jQuery Plugin

  var componentName = 'politespace';

  $.fn[ componentName ] = function(){
    return this.each( function(){
      var polite = new Politespace( this );

      if( polite.type === 'number' ) {
        polite.createProxy();
      }

      $(this)
        .bind('input keydown', function() {
          polite.updateProxy();
        })
        .bind('blur', function() {
          $(this).closest('.politespace-proxy').addClass('active');
          polite.update();
          polite.updateProxy();
        })
        .bind('focus', function() {
          $(this).closest('.politespace-proxy').removeClass('active');
          polite.reset();
        })
        .data( componentName, polite );

      polite.update();
    });
  };

  // auto-init on enhance (which is called on domready)
  $(document).ready(function() {
    $('[data-' + componentName + ']').politespace();
  });

}( jQuery ));

/**
 * Accordion
 *
 * An accordion component.
 *
 * @param {jQuery} $el A jQuery html element to turn into an accordion.
 */
function Accordion($el) {
  var self = this;
  this.$root = $el;
  this.$root.on('click', 'button', function(ev) {
    var expanded = JSON.parse($(this).attr('aria-expanded'));
    ev.preventDefault();
    self.hideAll();
    if (!expanded) {
      self.show($(this));
    }
  });
}

Accordion.prototype.$ = function(selector) {
  return this.$root.find(selector);
};

Accordion.prototype.hide = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', false);
  $content.attr('aria-hidden', true);
};

Accordion.prototype.show = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', true);
  $content.attr('aria-hidden', false);

  $('html, body').animate({
    scrollTop: $content.offset().top
  });
};

Accordion.prototype.hideAll = function() {
  var self = this;
  this.$('button').each(function() {
    self.hide($(this));
  });
};

/**
 * accordion
 *
 * Initialize a new Accordion component.
 *
 * @param {jQuery} $el A jQuery html element to turn into an accordion.
 */
function accordion($el) {
  return new Accordion($el);
}

function toggleFieldMask($field, showing) {
  $field.attr('autocapitalize', 'off');
  $field.attr('autocorrect', 'off');
  $field.attr('type', showing ? 'password' : 'text');
}

function togglePassword($el) {
  var fieldSelector =  '#' + $el.attr('aria-controls'),
      $field = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($field, showing);
    $el.text(showing ? 'Show password' : 'Hide password');
    showing = !showing;
  });
}

function toggleSSN($el) {
  var fieldSelector =  '#' + $el.attr('aria-controls'),
      $field = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($field, showing);
    $el.text(showing ? 'Show SSN' : 'Hide SSN');
    showing = !showing;
  });
}

function toggleMultiPassword($el) {
  var fieldSelector = '#password, #confirmPassword',
      $fields = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($fields, showing);
    $el.text(showing ? 'Show my typing' : 'Hide my typing');
    showing = !showing;
  });
}

function validator($el) {
  var data = $('#password[data-validation-element]').data(),
      validatorName,
      validatorPattern,
      $validatorCheckbox,
      $checkList = $($el.data('validationElement'));

  function validate() {
    var key;

    for (key in data) {
      if (key.startsWith('validate')) {
        validatorName = key.split('validate')[1];
        validatorPattern = new RegExp(data[key]);
        $validatorCheckbox = $checkList.find('[data-validator=' +
            validatorName.toLowerCase() + ']');

        if (!validatorPattern.test($el.val())) {
          $validatorCheckbox.toggleClass('usa-checklist-checked', false);
        }
        else {
          $validatorCheckbox.toggleClass('usa-checklist-checked', true);
        }
      }
    }
  }

  $el.on('keyup', validate);
}

$(function() {
  $('[class^=usa-accordion]').each(function() {
    accordion($(this));
  });

  // Fixing skip nav focus behavior in chrome
  $('.skipnav').click(function(){
    $('#main-content').attr('tabindex','0');
  });

  $('#main-content').blur(function(){
    $(this).attr('tabindex','-1');
  });

  togglePassword($('.usa-show_password'));
  toggleMultiPassword($('.usa-show_multipassword'));
  toggleSSN($('.usa-show_ssn'));
  validator($('.js-validate_password'));

});

// Footer

var $footer = $('[data-object="footer"]'),
  window_width = window.innerWidth;

$footer.on('click', '[data-behavior]', function () {
  var $el = $(this),
    $object = $el.closest('[data-object="footer"]'),
    state = $el.attr('data-state'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find($el.attr('data-target'));

  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $object.trigger(action, { el: $el, object: $object, state: state, target: $target });
  });
});

$footer.on('footer.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state === 'is-closed') {
    opts.object.trigger('footer.open', opts);
  } else if (opts.state === 'is-open') {
    opts.object.trigger('footer.close', opts);
  }
});

$footer.on('footer.open', function(event, opts) {
    // Hide all siblings
    /*
    opts.object
      .find('[data-behavior="footer.toggle"][data-state="is-open"]')
      .trigger('close', { });
    */

  opts.target.removeClass('is-hidden');
  opts.target.attr('aria-expanded', 'true');
  opts.el.attr('aria-expanded', 'true');
  opts.el.attr('data-state', 'is-open');
});

$footer.on('footer.close', function(event, opts) {
  if (window_width < 600) {
    event.preventDefault();

    opts.target.addClass('is-hidden');
    opts.target.attr('aria-expanded', 'false');
    opts.el.attr('aria-expanded', 'false');
    opts.el.attr('data-state', 'is-closed');
  }
});

// Navigation (top-level-nav)

var $nav = $('[data-object="nav"]');

$nav.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="nav"]'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find('#' + $el.attr('aria-controls')),
    state = $target.attr('aria-expanded');

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, state: state, target: $target });
  });
});

$nav.on('nav.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state === 'is-closed') {
    opts.object.trigger('nav.open', opts);
  } else if (opts.state === 'is-open') {
    opts.object.trigger('nav.close', opts);
  }
});

$nav.on('nav.open', function(event, opts) {
  opts.object.attr('data-state', 'is-open');
  opts.target.slideToggle(300, function () {
    opts.el.attr('aria-expanded', 'true');
    opts.target.attr('aria-expanded', 'true');
  });
});

$nav.on('nav.close', function(event, opts) {
  opts.object.attr('data-state', 'is-closed');
  opts.target.slideToggle(300, function () {
    opts.el.attr('aria-expanded', 'false');
    opts.target.attr('aria-expanded', 'false');
  });
});

$nav.on('nav.menu.toggle', function(event, opts) {
  var $parent = opts.el.parent(),
    parent_state = $parent.attr('data-state'),
    $menu = $parent.find('[role="menu"]'),
    $sibling = $parent.siblings().find('[aria-expanded="true"]');

  event.preventDefault();

  $nav.trigger('nav.menu.slide-close', { parent: $sibling.parent(), menu: $sibling });

  if (parent_state === 'is-closed') {
    $nav.trigger('nav.menu.slide-open', { parent: $parent, menu: $menu });
  } else if (parent_state === 'is-open') {
    $nav.trigger('nav.menu.slide-close', { parent: $parent, menu: $menu });
  }
});

$nav.on('nav.menu.slide-open', function(event, opts) {
  opts.parent.attr('data-state', 'is-open');
  opts.menu.slideDown(300, function () {
    opts.menu.attr('aria-expanded', 'true');
  });
});

$nav.on('nav.menu.slide-close', function(event, opts) {
  opts.parent.attr('data-state', 'is-closed');
  opts.menu.slideUp(300, function () {
    opts.menu.attr('aria-expanded', 'false');
  });
});

$nav.on('nav.menu.search-toggle', function(event, opts) {
  var $parent = opts.el.parent();

  event.preventDefault();

  if (opts.state === 'false') {
    $nav.trigger('nav.menu.slide-open', { parent: $parent, menu: opts.target });
  } else if (opts.state === 'true') {
    $nav.trigger('nav.menu.slide-close', { parent: $parent, menu: opts.target });
  }
});


// Search autocomplete locations
var acHostUrl = 'https://ac.usajobs.gov/acwd',
usajSrc = function (request, response) {
  $.ajax({
    url: acHostUrl,
    dataType: 'jsonp',
    crossdomain: true,
    cache: true,
    jsonpCallback: 'usaj151067976',
    data: { t: request.term },
    success: function (data) {
      response(data);
    }
  });
};

// Portions of this code came from http://jsfiddle.net/fozylet/kTAMm/
$('#search-location').autocomplete({
  source: usajSrc,
  minLength: 3,
  open: function (e, ui) {
    var acData = $(this).data('ui-autocomplete');
    acData
      .menu
      .element
      .find('li')
      .each(function () {
        var me = $(this);
        var keywords = acData.term.split(' ').join('|');
        me.html(me.text().replace(new RegExp("(" + keywords + ")", "gi"), '<strong>$1</strong>'));
      });
  },
  select: function (event, ui) {
    var selectedObj = ui.item;

    $('#search-location').val(selectedObj.label);
    $('#AutoCompleteSelected').val('true');
    return false;
  },
  search: function () {
    //wipe out values on new searches or when user selects one but changes their mind!
    $('#AutoCompleteSelected').val('false');
  }
});

var $help = $('[data-object="help.contact_us"]');

$help.on('change', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help.contact_us"]'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find('#' + $el.attr('aria-controls'));

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, target: $target });
  });
});

$help.on('help.open', function(event, opts) {
  var $send_button = $('#btn-send');

  event.preventDefault();

  opts.target.attr('aria-hidden', 'false');

  // Enabled the send button
  $send_button.removeAttr('disabled');
});
