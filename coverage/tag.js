function bt_eval(h,n){try{return window.eval.apply(window,[h])}catch(u){n&&n(u)}}var bt_parameter=function(){var h;return function(n,u){var C=u||document;"undefined"===typeof h&&(h=new BrightTag.HTTP.URL(C.location.href));return h.param(n)}}();function bt_meta(h,n){for(var u,C=(n||document).getElementsByTagName("meta"),H=0,J=C.length;H<J;H++)if(u=C[H],u.getAttribute("name")===h)return u.getAttribute("content");return""}
function bt_cookie(h,n){return(new BrightTag.HTTP.Cookie(n||document)).get(h)||""}function bt_data(h,n){var u=BrightTag.V2_RESPONSE?BrightTag.configuredSites()[0]:BrightTag.instance;return u?u.data(h,n):""}window.bt_data_escaped=bt_data;function bt_log(h){window.console&&console.log&&console.log("Signal: "+h)}var bt_handle_exception=bt_log;
window.BrightTag=function(h){function n(a,c){return Object.prototype.toString.call(a)==="[object "+c+"]"}function u(a){return a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function C(a){return"\n//at-sourceURL=/BrightTag/"+a.replace(/\s+/g,"_")+".js"}function H(a,c){for(var d=0,b=this.length;d<b;d++)a.call(c,this[d],d,this)}function J(a,c,d){for(var b in a)a.hasOwnProperty(b)&&c.call(d,b,a[b],a)}function r(a,c,d){a&&(O(a)?P.call(a,c,d):p.isObject(a)&&J(a,c,d))}function s(a,c){J(c,function(c,b){a[c]=
b});return a}function O(a){return p.isArray(a)||!p.isString(a)&&a.length}function oa(a){return!!a}function pa(a,c){var d=this.slice(),b=[];P.call(d,function(d,e){a.call(c,d,e,this)&&b.push(d)});return b}function T(a,c,d){if(a)return qa.call(O(a)?a:[a],c||oa,d)}function ra(a,c){var d=this.slice(),b=Array(d.length);P.call(d,function(d,e){b[e]=a.call(c,d,e,this)});return b}function A(a,c){var d,b,f=p.isArray(a)?a:[a];d=0;for(b=f.length;d<b;d++)if(f[d]===c)return!0;return!1}function U(a){return!p.isString(a)?
a:a.replace(/%/g,"%25").replace(/#/g,"%23").replace(/&/g,"%26").replace(/'/g,"%27").replace(/;/g,"%3B").replace(/</g,"%3C").replace(/>/g,"%3E")}function V(a){for(var c=5381,d=0,b=a.length;d<b;)c=(c<<5)+c+a.charCodeAt(d++);return c.toString(36)}function W(a){function c(){}function d(a){var b=Array.prototype.slice.call(arguments,1);x.each(r,function(l){var d=[t].concat(b);(l[a]||c).apply(null,d)})}function b(){D=!0;Q=y.length;d("engine:off")}function f(){D&&d("engine:on");D=!1;X=0;(y[Q++]||b)()}function e(a,
b){return{type:a,exception:b}}function g(){d("block:finish");f()}function l(b,l){var d=a.createElement(b.tagName),c=x.extend(x.extend({},b.defaults),l||{});x.each(b.supported,function(a){p.isString(a)&&null!=c[a]?d[a]=c[a]:p.isObject(a)&&null!=c[a.option]&&a.setter(d,c[a.option])});return d}function m(b,c){var m=l(s.iframe,c);m.onerror=function(){d("block:error",e("iframe","Problem loading "+b))};d("block:start",b);m.src=b.toString();a.body.appendChild(m);g()}function k(a,b){var c=l(s.image,b);c.onerror=
function(){d("block:error",e("image","Problem loading "+a))};d("block:start",a);c.src=a.toString();g()}function v(b,c,m){var k=!1,v=l(s.script,m);v.onerror=function(){d("block:error",e("script","Problem loading "+b));k||g()};v.onload=v.onreadystatechange=function(){var a;if(!(a=k)){a:{switch(v.readyState){case void 0:case "loaded":case "complete":a=!0;break a}a=!1}a=!a}a||(k=!0,g())};d("block:start",b);b&&(v.src=b.toString());c&&(v.text=c);c=a.getElementsByTagName("script")[0];c.parentNode.insertBefore(v,
c)}function q(a){var b=Array.prototype.slice.call(arguments,1);return function(){a.apply(null,b)}}function K(b){return function(){try{if(d("block:start",b),p.isString(b)){var c=x.trim(b).replace(/^\x3c!--/,"").replace(/--\x3e$/,"");a.defaultView?a.defaultView.eval.call(window,c):a.parentWindow?a.parentWindow.execScript(c):d("block:error",e("wait","Could not evaluate wait block ["+c+"]"))}else b()}catch(l){d("block:error",e("wait",l))}finally{g()}}}function w(a){y.push(a);D&&f();return t}function h(a){y.splice(Q+
X++,0,a);return t}var t=this,r=[],B={},D=!1,y=[],Q=0,X=0,s={iframe:{tagName:"iframe",defaults:{frameborder:"0",height:"1px",scrolling:"no",width:"1px"},supported:[{option:"display",setter:function(a,b){a.style.display=b}},"frameborder","id","height","scrolling","width"]},image:{tagName:"img",defaults:{},supported:[{option:"display",setter:function(a,b){a.style.display=b}},"id",{option:"height",setter:function(a,b){a.setAttribute("height",b)}},{option:"width",setter:function(a,b){a.setAttribute("width",
b)}}]},script:{tagName:"script",defaults:{type:"text/javascript"},supported:["async","id","type","charset"]}};t.run=function(){d("engine:on");f()};t.options=function(a){x.extend(B,a);return t};t.option=function(a){return B[a]};t.iframe=function(a,b){return w(q(m,a,b))};t.image=function(a,b){return w(q(k,a,b))};t.script=function(a,b,c){return w(q(v,a,b,c))};t.wait=function(a){return w(K(a))};t.preemptCss=function(a,b){return h(q(v,a,b))};t.preemptIframe=function(a,b){return h(q(v,a,b))};t.preemptImage=
function(a,b){return h(q(v,a,b))};t.preemptScript=function(a,b,c){return h(q(v,a,b,c))};t.preemptWait=function(a){return h(K(a))};t.listen=function(a){r.push(a);(a["engine:listen"]||c).apply(null,[t]);return t}}function Y(a){function c(a){e.push(a);l&&!m&&b()}function d(a){a.run()}function b(){var a=e[g];a&&(g++,a.listen(k).run())}var f,e=[],g=0,l=!1,m=!1,k={"engine:on":function(){m=!0},"engine:off":function(){m=!1;b()}};f=c;this.alwaysQueue=function(){f=c};this.neverQueue=function(){f=d};this.push=
function(a){f(a);return a};this.run=function(){l=!0;b()};this.applyListener=function(a){var b,c;b=g;for(c=e.length;b<c;b++)e[b].listen(a)};this.toString=function(){return"Group[name="+a+"; working="+m+"; running="+l+"]"}}function Z(a,c){return{"engine:listen":function(d){d.listen(new sa(a,c))}}}function $(a){function c(a){return f[a]||(f[a]=new Y(a))}function d(a){return b.addToGroup(a,b.newEngine())}var b=this,f={undefined:new Y(void 0)},e=[];f.undefined.neverQueue();b.addGlobalListener=function(a){e.push(a);
r(f,function(b,c){c.applyListener(a)})};b.addToGroup=function(a,b){r(e,function(a){b.listen(a)});return c(a).push(b)};b.newEngine=function(){return new W(a)};b.group=function(a){return d(a)};b.listen=function(){return d().listen.apply(null,arguments)};b.iframe=function(){return d().iframe.apply(null,arguments)};b.image=function(){return d().image.apply(null,arguments)};b.script=function(){return d().script.apply(null,arguments)};b.wait=function(){return d().wait.apply(null,arguments)};b.run=function(a){c(a).run()};
b.alwaysQueue=function(a){c(a).alwaysQueue()};b.neverQueue=function(a){c(a).neverQueue()};b.setOptions=function(){return d()}}function R(a){function c(a){var b,c;a=a.split(/; ?/);f={};for(var d=0,e=a.length;d<e;d++){c=a[d];b=c.indexOf("=");var q=f,h=c.slice(0,b);b=c.slice(b+1);b=unescape(b);q[h]=b}}function d(b,d,m){if(b){m=m||{};b=[b+"="+U(d||"")];if((d=m.expires)||0===d)p.isNumber(d)&&(d=(new Date(d)).toGMTString()),b.push("expires="+d);(d=m.path)&&b.push("path="+d);(d=m.domain)&&b.push("domain="+
d);!0===m.secure&&b.push("Secure");!0===m.httponly&&b.push("HttpOnly");m=b.join(";");if(m.length<e)a.cookie=m;else throw{name:"CookieTooLongError",message:"Cookie reached 4096 byte limit"};c(a.cookie)}}function b(a,b){d(a,"",s(b||{},{expires:1}))}var f={},e=4096;c(a.cookie||"");return{get:function(a){return f[a]},set:d,remove:b,findEach:function(a,b){for(var c in f)f.hasOwnProperty(c)&&c.match(a)&&b(c,f[c])},clear:function(a){var c=s({},f),d;for(d in c)b(d,a)}}}function aa(a){a=R(a);var c=a.set,d=
a.remove;a.set=function(a,d,e){e=s(e||{},{path:"/"});0===e.expires&&(e.expires=+new Date("1/1/2038"));c(a,d,e)};a.remove=function(a,c){d(a,s(c||{},{path:"/"}))};a.purge=function(){};return a}function ba(a,c){function d(a){a=a.expires;return 0!==a&&a<=+new Date}function b(b,c){a.setItem(b,c)}function f(a,b,e){b={value:b,expires:e};d(b)||c.setItem(a,JSON.stringify(b))}function e(a){a=c.getItem(a);try{return a?JSON.parse(a):void 0}catch(b){}}function g(a){a=e(a);var b;return a&&(a.hasOwnProperty("value")&&
a.hasOwnProperty("expires"))&&!d(a)?(b=a.value,delete a.value,[b,a]):[]}function l(a,b,c,d){for(var e,l=0,g=a.length;l<g;l++)e=a.key(l),!c[e]&&(c[e]=e.match(b))&&d(e)}return{set:function(a,c,d){a&&null!=c&&(d=d||{},(null!=d.expires?f:b)(a,c,d.expires))},get:function(b){return a.getItem(b)||g(b)[0]},findEach:function(b,d){var e={};l(a,b,e,function(b){var c=a.getItem(b);null!=c&&d(b,c)});l(c,b,e,function(a){var b=g(a),c=b[0],b=b[1];null!=c&&d(a,c,b)})},remove:function(b){a.removeItem(b);c.removeItem(b)},
purge:function(){for(var a,b,l=c.length;l--;)a=c.key(l),(b=e(a))&&(b.hasOwnProperty("value")&&b.hasOwnProperty("expires"))&&d(b)&&c.removeItem(a)}}}function L(a,c){var d={};d.set=a.set;d.findEach=function(b,d){var e={};a.findEach(b,function(a,b,c){e[a]=!0;d(a,b,c)});c.findEach(b,function(b,c,m){e[b]||(a.set(b,c,m),d(b,c,m))})};d.get=function(b){var d=a.get(b);void 0===d&&(d=c.get(b),void 0!==d&&a.set(b,d));return d};d.remove=function(b){a.remove(b);c.remove(b)};d.purge=function(){a.purge();c.purge()};
return d}function M(a){function c(a){var b={};if(!p.isString(a))return a;r(a.split("&"),function(a){if(""!==a){var c=a.split("=");a=decodeURIComponent(c[0]);c=c[1]&&decodeURIComponent(c[1].replace(/\+/g," "));(null==b[a]?b[a]=[]:b[a]).push(c)}});return b}function d(a,b){var c=[];r(a,function(a){if(p.isObject(a))return!1;a=null==a||""===a?b:a;(p.isString(a)||p.isNumber(a)||p.isBoolean(a))&&c.push(a)});return c}function b(a){return!p.isArray(a)?[a]:a}function f(a,b){var c=encodeURIComponent(a),d=encodeURIComponent(b);
return c+"="+d}var e=this,g={};s(g,c(a));e.param=function(a){a=g[a]||[""];return 1<a.length?a:a[0]};e.params=function(){return g};e.appendParam=function(a,c){if(a){var e=d(b(c));0<e.length&&(g[a]=(null==g[a]?g[a]=[]:g[a]).concat(e))}return this};e.replaceParam=function(a,c){if(a){var e=d(b(c));0<e.length&&(g[a]=(g[a]=[]).concat(e))}return this};e.appendParams=function(a){r(a,e.appendParam);return this};e.alwaysAppendParam=function(a,c){if(a){var e=d(b(c),"");0<e.length&&(g[a]=(null==g[a]?g[a]=[]:
g[a]).concat(e))}return this};e.alwaysReplaceParam=function(a,c){if(a){var e=d(b(c),"");0<e.length&&(g[a]=(g[a]=[]).concat(e))}return this};e.alwaysAppendParams=function(a){r(a,e.alwaysAppendParam);return this};e.appendPartialQueryString=function(a){a&&e.alwaysAppendParams(c(a));return this};e.deleteParam=function(a){delete g[a]};e.toString=function(){var a=[];r(g,function(b,c){r(c,function(c){a.push(f(b,c))})});return a.join("&")}}function E(a){function c(){var a=h.toString();return g+l+(0<a.length?
"?"+a:"")}var d={},b,f,e,g,l,m,k,v,q,h,w=a.match(ta);a=w[1]||"";f=w[2]||"";e=(w[3]||"").substring(1);b=f+(e?":"+e:"");g=a+(b?"//"+b:"");l=w[4]||"";m=(k=l.match(/^(.+?)?\/([^\/]+)?$/))&&k[1]||"";k=k&&k[2]||"";v=(w[5]||"").substring(1);q=(w[6]||"").substring(1);h=new M(v);s(d,h);s(d,{origin:g,scheme:a,host:b,hostname:f,port:e,path:l,pathname:m,scriptname:k,queryString:h.toString,fragment:function(){return q},tooLong:function(){return 2082<c().length},asString:c});d.toString=c;return d}function ca(a,
c,d){function b(){var b=d.createEvent("Event");b.initEvent(c,!0,!1);try{b.currentTarget=b.target=a}catch(e){bt_log("warning: can not set target for ["+c+"] event: "+e)}return b}function f(){var a=d.createEventObject("Event");a.type=c;a.cancelable=!0;a.bubbleable=!1;return a}function e(d){setTimeout(function(){try{(d.handleEvent||d).call(a,g?b():f())}catch(e){bt_log("error: overriding ["+c+"] event: "+e)}},0)}var g=!!a.addEventListener,l=g?"addEventListener":"attachEvent",m=a[l];a[l]=function(b,d,
f){if(d&&("function"==typeof d||"function"==typeof d.handleEvent))if(b==c||b=="on"+c)e(d);else try{g?m.call(a,b,d,f):m(b,d)}catch(l){bt_log("error: proxying ["+b+"] event: "+l)}}}function da(a,c,d){function b(a){a.hasOwnProperty("enabled")&&(v=a.enabled);a.hasOwnProperty("timestamp")&&(h=a.timestamp,v=!0);a.hasOwnProperty("site")&&(m=a.site);a.hasOwnProperty("referrer")&&(k=a.referrer)}function f(d){d&&b(d);q=[];a.remove(c)}function e(){try{return JSON.stringify({site:m,referrer:k,errors:q})}catch(a){bt_log("problem serializing errors: "+
a.message)}return null}function g(a){var b=p.isObject(a)?s({},a):{};b.type=b.type||"unknown";b.message=b.message||a.toString();b.timestamp=h;return b}function l(){f();q.push(g({type:"runtime",message:"Too many errors"}));a.set(c,e())}if(!a)throw Error("ErrorManager requires a store");var m,k,v=!0,q=[],h=+new Date;d&&b(d);return{configure:b,reset:f,hasErrors:function(){return 0<q.length},tooManyErrors:l,processStoredErrors:function(){var b=a.get(c);if(b)try{var d=JSON.parse(b)||{};m=d.site;k=d.referrer;
p.isArray(d.errors)&&(q=q.concat(d.errors))}catch(e){bt_log("problem reading stored errors: "+e.message)}},push:function(b){bt_log("error: "+JSON.stringify(b));if(v&&b&&!(-1>b.tagId||-1>b.pageId))try{q.push(g(b)),a.set(c,e())}catch(d){if("CookieTooLongError"!=d.name)throw d;l()}},toJSON:e,toArray:function(){return q}}}function ea(a,c){return new function(a,b){function c(a){k.wait(a)}function e(a){function b(){m=h.jQuery;c(a)}l="var $ = BrightTag.$; ";h.jQuery?b():k.script(h.instance.baseUri()+"BrightTag.jquery-1.5.1.js").wait(b)}
var g={},l="",m,k=h.Blab.group(b);g.getJQuery=function(){return m};g.ensureJQuery=function(l){g.ensureJQuery=c;m=a.jQuery;(m?c:e)(l);h.Blab.run(b)};g.functionWithAccess=function(a,b){return new Function(a,l+b)};return g}(a,c)}function fa(a){function c(a,c){c&&c.findEach(a,function(a,c){b.appendParam(a,c)})}function d(a,b){return function(c){bt_log("invalid "+a+" expression: "+b+", exception = "+c)}}var b=this,f=a.window,e=a.parentReferrer,g=a.referrer,l=E(0===a.host.length?"":(/^[a-z0-9+.-]+:\/\/.+/.test(a.host)?
"":"//")+a.host+"/tag"),m=a.store?a.store.get("X-BT-InspectSession"):null;s(b,l);b.toString=l.toString;b.appendParams({site:a.site,referrer:g,docReferrer:a.docReferrer,mode:a.mode,H:V(g||a.document.location.href)});m&&b.appendParam("inspect-session",m);g!==e&&b.appendParam("parentReferrer",e);c(/^btps\..+/,new R(a.document));c(/^btpdb\..+/,a.store);b.appendData=function(a){var c=bt_data(a),c=p.isArray(c)||p.isObject(c)?f.JSON.stringify(c):c;return b.alwaysReplaceParam("_cb_"+("bt_data('"+a+"')"),
c)};b.appendJs=function(a){var c=d("client binding expression",a);return b.alwaysReplaceParam("_cb_"+a,z(a,c))};b.cf=function(a){p.isArray(a)||(a=[a]);var c=b.param("cf");c&&(a=Array(c).concat(a));b.replaceParam("cf",a.join());return b};b.addCf=function(a,c){if(!z(c,d("conditional fire",c,"tags/"+a+"-cf.js")))return!1;var e=b.param("cf");b.replaceParam("cf",e?e+","+a:a);return!0};b.length=function(){return b.toString().length};b.isTooLarge=function(){return 2028<b.length()};var k=b.toString();b.hasConditions=
function(){return k!=b.toString()}}function ga(a,c){function d(a,b){r(b,function(b,c){a[a.type+"."+b]=c});c.push(a)}function b(a,b,c){var d=h.instance.serverURL();r(a,function(a){a.trigger(b,c,d)});d.hasConditions()&&(d.appendParam("mode","v1"),h.Blab.script(d.asString()))}function f(a,c,e){function g(b,c){r(k,function(g){var f,l=g.name;try{f=h[g.dbe];if(!f){var k=h,q=g.dbe,w,p=g.dbe,t=C("event-dbes/"+l+"-page-"+(B||"adhoc")+"-event-"+a);w=m.functionWithAccess(["eventObject","eventData"],"return "+
p+";"+t);f=k[q]=w}e.data(l,f.call(b.target,b,c))}catch(r){d({type:"evdbe",message:r.toString(),pageId:B||-1},{name:l,eventName:a})}})}var f={},k=[],h={},B=(c||{}).pageId;f.data=function(a,b){k.push({name:a,dbe:b});return f};f.applyDataBindings=g;f.handler=function(c){var d,e=l[a];e&&0<e.length&&(d=Array.prototype.slice.call(arguments,1),g(c,d),b(e,c,d))};return f}function e(a){function b(a){0<k.length&&(a.cf(k),r(h,function(b){a.appendData(b)}),r(y,function(b){a.appendJs(b)}))}function c(a,b){return function(c){bt_log("Invalid "+
a+" expression: "+b+", exception = "+c)}}var e={},g={},f,l,k=[],h=[],y=[];e.execute=function(b,c){s(g,c||{});if(p.isFunction(b))l=b;else if(p.isString(b))a:{try{var f=C("events/"+a+"-tag-"+(g.tagId||"adhoc"));l=m.functionWithAccess(["eventObject","eventData"],b+f);break a}catch(k){d({type:"evparse",message:k.toString(),tagId:g.tagId||-1},{eventName:a})}l=void 0}else bt_log("when.execute: unknown action: "+b);return e};e.evaluate=function(a){f=a;return e};e.fire=function(a){k.push(a);return e};e.appendData=
function(a){h.push(a);return e};e.appendJs=function(a){y.push(a);return e};e.trigger=function(e,k,m){var h=c("post-event conditional fire",f);if(!f||z(f,h)){try{l&&l.call(e.target,e,k)}catch(y){d({type:"evwait",message:y.toString(),tagId:g.tagId||-1},{eventName:a})}b(m)}};return e}var g={},l={},m=ea(a,"BrightTag.jQuery"),k=/^direct\//i;g.executeActions=b;g.Binder=f;g.bind=function(a,b,c,d){var e=f(a,d,h.instance);m.ensureJQuery(function(){var a=m.getJQuery(),d=a(b);if(p.isString(b)&&!k.test(c)&&(d.on||
d.live))if(d.on)a(document).on(c,b,e.handler);else d.live(c,e.handler);else d.bind(c.split(k).pop(),e.handler)});return e};g.EventAction=e;g.when=function(a){var b=e(a),c=l[a];c||(c=l[a]=[]);c.push(b);return b};return g}function ua(a,c,d,b){function f(b,c,e){var g=a.group(e).options(c||{});g.wait(function(){d.process(g,b)})}var e=!1,g={};g[b]=!0;return{tag:function(c,d){var k;k=d&&d.group;k=!e&&!k?b:k;f(c,d,k);k&&void 0===g[k]&&(g[k]=!0,e&&a.run(k))},run:function(){a.addGlobalListener(Z(c,d));e=!0;
r(g,a.run)}}}function ha(a,c){function d(a){r(p.isArray(a)?a:[a],function(a){p.isFunction(a)?a():q.write('<script type="text/javascript" src="'+a+'">\x3c/script>')})}function b(a){var b=w.group().options({tagId:-2});r(p.isArray(a)?a:[a],function(a){(p.isFunction(a)?b.wait:b.script)(a)})}function f(a){q.write(a)}function e(a,b){B.tag(a,b)}function g(a){k.writeScript=a?d:b;k.appendContent=a?f:e}function l(a){r(a,function(a){if(a.name){var b=s({},a);delete b.name;delete b.value;t.set(a.name,a.value,
b)}})}function m(b){n.hasErrors()&&(b.appendParam("errors",n.toJSON()),b.tooLong()&&(b.deleteParam("errors"),n.tooManyErrors(),b.appendParam("errors",n.toJSON())));n.reset({site:a.site,referrer:a.referrer||q.location.href})}var k=this,v=a.data||{},q=a.document||{},K=a.window||{},w=a.blab||h.Blab,n=a.errorManager,t=a.store,u=ia(q),B=a.asyncTagManager||ua(w,q,u,"domready"),D=ea(window,"jquery");k.referrer=a.referrer;k.parentReferrer=a.parentReferrer;k.docReferrer=a.docReferrer;k.site=a.site;k.host=
a.host;k.loadOnly=!!a.loadOnly;n&&w.addGlobalListener(new ja(n));w.run("serializer");k.load=function(){var a=Array.prototype.slice.call(arguments,0);r(a,function(a){p.isFunction(a)?w.addToGroup("serializer",w.newEngine().wait(function(){a(k)})):p.isObject(a)&&a.src?k.library(a.src,a.options):p.isString(a)&&k.library(a)})};k.library=function(a,b){w.addToGroup("serializer",w.newEngine().options(b||{}).script(a))};g(A(a.mode,"sync"));k.domReady=function(){A(a.mode,"sync")&&g(!1);B.run()};k.parameter=
function(a){return window.bt_parameter(a,q)};k.meta=function(a){return window.bt_meta(a,q)};k.cookie=function(a){return window.bt_cookie(a,q)};k.data=function(a,b){if(void 0!==b)return v[a]=b;b=v[a];return null==b?"":b};k.dbe=function(a,b,c){function d(b){n&&n.push({type:"dbe",message:b.toString(),"dbe.name":a,pageId:(c||{}).pageId||-1})}null==v[a]&&k.data(a,z(b,d,"page-dbes/"+a+"-page-"+(c&&c.pageId||"adhoc")))};k.errors=function(a){h.V2_RESPONSE=!1;n.configure(a)};k.store=t?l:function(){};k.serverURL=
function(){return new fa(a)};k.defaultBaseUri=function(){return("https:"==q.location.protocol?"https:":"http:")+"//s.btstatic.com/"};k.baseUri=function(){var a=/\btag(\.[^.]+|-n)?\.js(#.*)?$/;return c&&c.src&&c.src.replace(a,"")||k.defaultBaseUri()};k.primary=function(){function a(){var b=k.serverURL();n&&(n.processStoredErrors(),m(b));return b.toString()}var b=[];K.JSON?b.push(a()):(b.push(k.baseUri()+"json2.js"),b.push(function(){k.writeScript(a())}));k.writeScript(b)};k.secondary=function(a){var b=
k.serverURL(),c=b.toString();a(b);b.toString()!=c&&(b.appendParam("mode","v1"),n&&m(b),b.isTooLarge()?k.post(b):k.writeScript(b.toString()))};k.post=function(a){D.ensureJQuery(function(){D.getJQuery().ajax({url:"//"+a.host+a.path,type:"POST",dataType:"text",success:bt_eval,data:a.queryString(),xhrFields:{withCredentials:!0}})})}}function F(){var a={},c={};return{on:function(c,b){var f=a[c];f||(f=a[c]=[]);f.push(b)},once:function(a,b){var f=c[a];f||(f=c[a]=[]);f.push(b)},emit:function(d){function b(a){a.apply(this,
f)}var f=Array.prototype.slice.call(arguments,1);r(a[d],b);r(c[d],b);c[d]=[]}}}function va(a){function c(a){return null!=f[a]}function d(a,b){void 0!==b&&(f[a]=b);var c=f[a];return null==c?"":c}var b,f=s({},a);return b=s({dbe:function(a,g,f){if(!c(a)&&(g=z(g,function(c){b.emit("error",c,a,f)}),null!=g))return d(a,g)},data:d,hasData:c},F())}function wa(a){var c,d={},b=["eventObject","eventData","$","bt_data"];return c=s({dbe:function(a,e){try{d[a]=new Function(b,"return "+e+";")}catch(g){g.type="evdbe",
c.emit("error",g,a)}return c},trigger:function(b,e,g){var l=b.target,m=[b,e,g,a.data];r(d,function(b,d){try{a.data(b,d.apply(l,m))}catch(e){e.type="evdbe",c.emit("error",e,b)}})}},F())}function xa(a){function c(a){f.push(a);return b}function d(a){try{return new Function(g,a)}catch(c){c.type="evparse",b.emit("error",c)}}var b,f=[],e=function(){return!0},g=["eventObject","eventData","$","bt_data"];return b=s({fire:function(a){return c(function(b){b.fire(a)})},appendData:function(a){return c(function(b){b.appendData(a)})},
appendJs:function(a){return c(function(b){b.appendJs(a)})},execute:function(e){function g(c,d,e,l){try{f.call(d.target,d,e,l,a.data)}catch(m){m.type="evwait",b.emit("error",m)}}var f=p.isString(e)?d(e):e;return f?c(g):b},evaluate:function(c){var g=d("return "+c);e=g?function(b,c,d,e){return g.call(c.target,c,d,e,a.data)}:function(){return!1};return b},trigger:function(a,b,c,d){e(a,b,c,d)&&r(f,function(e){e(a,b,c,d)})}},F())}function ya(a){var c=/^direct\//i,d=!1;return{bind:function(a,d,e){function g(a){var b=
Array.prototype.slice.call(arguments,1);e(a,b,h.jQuery||window.jQuery)}var l=h.jQuery||window.jQuery,m=l(a),k=!p.isString(a)||c.test(d);if(!k&&m.on)l(document).on(d,a,g);else!k&&m.live?m.live(d,g):m.bind(d.split(c).pop(),g)},newBinder:function(a){return wa(a)},newHandler:function(a){return xa(a)},ensureLibrary:function(b){h.jQuery||window.jQuery?b():(d||(d=!0,a.run()),a.wait(b))}}}function za(a,c){function d(b,c,d,m){var k=S(a);r(b,function(a){a.trigger(k,c,d,m)});f.emit("triggered",k)}var b={},f=
F();return s(f,{bind:function(e,g,l,m){function k(a,c,g){h.trigger(a,c,g);d(b[e],a,c,g)}var h=c.newBinder(a,e);h.on("error",function(a,b){f.emit("error",a,{name:b,eventName:e},m)});c.ensureLibrary(function(){try{c.bind(g,l,k)}catch(a){f.emit("error",a,{eventName:e},m)}});return h},handle:function(d,g){var l=c.newHandler(a);l.on("error",function(a){f.emit("error",a,{eventName:d},g)});b[d]=b[d]||[];b[d].push(l);return l}})}function ia(a){function c(a,b){a.src?b.preemptScript(a.src,a.innerHTML):a.innerHTML&&
b.preemptWait(a.innerHTML)}function d(a,b){for(var g=a.childNodes||[],l=0,h=g.length;l<h;l++){var k=g[l];"SCRIPT"==k.tagName?c(k,b):d(k,b)}}var b=a.createElement("div");return{process:function(f,e){if(0!==e.length){b.innerHTML="<br/>"+e;for(var g=b.childNodes||[],l=1,h=g.length;l<h;l++){var k=g[l];if("SCRIPT"==k.tagName)c(k,f);else{try{a.body.appendChild(k.cloneNode(!0))}catch(p){bt_log("error appending content to body: "+p)}d(k,f)}}}}}}function Aa(a){function c(b){a.write(b);return d}var d={tag:c,
script:function(a){return c('<script type="text/javascript" src="'+a+'">\x3c/script>')},wait:function(a){a();return d}};return d}function Ba(a,c){function d(c,d){var f=c&&c.group;d(a.group(f).options(c||{}));f&&void 0===b[f]&&(b[f]=!0,a.run(f))}var b={},f={tag:function(a,b){d(b,function(b){b.wait(function(){c.process(b,a)})});return f},script:a.script,wait:a.wait};return f}function Ca(a,c){var d=c;return{tag:function(a,c){return d.tag(a,c)},script:function(a){return d.script(a)},wait:function(a){return d.wait(a)},
sync:function(){d=a},async:function(){d=c}}}function ja(a){return{dbe:function(c,d,b){a.push({type:"dbe",message:c.toString(),"dbe.name":d,pageId:(b||{}).pageId||-1})},events:function(c,d,b){var f=c.type,e="evdbe"===f?"pageId":"tagId",g={type:f,message:c.toString()};r(d,function(a,b){g[f+"."+a]=b});g[e]=(b||{})[e]||-1;a.push(g)},"block:error":function(c,d){var b,f,e;d&&(b=d.type,f=d.exception||d,e=c.option("tagId")||-1,a.push({type:b,message:f.toString(),tagId:e}))}}}function Da(a){function c(){var b=
new E(a.src),c={},d=b.fragment();c.staticHost=b.host+b.pathname;d&&r((new M(d)).params(),function(a,b){c[a]=1<b.length?b:b[0]});return c}function d(){var b=u(a.innerHTML);return 0===b.length?{}:z("(\n"+b+"\n)",function(a){bt_log("json configuration error: "+a)})}return{isTagjs:function(){return/\/tag(\.[^.]+|-n)?\.js(\?.*)?(#.*)?$/.test(a.src)},toJSON:function(){return s(c(),d())},script:a}}function Ea(a){return{isTagjs:function(){return!0},toJSON:function(){return a||{}},script:{src:void 0}}}function ka(){function a(){return c}
var c;return c={fire:a,appendData:a,appendJs:a,execute:a,when:a}}function S(a){function c(a,b){for(var c in a)if(b(c,a[c]))return!0;return!1}var d,b=[],f={};return d={toJSON:function(){var a=0<b.length?{cf:b.join()}:{};return s(a,f)},fire:function(a){p.isArray(a)||(a=[a]);a=T(a,function(a){return null!=a&&""!==a});b=b.concat(a);return d},appendData:function(b){var c=a.data(b);f["_cb_bt_data('"+b+"')"]=p.isArray(c)||p.isObject(c)?JSON.stringify(c):c;return d},appendJs:function(a){f["_cb_"+a]=z(a);
return d},execute:function(a){a();return d},when:function(b){var c;try{return c=new Function(["bt_data"],"return "+h.trim(b)),c(a.data)?d:ka()}catch(f){bt_log("conditional evaluation error: ["+f.toString()+"] while evaluating ["+b+"]")}return ka()},hasConditions:function(){return 0<b.length||c(f,function(a,b){return null!=b})}}}function Fa(a,c,d,b,f,e){function g(){t=!0;c.async();n.mode=x.filter(n.mode,function(a){return"sync"!==a})}function l(a){if(null==a||a.hasConditions())b.reset({site:n.site,
referrer:n.referrer||window.location.href})}function m(a){var c=E("//"+r+"/tag").appendParams({site:n.site,mode:n.mode,H:n.H,referrer:n.referrer,docReferrer:n.docReferrer}).appendParam("mode","v2").alwaysAppendParams(a);(a=I.get("X-BT-InspectSession"))&&c.appendParam("inspect-session",a);f.findEach(RegExp("^btp(s|db)\\."+n.site+"\\..+"),function(a,b){c.appendParam(a,b)});return c.appendParams({errors:b.hasErrors()?b.toJSON():null})}function k(a){if(null==a)return m();if(a.hasConditions())return m(a.toJSON())}
function p(a){var b=k(a);b?(l(a),b.tooLong()?u.ensure("jQuery",function(){h.jQuery.ajax({url:b.origin+b.path,type:"POST",data:b.queryString(),xhrFields:{withCredentials:!0}})}):c.script(b.toString())):l(a)}var q,n=x.extend({},e),r=n.host||"",s=F(),t=!1,u=new Ga(c,n);d.on("triggered",p);return q=x.extend({config:n,diagnostic:function(a){a&&(n.diagnostic=a,q.emit("diagnostic",a))},errors:function(a){b.configure({timestamp:a})},dbe:function(b,c,d){var e=a.dbe(b,c,d);null!=e&&q.emit("dbe",b,c,e,d)},data:a.data,
dataref:function(a){return null==a?"":'BrightTag.site("'+n.site+'").data("'+a.replace(/"/g,"\\x22")+'")'},store:function(a){x.each(a,function(a){if(a.name){var b=x.extend({},a);delete b.name;delete b.value;f.set(a.name,a.value,b)}})},tag:function(a,b){q.emit("tag",a,b);return c.tag(a,b)},script:c.script,wait:c.wait,events:{bind:function(a,b,c,e){q.emit("event-binding",a,b,c,e);return d.bind(a,b,c,e)},on:d.handle},when:function(b,c){S(a).when(b).execute(function(){c(q)});return q},domready:function(a){if(null==
a)g();else s.once("domready",a);t&&s.emit("domready",q)},primary:function(){u.ensure("JSON",function(){b.processStoredErrors();p()})},secondary:function(b){var c=S(a);b(c);p(c)}},F())}function Ha(a){a=E(a.staticHost+"/BrightTag.jquery-1.5.1.js");return ya((new W(document)).script(a))}function Ia(a,c,d){var b=Aa(document);a=Ba(a,c);b=Ca(b,a);x.contains(d.mode,"sync")&&b.sync();return b}function Ja(a){var c,d,b,f,e,g,l,m;if((l=a.site)&&!N[l])return c=va(a.data),d=new $(document),m=ia(document),b=Ia(d,
m,a),e=za(c,Ha(a)),g=da(G?L(G,I):I,"__bterr_"+l,{site:l,referrer:a.referrer,enabled:!1}),f=ja(g),c.on("error",f.dbe),e.on("error",f.events),d.addGlobalListener(f),h.Events.onDOMReady(function(){d.addGlobalListener(Z(document,m))}),a=N[l]=Fa(c,b,e,g,G?L(I,G):I,a)}function la(a,c,d){try{var b,f,e=a.toJSON();if(!(h.instance&&h.instance.site===e.site)){var g=s({host:"s.thebrighttag.com",staticHost:"s.btstatic.com",H:V(e.referrer||c.location.href),referrer:e.referrer||c.location.href,docReferrer:c.document.referrer},
e);b=Ja(g);if(e.site&&!h.instance&&!ma&&!A(e.mode,"v2")&&!A(e.mode,"v2b")){var l=a.script,m=na();h.EventBinding=ga(m.window,m.errorManager);h.instance=new ha(s(m,e),l);f=h.instance;b.config.loadOnly=!0}else if(b){var k=b.config,n;var q=b.config.mode;n=A(q,"v2")?q:!q?"v2":["v2"].concat(q);k.mode=n}d&&d(b,f);return b}}catch(p){bt_log("error configuring site ["+a.script.src+"]: "+p)}}function Ka(a){var c,d,b=[];if(p.isArray(a))b=a.slice(0);else{c=0;for(d=a.length;c<d;c++)b.push(a[c])}return b}function La(a){if(!ma&&
!A(a.config.mode,"v2")&&!A(a.config.mode,"v2b"))h.Events.onDOMReady(function(c){a.domready()});else a.config.loadOnly||(h.Events.onDOMReady(function(c){a.domready()}),a.primary())}function na(){var a,c=aa(document),d=c,b=c;try{window.localStorage&&window.sessionStorage&&(a=ba(sessionStorage,localStorage),a.purge(),d=L(c,a),b=L(a,c))}catch(f){bt_log("Unable to access DOM storage: "+f)}return{id:Math.random(),loadOnly:!1,window:window,document:document,host:"s.thebrighttag.com",parentReferrer:top!=
self&&self.window?self.window.location.href:null,docReferrer:document.referrer,data:{},store:d,errorManager:da(b,"__bterr")}}if(h)return h;var ma=!1;h={};var p={isString:function(a){return n(a,"String")},isArray:function(a){return n(a,"Array")},isNumber:function(a){return n(a,"Number")},isBoolean:function(a){return n(a,"Boolean")},isFunction:function(a){return n(a,"Function")},isObject:function(a){return null===a||void 0===a?!1:n(a,"Object")}},z=bt_eval,P=Array.prototype.forEach?Array.prototype.forEach:
H,qa=Array.prototype.filter?Array.prototype.filter:pa,Ma=Array.prototype.map?Array.prototype.map:ra,x={contains:A,each:r,extend:s,filter:T,map:function(a,c,d){if(a)return Ma.call(O(a)?a:[a],c,d)},trim:u},sa=function(){function a(){}function c(a,b,c){try{a[b]=c}catch(d){bt_log("warning: could not assign value to 'document."+b+"': "+d)}}var d,b=[],f=function(a){d.push(a)};return function(e,g){var h;this["block:start"]=function(){b.push([d,e.write,e.writeln,e.open,e.close]);d=[];c(e,"write",f);c(e,"writeln",
f);c(e,"open",a);c(e,"close",a)};this["block:finish"]=function(){try{g.process(h,d.join(""))}finally{var a=b.pop();d=a[0];c(e,"write",a[1]);c(e,"writeln",a[2]);c(e,"open",a[3]);c(e,"close",a[4])}};this["engine:listen"]=function(a){h=a}}}(),ta=/^(?:([^:\/]+:)?\/\/)?([^:\/?#]+)?(:[0-9]+)?([^?#]*)(\?[^#]*)?(#.*)?$/,Ga=function(){function a(a,b){this.tagMgrRouter=a;this.config=b}var c={JSON:{object:"JSON",path:"/json2.js"},jQuery:{object:"BrightTag.jQuery",path:"/BrightTag.jquery-1.5.1.js"}};a.prototype=
{ensure:function(a,b){var f=c[a];if(f){var e=f.object.split("."),g=window,h=e.length-1,m,k;for(k=0;k<h;k++){m=e[k];g=g[m];if(!g)throw"DependencyManager: Could not find key "+m;g=g[e[k]]}g?b():this.tagMgrRouter.script(E(this.config.staticHost+f.path)).wait(b)}}};return a}(),N={},G,I=aa(document);try{window.localStorage&&window.sessionStorage&&(G=ba(sessionStorage,localStorage),G.purge())}catch(Na){bt_log("Unable to access DOM storage: "+Na)}h.Escaper={cookie:U,javascript:function(a){return!p.isString(a)?
a:a.replace(/\\/g,"\\\\").replace(/'/g,"\\x27").replace(/"/g,"\\x22").replace(/\n/g,"\\n").replace(/\r/g,"\\r")}};h.Random={integer:function(a){return Math.floor(Math.random()*(a||1E8))}};h.pushIfDefined=function(a,c,d){a&&(a.constructor==Array&&null!=c)&&a.push(d||c)};h.ServerURL=fa;h.Main=function(a){function c(b){(b=(new E(b.src)).fragment())&&r((new M(b)).params(),function(b,c){a[b]=c[0]})}function d(b){function c(a){bt_log("configuration error: "+a)}b=u(b.innerHTML);0!==b.length&&s(a,z("(\n"+
b+"\n)",c,"site-config"))}var b,f=function(){var b,c,d=/\/tag(\.[^.]+|-n)?\.js(#.*)?$/,e=a.document.getElementsByTagName("script");for(b=e.length-1;-1<b;b--)if(c=e[b],d.test(c.src))return c}();f&&(c(f),d(f));if(null!=a.site){h.Events.enablePageReadyOverrides();try{b=new ha(a,f),h.Events.onDOMReady(b.domReady),b.loadOnly||b.primary()}catch(e){bt_log("execution error: "+e)}return b}};h.CookieSync={pushImage:function(a){(new Image).src=a;throw"CookieSync.pushImage no longer supported ["+a+"]";},pushIframe:function(a){throw"CookieSync.pushIframe no longer supported ["+
a+"]";}};h.EventBindingManager=ga;h.defaultConfig=na;h.eval=z;h.Types=p;h.trim=x.trim;h.Util=x;h.each=x.each;h.extend=x.extend;h.HTTP={Cookie:R,QueryString:M,URL:E};h.Blab=new $(document);h.Events=new function(a,c){function d(){}function b(a,b,c){a[r](t+b,c,!1)}function f(a,b,c){a[s](t+b,c,!1)}function e(){var a=c.readyState;if("loading"==a)return!1;if("complete"==a)return!0;a:{try{u("left")}catch(b){a=!1;break a}a=!0}return a}function g(a,b,c){var d=this;setTimeout(function(){a()?b.call(d):g(a,b,
c)},c)}function h(){h=d;n&&ca(c,q,c)}function m(){h();ca(a,p,c)}var k=this,n=!!a.addEventListener,q="DOMContentLoaded",p="load",r=n?"addEventListener":"attachEvent",s=n?"removeEventListener":"detachEvent",t=n?"":"on",u=c.documentElement.doScroll||function(){throw"No doScroll";};k.listen=b;k.unlisten=f;k.onDOMReady=function(d){e()?d.call(this):c.addEventListener?(b(c,q,d),b(c,q,function(){f(a,p,d)}),b(a,p,d)):g(e,d,1)};k.enablePageReadyOverrides=function(){k.enablePageReadyOverrides=d;e()?m():(n&&
b(c,q,h),b(a,p,m))}}(window,document);h.Events.enablePageReadyOverrides();h.Content=new function(a){a=a||h.Blab;return{iframe:a.iframe,image:a.image,link:a.link,script:a.script}}(h.Blab);h.V2_RESPONSE=!0;h.site=function(a,c){try{var d=N[a];d&&c&&c(d);return d}catch(b){bt_log("error while executing site configuration ["+a+"]: "+b)}};h.configureNewSites=function(a,c){r(Ka(a.document.getElementsByTagName("script")),function(d){d=Da(d);d.isTagjs()&&la(d,a,c)})};h.configureSite=function(a,c,d){return la(Ea(a),
c,d)};h.configuredSites=function(){var a=[];x.each(N,function(c,d){a.push(d)});return a};h.initializeSite=function(a,c){c&&(h.Events.onDOMReady(c.domReady),c.loadOnly||c.primary());a&&La(a)};return h}(window.BrightTag);(function(h){h.configureNewSites(window,h.initializeSite);null==h.instance&&setTimeout(function(){null==h.instance&&h.configureNewSites(window,h.initializeSite)},0)})(BrightTag);var _bt_url_prefix,_bt_referrer,_bt_site,_bt_mode;
function btServe(h){var n=BrightTag,u={referrer:_bt_referrer,site:_bt_site,mode:_bt_mode};null!=_bt_url_prefix&&(u.host=_bt_url_prefix);n.configureSite(n.extend(u,h),window,n.initializeSite)};