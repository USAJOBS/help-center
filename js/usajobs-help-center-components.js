/*! ScrollMagic v2.0.5 | (c) 2015 Jan Paepke (@janpaepke) | license & info: http://scrollmagic.io */

!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.ScrollMagic=t()}(this,function(){"use strict";var e=function(){};e.version="2.0.5",window.addEventListener("mousewheel",function(){});var t="data-scrollmagic-pin-spacer";e.Controller=function(r){var o,s,a="ScrollMagic.Controller",l="FORWARD",c="REVERSE",u="PAUSED",f=n.defaults,d=this,h=i.extend({},f,r),g=[],p=!1,v=0,m=u,w=!0,y=0,S=!0,b=function(){for(var e in h)f.hasOwnProperty(e)||delete h[e];if(h.container=i.get.elements(h.container)[0],!h.container)throw a+" init failed.";w=h.container===window||h.container===document.body||!document.body.contains(h.container),w&&(h.container=window),y=z(),h.container.addEventListener("resize",T),h.container.addEventListener("scroll",T),h.refreshInterval=parseInt(h.refreshInterval)||f.refreshInterval,E()},E=function(){h.refreshInterval>0&&(s=window.setTimeout(A,h.refreshInterval))},x=function(){return h.vertical?i.get.scrollTop(h.container):i.get.scrollLeft(h.container)},z=function(){return h.vertical?i.get.height(h.container):i.get.width(h.container)},C=this._setScrollPos=function(e){h.vertical?w?window.scrollTo(i.get.scrollLeft(),e):h.container.scrollTop=e:w?window.scrollTo(e,i.get.scrollTop()):h.container.scrollLeft=e},F=function(){if(S&&p){var e=i.type.Array(p)?p:g.slice(0);p=!1;var t=v;v=d.scrollPos();var n=v-t;0!==n&&(m=n>0?l:c),m===c&&e.reverse(),e.forEach(function(e){e.update(!0)})}},L=function(){o=i.rAF(F)},T=function(e){"resize"==e.type&&(y=z(),m=u),p!==!0&&(p=!0,L())},A=function(){if(!w&&y!=z()){var e;try{e=new Event("resize",{bubbles:!1,cancelable:!1})}catch(t){e=document.createEvent("Event"),e.initEvent("resize",!1,!1)}h.container.dispatchEvent(e)}g.forEach(function(e){e.refresh()}),E()};this._options=h;var O=function(e){if(e.length<=1)return e;var t=e.slice(0);return t.sort(function(e,t){return e.scrollOffset()>t.scrollOffset()?1:-1}),t};return this.addScene=function(t){if(i.type.Array(t))t.forEach(function(e){d.addScene(e)});else if(t instanceof e.Scene)if(t.controller()!==d)t.addTo(d);else if(g.indexOf(t)<0){g.push(t),g=O(g),t.on("shift.controller_sort",function(){g=O(g)});for(var n in h.globalSceneOptions)t[n]&&t[n].call(t,h.globalSceneOptions[n])}return d},this.removeScene=function(e){if(i.type.Array(e))e.forEach(function(e){d.removeScene(e)});else{var t=g.indexOf(e);t>-1&&(e.off("shift.controller_sort"),g.splice(t,1),e.remove())}return d},this.updateScene=function(t,n){return i.type.Array(t)?t.forEach(function(e){d.updateScene(e,n)}):n?t.update(!0):p!==!0&&t instanceof e.Scene&&(p=p||[],-1==p.indexOf(t)&&p.push(t),p=O(p),L()),d},this.update=function(e){return T({type:"resize"}),e&&F(),d},this.scrollTo=function(n,r){if(i.type.Number(n))C.call(h.container,n,r);else if(n instanceof e.Scene)n.controller()===d&&d.scrollTo(n.scrollOffset(),r);else if(i.type.Function(n))C=n;else{var o=i.get.elements(n)[0];if(o){for(;o.parentNode.hasAttribute(t);)o=o.parentNode;var s=h.vertical?"top":"left",a=i.get.offset(h.container),l=i.get.offset(o);w||(a[s]-=d.scrollPos()),d.scrollTo(l[s]-a[s],r)}}return d},this.scrollPos=function(e){return arguments.length?(i.type.Function(e)&&(x=e),d):x.call(d)},this.info=function(e){var t={size:y,vertical:h.vertical,scrollPos:v,scrollDirection:m,container:h.container,isDocument:w};return arguments.length?void 0!==t[e]?t[e]:void 0:t},this.loglevel=function(){return d},this.enabled=function(e){return arguments.length?(S!=e&&(S=!!e,d.updateScene(g,!0)),d):S},this.destroy=function(e){window.clearTimeout(s);for(var t=g.length;t--;)g[t].destroy(e);return h.container.removeEventListener("resize",T),h.container.removeEventListener("scroll",T),i.cAF(o),null},b(),d};var n={defaults:{container:window,vertical:!0,globalSceneOptions:{},loglevel:2,refreshInterval:100}};e.Controller.addOption=function(e,t){n.defaults[e]=t},e.Controller.extend=function(t){var n=this;e.Controller=function(){return n.apply(this,arguments),this.$super=i.extend({},this),t.apply(this,arguments)||this},i.extend(e.Controller,n),e.Controller.prototype=n.prototype,e.Controller.prototype.constructor=e.Controller},e.Scene=function(n){var o,s,a="BEFORE",l="DURING",c="AFTER",u=r.defaults,f=this,d=i.extend({},u,n),h=a,g=0,p={start:0,end:0},v=0,m=!0,w=function(){for(var e in d)u.hasOwnProperty(e)||delete d[e];for(var t in u)L(t);C()},y={};this.on=function(e,t){return i.type.Function(t)&&(e=e.trim().split(" "),e.forEach(function(e){var n=e.split("."),r=n[0],i=n[1];"*"!=r&&(y[r]||(y[r]=[]),y[r].push({namespace:i||"",callback:t}))})),f},this.off=function(e,t){return e?(e=e.trim().split(" "),e.forEach(function(e){var n=e.split("."),r=n[0],i=n[1]||"",o="*"===r?Object.keys(y):[r];o.forEach(function(e){for(var n=y[e]||[],r=n.length;r--;){var o=n[r];!o||i!==o.namespace&&"*"!==i||t&&t!=o.callback||n.splice(r,1)}n.length||delete y[e]})}),f):f},this.trigger=function(t,n){if(t){var r=t.trim().split("."),i=r[0],o=r[1],s=y[i];s&&s.forEach(function(t){o&&o!==t.namespace||t.callback.call(f,new e.Event(i,t.namespace,f,n))})}return f},f.on("change.internal",function(e){"loglevel"!==e.what&&"tweenChanges"!==e.what&&("triggerElement"===e.what?E():"reverse"===e.what&&f.update())}).on("shift.internal",function(){S(),f.update()}),this.addTo=function(t){return t instanceof e.Controller&&s!=t&&(s&&s.removeScene(f),s=t,C(),b(!0),E(!0),S(),s.info("container").addEventListener("resize",x),t.addScene(f),f.trigger("add",{controller:s}),f.update()),f},this.enabled=function(e){return arguments.length?(m!=e&&(m=!!e,f.update(!0)),f):m},this.remove=function(){if(s){s.info("container").removeEventListener("resize",x);var e=s;s=void 0,e.removeScene(f),f.trigger("remove")}return f},this.destroy=function(e){return f.trigger("destroy",{reset:e}),f.remove(),f.off("*.*"),null},this.update=function(e){if(s)if(e)if(s.enabled()&&m){var t,n=s.info("scrollPos");t=d.duration>0?(n-p.start)/(p.end-p.start):n>=p.start?1:0,f.trigger("update",{startPos:p.start,endPos:p.end,scrollPos:n}),f.progress(t)}else T&&h===l&&O(!0);else s.updateScene(f,!1);return f},this.refresh=function(){return b(),E(),f},this.progress=function(e){if(arguments.length){var t=!1,n=h,r=s?s.info("scrollDirection"):"PAUSED",i=d.reverse||e>=g;if(0===d.duration?(t=g!=e,g=1>e&&i?0:1,h=0===g?a:l):0>e&&h!==a&&i?(g=0,h=a,t=!0):e>=0&&1>e&&i?(g=e,h=l,t=!0):e>=1&&h!==c?(g=1,h=c,t=!0):h!==l||i||O(),t){var o={progress:g,state:h,scrollDirection:r},u=h!=n,p=function(e){f.trigger(e,o)};u&&n!==l&&(p("enter"),p(n===a?"start":"end")),p("progress"),u&&h!==l&&(p(h===a?"start":"end"),p("leave"))}return f}return g};var S=function(){p={start:v+d.offset},s&&d.triggerElement&&(p.start-=s.info("size")*d.triggerHook),p.end=p.start+d.duration},b=function(e){if(o){var t="duration";F(t,o.call(f))&&!e&&(f.trigger("change",{what:t,newval:d[t]}),f.trigger("shift",{reason:t}))}},E=function(e){var n=0,r=d.triggerElement;if(s&&r){for(var o=s.info(),a=i.get.offset(o.container),l=o.vertical?"top":"left";r.parentNode.hasAttribute(t);)r=r.parentNode;var c=i.get.offset(r);o.isDocument||(a[l]-=s.scrollPos()),n=c[l]-a[l]}var u=n!=v;v=n,u&&!e&&f.trigger("shift",{reason:"triggerElementPosition"})},x=function(){d.triggerHook>0&&f.trigger("shift",{reason:"containerResize"})},z=i.extend(r.validate,{duration:function(e){if(i.type.String(e)&&e.match(/^(\.|\d)*\d+%$/)){var t=parseFloat(e)/100;e=function(){return s?s.info("size")*t:0}}if(i.type.Function(e)){o=e;try{e=parseFloat(o())}catch(t){e=-1}}if(e=parseFloat(e),!i.type.Number(e)||0>e)throw o?(o=void 0,0):0;return e}}),C=function(e){e=arguments.length?[e]:Object.keys(z),e.forEach(function(e){var t;if(z[e])try{t=z[e](d[e])}catch(n){t=u[e]}finally{d[e]=t}})},F=function(e,t){var n=!1,r=d[e];return d[e]!=t&&(d[e]=t,C(e),n=r!=d[e]),n},L=function(e){f[e]||(f[e]=function(t){return arguments.length?("duration"===e&&(o=void 0),F(e,t)&&(f.trigger("change",{what:e,newval:d[e]}),r.shifts.indexOf(e)>-1&&f.trigger("shift",{reason:e})),f):d[e]})};this.controller=function(){return s},this.state=function(){return h},this.scrollOffset=function(){return p.start},this.triggerPosition=function(){var e=d.offset;return s&&(e+=d.triggerElement?v:s.info("size")*f.triggerHook()),e};var T,A;f.on("shift.internal",function(e){var t="duration"===e.reason;(h===c&&t||h===l&&0===d.duration)&&O(),t&&_()}).on("progress.internal",function(){O()}).on("add.internal",function(){_()}).on("destroy.internal",function(e){f.removePin(e.reset)});var O=function(e){if(T&&s){var t=s.info(),n=A.spacer.firstChild;if(e||h!==l){var r={position:A.inFlow?"relative":"absolute",top:0,left:0},o=i.css(n,"position")!=r.position;A.pushFollowers?d.duration>0&&(h===c&&0===parseFloat(i.css(A.spacer,"padding-top"))?o=!0:h===a&&0===parseFloat(i.css(A.spacer,"padding-bottom"))&&(o=!0)):r[t.vertical?"top":"left"]=d.duration*g,i.css(n,r),o&&_()}else{"fixed"!=i.css(n,"position")&&(i.css(n,{position:"fixed"}),_());var u=i.get.offset(A.spacer,!0),f=d.reverse||0===d.duration?t.scrollPos-p.start:Math.round(g*d.duration*10)/10;u[t.vertical?"top":"left"]+=f,i.css(A.spacer.firstChild,{top:u.top,left:u.left})}}},_=function(){if(T&&s&&A.inFlow){var e=h===l,t=s.info("vertical"),n=A.spacer.firstChild,r=i.isMarginCollapseType(i.css(A.spacer,"display")),o={};A.relSize.width||A.relSize.autoFullWidth?e?i.css(T,{width:i.get.width(A.spacer)}):i.css(T,{width:"100%"}):(o["min-width"]=i.get.width(t?T:n,!0,!0),o.width=e?o["min-width"]:"auto"),A.relSize.height?e?i.css(T,{height:i.get.height(A.spacer)-(A.pushFollowers?d.duration:0)}):i.css(T,{height:"100%"}):(o["min-height"]=i.get.height(t?n:T,!0,!r),o.height=e?o["min-height"]:"auto"),A.pushFollowers&&(o["padding"+(t?"Top":"Left")]=d.duration*g,o["padding"+(t?"Bottom":"Right")]=d.duration*(1-g)),i.css(A.spacer,o)}},N=function(){s&&T&&h===l&&!s.info("isDocument")&&O()},P=function(){s&&T&&h===l&&((A.relSize.width||A.relSize.autoFullWidth)&&i.get.width(window)!=i.get.width(A.spacer.parentNode)||A.relSize.height&&i.get.height(window)!=i.get.height(A.spacer.parentNode))&&_()},D=function(e){s&&T&&h===l&&!s.info("isDocument")&&(e.preventDefault(),s._setScrollPos(s.info("scrollPos")-((e.wheelDelta||e[s.info("vertical")?"wheelDeltaY":"wheelDeltaX"])/3||30*-e.detail)))};this.setPin=function(e,n){var r={pushFollowers:!0,spacerClass:"scrollmagic-pin-spacer"};if(n=i.extend({},r,n),e=i.get.elements(e)[0],!e)return f;if("fixed"===i.css(e,"position"))return f;if(T){if(T===e)return f;f.removePin()}T=e;var o=T.parentNode.style.display,s=["top","left","bottom","right","margin","marginLeft","marginRight","marginTop","marginBottom"];T.parentNode.style.display="none";var a="absolute"!=i.css(T,"position"),l=i.css(T,s.concat(["display"])),c=i.css(T,["width","height"]);T.parentNode.style.display=o,!a&&n.pushFollowers&&(n.pushFollowers=!1);var u=T.parentNode.insertBefore(document.createElement("div"),T),d=i.extend(l,{position:a?"relative":"absolute",boxSizing:"content-box",mozBoxSizing:"content-box",webkitBoxSizing:"content-box"});if(a||i.extend(d,i.css(T,["width","height"])),i.css(u,d),u.setAttribute(t,""),i.addClass(u,n.spacerClass),A={spacer:u,relSize:{width:"%"===c.width.slice(-1),height:"%"===c.height.slice(-1),autoFullWidth:"auto"===c.width&&a&&i.isMarginCollapseType(l.display)},pushFollowers:n.pushFollowers,inFlow:a},!T.___origStyle){T.___origStyle={};var h=T.style,g=s.concat(["width","height","position","boxSizing","mozBoxSizing","webkitBoxSizing"]);g.forEach(function(e){T.___origStyle[e]=h[e]||""})}return A.relSize.width&&i.css(u,{width:c.width}),A.relSize.height&&i.css(u,{height:c.height}),u.appendChild(T),i.css(T,{position:a?"relative":"absolute",margin:"auto",top:"auto",left:"auto",bottom:"auto",right:"auto"}),(A.relSize.width||A.relSize.autoFullWidth)&&i.css(T,{boxSizing:"border-box",mozBoxSizing:"border-box",webkitBoxSizing:"border-box"}),window.addEventListener("scroll",N),window.addEventListener("resize",N),window.addEventListener("resize",P),T.addEventListener("mousewheel",D),T.addEventListener("DOMMouseScroll",D),O(),f},this.removePin=function(e){if(T){if(h===l&&O(!0),e||!s){var n=A.spacer.firstChild;if(n.hasAttribute(t)){var r=A.spacer.style,o=["margin","marginLeft","marginRight","marginTop","marginBottom"];margins={},o.forEach(function(e){margins[e]=r[e]||""}),i.css(n,margins)}A.spacer.parentNode.insertBefore(n,A.spacer),A.spacer.parentNode.removeChild(A.spacer),T.parentNode.hasAttribute(t)||(i.css(T,T.___origStyle),delete T.___origStyle)}window.removeEventListener("scroll",N),window.removeEventListener("resize",N),window.removeEventListener("resize",P),T.removeEventListener("mousewheel",D),T.removeEventListener("DOMMouseScroll",D),T=void 0}return f};var R,k=[];return f.on("destroy.internal",function(e){f.removeClassToggle(e.reset)}),this.setClassToggle=function(e,t){var n=i.get.elements(e);return 0!==n.length&&i.type.String(t)?(k.length>0&&f.removeClassToggle(),R=t,k=n,f.on("enter.internal_class leave.internal_class",function(e){var t="enter"===e.type?i.addClass:i.removeClass;k.forEach(function(e){t(e,R)})}),f):f},this.removeClassToggle=function(e){return e&&k.forEach(function(e){i.removeClass(e,R)}),f.off("start.internal_class end.internal_class"),R=void 0,k=[],f},w(),f};var r={defaults:{duration:0,offset:0,triggerElement:void 0,triggerHook:.5,reverse:!0,loglevel:2},validate:{offset:function(e){if(e=parseFloat(e),!i.type.Number(e))throw 0;return e},triggerElement:function(e){if(e=e||void 0){var t=i.get.elements(e)[0];if(!t)throw 0;e=t}return e},triggerHook:function(e){var t={onCenter:.5,onEnter:1,onLeave:0};if(i.type.Number(e))e=Math.max(0,Math.min(parseFloat(e),1));else{if(!(e in t))throw 0;e=t[e]}return e},reverse:function(e){return!!e}},shifts:["duration","offset","triggerHook"]};e.Scene.addOption=function(e,t,n,i){e in r.defaults||(r.defaults[e]=t,r.validate[e]=n,i&&r.shifts.push(e))},e.Scene.extend=function(t){var n=this;e.Scene=function(){return n.apply(this,arguments),this.$super=i.extend({},this),t.apply(this,arguments)||this},i.extend(e.Scene,n),e.Scene.prototype=n.prototype,e.Scene.prototype.constructor=e.Scene},e.Event=function(e,t,n,r){r=r||{};for(var i in r)this[i]=r[i];return this.type=e,this.target=this.currentTarget=n,this.namespace=t||"",this.timeStamp=this.timestamp=Date.now(),this};var i=e._util=function(e){var t,n={},r=function(e){return parseFloat(e)||0},i=function(t){return t.currentStyle?t.currentStyle:e.getComputedStyle(t)},o=function(t,n,o,s){if(n=n===document?e:n,n===e)s=!1;else if(!f.DomElement(n))return 0;t=t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();var a=(o?n["offset"+t]||n["outer"+t]:n["client"+t]||n["inner"+t])||0;if(o&&s){var l=i(n);a+="Height"===t?r(l.marginTop)+r(l.marginBottom):r(l.marginLeft)+r(l.marginRight)}return a},s=function(e){return e.replace(/^[^a-z]+([a-z])/g,"$1").replace(/-([a-z])/g,function(e){return e[1].toUpperCase()})};n.extend=function(e){for(e=e||{},t=1;t<arguments.length;t++)if(arguments[t])for(var n in arguments[t])arguments[t].hasOwnProperty(n)&&(e[n]=arguments[t][n]);return e},n.isMarginCollapseType=function(e){return["block","flex","list-item","table","-webkit-box"].indexOf(e)>-1};var a=0,l=["ms","moz","webkit","o"],c=e.requestAnimationFrame,u=e.cancelAnimationFrame;for(t=0;!c&&t<l.length;++t)c=e[l[t]+"RequestAnimationFrame"],u=e[l[t]+"CancelAnimationFrame"]||e[l[t]+"CancelRequestAnimationFrame"];c||(c=function(t){var n=(new Date).getTime(),r=Math.max(0,16-(n-a)),i=e.setTimeout(function(){t(n+r)},r);return a=n+r,i}),u||(u=function(t){e.clearTimeout(t)}),n.rAF=c.bind(e),n.cAF=u.bind(e);var f=n.type=function(e){return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/,"$1").toLowerCase()};f.String=function(e){return"string"===f(e)},f.Function=function(e){return"function"===f(e)},f.Array=function(e){return Array.isArray(e)},f.Number=function(e){return!f.Array(e)&&e-parseFloat(e)+1>=0},f.DomElement=function(e){return"object"==typeof HTMLElement?e instanceof HTMLElement:e&&"object"==typeof e&&null!==e&&1===e.nodeType&&"string"==typeof e.nodeName};var d=n.get={};return d.elements=function(t){var n=[];if(f.String(t))try{t=document.querySelectorAll(t)}catch(e){return n}if("nodelist"===f(t)||f.Array(t))for(var r=0,i=n.length=t.length;i>r;r++){var o=t[r];n[r]=f.DomElement(o)?o:d.elements(o)}else(f.DomElement(t)||t===document||t===e)&&(n=[t]);return n},d.scrollTop=function(t){return t&&"number"==typeof t.scrollTop?t.scrollTop:e.pageYOffset||0},d.scrollLeft=function(t){return t&&"number"==typeof t.scrollLeft?t.scrollLeft:e.pageXOffset||0},d.width=function(e,t,n){return o("width",e,t,n)},d.height=function(e,t,n){return o("height",e,t,n)},d.offset=function(e,t){var n={top:0,left:0};if(e&&e.getBoundingClientRect){var r=e.getBoundingClientRect();n.top=r.top,n.left=r.left,t||(n.top+=d.scrollTop(),n.left+=d.scrollLeft())}return n},n.addClass=function(e,t){t&&(e.classList?e.classList.add(t):e.className+=" "+t)},n.removeClass=function(e,t){t&&(e.classList?e.classList.remove(t):e.className=e.className.replace(RegExp("(^|\\b)"+t.split(" ").join("|")+"(\\b|$)","gi")," "))},n.css=function(e,t){if(f.String(t))return i(e)[s(t)];if(f.Array(t)){var n={},r=i(e);return t.forEach(function(e){n[e]=r[s(e)]}),n}for(var o in t){var a=t[o];a==parseFloat(a)&&(a+="px"),e.style[s(o)]=a}},n}(window||{});return e});
/*! picturefill - v3.0.2 - 2016-02-12
 * https://scottjehl.github.io/picturefill/
 * Copyright (c) 2016 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT
 */
!function(a){var b=navigator.userAgent;a.HTMLPictureElement&&/ecko/.test(b)&&b.match(/rv\:(\d+)/)&&RegExp.$1<45&&addEventListener("resize",function(){var b,c=document.createElement("source"),d=function(a){var b,d,e=a.parentNode;"PICTURE"===e.nodeName.toUpperCase()?(b=c.cloneNode(),e.insertBefore(b,e.firstElementChild),setTimeout(function(){e.removeChild(b)})):(!a._pfLastSize||a.offsetWidth>a._pfLastSize)&&(a._pfLastSize=a.offsetWidth,d=a.sizes,a.sizes+=",100vw",setTimeout(function(){a.sizes=d}))},e=function(){var a,b=document.querySelectorAll("picture > img, img[srcset][sizes]");for(a=0;a<b.length;a++)d(b[a])},f=function(){clearTimeout(b),b=setTimeout(e,99)},g=a.matchMedia&&matchMedia("(orientation: landscape)"),h=function(){f(),g&&g.addListener&&g.addListener(f)};return c.srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",/^[c|i]|d$/.test(document.readyState||"")?h():document.addEventListener("DOMContentLoaded",h),f}())}(window),function(a,b,c){"use strict";function d(a){return" "===a||"	"===a||"\n"===a||"\f"===a||"\r"===a}function e(b,c){var d=new a.Image;return d.onerror=function(){A[b]=!1,ba()},d.onload=function(){A[b]=1===d.width,ba()},d.src=c,"pending"}function f(){M=!1,P=a.devicePixelRatio,N={},O={},s.DPR=P||1,Q.width=Math.max(a.innerWidth||0,z.clientWidth),Q.height=Math.max(a.innerHeight||0,z.clientHeight),Q.vw=Q.width/100,Q.vh=Q.height/100,r=[Q.height,Q.width,P].join("-"),Q.em=s.getEmValue(),Q.rem=Q.em}function g(a,b,c,d){var e,f,g,h;return"saveData"===B.algorithm?a>2.7?h=c+1:(f=b-c,e=Math.pow(a-.6,1.5),g=f*e,d&&(g+=.1*e),h=a+g):h=c>1?Math.sqrt(a*b):a,h>c}function h(a){var b,c=s.getSet(a),d=!1;"pending"!==c&&(d=r,c&&(b=s.setRes(c),s.applySetCandidate(b,a))),a[s.ns].evaled=d}function i(a,b){return a.res-b.res}function j(a,b,c){var d;return!c&&b&&(c=a[s.ns].sets,c=c&&c[c.length-1]),d=k(b,c),d&&(b=s.makeUrl(b),a[s.ns].curSrc=b,a[s.ns].curCan=d,d.res||aa(d,d.set.sizes)),d}function k(a,b){var c,d,e;if(a&&b)for(e=s.parseSet(b),a=s.makeUrl(a),c=0;c<e.length;c++)if(a===s.makeUrl(e[c].url)){d=e[c];break}return d}function l(a,b){var c,d,e,f,g=a.getElementsByTagName("source");for(c=0,d=g.length;d>c;c++)e=g[c],e[s.ns]=!0,f=e.getAttribute("srcset"),f&&b.push({srcset:f,media:e.getAttribute("media"),type:e.getAttribute("type"),sizes:e.getAttribute("sizes")})}function m(a,b){function c(b){var c,d=b.exec(a.substring(m));return d?(c=d[0],m+=c.length,c):void 0}function e(){var a,c,d,e,f,i,j,k,l,m=!1,o={};for(e=0;e<h.length;e++)f=h[e],i=f[f.length-1],j=f.substring(0,f.length-1),k=parseInt(j,10),l=parseFloat(j),X.test(j)&&"w"===i?((a||c)&&(m=!0),0===k?m=!0:a=k):Y.test(j)&&"x"===i?((a||c||d)&&(m=!0),0>l?m=!0:c=l):X.test(j)&&"h"===i?((d||c)&&(m=!0),0===k?m=!0:d=k):m=!0;m||(o.url=g,a&&(o.w=a),c&&(o.d=c),d&&(o.h=d),d||c||a||(o.d=1),1===o.d&&(b.has1x=!0),o.set=b,n.push(o))}function f(){for(c(T),i="",j="in descriptor";;){if(k=a.charAt(m),"in descriptor"===j)if(d(k))i&&(h.push(i),i="",j="after descriptor");else{if(","===k)return m+=1,i&&h.push(i),void e();if("("===k)i+=k,j="in parens";else{if(""===k)return i&&h.push(i),void e();i+=k}}else if("in parens"===j)if(")"===k)i+=k,j="in descriptor";else{if(""===k)return h.push(i),void e();i+=k}else if("after descriptor"===j)if(d(k));else{if(""===k)return void e();j="in descriptor",m-=1}m+=1}}for(var g,h,i,j,k,l=a.length,m=0,n=[];;){if(c(U),m>=l)return n;g=c(V),h=[],","===g.slice(-1)?(g=g.replace(W,""),e()):f()}}function n(a){function b(a){function b(){f&&(g.push(f),f="")}function c(){g[0]&&(h.push(g),g=[])}for(var e,f="",g=[],h=[],i=0,j=0,k=!1;;){if(e=a.charAt(j),""===e)return b(),c(),h;if(k){if("*"===e&&"/"===a[j+1]){k=!1,j+=2,b();continue}j+=1}else{if(d(e)){if(a.charAt(j-1)&&d(a.charAt(j-1))||!f){j+=1;continue}if(0===i){b(),j+=1;continue}e=" "}else if("("===e)i+=1;else if(")"===e)i-=1;else{if(","===e){b(),c(),j+=1;continue}if("/"===e&&"*"===a.charAt(j+1)){k=!0,j+=2;continue}}f+=e,j+=1}}}function c(a){return k.test(a)&&parseFloat(a)>=0?!0:l.test(a)?!0:"0"===a||"-0"===a||"+0"===a?!0:!1}var e,f,g,h,i,j,k=/^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,l=/^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;for(f=b(a),g=f.length,e=0;g>e;e++)if(h=f[e],i=h[h.length-1],c(i)){if(j=i,h.pop(),0===h.length)return j;if(h=h.join(" "),s.matchesMedia(h))return j}return"100vw"}b.createElement("picture");var o,p,q,r,s={},t=!1,u=function(){},v=b.createElement("img"),w=v.getAttribute,x=v.setAttribute,y=v.removeAttribute,z=b.documentElement,A={},B={algorithm:""},C="data-pfsrc",D=C+"set",E=navigator.userAgent,F=/rident/.test(E)||/ecko/.test(E)&&E.match(/rv\:(\d+)/)&&RegExp.$1>35,G="currentSrc",H=/\s+\+?\d+(e\d+)?w/,I=/(\([^)]+\))?\s*(.+)/,J=a.picturefillCFG,K="position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",L="font-size:100%!important;",M=!0,N={},O={},P=a.devicePixelRatio,Q={px:1,"in":96},R=b.createElement("a"),S=!1,T=/^[ \t\n\r\u000c]+/,U=/^[, \t\n\r\u000c]+/,V=/^[^ \t\n\r\u000c]+/,W=/[,]+$/,X=/^\d+$/,Y=/^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,Z=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d||!1):a.attachEvent&&a.attachEvent("on"+b,c)},$=function(a){var b={};return function(c){return c in b||(b[c]=a(c)),b[c]}},_=function(){var a=/^([\d\.]+)(em|vw|px)$/,b=function(){for(var a=arguments,b=0,c=a[0];++b in a;)c=c.replace(a[b],a[++b]);return c},c=$(function(a){return"return "+b((a||"").toLowerCase(),/\band\b/g,"&&",/,/g,"||",/min-([a-z-\s]+):/g,"e.$1>=",/max-([a-z-\s]+):/g,"e.$1<=",/calc([^)]+)/g,"($1)",/(\d+[\.]*[\d]*)([a-z]+)/g,"($1 * e.$2)",/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,"")+";"});return function(b,d){var e;if(!(b in N))if(N[b]=!1,d&&(e=b.match(a)))N[b]=e[1]*Q[e[2]];else try{N[b]=new Function("e",c(b))(Q)}catch(f){}return N[b]}}(),aa=function(a,b){return a.w?(a.cWidth=s.calcListLength(b||"100vw"),a.res=a.w/a.cWidth):a.res=a.d,a},ba=function(a){if(t){var c,d,e,f=a||{};if(f.elements&&1===f.elements.nodeType&&("IMG"===f.elements.nodeName.toUpperCase()?f.elements=[f.elements]:(f.context=f.elements,f.elements=null)),c=f.elements||s.qsa(f.context||b,f.reevaluate||f.reselect?s.sel:s.selShort),e=c.length){for(s.setupRun(f),S=!0,d=0;e>d;d++)s.fillImg(c[d],f);s.teardownRun(f)}}};o=a.console&&console.warn?function(a){console.warn(a)}:u,G in v||(G="src"),A["image/jpeg"]=!0,A["image/gif"]=!0,A["image/png"]=!0,A["image/svg+xml"]=b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"),s.ns=("pf"+(new Date).getTime()).substr(0,9),s.supSrcset="srcset"in v,s.supSizes="sizes"in v,s.supPicture=!!a.HTMLPictureElement,s.supSrcset&&s.supPicture&&!s.supSizes&&!function(a){v.srcset="data:,a",a.src="data:,a",s.supSrcset=v.complete===a.complete,s.supPicture=s.supSrcset&&s.supPicture}(b.createElement("img")),s.supSrcset&&!s.supSizes?!function(){var a="data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==",c="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",d=b.createElement("img"),e=function(){var a=d.width;2===a&&(s.supSizes=!0),q=s.supSrcset&&!s.supSizes,t=!0,setTimeout(ba)};d.onload=e,d.onerror=e,d.setAttribute("sizes","9px"),d.srcset=c+" 1w,"+a+" 9w",d.src=c}():t=!0,s.selShort="picture>img,img[srcset]",s.sel=s.selShort,s.cfg=B,s.DPR=P||1,s.u=Q,s.types=A,s.setSize=u,s.makeUrl=$(function(a){return R.href=a,R.href}),s.qsa=function(a,b){return"querySelector"in a?a.querySelectorAll(b):[]},s.matchesMedia=function(){return a.matchMedia&&(matchMedia("(min-width: 0.1em)")||{}).matches?s.matchesMedia=function(a){return!a||matchMedia(a).matches}:s.matchesMedia=s.mMQ,s.matchesMedia.apply(this,arguments)},s.mMQ=function(a){return a?_(a):!0},s.calcLength=function(a){var b=_(a,!0)||!1;return 0>b&&(b=!1),b},s.supportsType=function(a){return a?A[a]:!0},s.parseSize=$(function(a){var b=(a||"").match(I);return{media:b&&b[1],length:b&&b[2]}}),s.parseSet=function(a){return a.cands||(a.cands=m(a.srcset,a)),a.cands},s.getEmValue=function(){var a;if(!p&&(a=b.body)){var c=b.createElement("div"),d=z.style.cssText,e=a.style.cssText;c.style.cssText=K,z.style.cssText=L,a.style.cssText=L,a.appendChild(c),p=c.offsetWidth,a.removeChild(c),p=parseFloat(p,10),z.style.cssText=d,a.style.cssText=e}return p||16},s.calcListLength=function(a){if(!(a in O)||B.uT){var b=s.calcLength(n(a));O[a]=b?b:Q.width}return O[a]},s.setRes=function(a){var b;if(a){b=s.parseSet(a);for(var c=0,d=b.length;d>c;c++)aa(b[c],a.sizes)}return b},s.setRes.res=aa,s.applySetCandidate=function(a,b){if(a.length){var c,d,e,f,h,k,l,m,n,o=b[s.ns],p=s.DPR;if(k=o.curSrc||b[G],l=o.curCan||j(b,k,a[0].set),l&&l.set===a[0].set&&(n=F&&!b.complete&&l.res-.1>p,n||(l.cached=!0,l.res>=p&&(h=l))),!h)for(a.sort(i),f=a.length,h=a[f-1],d=0;f>d;d++)if(c=a[d],c.res>=p){e=d-1,h=a[e]&&(n||k!==s.makeUrl(c.url))&&g(a[e].res,c.res,p,a[e].cached)?a[e]:c;break}h&&(m=s.makeUrl(h.url),o.curSrc=m,o.curCan=h,m!==k&&s.setSrc(b,h),s.setSize(b))}},s.setSrc=function(a,b){var c;a.src=b.url,"image/svg+xml"===b.set.type&&(c=a.style.width,a.style.width=a.offsetWidth+1+"px",a.offsetWidth+1&&(a.style.width=c))},s.getSet=function(a){var b,c,d,e=!1,f=a[s.ns].sets;for(b=0;b<f.length&&!e;b++)if(c=f[b],c.srcset&&s.matchesMedia(c.media)&&(d=s.supportsType(c.type))){"pending"===d&&(c=d),e=c;break}return e},s.parseSets=function(a,b,d){var e,f,g,h,i=b&&"PICTURE"===b.nodeName.toUpperCase(),j=a[s.ns];(j.src===c||d.src)&&(j.src=w.call(a,"src"),j.src?x.call(a,C,j.src):y.call(a,C)),(j.srcset===c||d.srcset||!s.supSrcset||a.srcset)&&(e=w.call(a,"srcset"),j.srcset=e,h=!0),j.sets=[],i&&(j.pic=!0,l(b,j.sets)),j.srcset?(f={srcset:j.srcset,sizes:w.call(a,"sizes")},j.sets.push(f),g=(q||j.src)&&H.test(j.srcset||""),g||!j.src||k(j.src,f)||f.has1x||(f.srcset+=", "+j.src,f.cands.push({url:j.src,d:1,set:f}))):j.src&&j.sets.push({srcset:j.src,sizes:null}),j.curCan=null,j.curSrc=c,j.supported=!(i||f&&!s.supSrcset||g&&!s.supSizes),h&&s.supSrcset&&!j.supported&&(e?(x.call(a,D,e),a.srcset=""):y.call(a,D)),j.supported&&!j.srcset&&(!j.src&&a.src||a.src!==s.makeUrl(j.src))&&(null===j.src?a.removeAttribute("src"):a.src=j.src),j.parsed=!0},s.fillImg=function(a,b){var c,d=b.reselect||b.reevaluate;a[s.ns]||(a[s.ns]={}),c=a[s.ns],(d||c.evaled!==r)&&((!c.parsed||b.reevaluate)&&s.parseSets(a,a.parentNode,b),c.supported?c.evaled=r:h(a))},s.setupRun=function(){(!S||M||P!==a.devicePixelRatio)&&f()},s.supPicture?(ba=u,s.fillImg=u):!function(){var c,d=a.attachEvent?/d$|^c/:/d$|^c|^i/,e=function(){var a=b.readyState||"";f=setTimeout(e,"loading"===a?200:999),b.body&&(s.fillImgs(),c=c||d.test(a),c&&clearTimeout(f))},f=setTimeout(e,b.body?9:99),g=function(a,b){var c,d,e=function(){var f=new Date-d;b>f?c=setTimeout(e,b-f):(c=null,a())};return function(){d=new Date,c||(c=setTimeout(e,b))}},h=z.clientHeight,i=function(){M=Math.max(a.innerWidth||0,z.clientWidth)!==Q.width||z.clientHeight!==h,h=z.clientHeight,M&&s.fillImgs()};Z(a,"resize",g(i,99)),Z(b,"readystatechange",e)}(),s.picturefill=ba,s.fillImgs=ba,s.teardownRun=u,ba._=s,a.picturefillCFG={pf:s,push:function(a){var b=a.shift();"function"==typeof s[b]?s[b].apply(s,a):(B[b]=a[0],S&&s.fillImgs({reselect:!0}))}};for(;J&&J.length;)a.picturefillCFG.push(J.shift());a.picturefill=ba,"object"==typeof module&&"object"==typeof module.exports?module.exports=ba:"function"==typeof define&&define.amd&&define("picturefill",function(){return ba}),s.supPicture||(A["image/webp"]=e("image/webp","data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="))}(window,document);
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
!function(e,t){if("object"==typeof exports&&exports)t(exports);else{var n={};t(n),"function"==typeof define&&define.amd?define(n):e.Mustache=n}}(this,function(e){function t(e,t){return f.call(e,t)}function n(e){return!t(d,e)}function r(e){return"function"==typeof e}function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function o(e){return String(e).replace(/[&<>"'\/]/g,function(e){return y[e]})}function s(e){if(!g(e)||2!==e.length)throw new Error("Invalid tags: "+e);return[new RegExp(i(e[0])+"\\s*"),new RegExp("\\s*"+i(e[1]))]}function a(t,r){function o(){if(C&&!E)for(;k.length;)delete _[k.pop()];else k=[];C=!1,E=!1}r=r||e.tags,t=t||"","string"==typeof r&&(r=r.split(b));for(var a,p,h,f,d,m,g=s(r),y=new c(t),T=[],_=[],k=[],C=!1,E=!1;!y.eos();){if(a=y.pos,h=y.scanUntil(g[0]))for(var A=0,N=h.length;N>A;++A)f=h.charAt(A),n(f)?k.push(_.length):E=!0,_.push(["text",f,a,a+1]),a+=1,"\n"===f&&o();if(!y.scan(g[0]))break;if(C=!0,p=y.scan(S)||"name",y.scan(v),"="===p?(h=y.scanUntil(x),y.scan(x),y.scanUntil(g[1])):"{"===p?(h=y.scanUntil(new RegExp("\\s*"+i("}"+r[1]))),y.scan(w),y.scanUntil(g[1]),p="&"):h=y.scanUntil(g[1]),!y.scan(g[1]))throw new Error("Unclosed tag at "+y.pos);if(d=[p,h,a,y.pos],_.push(d),"#"===p||"^"===p)T.push(d);else if("/"===p){if(m=T.pop(),!m)throw new Error('Unopened section "'+h+'" at '+a);if(m[1]!==h)throw new Error('Unclosed section "'+m[1]+'" at '+a)}else"name"===p||"{"===p||"&"===p?E=!0:"="===p&&(g=s(r=h.split(b)))}if(m=T.pop())throw new Error('Unclosed section "'+m[1]+'" at '+y.pos);return l(u(_))}function u(e){for(var t,n,r=[],i=0,o=e.length;o>i;++i)t=e[i],t&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(r.push(t),n=t));return r}function l(e){for(var t,n,r=[],i=r,o=[],s=0,a=e.length;a>s;++s)switch(t=e[s],t[0]){case"#":case"^":i.push(t),o.push(t),i=t[4]=[];break;case"/":n=o.pop(),n[5]=t[2],i=o.length>0?o[o.length-1][4]:r;break;default:i.push(t)}return r}function c(e){this.string=e,this.tail=e,this.pos=0}function p(e,t){this.view=null==e?{}:e,this.cache={".":this.view},this.parent=t}function h(){this.cache={}}var f=RegExp.prototype.test,d=/\S/,m=Object.prototype.toString,g=Array.isArray||function(e){return"[object Array]"===m.call(e)},y={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},v=/\s*/,b=/\s+/,x=/\s*=/,w=/\s*\}/,S=/#|\^|\/|>|\{|&|=|!/;c.prototype.eos=function(){return""===this.tail},c.prototype.scan=function(e){var t=this.tail.match(e);if(t&&0===t.index){var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n}return""},c.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},p.prototype.push=function(e){return new p(e,this)},p.prototype.lookup=function(e){var t;if(e in this.cache)t=this.cache[e];else{for(var n=this;n;){if(e.indexOf(".")>0){t=n.view;for(var i=e.split("."),o=0;null!=t&&o<i.length;)t=t[i[o++]]}else t=n.view[e];if(null!=t)break;n=n.parent}this.cache[e]=t}return r(t)&&(t=t.call(this.view)),t},h.prototype.clearCache=function(){this.cache={}},h.prototype.parse=function(e,t){var n=this.cache,r=n[e];return null==r&&(r=n[e]=a(e,t)),r},h.prototype.render=function(e,t,n){var r=this.parse(e),i=t instanceof p?t:new p(t);return this.renderTokens(r,i,n,e)},h.prototype.renderTokens=function(t,n,i,o){function s(e){return c.render(e,n,i)}for(var a,u,l="",c=this,p=0,h=t.length;h>p;++p)switch(a=t[p],a[0]){case"#":if(u=n.lookup(a[1]),!u)continue;if(g(u))for(var f=0,d=u.length;d>f;++f)l+=this.renderTokens(a[4],n.push(u[f]),i,o);else if("object"==typeof u||"string"==typeof u)l+=this.renderTokens(a[4],n.push(u),i,o);else if(r(u)){if("string"!=typeof o)throw new Error("Cannot use higher-order sections without the original template");u=u.call(n.view,o.slice(a[3],a[5]),s),null!=u&&(l+=u)}else l+=this.renderTokens(a[4],n,i,o);break;case"^":u=n.lookup(a[1]),(!u||g(u)&&0===u.length)&&(l+=this.renderTokens(a[4],n,i,o));break;case">":if(!i)continue;u=r(i)?i(a[1]):i[a[1]],null!=u&&(l+=this.renderTokens(this.parse(u),n,i,u));break;case"&":u=n.lookup(a[1]),null!=u&&(l+=u);break;case"name":u=n.lookup(a[1]),null!=u&&(l+=e.escape(u));break;case"text":l+=a[1]}return l},e.name="mustache.js",e.version="0.8.1",e.tags=["{{","}}"];var T=new h;e.clearCache=function(){return T.clearCache()},e.parse=function(e,t){return T.parse(e,t)},e.render=function(e,t,n){return T.render(e,t,n)},e.to_html=function(t,n,i,o){var s=e.render(t,n,i);return r(o)?void o(s):s},e.escape=o,e.Scanner=c,e.Context=p,e.Writer=h});var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,r=function(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e};return function(i,o,s){var a=dateFormat;if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(i)||/\d/.test(i)||(o=i,i=void 0),i=i?new Date(i):new Date,isNaN(i))throw SyntaxError("invalid date");o=String(a.masks[o]||o||a.masks["default"]),"UTC:"==o.slice(0,4)&&(o=o.slice(4),s=!0);var u=s?"getUTC":"get",l=i[u+"Date"](),c=i[u+"Day"](),p=i[u+"Month"](),h=i[u+"FullYear"](),f=i[u+"Hours"](),d=i[u+"Minutes"](),m=i[u+"Seconds"](),g=i[u+"Milliseconds"](),y=s?0:i.getTimezoneOffset(),v={d:l,dd:r(l),ddd:a.i18n.dayNames[c],dddd:a.i18n.dayNames[c+7],m:p+1,mm:r(p+1),mmm:a.i18n.monthNames[p],mmmm:a.i18n.monthNames[p+12],yy:String(h).slice(2),yyyy:h,h:f%12||12,hh:r(f%12||12),H:f,HH:r(f),M:d,MM:r(d),s:m,ss:r(m),l:r(g,3),L:r(g>99?Math.round(g/10):g),t:12>f?"a":"p",tt:12>f?"am":"pm",T:12>f?"A":"P",TT:12>f?"AM":"PM",Z:s?"UTC":(String(i).match(t)||[""]).pop().replace(n,""),o:(y>0?"-":"+")+r(100*Math.floor(Math.abs(y)/60)+Math.abs(y)%60,4),S:["th","st","nd","rd"][l%10>3?0:(l%100-l%10!=10)*l%10]};return o.replace(e,function(e){return e in v?v[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"},dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},Date.prototype.format=function(e,t){return dateFormat(this,e,t)},/*!
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
var lunr=function(e){var t=new lunr.Index;return t.pipeline.add(lunr.stopWordFilter,lunr.stemmer),e&&e.call(t,t),t};lunr.version="0.4.5","undefined"!=typeof module&&(module.exports=lunr),lunr.utils={},lunr.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),lunr.utils.zeroFillArray=function(){var e=[0];return function(t){for(;t>e.length;)e=e.concat(e);return e.slice(0,t)}}(),lunr.EventEmitter=function(){this.events={}},lunr.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),n=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");n.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},lunr.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var n=this.events[e].indexOf(t);this.events[e].splice(n,1),this.events[e].length||delete this.events[e]}},lunr.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)})}},lunr.EventEmitter.prototype.hasHandler=function(e){return e in this.events},lunr.tokenizer=function(e){if(!arguments.length||null==e||void 0==e)return[];if(Array.isArray(e))return e.map(function(e){return e.toLowerCase()});for(var t=(""+e).replace(/^\s+/,""),n=t.length-1;n>=0;n--)if(/\S/.test(t.charAt(n))){t=t.substring(0,n+1);break}return t.split(/\s+/).map(function(e){return e.replace(/^\W+/,"").replace(/\W+$/,"").toLowerCase()})},lunr.Pipeline=function(){this._stack=[]},lunr.Pipeline.registeredFunctions={},lunr.Pipeline.registerFunction=function(e,t){t in this.registeredFunctions&&lunr.utils.warn("Overwriting existing registered function: "+t),e.label=t,lunr.Pipeline.registeredFunctions[e.label]=e},lunr.Pipeline.warnIfFunctionNotRegistered=function(e){var t=e.label&&e.label in this.registeredFunctions;t||lunr.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},lunr.Pipeline.load=function(e){var t=new lunr.Pipeline;return e.forEach(function(e){var n=lunr.Pipeline.registeredFunctions[e];if(!n)throw Error("Cannot load un-registered function: "+e);t.add(n)}),t},lunr.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){lunr.Pipeline.warnIfFunctionNotRegistered(e),this._stack.push(e)},this)},lunr.Pipeline.prototype.after=function(e,t){lunr.Pipeline.warnIfFunctionNotRegistered(t);var n=this._stack.indexOf(e)+1;this._stack.splice(n,0,t)},lunr.Pipeline.prototype.before=function(e,t){lunr.Pipeline.warnIfFunctionNotRegistered(t);var n=this._stack.indexOf(e);this._stack.splice(n,0,t)},lunr.Pipeline.prototype.remove=function(e){var t=this._stack.indexOf(e);this._stack.splice(t,1)},lunr.Pipeline.prototype.run=function(e){for(var t=[],n=e.length,r=this._stack.length,i=0;n>i;i++){for(var o=e[i],s=0;r>s&&(o=this._stack[s](o,i,e),void 0!==o);s++);void 0!==o&&t.push(o)}return t},lunr.Pipeline.prototype.toJSON=function(){return this._stack.map(function(e){return lunr.Pipeline.warnIfFunctionNotRegistered(e),e.label})},lunr.Vector=function(e){this.elements=e},lunr.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude;for(var e,t=0,n=this.elements,r=n.length,i=0;r>i;i++)e=n[i],t+=e*e;return this._magnitude=Math.sqrt(t)},lunr.Vector.prototype.dot=function(e){for(var t=this.elements,n=e.elements,r=t.length,i=0,o=0;r>o;o++)i+=t[o]*n[o];return i},lunr.Vector.prototype.similarity=function(e){return this.dot(e)/(this.magnitude()*e.magnitude())},lunr.Vector.prototype.toArray=function(){return this.elements},lunr.SortedSet=function(){this.length=0,this.elements=[]},lunr.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},lunr.SortedSet.prototype.add=function(){Array.prototype.slice.call(arguments).forEach(function(e){~this.indexOf(e)||this.elements.splice(this.locationFor(e),0,e)},this),this.length=this.elements.length},lunr.SortedSet.prototype.toArray=function(){return this.elements.slice()},lunr.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},lunr.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},lunr.SortedSet.prototype.indexOf=function(e,t,n){var t=t||0,n=n||this.elements.length,r=n-t,i=t+Math.floor(r/2),o=this.elements[i];return 1>=r?o===e?i:-1:e>o?this.indexOf(e,i,n):o>e?this.indexOf(e,t,i):o===e?i:void 0},lunr.SortedSet.prototype.locationFor=function(e,t,n){var t=t||0,n=n||this.elements.length,r=n-t,i=t+Math.floor(r/2),o=this.elements[i];if(1>=r){if(o>e)return i;if(e>o)return i+1}return e>o?this.locationFor(e,i,n):o>e?this.locationFor(e,t,i):void 0},lunr.SortedSet.prototype.intersect=function(e){for(var t=new lunr.SortedSet,n=0,r=0,i=this.length,o=e.length,s=this.elements,a=e.elements;!(n>i-1||r>o-1);)s[n]!==a[r]?s[n]<a[r]?n++:s[n]>a[r]&&r++:(t.add(s[n]),n++,r++);return t},lunr.SortedSet.prototype.clone=function(){var e=new lunr.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},lunr.SortedSet.prototype.union=function(e){var t,n,r;return this.length>=e.length?(t=this,n=e):(t=e,n=this),r=t.clone(),r.add.apply(r,n.toArray()),r},lunr.SortedSet.prototype.toJSON=function(){return this.toArray()},lunr.Index=function(){this._fields=[],this._ref="id",this.pipeline=new lunr.Pipeline,this.documentStore=new lunr.Store,this.tokenStore=new lunr.TokenStore,this.corpusTokens=new lunr.SortedSet,this.eventEmitter=new lunr.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},lunr.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},lunr.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},lunr.Index.load=function(e){e.version!==lunr.version&&lunr.utils.warn("version mismatch: current "+lunr.version+" importing "+e.version);var t=new this;return t._fields=e.fields,t._ref=e.ref,t.documentStore=lunr.Store.load(e.documentStore),t.tokenStore=lunr.TokenStore.load(e.tokenStore),t.corpusTokens=lunr.SortedSet.load(e.corpusTokens),t.pipeline=lunr.Pipeline.load(e.pipeline),t},lunr.Index.prototype.field=function(e,t){var t=t||{},n={name:e,boost:t.boost||1};return this._fields.push(n),this},lunr.Index.prototype.ref=function(e){return this._ref=e,this},lunr.Index.prototype.add=function(e,t){var n={},r=new lunr.SortedSet,i=e[this._ref],t=void 0===t?!0:t;this._fields.forEach(function(t){var i=this.pipeline.run(lunr.tokenizer(e[t.name]));n[t.name]=i,lunr.SortedSet.prototype.add.apply(r,i)},this),this.documentStore.set(i,r),lunr.SortedSet.prototype.add.apply(this.corpusTokens,r.toArray());for(var o=0;r.length>o;o++){var s=r.elements[o],a=this._fields.reduce(function(e,t){var r=n[t.name].length;if(!r)return e;var i=n[t.name].filter(function(e){return e===s}).length;return e+i/r*t.boost},0);this.tokenStore.add(s,{ref:i,tf:a})}t&&this.eventEmitter.emit("add",e,this)},lunr.Index.prototype.remove=function(e,t){var n=e[this._ref],t=void 0===t?!0:t;if(this.documentStore.has(n)){var r=this.documentStore.get(n);this.documentStore.remove(n),r.forEach(function(e){this.tokenStore.remove(e,n)},this),t&&this.eventEmitter.emit("remove",e,this)}},lunr.Index.prototype.update=function(e,t){var t=void 0===t?!0:t;this.remove(e,!1),this.add(e,!1),t&&this.eventEmitter.emit("update",e,this)},lunr.Index.prototype.idf=function(e){var t="@"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,t))return this._idfCache[t];var n=this.tokenStore.count(e),r=1;return n>0&&(r=1+Math.log(this.tokenStore.length/n)),this._idfCache[t]=r},lunr.Index.prototype.search=function(e){var t=this.pipeline.run(lunr.tokenizer(e)),n=lunr.utils.zeroFillArray(this.corpusTokens.length),r=[],i=this._fields.reduce(function(e,t){return e+t.boost},0),o=t.some(function(e){return this.tokenStore.has(e)},this);if(!o)return[];t.forEach(function(e,t,o){var s=1/o.length*this._fields.length*i,a=this,u=this.tokenStore.expand(e).reduce(function(t,r){var i=a.corpusTokens.indexOf(r),o=a.idf(r),u=1,l=new lunr.SortedSet;if(r!==e){var c=Math.max(3,r.length-e.length);u=1/Math.log(c)}return i>-1&&(n[i]=s*o*u),Object.keys(a.tokenStore.get(r)).forEach(function(e){l.add(e)}),t.union(l)},new lunr.SortedSet);r.push(u)},this);var s=r.reduce(function(e,t){return e.intersect(t)}),a=new lunr.Vector(n);return s.map(function(e){return{ref:e,score:a.similarity(this.documentVector(e))}},this).sort(function(e,t){return t.score-e.score})},lunr.Index.prototype.documentVector=function(e){for(var t=this.documentStore.get(e),n=t.length,r=lunr.utils.zeroFillArray(this.corpusTokens.length),i=0;n>i;i++){var o=t.elements[i],s=this.tokenStore.get(o)[e].tf,a=this.idf(o);r[this.corpusTokens.indexOf(o)]=s*a}return new lunr.Vector(r)},lunr.Index.prototype.toJSON=function(){return{version:lunr.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),tokenStore:this.tokenStore.toJSON(),corpusTokens:this.corpusTokens.toJSON(),pipeline:this.pipeline.toJSON()}},lunr.Store=function(){this.store={},this.length=0},lunr.Store.load=function(e){var t=new this;return t.length=e.length,t.store=Object.keys(e.store).reduce(function(t,n){return t[n]=lunr.SortedSet.load(e.store[n]),t},{}),t},lunr.Store.prototype.set=function(e,t){this.store[e]=t,this.length=Object.keys(this.store).length},lunr.Store.prototype.get=function(e){return this.store[e]},lunr.Store.prototype.has=function(e){return e in this.store},lunr.Store.prototype.remove=function(e){this.has(e)&&(delete this.store[e],this.length--)},lunr.Store.prototype.toJSON=function(){return{store:this.store,length:this.length}},lunr.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",r="[aeiouy]",i=n+"[^aeiouy]*",o=r+"[aeiou]*",s="^("+i+")?"+o+i,a="^("+i+")?"+o+i+"("+o+")?$",u="^("+i+")?"+o+i+o+i,l="^("+i+")?"+r;return function(n){var o,c,p,h,f,d,m;if(3>n.length)return n;if(p=n.substr(0,1),"y"==p&&(n=p.toUpperCase()+n.substr(1)),h=/^(.+?)(ss|i)es$/,f=/^(.+?)([^s])s$/,h.test(n)?n=n.replace(h,"$1$2"):f.test(n)&&(n=n.replace(f,"$1$2")),h=/^(.+?)eed$/,f=/^(.+?)(ed|ing)$/,h.test(n)){var g=h.exec(n);h=RegExp(s),h.test(g[1])&&(h=/.$/,n=n.replace(h,""))}else if(f.test(n)){var g=f.exec(n);o=g[1],f=RegExp(l),f.test(o)&&(n=o,f=/(at|bl|iz)$/,d=RegExp("([^aeiouylsz])\\1$"),m=RegExp("^"+i+r+"[^aeiouwxy]$"),f.test(n)?n+="e":d.test(n)?(h=/.$/,n=n.replace(h,"")):m.test(n)&&(n+="e"))}if(h=/^(.+?)y$/,h.test(n)){var g=h.exec(n);o=g[1],h=RegExp(l),h.test(o)&&(n=o+"i")}if(h=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,h.test(n)){var g=h.exec(n);o=g[1],c=g[2],h=RegExp(s),h.test(o)&&(n=o+e[c])}if(h=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,h.test(n)){var g=h.exec(n);o=g[1],c=g[2],h=RegExp(s),h.test(o)&&(n=o+t[c])}if(h=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,f=/^(.+?)(s|t)(ion)$/,h.test(n)){var g=h.exec(n);o=g[1],h=RegExp(u),h.test(o)&&(n=o)}else if(f.test(n)){var g=f.exec(n);o=g[1]+g[2],f=RegExp(u),f.test(o)&&(n=o)}if(h=/^(.+?)e$/,h.test(n)){var g=h.exec(n);o=g[1],h=RegExp(u),f=RegExp(a),d=RegExp("^"+i+r+"[^aeiouwxy]$"),(h.test(o)||f.test(o)&&!d.test(o))&&(n=o)}return h=/ll$/,f=RegExp(u),h.test(n)&&f.test(n)&&(h=/.$/,n=n.replace(h,"")),"y"==p&&(n=p.toLowerCase()+n.substr(1)),n}}(),lunr.Pipeline.registerFunction(lunr.stemmer,"stemmer"),lunr.stopWordFilter=function(e){return-1===lunr.stopWordFilter.stopWords.indexOf(e)?e:void 0},lunr.stopWordFilter.stopWords=new lunr.SortedSet,lunr.stopWordFilter.stopWords.length=119,lunr.stopWordFilter.stopWords.elements=["","a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"],lunr.Pipeline.registerFunction(lunr.stopWordFilter,"stopWordFilter"),lunr.TokenStore=function(){this.root={docs:{}},this.length=0},lunr.TokenStore.load=function(e){var t=new this;return t.root=e.root,t.length=e.length,t},lunr.TokenStore.prototype.add=function(e,t,n){var n=n||this.root,r=e[0],i=e.slice(1);return r in n||(n[r]={docs:{}}),0===i.length?(n[r].docs[t.ref]=t,void(this.length+=1)):this.add(i,t,n[r])},lunr.TokenStore.prototype.has=function(e){if(!e)return!1;for(var t=this.root,n=0;e.length>n;n++){if(!t[e[n]])return!1;t=t[e[n]]}return!0},lunr.TokenStore.prototype.getNode=function(e){if(!e)return{};for(var t=this.root,n=0;e.length>n;n++){if(!t[e[n]])return{};t=t[e[n]]}return t},lunr.TokenStore.prototype.get=function(e,t){return this.getNode(e,t).docs||{}},lunr.TokenStore.prototype.count=function(e,t){return Object.keys(this.get(e,t)).length},lunr.TokenStore.prototype.remove=function(e,t){if(e){for(var n=this.root,r=0;e.length>r;r++){if(!(e[r]in n))return;n=n[e[r]]}delete n.docs[t]}},lunr.TokenStore.prototype.expand=function(e,t){var n=this.getNode(e),r=n.docs||{},t=t||[];return Object.keys(r).length&&t.push(e),Object.keys(n).forEach(function(n){"docs"!==n&&t.concat(this.expand(e+n,t))},this),t},lunr.TokenStore.prototype.toJSON=function(){return{root:this.root,length:this.length}},function(e){var t=function(e){var t,n=Array.prototype.slice;return function(){var r=n.call(arguments),i=this;clearTimeout(t),t=setTimeout(function(){e.apply(i,r)},100)}},n=function(e){var t=e.match(/(\d+)/g);return new Date(t[0],t[1]-1,t[2])},r=function(){function r(t,n){this.$elem=t,this.$results=e(n.results),this.$entries=e(n.entries,this.$results),this.indexDataUrl=n.indexUrl,this.template=this.compileTemplate(e(n.template)),this.emptyMsg=n.emptyMsg,this.initialize()}return r.prototype.initialize=function(){var t=this;this.loadIndexData(function(n){t.entries=e.map(n.docs,t.createEntry),t.index=lunr.Index.load(n.index),t.populateSearchFromQuery(),t.bindKeypress()})},r.prototype.compileTemplate=function(e){var t=e.text();return Mustache.parse(t),function(e,n){return Mustache.render(t,e,n)}},r.prototype.loadIndexData=function(t){e.getJSON(this.indexDataUrl,t)},r.prototype.createEntry=function(t,r){var i=e.extend({id:r+1},t);return t.date&&e.extend(i,{date:n(t.date),pubdate:function(){return dateFormat(n(t.date),"yyyy-mm-dd")},displaydate:function(){return dateFormat(n(t.date),"mmm dd, yyyy")}}),i},r.prototype.bindKeypress=function(){var e=this,n=this.$elem.val();this.$elem.bind("keyup",t(function(){var t=e.$elem.val();t!==n&&e.search(t),n=t}))},r.prototype.search=function(t){var n=this.entries;if(t.length<3)this.$results.hide(),this.$entries.empty();else{var r=e.map(this.index.search(t),function(t){return e.grep(n,function(e){return e.id===parseInt(t.ref,10)})[0]});this.displayResults(r)}},r.prototype.displayResults=function(e){var t=this.$entries,n=this.$results;t.empty(),t.append(0===e.length?"<p>"+this.emptyMsg+"</p>":this.template({entries:e})),n.show()},r.prototype.populateSearchFromQuery=function(){var e=new URI(window.location.search.toString()),t=e.search(!0);t.hasOwnProperty("q")&&(this.$elem.val(t.q),this.search(t.q.toString()))},r}();e.fn.lunrSearch=function(t){return t=e.extend({},e.fn.lunrSearch.defaults,t),new r(this,t),this},e.fn.lunrSearch.defaults={indexUrl:"/js/index.json",results:"#search-results",entries:".entries",template:"#search-results-template",emptyMsg:"Sorry, no help articles could be found."}}(jQuery);
//# sourceMappingURL=search.js.map
var $help = $('[data-object="help.contact_us"]');

$help.on('change', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help.contact_us"]'),
    behavior = $el.attr('data-behavior'),
    selected_id = $el.val(),
    $target = $object.find('#' + $el.attr('aria-controls'));

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, selected_id: selected_id, target: $target });
  });
});

$help.on('help.open', function(event, opts) {
  var $send_button = $('#btn-send'),
    $all_topics = opts.target.find('.usajobs-help-topic'),
    $target_topics = opts.target.find('.' + opts.selected_id);

  event.preventDefault();

  if (opts.selected_id !== '0') {
    $send_button.removeAttr('disabled');
    opts.target.attr('aria-hidden', 'false');
    $all_topics.attr('aria-hidden', 'true');
    $target_topics.attr('aria-hidden', 'false');
  } else {
    $send_button.attr('disabled', 'disabled');
    opts.target.attr('aria-hidden', 'true');
    $all_topics.attr('aria-hidden', 'true');
  }

  // Show optional fields for login/password
  if (opts.selected_id === 'sign-in-password') {
    opts.object.find('#contactOptionalData').attr('aria-hidden', 'false');
  } else {
    opts.object.find('#contactOptionalData').attr('aria-hidden', 'true');
  }
});

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// 18F glossary
var Glossary = require('glossary-panel'),
  terms = require('./terms.json'),
  $glossary = $('#glossary');

if ($glossary !== undefined && $glossary.length > 0) {
  new Glossary(terms);
}

},{"./terms.json":2,"glossary-panel":6}],2:[function(require,module,exports){
module.exports=[
  {
    "term": "ACTIVE DUTY OR ACTIVE MILITARY DUTY",
    "definition": "Means full-time duty with military pay and allowances in the Armed Forces. Active duty does include 'annual' active duty for training, but excludes weekend Reserve meetings."
  },
  {
    "term": "ADJUSTED BASIC PAY",
    "definition": "The maximum adjusted rate of basic pay after taking into account all pay caps that may be applicable."
  },
  {
    "term": "ADVERSE ACTION",
    "definition": "A personnel action considered unfavorable to an employee, e.g., removal, suspension, furlough, or reduction in grade or pay."
  },
  {
    "term": "AGENCY",
    "definition": "Any department or independent establishment of the Federal Government, including a Government-owned or controlled corporation, that has the authority to hire employees in the competitive, excepted, and senior executive service."
  },
  {
    "term": "ANNUITANT",
    "definition": "A person who has retired from federal civilian service and now receives an annuity."
  },
  {
    "term": "APPLICANT",
    "definition": "A person who has asked to be considered for a job with an agency. An applicant may be a current employee of the agency, an employee of another agency, or a person who is not currently employed by any agency."
  },
  {
    "term": "APPLICATION",
    "definition": "Résumé or form(s) and supporting documents that demonstrates an applicant's qualifications for employment."
  },
  {
    "term": "APPOINTEE",
    "definition": "A person being hired for a position in an agency."
  },
  {
    "term": "APPOINTING OFFICER",
    "definition": "A person having power by law, or by duly delegated authority, to make appointments (i.e. hire applicants)."
  },
  {
    "term": "APPOINTMENT",
    "definition": "Any personnel action that brings an individual onto the rolls (staff) of an agency."
  },
  {
    "term": "AREA OF CONSIDERATION (who may apply or who may be considered)",
    "definition": "The group from which an agency will accept applications for its vacancy. (e.g., all sources, all U.S. Citizens, status candidates). It may be a broad or a limited group of individuals."
  },
  {
    "term": "ARMED FORCES",
    "definition": "The Army, Navy, Air Force, Marine Corps and Coast Guard."
  },
  {
    "term": "AVAILABILITY PAY",
    "definition": "A special form of premium pay fixed at 25 percent of basic pay (including locality pay) that applies to criminal investigators who are required to work, or be available to work, substantial amounts of unscheduled overtime duty based on the needs of the employing agency. Criminal investigators receiving availability pay are exempt from the minimum wage and overtime pay provisions of the Fair Labor Standards Act and may not receive administratively uncontrollable overtime pay."
  },
  {
    "term": "BREAK IN SERVICE",
    "definition": "The time when an employee is no longer on the payroll of an agency. (In computing creditable service for benefits, e.g., leave accrual and reduction in force retention, a separation of 1, 2, or 3 calendar days is not considered to be a break in service; a separation of 4 or more calendar days is considered to be a break in service and the days of separation are subtracted from the employee's total creditable service.)"
  },
  {
    "term": "CAREER APPOINTMENT",
    "definition": "Competitive service permanent appointment given to an employee who has completed 3 substantially continuous, creditable years of Federal service. In special cases (such as Administrative Law Judges), career appointment may be given to a person at the time he or she is hired from a civil service register.(See 'SUBSTANTIALLY CONTINUOUS SERVICE' and 'CREDITABLE SERVICE.')"
  },
  {
    "term": "CERTIFICATE of Eligibles (also called Referral List)",
    "definition": "A list of the highest-ranked eligibles in score and veterans’ preference order,  submitted to a hiring manager or appointing officer for employment consideration."
  },
  {
    "term": "CHANGE TO LOWER GRADE (also called 'Demotion' and 'Reduction in Grade')",
    "definition": "Personnel action that moves an employee, while serving continuously in the same agency, to (1) a position at a lower grade when both the old and new positions are under the General Schedule or under the same type graded wage schedule, or (2) to a position with a lower rate of basic pay when both the old and the new positions are under the same type ungraded wage schedule or in a different pay-method category."
  },
  {
    "term": "CIVILIAN POSITION",
    "definition": "A civilian office or position (including a temporary, part-time or intermittent position), appointive or elective, in the legislative, executive, or judicial branch of the Federal Government (including each corporation owned or controlled by the Federal Government and including non-appropriated fund instrumentalities under the jurisdiction of the Armed Forces) or in the Government of the District of Columbia."
  },
  {
    "term": "CIVILIAN RETIREE",
    "definition": "A person who has retired from Federal Government civilian employment under any Federal Government-administered retirement system. The social security system (FICA) is not a retirement system for purposes of this definition."
  },
  {
    "term": "CIVIL SERVICE RETIREE",
    "definition": "A person retired under the Civil Service Retirement System (CSRS)."
  },
  {
    "term": "CLASSIFY",
    "definition": "To evaluate the duties and responsibilities of a position and assign a title, occupation series and grade."
  },
  {
    "term": "COMPETITIVE POSITION",
    "definition": "A position in the competitive service."
  },
  {
    "term": "COMPETITIVE SERVICE",
    "definition": "All civilian positions in the Federal Government that are not specifically excepted from the civil service laws by or pursuant to statute, by the President, or by the Office of Personnel Management (OPM) under Rule VI (5 Code of Federal Regulations Part 6), and that are not in the Senior Executive Service."
  },
  {
    "term": "COMPETITIVE STATUS",
    "definition": "Competitive status is a person's basic eligibility for assignment (e.g., by transfer, promotion, reassignment, demotion, or reinstatement) to a position in the competitive service without having to compete with members of the general public in an open competitive examination. When a vacancy announcement indicates that status candidates are eligible to apply, career employees and career-conditional employees who have served at least 90 days after competitive appointment may apply. Once acquired, status belongs to the individual, not to a position."
  },
  {
    "term": "CONTINUANCE",
    "definition": "The personnel action used to document that an employee has received a waiver from mandatory retirement or the extension of the not-to-exceed date of a previous waiver."
  },
  {
    "term": "CREDITABLE MILITARY SERVICE",
    "definition": "The total number of years and months of military service that is creditable for annual leave accrual purposes."
  },
  {
    "term": "CREDITABLE SERVICE",
    "definition": "Federal Government employment (civilian or uniformed service) that meets requirements for a particular type of appointment or benefit, such as leave accrual or reduction in force retention."
  },
  {
    "term": "DELEGATED EXAMINING (DE)",
    "definition": "A hiring authority OPM grants to agencies to fill competitive service positions with applicants without prior Federal service, Federal employees without competitive service status, or those with status. DE appointments are subject to civil service laws and regulations to ensure fair and open competition."
  },
  {
    "term": "DEMOTION",
    "definition": "See CHANGE TO LOWER GRADE"
  },
  {
    "term": "DENIAL OF WITHIN-GRADE INCREASE",
    "definition": "The decision to withhold (not grant) a within-grade increase to a General Schedule employee because of a determination that the employee's performance is not at an acceptable level of competence."
  },
  {
    "term": "DETAIL",
    "definition": "A temporary assignment of an employee to a different position for a specified period, with the employee returning to his or her regular duties at the end of the detail."
  },
  {
    "term": "DIRECT HIRING AUTHORITY",
    "definition": "OPM-approved agency recruiting plans, which expedite recruitment of persons for appointment to positions in shortage occupations."
  },
  {
    "term": "DISABLED VETERAN",
    "definition": "A person who was separated under honorable conditions from active duty in the Armed Forces performed at any time and who has established the present existence of a service-connected disability or is receiving compensation, disability retirement benefits, or pension because of a public statute administered by the Department of Veterans Affairs or a military department."
  },
  {
    "term": "DISPLACED EMPLOYEE",
    "definition": "An employee who is in the competitive service; are in tenure group I (career) or tenure group II (career conditional); and have an official notice from your agency saying you will be separated by reduction in force. This notice could be: a specific reduction in force separation notice; or a notice of proposed removal because you declined a directed reassignment or transfer of function out of the local commuting area. Please note that the definition of a 'displaced' employee can be extended by Agencies to include employees in the excepted service if they are on Schedule A or B appointments without time limit and have received an appropriate notice (see above). Selection priority for these employees is limited to other permanent Schedule A or B positions in the same agency and local commuting area."
  },
  {
    "term": "DUAL COMPENSATION",
    "definition": "Payment for more than one civilian office involving a total of more than 40 hours a week."
  },
  {
    "term": "DUTY STATION",
    "definition": "The city/town, county, and State in which the employee works. For most employees, this will be the location of the employee's work site."
  },
  {
    "term": "EFFECTIVE DATE",
    "definition": "The date on which a personnel action takes place and on which the employee's official assignment begins."
  },
  {
    "term": "EOD (ENTRY ON DUTY)",
    "definition": "The process by which a person completes the necessary paperwork and is sworn in as an employee."
  },
  {
    "term": "EXCEPTED POSITION",
    "definition": "A position in the excepted service."
  },
  {
    "term": "EXCEPTED SERVICE",
    "definition": "Federal or civil service positions not in the competitive service or the Senior Executive Service. Excepted service positions have been excepted from the requirements of the competitive service by law, Executive Order, or OPM regulation. Excepted service agencies set their own qualification requirements and are not subject to the appointment, pay, and classification rules in title 5, United States Code."
  },
  {
    "term": "EXECUTIVE ORDER",
    "definition": "A directive issued by the President."
  },
  {
    "term": "EXPERT",
    "definition": "A person with excellent qualifications and a high degree of attainment in professional, scientific, technical, or other field. An expert's attainment is such that he or she usually is regarded as an authority or as a practitioner of unusual competence and skill by other persons in the profession, occupation, or activity in unskilled, semiskilled or skilled manual labor."
  },
  {
    "term": "EXPERT POSITION",
    "definition": "A position that cannot be satisfactorily performed by someone who is not an expert in that field."
  },
  {
    "term": "EXTENSION",
    "definition": "The continuation of a time-limited appointment (one with a Not to Exceed (NTE) date) up to the maximum time allowed by the authority under which it was affected."
  },
  {
    "term": "FEDERAL GOVERNMENT SERVICE",
    "definition": "The total of all periods of military and civilian Federal service considered for retirement, reduction in force, and leave purposes."
  },
  {
    "term": "FEDERAL MERIT SYSTEM",
    "definition": "A complete system of personnel selection and management based on an integrated set of personnel policies, procedures and practices designed to accomplish three basic objectives: (1) to recruit a competent work force; (2) to insure a stable work force; and (3) to provide equal opportunity for employment."
  },
  {
    "term": "FEDERAL WAGE SYSTEM",
    "definition": "The job-grading and pay system that applies to most trade, craft, and labor positions in agencies subject to 5 United States Code (U.S.C.) 5342. Under this system, pay is adjusted according to the rates paid by private industry for similar jobs in the same area. Included are Federal employees in recognized trade or craft or skilled mechanical crafts, occupations, and other persons, including foremen or supervisors, in positions where trade, craft, or labor experience or knowledge is the main requirement."
  },
  {
    "term": "FERS RETIREE",
    "definition": "A person retired under the Federal Employees Retirement System."
  },
  {
    "term": "FROZEN SERVICE",
    "definition": "The total number of years and months of civilian and military service that is creditable in a Civil Service Retirement System (CSRS) component of a Federal Employees Retirement System (FERS) employee."
  },
  {
    "term": "FULL-TIME WORK SCHEDULE",
    "definition": "A full-time work schedule that requires most employees to work 40 hours during the traditional work week, or 80 hours in a pay period."
  },
  {
    "term": "FURLOUGH",
    "definition": "The placement of an employee in a temporary non-pay status and non-duty status (or absence from duty) because of lack of work or funds, or for other non-disciplinary reasons."
  },
  {
    "term": "GENERAL DISCHARGE",
    "definition": "A discharge granted from the Armed Forces under honorable conditions."
  },
  {
    "term": "GENERAL EXPERIENCE",
    "definition": "A type of work experience that is not necessarily directly related to the position but demonstrates the ability to acquire the particular competencies/knowledge, skills, and abilities to perform the work of the position."
  },
  {
    "term": "GENERAL SCHEDULE",
    "definition": "Federal pay system that covers more than 1.2 million employees; GS was established under the Classification Act of 1949, as amended. Click here to view GS schedule."
  },
  {
    "term": "GRADE",
    "definition": "Rate of basic pay associated with a specific level of work or range of difficulty, responsibility and qualification requirements."
  },
  {
    "term": "GRADE RESTORATION ACTION",
    "definition": "An action taken to restore to an employee the grade held prior to a grade reduction that was effective during the retroactive period of title VIII of the Civil Service Reform Act. The grade restoration action recorded the employee's retained grade in the OPM's data system."
  },
  {
    "term": "GRADE RETENTION ACTION",
    "definition": "An action to retain the grade held by an employee prior to a grade reduction that was effective during the retroactive period of title VIII of the Civil Service Reform Act. The grade retention action documented the employee's step in the retained grade and the rate of basic pay to which he or she was entitled."
  },
  {
    "term": "GRADE RETENTION ENTITLEMENT",
    "definition": "The right of an employee to retain for 2 years, for pay and benefits purposes, the grade of the position from which he or she was reduced."
  },
  {
    "term": "INDEFINITE APPOINTMENT",
    "definition": "An appointment given to a non-permanent employee who is hired for an unlimited period of time."
  },
  {
    "term": "INJURY COMPENSATION",
    "definition": "The compensation and medical care provided to civilian Federal employees for disability due to personal injuries sustained while in performance of duty and due to diseases relating to this employment."
  },
  {
    "term": "INTERMITTENT SERVICE OR INTERMITTENT EMPLOYMENT",
    "definition": "Service when an employee works on less than a full-time basis with no prescheduled tour of duty. In the past, 'WAE' – when actually employed -- was used on personnel documents to identify intermittent service."
  },
  {
    "term": "INVOLUNTARY SEPARATION",
    "definition": "A separation against the will of and without the consent of the employee, other than separation for cause on charges of misconduct or delinquency. Examples include separation based on reduction in force, abolishment of position, expiration of term of office, lack of funds, and unacceptable performance (unless due to the employee's misconduct)."
  },
  {
    "term": "LEAD AGENCY",
    "definition": "Under the Federal Wage System, an agency designated by the OPM to plan and conduct wage surveys, analyze the survey data and determine and issue required wage schedules for a wage area."
  },
  {
    "term": "LEGAL AUTHORITY",
    "definition": "The legal authority is the law, Executive Order, regulation, agency directive, or the instruction under which the personnel action is taken."
  },
  {
    "term": "LEAVE, ANNUAL",
    "definition": "Leave of absence with pay allowed for personal, emergency, and other purposes. With certain exceptions, employees earn or accrue leave at the rate of 13 to 26 working days a year, depending on length of service."
  },
  {
    "term": "LEAVE, MILITARY",
    "definition": "Paid leave provided to Reservists and members of the National Guard under 5 U.S.C. 6323 who serve on active duty. (Military Leave is not available for inactive duty or drills.)"
  },
  {
    "term": "LEAVE, SICK",
    "definition": "Leave of absence with pay allowed for employees when the employee is physically incapacitated for the performance of duties; receives medical, dental, or optical examination or treatment; or is required to give care and attendance to a member of his or her immediate family who is afflicted with a contagious disease. With certain exceptions, all civilian employees of the Federal Government earn sick leave at the rate of 13 working days a year."
  },
  {
    "term": "LEAVE WITH PAY (LWP)",
    "definition": "An absence from duty with pay (in sick leave status) granted at the employee's request following the approval of a disability retirement application, or after application for optional retirement due to disability."
  },
  {
    "term": "LEAVE WITHOUT PAY (LWOP)",
    "definition": "A temporary non-pay status and non-duty status (or absence from a pre-scheduled tour of duty) granted at the employee's request. LWOP-US (formerly called LWOP-MIL) is a nature of action specifically used to document a leave of absence to perform duty with the uniformed services."
  },
  {
    "term": "LOCALITY PAY",
    "definition": "Location-based pay, in addition to an employee’s rate of basic pay, as defined by the <a href=\"https://www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/2017/locality-pay-area-definitions/\">32 locality pay areas</a>. Employees outside the continental United States in non-foreign areas (i.e., Alaska, Hawaii, Puerto Rico, Guam and the U.S. Virgin Islands) do not receive locality pay, but rather receive cost-of-living allowances."
  },
  {
    "term": "MASS TRANSFER",
    "definition": "The movement of an employee with his or her position to a different agency when (1) a transfer of function or an organization change takes place and (2) there is no change in the employee's position, grade, or pay. (Note: for purposes of this definition, a change in the amount of any locality payment to which the employee is entitled is not a change in pay.)"
  },
  {
    "term": "MERIT PROMOTION PROGRAM (MERIT STAFFING PROGRAM)",
    "definition": "The system under which agencies consider an employee for vacant positions on the basis of personal merit. Vacant positions are usually filled through competition with applicants (current competitive service employees) being evaluated and ranked for the position on the basis of their experience, education, competencies and performance."
  },
  {
    "term": "MERIT SYSTEM PRINCIPLES",
    "definition": "Nine basic standards, which are part of the Civil Service Reform Act of 1978, used to govern the management of the executive branch workforce. The Merit System Principles can be found at <a href=\"http://www.mspb.gov/meritsystemsprinciples.htm\" rel=\"nofollow\" target=\"_blank\">http://www.mspb.gov/meritsystemsprinciples.htm</a>"
  },
  {
    "term": "MILITARY SPOUSE SPECIAL HIRING AUTHORITY",
    "definition": "Authority to appoint a military spouse without competition when filling competitive service positions on a temporary (not to exceed 1 year), term (more than 1 year but not more than 4 years), or permanent basis. The authority does not guarantee spouses placement in a position over any other applicant. Military spouses are eligible under this authority if the active duty military spouse: 1) receives a Permanent Change of Station (PCS) move; 2) has a 100% disability rating; or 3) died while on active duty. Each of these categories has different eligibility criteria that must be met."
  },
  {
    "term": "MSPB",
    "definition": "Merit Systems Protection Board."
  },
  {
    "term": "NONAPPROPRIATED FUNDS INSTRUMENTALITY (NAFI)",
    "definition": "Employees of the following organizations are not paid from funds appropriated by the Congress and, for most purposes, are not considered to be Federal employees. The Army and Air Force Exchange Service, Army and Air Force Motion Picture Service, Navy Ship's Stores Ashore, Navy exchanges, Marine Corps exchanges, Coast Guard exchanges, and other instrumentalities of the United States under the jurisdiction of the Armed Forces conducted for the comfort, pleasure, contentment, and mental and physical improvement of personnel of the Armed Forces."
  },
  {
    "term": "NONCOMPETITIVE ACTION",
    "definition": "A promotion, demotion, reassignment, transfer, reinstatement, or an appointment based on prior service."
  },
  {
    "term": "OCCUPATIONAL CODE",
    "definition": "See definition of SERIES."
  },
  {
    "term": "OFFICIAL PERSONNEL FOLDER (OPF), Standard Form 66",
    "definition": "A file containing records and documents related to civilian employment under title 5, U.S. Code."
  },
  {
    "term": "PATHWAYS",
    "definition": "See STUDENT PATHWAYS PROGRAM"
  },
  {
    "term": "PAY ADJUSTMENT",
    "definition": "Any increase or decrease in an employee's rate of basic pay when there is no change in the duties or responsibilities of the employee's position. A pay adjustment may include a change in the step at which the employee is paid. A change in the pay system/pay plan under which the employee is paid is also considered a pay adjustment."
  },
  {
    "term": "PAY PLAN",
    "definition": "The pay system or pay schedule under which the employee's rate of basic pay is determined, e.g., General Schedule (GS), Executive Schedule (EX), and Leader under the Federal Wage System (WL)."
  },
  {
    "term": "PAY RATE DETERMINANT (PRD)",
    "definition": "A designation of any special factors that help determine an employee's rate of basic pay or adjusted basic pay."
  },
  {
    "term": "PAY RETENTION ENTITLEMENT",
    "definition": "The right of an employee to retain, under certain circumstances, a rate of basic pay higher than the maximum rate of the grade for the position occupied."
  },
  {
    "term": "PERMANENT APPOINTMENT",
    "definition": "A permanent appointment is an appointment to a position that is not a temporary or time-limited appointment."
  },
  {
    "term": "PENSION (also called annuity)",
    "definition": "A fixed amount of money paid regularly during retirement or due to disability by the government, a former employer, or an insurance company."
  },
  {
    "term": "PERSONNEL ACTION",
    "definition": "The process necessary to appoint, separate, or make other personnel changes."
  },
  {
    "term": "PLACEMENT",
    "definition": "Putting employees into jobs. Placement may be by appointment of a new employee to federal service; by promotion, change to lower grade, reassignment, or transfer within an agency or from another agency of a current employee; or by reinstatement of a former employee."
  },
  {
    "term": "POSITION CLASSIFICATION (often referred to as Classification)",
    "definition": "A process through which Federal jobs (i.e., positions) are assigned to a pay system, series, title, and grade or band, based on consistent application of position classification standards."
  },
  {
    "term": "PREFERENCE (VETERANS' PREFERENCE)",
    "definition": "There are basically two types of preference eligibles, disabled (10 point preference eligible) and non-disabled (5 point preference eligibles).  Refer to title 5, United States Code, Section 2108 for additional information on veterans’ preference and preference eligibles.  Visit the Department of Labor's Veterans' Preference Advisor to determine your preference eligibility."
  },
  {
    "term": "PREFERENCE ELIGIBLE",
    "definition": "Veterans, spouses, widows, or mothers who meet the definition of \"preference eligible\" in 5 U.S.C. 2108. Preference eligibles are entitled to have 5 or 10 points added to their earned score on a civil service examination (see 5 U.S.C. 3309). They are also accorded a higher retention standing in the event of a reduction in force (see 5 U.S.C. 3502). Preference does not apply, however, to in-service (internal or merit) placement actions such as promotions. If you are a \"retired member of the armed forces,\" you are not included in the definition of preference eligible unless you are a disabled veteran OR you retired below the rank of major or its equivalent."
  },
  {
    "term": "PREMIUM PAY",
    "definition": "The dollar value of earned hours of compensatory time off and additional pay for overtime, night, Sunday, or holiday work; or for standby duty, administratively uncontrollable overtime work, or availability duty. This excludes overtime pay paid to employees under the Fair Labor Standards Act and compensatory time off earned in lieu of such overtime pay."
  },
  {
    "term": "PRESIDENTIAL MANAGEMENT FELLOWS",
    "definition": "An entry level leadership development program for advanced degree candidates; visit www.pmf.gov"
  },
  {
    "term": "PROBATIONARY PERIOD",
    "definition": "The first year of service of an employee who is given a career or career-conditional appointment under 5 CFR part 315. During this period, the agency validates the competencies of the employee and his/her fit for the position. Also, the first year of service in a supervisory or management position during which the agency decides whether the employee has the unique skills necessary to succeed in a supervisory or managerial position."
  },
  {
    "term": "PROMOTION",
    "definition": "A nature of action (NOA) used to document personnel actions that change an employee (1) to a position at a higher grade level within the same job classification system and pay schedule or (2) to a position with a higher rate of basic pay in a different job classification system and pay schedule."
  },
  {
    "term": "PROVISIONAL APPOINTMENT",
    "definition": "A temporary appointment to a continuing position when the agency intends later to convert the employee to a non-temporary appointment and has current authority for such conversion at the time of the temporary appointment."
  },
  {
    "term": "QUALITY (STEP) INCREASE (QSI OR QI)",
    "definition": "An accelerated increase in employee's rate of basic pay through an additional within-grade increase granted under  5 U.S.C. 5336, or 5 CFR part 531 subpart E for sustained high quality performance."
  },
  {
    "term": "QUALIFICATION STANDARDS",
    "definition": "A description of the minimum requirements necessary to perform the work of a particular occupation. These minimum requirements may include specific job-related work experience, education, medical or physical standards, training, security, and/or licensure. They are not designed to rank candidates, identify the best qualified for a particular position, or substitute for an analysis of an applicant's knowledge, skills, and abilities/competencies."
  },
  {
    "term": "RATE OF BASIC PAY",
    "definition": "The rate of pay fixed by law or administrative action for the position held by an employee before any deductions (such as taxes) and exclusive of additional pay of any kind (such as overtime pay)."
  },
  {
    "term": "REALIGNMENT",
    "definition": "The movement of an employee and his or her position when (1) a transfer of function or an organization change occurs, and (2) the employee has REEMPLOYMENT RIGHTS, the entitlement of a stay in the same agency, and (3) there is no change in the employee's position, grade or pay. (Note: For purposes of this definition, a change in the amount of any locality payment to which the employee is entitled is not a change in pay.)"
  },
  {
    "term": "REASSIGNMENT",
    "definition": "The change of an employee, while serving continuously with the same agency, from one position to another without a change in grade or pay. Reassignment includes: (1) movement to a position in a new occupational series, or to another position in the same series; (2) assignment to a position that has been re-described due to the introduction of a new or revised classification or job grading standard; (3) assignment to a position that has been re-described as a result of position review; and (4) movement to a different position at the same grade but with a change in salary that is the result of different local prevailing wage rates or a different locality pay schedule."
  },
  {
    "term": "RECRUITMENT BONUS",
    "definition": "A one-time payment of up to 25 percent of basic pay to an employee who is newly appointed to a hard-to-fill position."
  },
  {
    "term": "REDUCTION IN FORCE (RIF)",
    "definition": "Separation of an employee from their competitive level (see competitive level defined above), required by the agency because of lack of work or funds, abolition of position or agency, or cuts in personnel authorizations."
  },
  {
    "term": "REDUCTION IN GRADE OR PAY",
    "definition": "Situation in which an employee is demoted to a lower grade or lesser pay because of adverse action, reduction in force, or other reasons."
  },
  {
    "term": "REEMPLOYED ANNUITANT",
    "definition": "A person retired under the Civil Service Retirement System (CSRS) or Federal Employees Retirement System (FERS) whose annuity continues after the Federal Government reemploys him or her."
  },
  {
    "term": "REEMPLOYMENT PRIORITY LIST",
    "definition": "A list of career and career-conditional employees an agency has separated because of (1) reduction in force or (2) compensable injury or disability where recovery takes more than one year from the time the employee began receiving compensation to return to non-temporary employment after assignment to other civilian employment. This other employment may be with the Foreign Service, public international organizations, or other agencies in the executive branch or overseas.  Employees on the reemployment priority list are entitled to reemployment consideration."
  },
  {
    "term": "REGISTER (also known as CIVIL SERVICE REGISTER)",
    "definition": "A list of qualified applicants compiled in order of relative standing for certification.  Applies to Federal jobs and is generally administered by OPM or delegated to agencies by OPM."
  },
  {
    "term": "REINSTATEMENT",
    "definition": "Noncompetitive reemployment in the competitive service as a career or career-conditional employee of a person formerly employed in the competitive service who had a competitive status or was serving probation when separated."
  },
  {
    "term": "RELOCATION BONUS",
    "definition": "A one-time payment of up to 25 percent of basic pay to a current Federal employee who relocates to accept a hard-to-fill position."
  },
  {
    "term": "REMOVAL",
    "definition": "A separation from Federal service initiated by the agency, Office of Personnel Management (OPM), or Merit Systems Protection Board (MSPB), under 5 CFR parts 359, 432, 731, or 752; section 1201 of title 5, U.S. Code; or comparable agency statutes or regulations."
  },
  {
    "term": "RESTORATION RIGHTS",
    "definition": "An entitlement for employees, who leave their civilian positions for military duty, to return to those positions after termination of that duty; it is also an entitlement for an employee to return to his or her position after recovery from compensable injury."
  },
  {
    "term": "RETAINED RATE",
    "definition": "A rate of pay above the maximum rate of the employee's grade, which an employee is allowed to keep in special situations rather than having his or her rate of basic pay reduced."
  },
  {
    "term": "RETENTION ALLOWANCE",
    "definition": "The annual total dollar amount paid to an essential employee(s) with unusually high qualifications or special skills in those cases where the agency determines that the employee(s) would be likely to leave Federal employment if no allowance were paid.  An individual employee may receive a retention allowance of up to 25 percent of basic pay.  A group of employees may receive a retention allowance of up to 10 percent of each individual’s basic pay.  OPM may waive retention allowance limitations based on critical need (up to 50 percent of basic pay)."
  },
  {
    "term": "RETENTION PREFERENCE",
    "definition": "The relative right of certain employees, because of veterans’ preference, seniority, or tenure, to be retained in a position when similar positions are being abolished and employees with less standing are being separated or furloughed."
  },
  {
    "term": "RETENTION REGISTER",
    "definition": "A written or printed record of all employees occupying positions in a competitive level arranged by tenure groups and subgroups, and by service dates within the subgroup. It is used in a reduction in force to determine which employees are retained and which are separated or moved to other positions."
  },
  {
    "term": "RETIREMENT, DEFERRED",
    "definition": "Retirement of a person age 62 or older with at least 5 years of civilian service who was formerly employed under the Civil Service Retirement System (CSRS) and then left Federal service or moved to a non-CSRS position. An employee covered by the Federal Employees Retirement System (FERS) who separates after completing 10 years of service can also receive a deferred retirement upon reaching the FERS \"Minimum Retirement Age\" (55 to 57, depending on birth date). (The CSRS and FERS Handbook)"
  },
  {
    "term": "RETIREMENT, DISCONTINUED SERVICE",
    "definition": "Retirement based on involuntary separation against the will and without the consent of the employee, other than on charges of misconduct or delinquency. An employee who does not meet the age and service requirements for optional retirement at the time of separation may retire on discontinued service if he or she is age 50 with 20 years of creditable service or at any age with 25 years of creditable service including 5 years of civilian service. (The CSRS and FERS Handbook)"
  },
  {
    "term": "RETIREMENT, OPTIONAL",
    "definition": "Voluntary retirement, without reduction in annuity, of an employee who meets the minimum age and service requirements. Under the Civil Service Retirement System (CSRS), an employee qualifies at age 55 with 30 years of creditable service; under the Federal Employees Retirement System (FERS), an employee qualifies at the minimum retirement age (55-57, depending on birth date) with 30 years of creditable service. Under both CSRS and FERS, an employee also qualifies at age 60 with 20 years of creditable service and at age 62 with 5 years of creditable service. (The CSRS and FERS Handbook)"
  },
  {
    "term": "RETURN TO DUTY",
    "definition": "Placement of an employee back in pay and duty status after absence for Furlough, Suspension, or Leave Without Pay."
  },
  {
    "term": "SABBATICAL",
    "definition": "An absence from duty, without charge to pay or leave, that an agency may grant to a Senior Executive Service (SES) career appointee to engage in study or uncompensated work experience."
  },
  {
    "term": "SEASONAL EMPLOYEE",
    "definition": "An employee who works on an annual recurring basis for periods of less than 12 months (2,087 hours) each year."
  },
  {
    "term": "SCIENTIFIC AND PROFESSIONAL (ST) SERIES",
    "definition": "Unique category of Federal jobs, which covers non-executive positions classified above the GS-15 level, and involves performance of high-level research and development in the physical, biological, medical, or engineering sciences, or a closely-related field.  All ST positions are in the competitive civil service; however, by statute appointments may be made to ST positions without applying through the competitive examination process required for most entrants into the competitive civil service. This means qualified applicants for ST positions can often be hired more quickly than applicants for other Federal positions.  Vacant ST positions are advertised on www.usajobs.gov.  Agencies with the largest number of ST positions include Agriculture, Commerce, Defense, Environmental Protection Agency (EPA), Health and Human Services (HHS), Interior, and National Aeronautics and Space Administration (NASA)."
  },
  {
    "term": "SERVICE COMPUTATION DATE (SCD)",
    "definition": "The Service Computation Date (SCD) determines an employee’s eligibility for a specific benefit or entitlement, which may include: Annual Leave, Retirement, Thrift Savings Plan, and Reduction-In-Force (RIF)."
  },
  {
    "term": "SENIOR EXECUTIVE SERVICE (SES)",
    "definition": "The Senior Executive Service (SES) is comprised of the men and women charged with leading the continuing transformation of government. These leaders possess well-honed executive skills and share a broad perspective of government and a public service commitment which is grounded in the Constitution. The keystone of the Civil Service Reform Act of 1978, the SES was designed to be a corps of executives selected for their leadership qualifications.    Members of the SES serve in the key positions just below the top Presidential appointees. SES members are the major link between these appointees and the rest of the Federal workforce."
  },
  {
    "term": "SEVERANCE PAY",
    "definition": "Sum of money an employee may be paid when separated involuntarily from an agency, such as during a reduction in force."
  },
  {
    "term": "SCHEDULE A",
    "definition": "For special jobs and situations for which it is impractical to use standard qualification requirements and to rate applicants using traditional competitive procedures. Applicants with an intellectual disability or a severe physical or psychiatric disability (with or without reasonable accommodation) may also be hired under Schedule A. For example, the Schedule A exception is used to hire attorneys because, by law, OPM cannot develop qualification standards or examinations for attorney jobs. This exception can also be used for other special jobs, including chaplain, law clerk trainee, medical doctor, dentist, certain interpreters, experts for consultation purposes, and some others.<br/> Examples of other Schedule A exceptions include: <ul><li>A critical hiring need to fill a short-term job or to fill a continuing job pending completion of examining, clearances, or other procedures.</li> <li>A temporary or part-time job in a remote or isolated location.</li> <li>A noncitizen must be hired because no qualified citizen is available.</li> <li>A temporary board or commission established by law or Executive order must be quickly staffed.</li></ul>"
  },
  {
    "term": "SCHEDULE B",
    "definition": "Applies to jobs and situations for which it is impractical to rate applicants using competitive procedures. However, under Schedule B, applicants must meet the qualification standards for the job. For example, Schedule B includes hiring for the Student Temporary Employment Program, the Student Career Experience Program, and the Federal Career Intern Program. Only students qualify for student programs; it is not practical to use competitive procedures for them."
  },
  {
    "term": "SCHEDULE C",
    "definition": "OPM grants hiring authority under Schedule C on a case-by-case basis in situations for which political appointments are appropriate. Schedule C appointees keep a confidential or policy-determining relationship to their supervisor and agency head. Generally, the authority to fill a Schedule C job is revoked when the incumbent leaves and agencies need specific approval from OPM to establish or reestablish the position."
  },
  {
    "term": "SPECIAL GOVERNMENT EMPLOYEE",
    "definition": "An employee who is appointed to work for a period not to exceed 130 days during any period of 365 days."
  },
  {
    "term": "SPECIALIZED EXPERIENCE",
    "definition": "A type of work experience directly related to the work to be performed in a position."
  },
  {
    "term": "SPECIAL SALARY RATES",
    "definition": "Salary rates higher than the regular statutory schedule. The President establishes these higher pay rates for occupations in which private enterprise is paying substantially more than the regular Government schedule and this salary gap significantly handicaps the Government's recruitment or retention of well-qualified persons."
  },
  {
    "term": "STANDARD FORM 50 (also called SF50)",
    "definition": "Notification of Personnel Action. The Standard Form 50 is completed by the personnel or administrative office to which appointing authority has been delegated, and is used to notify the employee and the payroll office, and to record the action in the employee's Official Personnel Folder."
  },
  {
    "term": "STANDARD FORM 52 (also called a SF52)",
    "definition": "Request for Personnel Action. Is used by operating officials or supervisors to request personnel actions and to secure internal agency clearance of requests for personnel action. Employees use the Standard Form 52 to request leave without pay or a name change and to notify the agency of their intent to resign or retire."
  },
  {
    "term": "STATUS EMPLOYEE",
    "definition": "One who has completed the career-conditional period of employment and has served a career appointment in the competitive service. Also known as an employee with competitive status. Status employees are eligible for noncompetitive movement within the competitive service."
  },
  {
    "term": "STEP",
    "definition": "The step within a grade under which an employee is paid. For example, step 2 of GS 7; step 1 of WG 5."
  },
  {
    "term": "STEP ADJUSTMENT",
    "definition": "A change in the step of the grade at which the employee is serving without a change in the employee's rate of basic pay."
  },
  {
    "term": "STUDENT PATHWAYS PROGRAMS",
    "definition": "Three excepted service programs tailored to recruit, hire, develop, and retain students and recent graduates. The programs include: the Internship Program, the Recent Graduates Program, and a reinvigorated Presidential Management Fellows (PMF) Program."
  },
  {
    "term": "SUBSTANTIALLY CONTINUOUS SERVICE",
    "definition": "Federal civilian service which continued without break or interruption; a period of service from which time off the agency's rolls was not deducted or subtracted from employee's total period of service."
  },
  {
    "term": "SUPERIOR QUALIFICATIONS APPOINTMENT",
    "definition": "Placement of a person in a hard-to-recruit-for position at a pay rate above the minimum  rate based on the applicant's unique or unusually high qualifications, a special government need for applicant’s services, and the applicant’s current salary or salary offerings being higher than the minimum rate of the grade level to which the applicant can be appointed."
  },
  {
    "term": "SUPERVISORY DIFFERENTIAL",
    "definition": "The annual total dollar amount paid, over and above basic pay, to a General Schedule supervisor who otherwise would be paid less than one or more of the civilian employees supervised."
  },
  {
    "term": "SURPLUS EMPLOYEE",
    "definition": "An employee in the competitive service, in tenure group I (career) or tenure group II (career conditional), who has an official notice from your agency saying that your position is no longer needed. This notice could be: a \"Certificate of Expected Separation\" (CES); an agency certification that you are in a surplus organization or occupation; a notice that your position is being abolished; or a letter saying you are eligible for discontinued service retirement. Please note that the definition of a \"surplus\" employee can be extended by agencies to include employees in the excepted service if they are on Schedule A or B appointments without time limit and have received an appropriate notice (see above). Selection priority for these employees is limited to other permanent Schedule A or B positions in the same agency and local commuting area."
  },
  {
    "term": "SUSPENSION",
    "definition": "Placement of an employee in a temporary non-pay and non-duty status (or absence from duty) for disciplinary reasons or other reasons pending an inquiry."
  },
  {
    "term": "TEMPORARY APPOINTMENT",
    "definition": "An appointment lasting one year or less, with a specific expiration date.  Typically used to fill a short-term position due to reorganization, abolishment, or the completion of a specific project or peak workload; or to fill positions that involve intermittent (irregular) or seasonal (recurring annually) work schedules."
  },
  {
    "term": "TENURE",
    "definition": "The period of time an employee may reasonably expect to serve under his or her current appointment. Tenure is governed by the type of appointment under which an employee is currently serving, without regard to whether the employee has competitive status or whether the employee's appointment is to a competitive service position or an excepted service position."
  },
  {
    "term": "TENURE GROUPS",
    "definition": "Categories of employees ranked in priority order for retention during reduction in force."
  },
  {
    "term": "TERM APPOINTMENT",
    "definition": "An appointment lasting more than one year but less than four years, with a specific expiration date. Term appointments may be used for project work; extraordinary workload; scheduled abolishment of a position; reorganization; uncertainty of future funding; or contracting out of the function."
  },
  {
    "term": "TERMINATION DURING PROB/TRIAL PERIOD",
    "definition": "An agency-initiated separation of an employee who is serving initial appointment probation or a trial period required by civil service or agency regulations."
  },
  {
    "term": "TIME–AFTER–COMPETITIVE–APPOINTMENT RESTRICTION",
    "definition": "The provision that states 3 months must elapse after an employee's latest non-temporary competitive appointment before he or she may be (1) promoted or reassigned, or transferred to a different line of work or to a different geographical area, or (2) transferred to or reinstated to a higher grade or different line of work in the competitive service."
  },
  {
    "term": "TOUR OF DUTY",
    "definition": "The hours of a day (daily tour of duty) and the days of an administrative workweek (weekly tour of duty) that are scheduled in advance and during which an employee is required to perform work on a regularly recurring basis."
  },
  {
    "term": "TRANSFER",
    "definition": "A change of an employee, without a break in service of one full workday, from a position in one agency to a position in another agency that can be filled under the same appointing authority."
  },
  {
    "term": "TRANSFER OF FUNCTION",
    "definition": "The movement of the work of one or more employees from one competitive area to another."
  },
  {
    "term": "UNEMPLOYMENT COMPENSATION",
    "definition": "Unemployment insurance for Federal employees."
  },
  {
    "term": "UNIFORMED SERVICES",
    "definition": "The Armed Forces (Army, Navy, Air Force, Marine Corps, and Coast Guard) plus the commissioned officer corps of the Public Health Service and National Oceanic and Atmospheric Administration."
  },
  {
    "term": "VETERAN",
    "definition": "Means a person who was separated with an honorable discharge or under honorable conditions from active duty in the Armed Forces performed during one of the periods described in 5 U.S.C. 2108."
  },
  {
    "term": "VETERANS' PREFERENCE",
    "definition": "(See PREFERENCE) is an employee's category of entitlement to preference in the Federal service based on active military service that terminated honorably."
  },
  {
    "term": "VETERANS EMPLOYMENT OPPORTUNITY ACT (VEOA)",
    "definition": "A special hiring authority, which gives eligible Veterans access to positions that otherwise may have only been available to current competitive service employees. In VEOA appointments, preference eligibles and Veterans are not accorded preference, but they are allowed to compete for job opportunities that are not offered to other external candidates. A VEOA eligible who is selected will be given a career or career-conditional appointment."
  },
  {
    "term": "VETERANS’ RECRUITMENT APPOINTMENT (VRA)",
    "definition": "An excepted authority that allows agencies to appoint eligible veterans without competition if the veteran has received a campaign badge for service during a war or in a campaign or expedition; or is a disabled veteran; or has received an Armed Forces Service Medal for participation in a military operation; or is a recently separated veteran (within the last 3 years) and separated under honorable conditions. Appointments under this authority may be made at any grade level up to and including a GS-11 or equivalent. This is an excepted service appointment, which can be converted to competitive service after 2 years."
  },
  {
    "term": "WAGE EMPLOYEES (often called Wage Grade)",
    "definition": "(also called prevailing rate employees) These employees are in trades, crafts, or labor occupations is fixed and adjusted from time-to-time in accordance with prevailing rates."
  },
  {
    "term": "WITHIN-GRADE INCREASE (WGI)",
    "definition": "Is an increase in employee's rate of basic pay by advancement from one step of his or her grade to the next after meeting requirements for length of service and performance."
  },
  {
    "term": "WORK SCHEDULE (see Tour of Duty)",
    "definition": "The place where the employee works, or at which the employee's activities are based, as determined by the employing agency."
  }
]

},{}],3:[function(require,module,exports){
'use strict';

var extend = require('./util').extend;

var defaultOpts = {
  collapseOthers: false,
  customHiding: false,
  contentPrefix: 'accordion',
  openFirst: false
};

var defaultSelectors = {
  trigger: 'button'
};

/**
 * Creates a new accordion component
 * @constructor
 * @param {Element} elm - The element that contains the entire accordion
 * @param {object} selectors - Selectors for locating DOM elements
 * @param {object} opts - Options for configuring behavior
 */

var Accordion = function(elm, selectors, opts) {
  this.elm = elm;
  this.selectors = extend({}, defaultSelectors, selectors);
  this.opts = extend({}, defaultOpts, opts);

  this.triggers = this.findTriggers();

  this.listeners = [];
  this.addEventListener(this.elm, 'click', this.handleClickElm.bind(this));

  if (this.opts.openFirst) {
    this.expand(this.triggers[0]);
  }
};

Accordion.prototype.handleClickElm = function(e) {
  // If the target is the button, toggle the button
  // Else see if the target is a child of a button
  if (this.triggers.indexOf(e.target) > -1) {
    this.toggle(e.target);
  } else {
    var self = this;
    this.triggers.forEach(function(trigger){
      if (e.target.parentElement === trigger) {
        self.toggle(trigger);
      }
    });
  }
};

Accordion.prototype.findTriggers = function() {
  var self = this;
  var triggers = [].slice.call(this.elm.querySelectorAll(this.selectors.trigger));
  triggers.forEach(function(trigger, index) {
    self.setAria(trigger, index);
  });
  return triggers;
};

Accordion.prototype.setAria = function(trigger, index) {
  var content = trigger.nextElementSibling;
  var contentID;

  if (content.hasAttribute('id')) {
    contentID = content.getAttribute('id');
  } else {
    contentID = this.opts.contentPrefix + '-' + 'content-' + index;
    content.setAttribute('id', contentID);
  }

  trigger.setAttribute('aria-controls', contentID);
  trigger.setAttribute('aria-expanded', 'false');
  content.setAttribute('aria-hidden', 'true');
  this.setStyles(content);
};

Accordion.prototype.toggle = function(elm) {
  var f = elm.getAttribute('aria-expanded') === 'true' ? this.collapse : this.expand;
  f.call(this, elm);
};

Accordion.prototype.expand = function(button) {
  if (this.opts.collapseOthers) {
    this.collapseAll();
  }
  var content = document.getElementById(button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', 'true');
  content.setAttribute('aria-hidden', 'false');
  this.setStyles(content);
};

Accordion.prototype.collapse = function(button) {
  var content = document.getElementById(button.getAttribute('aria-controls'));
  button.setAttribute('aria-expanded', 'false');
  content.setAttribute('aria-hidden', 'true');
  this.setStyles(content);
};

Accordion.prototype.collapseAll = function() {
  var self = this;
  this.triggers.forEach(function(trigger) {
    self.collapse(trigger);
  });
};

Accordion.prototype.expandAll = function() {
  var self = this;
  this.triggers.forEach(function(trigger) {
    self.expand(trigger);
  });
};

Accordion.prototype.setStyles = function(content) {
  var prop = content.getAttribute('aria-hidden') === 'true' ? 'none' : 'block';

  if (!this.opts.customHiding) {
    content.style.display = prop;
  }
};

Accordion.prototype.addEventListener = function(elm, event, callback) {
  if (elm) {
    elm.addEventListener(event, callback);
    this.listeners.push({
      elm: elm,
      event: event,
      callback: callback
    });
  }
};

Accordion.prototype.destroy = function() {
  this.listeners.forEach(function(listener) {
    listener.elm.removeEventListener(listener.event, listener.callback);
  });
};

module.exports = { Accordion: Accordion };

},{"./util":4}],4:[function(require,module,exports){
var extend = function(out) {
  out = out || {};
  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i]) continue;
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
        out[key] = arguments[i][key];
      }
    }
  }
  return out;
};

module.exports = {
  extend: extend
}

},{}],5:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],6:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var List = require('list.js');
var Accordion = require('aria-accordion').Accordion;

var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;

// https://davidwalsh.name/element-matches-selector
function selectorMatches(el, selector) {
  var p = Element.prototype;
  var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };
  return f.call(el, selector);
}

function forEach(values, callback) {
  return [].forEach.call(values, callback);
}

var itemTemplate = _.template(
  '<li class="{{ glossaryItemClass }}">' +
    '<button class="data-glossary-term {{ termClass }}">{{ term }}' +
    '</button>' +
    '<div class="{{ definitionClass }}">{{ definition }}</div>' +
  '</li>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

var defaultSelectors = {
  glossaryID: '#glossary',
  toggle: '.js-glossary-toggle',
  close: '.js-glossary-close',
  listClass: '.js-glossary-list',
  searchClass: '.js-glossary-search'
};

var defaultClasses = {
  definitionClass: 'glossary__definition',
  glossaryItemClass: 'glossary__item',
  highlightedTerm: 'term--highlight',
  termClass: 'glossary__term'
};

function removeTabindex(elm) {
  var elms = getTabIndex(elm);
  forEach(elms, function(elm) {
    elm.setAttribute('tabIndex', '-1');
  });
}

function restoreTabindex(elm) {
  var elms = getTabIndex(elm);
  forEach(elms, function(elm) {
    elm.setAttribute('tabIndex', '0');
  });
}

function getTabIndex(elm) {
  return elm.querySelectorAll('a, button, input, [tabindex]');
}

/**
 * Glossary widget
 * @constructor
 * @param {Array} terms - Term objects with "glossary-term" and "glossary-definition" keys
 * @param {Object} selectors - CSS selectors for glossary components
 * @param {Object} classes - CSS classes to be applied for styling
 */
function Glossary(terms, selectors, classes) {
  this.terms = terms;
  this.selectors = _.extend({}, defaultSelectors, selectors);
  this.classes = _.extend({}, defaultClasses, classes);

  this.body = document.querySelector(this.selectors.glossaryID);
  this.toggleBtn = document.querySelector(this.selectors.toggle);
  this.closeBtn = document.querySelector(this.selectors.close);
  this.search = this.body.querySelector(this.selectors.searchClass);
  this.listElm = this.body.querySelector(this.selectors.listClass);
  this.selectedTerm = this.toggleBtn;

  // Initialize state
  this.isOpen = false;

  // Update DOM
  this.populate();
  this.initList();
  this.linkTerms();

  // Remove tabindices
  removeTabindex(this.body);

  // Initialize accordions
  this.accordion = new Accordion(this.listElm, null, {contentPrefix: 'glossary'});

  // Bind listeners
  this.listeners = [];
  this.addEventListener(this.toggleBtn, 'click', this.toggle.bind(this));
  this.addEventListener(this.closeBtn, 'click', this.hide.bind(this));
  this.addEventListener(this.search, 'input', this.handleInput.bind(this));
  this.addEventListener(document.body, 'keyup', this.handleKeyup.bind(this));
}

Glossary.prototype.populate = function() {
  this.terms.forEach(function(term) {
    var opts = {
      term: term.term,
      definition: term.definition,
      definitionClass: this.classes.definitionClass,
      glossaryItemClass: this.classes.glossaryItemClass,
      termClass: this.classes.termClass
    };
    this.listElm.insertAdjacentHTML('beforeend', itemTemplate(opts));
  }, this);
};

/** Initialize list.js list of terms */
Glossary.prototype.initList = function() {
  var glossaryId = this.selectors.glossaryID.slice(1);
  var listClass = this.selectors.listClass.slice(1);
  var searchClass = this.selectors.searchClass.slice(1);
  var options = {
    valueNames: ['data-glossary-term'],
    listClass: listClass,
    searchClass: searchClass,
  };
  this.list = new List(glossaryId, options);
  this.list.sort('data-glossary-term', {order: 'asc'});
};

/** Add links to terms in body */
Glossary.prototype.linkTerms = function() {
  var terms = document.querySelectorAll('[data-term]');
  forEach(terms, function(term) {
    term.setAttribute('title', 'Click to define');
    term.setAttribute('tabIndex', 0);
    term.setAttribute('data-term', (term.getAttribute('data-term') || '').toLowerCase());
  });
  document.body.addEventListener('click', this.handleTermTouch.bind(this));
  document.body.addEventListener('keyup', this.handleTermTouch.bind(this));
};

Glossary.prototype.handleTermTouch = function(e) {
  if (e.which === KEYCODE_ENTER || e.type === 'click') {
    if (selectorMatches(e.target, '[data-term]')) {
      this.show(e);
      this.selectedTerm = e.target;
      this.findTerm(e.target.getAttribute('data-term'));
    }
    else {
      this.selectedTerm = this.toggleBtn;
    }
  }
};

/** Highlight a term */
Glossary.prototype.findTerm = function(term) {
  this.search.value = term;
  var highlightClass = this.classes.highlightedTerm;

  // Highlight the term and remove other highlights
  forEach(this.body.querySelectorAll('.' + highlightClass), function(term) {
    term.classList.remove(highlightClass);
  });
  forEach(this.body.querySelectorAll('span[data-term="' + term + '"]'), function(term) {
    term.classList.add(highlightClass);
  });
  this.list.filter(function(item) {
    return item._values['data-glossary-term'].toLowerCase() === term;
  });

  this.list.search();
  var button = this.list.visibleItems[0].elm.querySelector('button');
  this.accordion.expand(button);
};

Glossary.prototype.toggle = function() {
  var method = this.isOpen ? this.hide : this.show;
  method.apply(this);
};

Glossary.prototype.show = function() {
  this.body.setAttribute('aria-hidden', 'false');
  this.toggleBtn.setAttribute('aria-expanded', 'true');
  this.search.focus();
  this.isOpen = true;
  restoreTabindex(this.body);
};

Glossary.prototype.hide = function() {
  this.body.setAttribute('aria-hidden', 'true');
  this.toggleBtn.setAttribute('aria-expanded', 'false');
  this.selectedTerm.focus();
  this.isOpen = false;
  removeTabindex(this.body);
};

/** Remove existing filters on input */
Glossary.prototype.handleInput = function() {
  if (this.list.filtered) {
    this.list.filter();
  }
};

/** Close glossary on escape keypress */
Glossary.prototype.handleKeyup = function(e) {
  if (e.keyCode == KEYCODE_ESC) {
    if (this.isOpen) {
      this.hide();
    }
  }
};

Glossary.prototype.addEventListener = function(elm, event, callback) {
  if (elm) {
    elm.addEventListener(event, callback);
    this.listeners.push({
      elm: elm,
      event: event,
      callback: callback
    });
  }
};

Glossary.prototype.destroy = function() {
  this.accordion.destroy();
  this.listeners.forEach(function(listener) {
    listener.elm.removeEventListener(listener.event, listener.callback);
  });
};

module.exports = Glossary;

},{"aria-accordion":3,"list.js":7,"underscore":5}],7:[function(require,module,exports){
(function( window, undefined ) {
"use strict";

var document = window.document,
  getByClass = require('./src/utils/get-by-class'),
  extend = require('./src/utils/extend'),
  indexOf = require('./src/utils/index-of'),
  events = require('./src/utils/events'),
  toString = require('./src/utils/to-string'),
  naturalSort = require('./src/utils/natural-sort'),
  classes = require('./src/utils/classes'),
  getAttribute = require('./src/utils/get-attribute'),
  toArray = require('./src/utils/to-array');

var List = function(id, options, values) {

  var self = this,
    init,
    Item = require('./src/item')(self),
    addAsync = require('./src/add-async')(self);

  init = {
    start: function() {
      self.listClass      = "list";
      self.searchClass    = "search";
      self.sortClass      = "sort";
      self.page           = 10000;
      self.i              = 1;
      self.items          = [];
      self.visibleItems   = [];
      self.matchingItems  = [];
      self.searched       = false;
      self.filtered       = false;
      self.searchColumns  = undefined;
      self.handlers       = { 'updated': [] };
      self.plugins        = {};
      self.valueNames     = [];
      self.utils          = {
        getByClass: getByClass,
        extend: extend,
        indexOf: indexOf,
        events: events,
        toString: toString,
        naturalSort: naturalSort,
        classes: classes,
        getAttribute: getAttribute,
        toArray: toArray
      };

      self.utils.extend(self, options);

      self.listContainer = (typeof(id) === 'string') ? document.getElementById(id) : id;
      if (!self.listContainer) { return; }
      self.list       = getByClass(self.listContainer, self.listClass, true);

      self.parse      = require('./src/parse')(self);
      self.templater  = require('./src/templater')(self);
      self.search     = require('./src/search')(self);
      self.filter     = require('./src/filter')(self);
      self.sort       = require('./src/sort')(self);

      this.handlers();
      this.items();
      self.update();
      this.plugins();
    },
    handlers: function() {
      for (var handler in self.handlers) {
        if (self[handler]) {
          self.on(handler, self[handler]);
        }
      }
    },
    items: function() {
      self.parse(self.list);
      if (values !== undefined) {
        self.add(values);
      }
    },
    plugins: function() {
      for (var i = 0; i < self.plugins.length; i++) {
        var plugin = self.plugins[i];
        self[plugin.name] = plugin;
        plugin.init(self, List);
      }
    }
  };

  /*
  * Re-parse the List, use if html have changed
  */
  this.reIndex = function() {
    self.items          = [];
    self.visibleItems   = [];
    self.matchingItems  = [];
    self.searched       = false;
    self.filtered       = false;
    self.parse(self.list);
  };

  this.toJSON = function() {
    var json = [];
    for (var i = 0, il = self.items.length; i < il; i++) {
      json.push(self.items[i].values());
    }
    return json;
  };


  /*
  * Add object to list
  */
  this.add = function(values, callback) {
    if (values.length === 0) {
      return;
    }
    if (callback) {
      addAsync(values, callback);
      return;
    }
    var added = [],
      notCreate = false;
    if (values[0] === undefined){
      values = [values];
    }
    for (var i = 0, il = values.length; i < il; i++) {
      var item = null;
      notCreate = (self.items.length > self.page) ? true : false;
      item = new Item(values[i], undefined, notCreate);
      self.items.push(item);
      added.push(item);
    }
    self.update();
    return added;
  };

	this.show = function(i, page) {
		this.i = i;
		this.page = page;
		self.update();
    return self;
	};

  /* Removes object from list.
  * Loops through the list and removes objects where
  * property "valuename" === value
  */
  this.remove = function(valueName, value, options) {
    var found = 0;
    for (var i = 0, il = self.items.length; i < il; i++) {
      if (self.items[i].values()[valueName] == value) {
        self.templater.remove(self.items[i], options);
        self.items.splice(i,1);
        il--;
        i--;
        found++;
      }
    }
    self.update();
    return found;
  };

  /* Gets the objects in the list which
  * property "valueName" === value
  */
  this.get = function(valueName, value) {
    var matchedItems = [];
    for (var i = 0, il = self.items.length; i < il; i++) {
      var item = self.items[i];
      if (item.values()[valueName] == value) {
        matchedItems.push(item);
      }
    }
    return matchedItems;
  };

  /*
  * Get size of the list
  */
  this.size = function() {
    return self.items.length;
  };

  /*
  * Removes all items from the list
  */
  this.clear = function() {
    self.templater.clear();
    self.items = [];
    return self;
  };

  this.on = function(event, callback) {
    self.handlers[event].push(callback);
    return self;
  };

  this.off = function(event, callback) {
    var e = self.handlers[event];
    var index = indexOf(e, callback);
    if (index > -1) {
      e.splice(index, 1);
    }
    return self;
  };

  this.trigger = function(event) {
    var i = self.handlers[event].length;
    while(i--) {
      self.handlers[event][i](self);
    }
    return self;
  };

  this.reset = {
    filter: function() {
      var is = self.items,
        il = is.length;
      while (il--) {
        is[il].filtered = false;
      }
      return self;
    },
    search: function() {
      var is = self.items,
        il = is.length;
      while (il--) {
        is[il].found = false;
      }
      return self;
    }
  };

  this.update = function() {
    var is = self.items,
			il = is.length;

    self.visibleItems = [];
    self.matchingItems = [];
    self.templater.clear();
    for (var i = 0; i < il; i++) {
      if (is[i].matching() && ((self.matchingItems.length+1) >= self.i && self.visibleItems.length < self.page)) {
        is[i].show();
        self.visibleItems.push(is[i]);
        self.matchingItems.push(is[i]);
      } else if (is[i].matching()) {
        self.matchingItems.push(is[i]);
        is[i].hide();
      } else {
        is[i].hide();
      }
    }
    self.trigger('updated');
    return self;
  };

  init.start();
};


// AMD support
if (typeof define === 'function' && define.amd) {
  define(function () { return List; });
}
module.exports = List;
window.List = List;

})(window);

},{"./src/add-async":8,"./src/filter":9,"./src/item":10,"./src/parse":11,"./src/search":12,"./src/sort":13,"./src/templater":14,"./src/utils/classes":15,"./src/utils/events":16,"./src/utils/extend":17,"./src/utils/get-attribute":18,"./src/utils/get-by-class":19,"./src/utils/index-of":20,"./src/utils/natural-sort":21,"./src/utils/to-array":22,"./src/utils/to-string":23}],8:[function(require,module,exports){
module.exports = function(list) {
  var addAsync = function(values, callback, items) {
    var valuesToAdd = values.splice(0, 50);
    items = items || [];
    items = items.concat(list.add(valuesToAdd));
    if (values.length > 0) {
      setTimeout(function() {
        addAsync(values, callback, items);
      }, 1);
    } else {
      list.update();
      callback(items);
    }
  };
  return addAsync;
};

},{}],9:[function(require,module,exports){
module.exports = function(list) {

  // Add handlers
  list.handlers.filterStart = list.handlers.filterStart || [];
  list.handlers.filterComplete = list.handlers.filterComplete || [];

  return function(filterFunction) {
    list.trigger('filterStart');
    list.i = 1; // Reset paging
    list.reset.filter();
    if (filterFunction === undefined) {
      list.filtered = false;
    } else {
      list.filtered = true;
      var is = list.items;
      for (var i = 0, il = is.length; i < il; i++) {
        var item = is[i];
        if (filterFunction(item)) {
          item.filtered = true;
        } else {
          item.filtered = false;
        }
      }
    }
    list.update();
    list.trigger('filterComplete');
    return list.visibleItems;
  };
};

},{}],10:[function(require,module,exports){
module.exports = function(list) {
  return function(initValues, element, notCreate) {
    var item = this;

    this._values = {};

    this.found = false; // Show if list.searched == true and this.found == true
    this.filtered = false;// Show if list.filtered == true and this.filtered == true

    var init = function(initValues, element, notCreate) {
      if (element === undefined) {
        if (notCreate) {
          item.values(initValues, notCreate);
        } else {
          item.values(initValues);
        }
      } else {
        item.elm = element;
        var values = list.templater.get(item, initValues);
        item.values(values);
      }
    };

    this.values = function(newValues, notCreate) {
      if (newValues !== undefined) {
        for(var name in newValues) {
          item._values[name] = newValues[name];
        }
        if (notCreate !== true) {
          list.templater.set(item, item.values());
        }
      } else {
        return item._values;
      }
    };

    this.show = function() {
      list.templater.show(item);
    };

    this.hide = function() {
      list.templater.hide(item);
    };

    this.matching = function() {
      return (
        (list.filtered && list.searched && item.found && item.filtered) ||
        (list.filtered && !list.searched && item.filtered) ||
        (!list.filtered && list.searched && item.found) ||
        (!list.filtered && !list.searched)
      );
    };

    this.visible = function() {
      return (item.elm && (item.elm.parentNode == list.list)) ? true : false;
    };

    init(initValues, element, notCreate);
  };
};

},{}],11:[function(require,module,exports){
module.exports = function(list) {

  var Item = require('./item')(list);

  var getChildren = function(parent) {
    var nodes = parent.childNodes,
      items = [];
    for (var i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        items.push(nodes[i]);
      }
    }
    return items;
  };

  var parse = function(itemElements, valueNames) {
    for (var i = 0, il = itemElements.length; i < il; i++) {
      list.items.push(new Item(valueNames, itemElements[i]));
    }
  };
  var parseAsync = function(itemElements, valueNames) {
    var itemsToIndex = itemElements.splice(0, 50); // TODO: If < 100 items, what happens in IE etc?
    parse(itemsToIndex, valueNames);
    if (itemElements.length > 0) {
      setTimeout(function() {
        parseAsync(itemElements, valueNames);
      }, 1);
    } else {
      list.update();
      list.trigger('parseComplete');
    }
  };

  list.handlers.parseComplete = list.handlers.parseComplete || [];

  return function() {
    var itemsToIndex = getChildren(list.list),
      valueNames = list.valueNames;

    if (list.indexAsync) {
      parseAsync(itemsToIndex, valueNames);
    } else {
      parse(itemsToIndex, valueNames);
    }
  };
};

},{"./item":10}],12:[function(require,module,exports){
module.exports = function(list) {
  var item,
    text,
    columns,
    searchString,
    customSearch;

  var prepare = {
    resetList: function() {
      list.i = 1;
      list.templater.clear();
      customSearch = undefined;
    },
    setOptions: function(args) {
      if (args.length == 2 && args[1] instanceof Array) {
        columns = args[1];
      } else if (args.length == 2 && typeof(args[1]) == "function") {
        columns = undefined;
        customSearch = args[1];
      } else if (args.length == 3) {
        columns = args[1];
        customSearch = args[2];
      } else {
        columns = undefined;
      }
    },
    setColumns: function() {
      if (list.items.length === 0) return;
      if (columns === undefined) {
        columns = (list.searchColumns === undefined) ? prepare.toArray(list.items[0].values()) : list.searchColumns;
      }
    },
    setSearchString: function(s) {
      s = list.utils.toString(s).toLowerCase();
      s = s.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&"); // Escape regular expression characters
      searchString = s;
    },
    toArray: function(values) {
      var tmpColumn = [];
      for (var name in values) {
        tmpColumn.push(name);
      }
      return tmpColumn;
    }
  };
  var search = {
    list: function() {
      for (var k = 0, kl = list.items.length; k < kl; k++) {
        search.item(list.items[k]);
      }
    },
    item: function(item) {
      item.found = false;
      for (var j = 0, jl = columns.length; j < jl; j++) {
        if (search.values(item.values(), columns[j])) {
          item.found = true;
          return;
        }
      }
    },
    values: function(values, column) {
      if (values.hasOwnProperty(column)) {
        text = list.utils.toString(values[column]).toLowerCase();
        if ((searchString !== "") && (text.search(searchString) > -1)) {
          return true;
        }
      }
      return false;
    },
    reset: function() {
      list.reset.search();
      list.searched = false;
    }
  };

  var searchMethod = function(str) {
    list.trigger('searchStart');

    prepare.resetList();
    prepare.setSearchString(str);
    prepare.setOptions(arguments); // str, cols|searchFunction, searchFunction
    prepare.setColumns();

    if (searchString === "" ) {
      search.reset();
    } else {
      list.searched = true;
      if (customSearch) {
        customSearch(searchString, columns);
      } else {
        search.list();
      }
    }

    list.update();
    list.trigger('searchComplete');
    return list.visibleItems;
  };

  list.handlers.searchStart = list.handlers.searchStart || [];
  list.handlers.searchComplete = list.handlers.searchComplete || [];

  list.utils.events.bind(list.utils.getByClass(list.listContainer, list.searchClass), 'keyup', function(e) {
    var target = e.target || e.srcElement, // IE have srcElement
      alreadyCleared = (target.value === "" && !list.searched);
    if (!alreadyCleared) { // If oninput already have resetted the list, do nothing
      searchMethod(target.value);
    }
  });

  // Used to detect click on HTML5 clear button
  list.utils.events.bind(list.utils.getByClass(list.listContainer, list.searchClass), 'input', function(e) {
    var target = e.target || e.srcElement;
    if (target.value === "") {
      searchMethod('');
    }
  });

  return searchMethod;
};

},{}],13:[function(require,module,exports){
module.exports = function(list) {
  list.sortFunction = list.sortFunction || function(itemA, itemB, options) {
    options.desc = options.order == "desc" ? true : false; // Natural sort uses this format
    return list.utils.naturalSort(itemA.values()[options.valueName], itemB.values()[options.valueName], options);
  };

  var buttons = {
    els: undefined,
    clear: function() {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        list.utils.classes(buttons.els[i]).remove('asc');
        list.utils.classes(buttons.els[i]).remove('desc');
      }
    },
    getOrder: function(btn) {
      var predefinedOrder = list.utils.getAttribute(btn, 'data-order');
      if (predefinedOrder == "asc" || predefinedOrder == "desc") {
        return predefinedOrder;
      } else if (list.utils.classes(btn).has('desc')) {
        return "asc";
      } else if (list.utils.classes(btn).has('asc')) {
        return "desc";
      } else {
        return "asc";
      }
    },
    getInSensitive: function(btn, options) {
      var insensitive = list.utils.getAttribute(btn, 'data-insensitive');
      if (insensitive === "false") {
        options.insensitive = false;
      } else {
        options.insensitive = true;
      }
    },
    setOrder: function(options) {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        var btn = buttons.els[i];
        if (list.utils.getAttribute(btn, 'data-sort') !== options.valueName) {
          continue;
        }
        var predefinedOrder = list.utils.getAttribute(btn, 'data-order');
        if (predefinedOrder == "asc" || predefinedOrder == "desc") {
          if (predefinedOrder == options.order) {
            list.utils.classes(btn).add(options.order);
          }
        } else {
          list.utils.classes(btn).add(options.order);
        }
      }
    }
  };
  var sort = function() {
    list.trigger('sortStart');
    var options = {};

    var target = arguments[0].currentTarget || arguments[0].srcElement || undefined;

    if (target) {
      options.valueName = list.utils.getAttribute(target, 'data-sort');
      buttons.getInSensitive(target, options);
      options.order = buttons.getOrder(target);
    } else {
      options = arguments[1] || options;
      options.valueName = arguments[0];
      options.order = options.order || "asc";
      options.insensitive = (typeof options.insensitive == "undefined") ? true : options.insensitive;
    }
    buttons.clear();
    buttons.setOrder(options);

    options.sortFunction = options.sortFunction || list.sortFunction;
    list.items.sort(function(a, b) {
      var mult = (options.order === 'desc') ? -1 : 1;
      return (options.sortFunction(a, b, options) * mult);
    });
    list.update();
    list.trigger('sortComplete');
  };

  // Add handlers
  list.handlers.sortStart = list.handlers.sortStart || [];
  list.handlers.sortComplete = list.handlers.sortComplete || [];

  buttons.els = list.utils.getByClass(list.listContainer, list.sortClass);
  list.utils.events.bind(buttons.els, 'click', sort);
  list.on('searchStart', buttons.clear);
  list.on('filterStart', buttons.clear);

  return sort;
};

},{}],14:[function(require,module,exports){
var Templater = function(list) {
  var itemSource,
    templater = this;

  var init = function() {
    itemSource = templater.getItemSource(list.item);
    if (itemSource) {
      itemSource = templater.clearSourceItem(itemSource, list.valueNames);
    }
  };

  this.clearSourceItem = function(el, valueNames) {
    for(var i = 0, il = valueNames.length; i < il; i++) {
      var elm;
      if (valueNames[i].data) {
        for (var j = 0, jl = valueNames[i].data.length; j < jl; j++) {
          el.setAttribute('data-'+valueNames[i].data[j], '');
        }
      } else if (valueNames[i].attr && valueNames[i].name) {
        elm = list.utils.getByClass(el, valueNames[i].name, true);
        if (elm) {
          elm.setAttribute(valueNames[i].attr, "");
        }
      } else {
        elm = list.utils.getByClass(el, valueNames[i], true);
        if (elm) {
          elm.innerHTML = "";
        }
      }
      elm = undefined;
    }
    return el;
  };

  this.getItemSource = function(item) {
    if (item === undefined) {
      var nodes = list.list.childNodes,
        items = [];

      for (var i = 0, il = nodes.length; i < il; i++) {
        // Only textnodes have a data attribute
        if (nodes[i].data === undefined) {
          return nodes[i].cloneNode(true);
        }
      }
    } else if (/<tr[\s>]/g.exec(item)) {
      var tbody = document.createElement('tbody');
      tbody.innerHTML = item;
      return tbody.firstChild;
    } else if (item.indexOf("<") !== -1) {
      var div = document.createElement('div');
      div.innerHTML = item;
      return div.firstChild;
    } else {
      var source = document.getElementById(list.item);
      if (source) {
        return source;
      }
    }
    return undefined;
  };

  this.get = function(item, valueNames) {
    templater.create(item);
    var values = {};
    for(var i = 0, il = valueNames.length; i < il; i++) {
      var elm;
      if (valueNames[i].data) {
        for (var j = 0, jl = valueNames[i].data.length; j < jl; j++) {
          values[valueNames[i].data[j]] = list.utils.getAttribute(item.elm, 'data-'+valueNames[i].data[j]);
        }
      } else if (valueNames[i].attr && valueNames[i].name) {
        elm = list.utils.getByClass(item.elm, valueNames[i].name, true);
        values[valueNames[i].name] = elm ? list.utils.getAttribute(elm, valueNames[i].attr) : "";
      } else {
        elm = list.utils.getByClass(item.elm, valueNames[i], true);
        values[valueNames[i]] = elm ? elm.innerHTML : "";
      }
      elm = undefined;
    }
    return values;
  };

  this.set = function(item, values) {
    var getValueName = function(name) {
      for (var i = 0, il = list.valueNames.length; i < il; i++) {
        if (list.valueNames[i].data) {
          var data = list.valueNames[i].data;
          for (var j = 0, jl = data.length; j < jl; j++) {
            if (data[j] === name) {
              return { data: name };
            }
          }
        } else if (list.valueNames[i].attr && list.valueNames[i].name && list.valueNames[i].name == name) {
          return list.valueNames[i];
        } else if (list.valueNames[i] === name) {
          return name;
        }
      }
    };
    var setValue = function(name, value) {
      var elm;
      var valueName = getValueName(name);
      if (!valueName)
        return;
      if (valueName.data) {
        item.elm.setAttribute('data-'+valueName.data, value);
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(item.elm, valueName.name, true);
        if (elm) {
          elm.setAttribute(valueName.attr, value);
        }
      } else {
        elm = list.utils.getByClass(item.elm, valueName, true);
        if (elm) {
          elm.innerHTML = value;
        }
      }
      elm = undefined;
    };
    if (!templater.create(item)) {
      for(var v in values) {
        if (values.hasOwnProperty(v)) {
          setValue(v, values[v]);
        }
      }
    }
  };

  this.create = function(item) {
    if (item.elm !== undefined) {
      return false;
    }
    if (itemSource === undefined) {
      throw new Error("The list need to have at list one item on init otherwise you'll have to add a template.");
    }
    /* If item source does not exists, use the first item in list as
    source for new items */
    var newItem = itemSource.cloneNode(true);
    newItem.removeAttribute('id');
    item.elm = newItem;
    templater.set(item, item.values());
    return true;
  };
  this.remove = function(item) {
    if (item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.show = function(item) {
    templater.create(item);
    list.list.appendChild(item.elm);
  };
  this.hide = function(item) {
    if (item.elm !== undefined && item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.clear = function() {
    /* .innerHTML = ''; fucks up IE */
    if (list.list.hasChildNodes()) {
      while (list.list.childNodes.length >= 1)
      {
        list.list.removeChild(list.list.firstChild);
      }
    }
  };

  init();
};

module.exports = function(list) {
  return new Templater(list);
};

},{}],15:[function(require,module,exports){
/**
 * Module dependencies.
 */

var index = require('./index-of');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list ? this.list.contains(name) : !! ~index(this.array(), name);
};

},{"./index-of":20}],16:[function(require,module,exports){
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '',
    toArray = require('./to-array');

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el = toArray(el);
  for ( var i = 0; i < el.length; i++ ) {
    el[i][bind](prefix + type, fn, capture || false);
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el = toArray(el);
  for ( var i = 0; i < el.length; i++ ) {
    el[i][unbind](prefix + type, fn, capture || false);
  }
};

},{"./to-array":22}],17:[function(require,module,exports){
/*
 * Source: https://github.com/segmentio/extend
 */

module.exports = function extend (object) {
    // Takes an unlimited number of extenders.
    var args = Array.prototype.slice.call(arguments, 1);

    // For each extender, copy their properties on our object.
    for (var i = 0, source; source = args[i]; i++) {
        if (!source) continue;
        for (var property in source) {
            object[property] = source[property];
        }
    }

    return object;
};

},{}],18:[function(require,module,exports){
/**
 * A cross-browser implementation of getAttribute.
 * Source found here: http://stackoverflow.com/a/3755343/361337 written by Vivin Paliath
 *
 * Return the value for `attr` at `element`.
 *
 * @param {Element} el
 * @param {String} attr
 * @api public
 */

module.exports = function(el, attr) {
  var result = (el.getAttribute && el.getAttribute(attr)) || null;
  if( !result ) {
    var attrs = el.attributes;
    var length = attrs.length;
    for(var i = 0; i < length; i++) {
      if (attr[i] !== undefined) {
        if(attr[i].nodeName === attr) {
          result = attr[i].nodeValue;
        }
      }
    }
  }
  return result;
};

},{}],19:[function(require,module,exports){
/**
 * A cross-browser implementation of getElementsByClass.
 * Heavily based on Dustin Diaz's function: http://dustindiaz.com/getelementsbyclass.
 *
 * Find all elements with class `className` inside `container`.
 * Use `single = true` to increase performance in older browsers
 * when only one element is needed.
 *
 * @param {String} className
 * @param {Element} container
 * @param {Boolean} single
 * @api public
 */

module.exports = (function() {
  if (document.getElementsByClassName) {
    return function(container, className, single) {
      if (single) {
        return container.getElementsByClassName(className)[0];
      } else {
        return container.getElementsByClassName(className);
      }
    };
  } else if (document.querySelector) {
    return function(container, className, single) {
      className = '.' + className;
      if (single) {
        return container.querySelector(className);
      } else {
        return container.querySelectorAll(className);
      }
    };
  } else {
    return function(container, className, single) {
      var classElements = [],
        tag = '*';
      if (container === null) {
        container = document;
      }
      var els = container.getElementsByTagName(tag);
      var elsLen = els.length;
      var pattern = new RegExp("(^|\\s)"+className+"(\\s|$)");
      for (var i = 0, j = 0; i < elsLen; i++) {
        if ( pattern.test(els[i].className) ) {
          if (single) {
            return els[i];
          } else {
            classElements[j] = els[i];
            j++;
          }
        }
      }
      return classElements;
    };
  }
})();

},{}],20:[function(require,module,exports){
var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

},{}],21:[function(require,module,exports){
/*
 * Natural Sort algorithm for Javascript - Version 0.8.1 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */
module.exports = function(a, b, opts) {
    var re = /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,
        sre = /^\s+|\s+$/g,   // trim pre-post whitespace
        snre = /\s+/g,        // normalize all whitespace to single ' ' character
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        options = opts || {},
        i = function(s) {
            return (options.insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, '');
        },
        // convert all to strings strip whitespace
        x = i(a),
        y = i(b),
        // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        // numeric, hex or date detection
        xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
        yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
        normChunk = function(s, l) {
           // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
           return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
        },
        oFxNcL, oFyNcL;
   // first try and sort Hex codes or Dates
   if (yD) {
       if (xD < yD) { return -1; }
       else if (xD > yD) { return 1; }
   }
   // natural sorting through split numeric strings and default strings
   for(var cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl); cLoc < numS; cLoc++) {
       oFxNcL = normChunk(xN[cLoc] || '', xNl);
       oFyNcL = normChunk(yN[cLoc] || '', yNl);
       // handle numeric vs string comparison - number < string - (Kyle Adams)
       if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
           return isNaN(oFxNcL) ? 1 : -1;
       }
       // if unicode use locale comparison
       if (/[^\x00-\x80]/.test(oFxNcL + oFyNcL) && oFxNcL.localeCompare) {
           var comp = oFxNcL.localeCompare(oFyNcL);
           return comp / Math.abs(comp);
       }
       if (oFxNcL < oFyNcL) { return -1; }
       else if (oFxNcL > oFyNcL) { return 1; }
   }
    return 0;
};

},{}],22:[function(require,module,exports){
/**
 * Source: https://github.com/timoxley/to-array
 *
 * Convert an array-like object into an `Array`.
 * If `collection` is already an `Array`, then will return a clone of `collection`.
 *
 * @param {Array | Mixed} collection An `Array` or array-like object to convert e.g. `arguments` or `NodeList`
 * @return {Array} Naive conversion of `collection` to a new `Array`.
 * @api public
 */

module.exports = function toArray(collection) {
  if (typeof collection === 'undefined') return [];
  if (collection === null) return [null];
  if (collection === window) return [window];
  if (typeof collection === 'string') return [collection];
  if (isArray(collection)) return collection;
  if (typeof collection.length != 'number') return [collection];
  if (typeof collection === 'function' && collection instanceof Function) return [collection];

  var arr = [];
  for (var i = 0; i < collection.length; i++) {
    if (Object.prototype.hasOwnProperty.call(collection, i) || i in collection) {
      arr.push(collection[i]);
    }
  }
  if (!arr.length) return [];
  return arr;
};

function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

},{}],23:[function(require,module,exports){
module.exports = function(s) {
  s = (s === undefined) ? "" : s;
  s = (s === null) ? "" : s;
  s = s.toString();
  return s;
};

},{}]},{},[1]);

var $help_accordion = $('[data-object="help-accordion"]'),
  hideContentByDefault = function () {
    var $drawers = $help_accordion.find('[data-behavior="help-accordion.toggle"]'),
      drawer_state;

    $.each($drawers, function (idx, drawer) {
      drawer_state = $(drawer).attr('aria-expanded');

      if (drawer_state === 'false') {
        $help_accordion.find('#' + $(drawer).attr('aria-controls')).attr('aria-hidden', 'true');
      }
    });
  };

// Hide drawer contents that should be hidden by default
hideContentByDefault();

$help_accordion.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help-accordion"]'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find('#' + $el.attr('aria-controls')),
    state = $target.attr('aria-hidden');

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    if (action.match(/^help/)) {
      $el.trigger(action, { el: $el, object: $object, target: $target, state: state });
    }
  });
});

$help_accordion.on('help-accordion.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state === 'true') {
    opts.target.slideDown(function () {
      // Clean up and remove any style elements from other drawers
      opts.object.find('.usa-accordion-content[aria-hidden=true]').slideUp();

      $('html, body').animate({
        scrollTop: opts.object.offset().top
      });
    });
  } else {
    opts.target.slideUp(function () {
      $('html, body').animate({
        scrollTop: opts.object.offset().top
      });
    });
  }
});

var $article = $('[data-object="help-article"]'),
  fireEvent = function (action, label) {
    if (window.ga && ga.create) {
      var trackerName = ga.getAll()[0].get('name');
      ga(trackerName + '.send', 'event', 'helpcenter', action, label);
    }
  },
  hideContentByDefault = function () {
    var $drawers = $article.find('[data-behavior="help-article.contact-event"]'),
      drawer_state;

    $.each($drawers, function (idx, drawer) {
      drawer_state = $(drawer).attr('aria-expanded');

      if (drawer_state === 'false') {
        $article.find('#' + $(drawer).attr('aria-controls')).hide();
      }
    });
  };

// Hide drawer contents that should be hidden by default
hideContentByDefault();

$article.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="help-article"]'),
    behavior = $el.attr('data-behavior'),
    selected_id = $el.val(),
    $target = $('body').find('#' + $el.attr('aria-controls'));

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    if (action.match(/^help-article/)) {
      $el.trigger(action, { el: $el, object: $object, selected_id: selected_id, target: $target });
    }
  });
});

$article.on('help-article.contact', function(event, opts) {
  opts.target.siblings('button').trigger('click');
  fireEvent('select', 'USAJOBS_' + window.location.pathname);
});

$article.on('help-article.contact-event', function(event, opts) {
  if (opts.el.attr('aria-expanded') === 'false') {
    opts.target.slideUp(function () {
      $('html, body').animate({
        scrollTop: opts.object.offset().top
      });
    });

    fireEvent('close', 'USAJOBS_' + window.location.pathname);
  } else {
    opts.target.slideDown(function () {
      $('html, body').animate({
        scrollTop: opts.target.offset().top
      });
    });

    fireEvent('open', 'USAJOBS_' + window.location.pathname);
  }
});

// Search autocomplete locations
function TermsHighlighter(s, t) {
  var splitString = t.split(" ");
  for (var i = 0; i < splitString.length; i++) {
    if (splitString[i] !== "") {
      var matcher = new RegExp("(" + $.ui.autocomplete.escapeRegex(splitString[i]) + ")", "ig");
      s = s.replace(matcher, "<strong>$1</strong>");
    }
  }
  return s;
}

function splitTermHighlighter(s, t) {
  var splitString = t.split(" ").sort(function(a, b) { return b.length - a.length; }),
    matcherString = "";

  for (var i = 0; i < splitString.length; i++) {
    if (splitString[i] !== "") {
      matcherString = matcherString + "(" + $.ui.autocomplete.escapeRegex(splitString[i]) + ")|";
    }
  }

  var matcher = new RegExp(matcherString, "ig");
  s = s.replace(matcher, "<strong>$&</strong>");

  return s;
}

var HelpURLHelper = { DataConfig: "https://data.usajobs.gov" };
//{{ReplaceURLHelper}}

// Search autocomplete
var $location = $('#uhp-location'),
  $keyword = $('#uhp-keyword'),
  $search_form = $('#uhp-search'),
  handleLocationReturn = function () {
    $location.keypress(function (event) {
      if (event.which == 13) {
        closeLocationAutocomplete();
        $search_form.submit();
      }
    });
  },
  closeLocationAutocomplete = function () {
    $location.catcomplete('close');
    $location.blur(); // unfocus the input so the keyboard will close
  };

handleLocationReturn();

$.widget("custom.catcomplete", $.ui.autocomplete, {
  _create: function() {
    this._super();
    this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
  },
  _renderMenu: function(ul, items) {
    var that = this,
      currentCategory = "";

    ul.addClass("usajobs-search-location-autocomplete");

    $.each(items, function(index, item) {
      var li;

      item.value = item.Name;
      item.label = item.Name;
      item.category = item.Type;

      if (item.category != currentCategory) {
        ul.append('<li class="ui-autocomplete-category ' + item.category + '">' + item.category + '</li>');
        currentCategory = item.category;
      }
      li = that._renderItemData( ul, item );
      if (item.category) {
        li.attr("aria-label", item.category + " : " + item.label);
      }
    });
  },
  _renderItem: function (ul, item) {
     return $("<li>")
     .addClass(item.type)
     .attr("data-value", item.value)
     .append($("<a>").html(item.label))
     .appendTo(ul);
  }
});

$.widget("custom.keywordcomplete", $.ui.autocomplete, {
    _create: function () {
        this._super();
        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
    },
    _renderMenu: function (ul, items) {
        ul.addClass("usajobs-search-keyword-autocomplete");
        var that = this,
            currentCategory = "",
            header = '<li class="ui-autocomplete-close-header">Close &nbsp;&nbsp;&times;</li>',
            $header = $(header);

        $.each(items, function (index, item) {
            var li;
            if (item.type != currentCategory) {
                ul.append('<li class="ui-autocomplete-category ' + item.type + ' ">' + item.type + '</li>');
                currentCategory = item.type;
            }
            li = that._renderItemData(ul, item);
            if (item.Type) {
                li.attr("aria-label", item.type + " : " + item.value);
            }
        });
    },
    _renderItem: function (ul, item) {
        return $("<li>")
        .addClass(item.type)
        .attr("data-value", item.value)
        .append($("<a>").html(item.label))
        .appendTo(ul);
    }
});

var url = 'https://ac.usajobs.gov/locationAC',
  autocompleteRequest = function (request, response) {
    $.ajax({
      url: url,
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

var keywordautocompleterequest = function (request, response) {
  $.ajax({
    url: HelpURLHelper.DataConfig + "/api/Autocomplete/Keyword",
    dataType: "json",
    crossdomain: true,
    cache: true,
    data: { term: request.term },
    success: function (data) {
      var results = [];

      for (var key in data) {
        for (var i = 0; i < data[key].length; i++) {
          var label = data[key][i].Name,
            code = data[key][i].Code,
            parentName = "";

          if (key == "series") {
            label = code + " - " + data[key][i].Name;
          } else if (key == "occupations") {
            code = data[key][i].Name;
          }

          if (data[key][i].hasOwnProperty('Acronym')) {
            label = label + " (" + data[key][i].Acronym.toUpperCase() + ")";
          }

          if (data[key][i].hasOwnProperty('ParentName')) {
            label = label + " - " + data[key][i].ParentName;
            parentName = data[key][i].ParentName;
          }

          var autocompleteItem = {
            value: label,
            label: splitTermHighlighter(label, request.term),
            type: key,
            actualValue: code,
            parentName: parentName
          };

          results.push(autocompleteItem);
        }
      }
      response(results);
    },
    global: false
  });
};

$location.catcomplete({
  appendTo: "#search-inner-autocomplete-container",
  source: autocompleteRequest,
  minLength: 2,
  open: function () {
    var data = $(this).data('custom-catcomplete');

    $("ul.ui-menu").width($(this).innerWidth());

    $location.off('menufocus hover mouseover mouseenter');

    data
      .menu
      .element
      .find('li a')
      .each(function () {
        var $me = $(this),
          keywords = data.term.split(' ').join('|');

        $me.addClass("ui-corner-all");
        $me.html($me.text().replace(new RegExp('(' + keywords + ')', 'gi'), '<strong>$1</strong>'));
      });
  },
  select: function (event, ui) {
    var selected = ui.item,
      field_name,
      pill_name,
      $hidden_cities = $('<input type="hidden" name="locations[]"></input>'),
      $hidden_states = $('<input type="hidden" name="states[]"></input>'),
      $hidden_countries = $('<input type="hidden" name="countries[]"></input>'),
      value = selected.label.split(' (')[0]; // Removes the acronym

    if (selected.Type === 'Cities') {
      field_name = 'locations';
      pill_name = field_name + '-' + Date.now(); // This is a hacky way to get a unique ID

      // Add hidden field so entry sticks around
      $hidden_cities
        .attr('id', pill_name)
        .attr('value', value);

      $hidden_cities.appendTo($search_form);
    } else if (selected.Type === 'States') {
      field_name = 'states';
      pill_name = field_name + '-' + Date.now(); // This is a hacky way to get a unique ID

      // Add hidden field so entry sticks around
      $hidden_states
        .attr('id', pill_name)
        .attr('value', value);

      $hidden_states.appendTo($search_form);
    } else if (selected.Type === 'Countries') {
      field_name = 'countries';
      pill_name = field_name + '-' + Date.now(); // This is a hacky way to get a unique ID

      // Add hidden field so entry sticks around
      $hidden_countries
        .attr('id', pill_name)
        .attr('value', value);

      $hidden_countries.appendTo($search_form);
    }

    logLocationAC(value);
    $location.val(value);
    closeLocationAutocomplete();

    return false;
  }
});

$keyword.keywordcomplete({
  source: keywordautocompleterequest,
  minLength: 2,
  select: function (event, ui) {
    var selectedObj = ui.item,
      parameter = "";

    switch (selectedObj.type) {
      case "series":
        parameter = selectedObj.parentName !== "" ? "j=" + selectedObj.actualValue : "jf=" + selectedObj.actualValue;
        break;
      case "agencies":
        parameter = "a=" + selectedObj.actualValue;
        break;
      case "departments":
        parameter = "d=" + selectedObj.actualValue;
        break;
      case "occupations":
        parameter = "soc=" + selectedObj.actualValue;
        break;
      case "job titles":
        parameter = "jt=" + selectedObj.actualValue;
        break;
      }

    logKeywordAC(selectedObj.value);

    window.location.href = "/Search?" + parameter;
    return false;
  },
  open: function () {
    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    $("ul.ui-menu").width($(this).innerWidth());
  },
  close: function () {
     $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
  }
});

$(function () { // wait for document ready

	// init
	var controller = new ScrollMagic.Controller({
		globalSceneOptions: {
			triggerHook: 'onLeave'
		}
	});

	// get all slides
	var slides = document.querySelectorAll(".usajobs-help-center-timeline-panel");

	// create scene for every slide
	for (var i=0; i<slides.length; i++) {
		new ScrollMagic.Scene({
				triggerElement: slides[i]
			})
			.setPin(slides[i])
			.addTo(controller);
	}
});
