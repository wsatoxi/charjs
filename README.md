#Mario.js (bookmarklet)

Add the following code to your bookmark

for non CSP setting site
```javascript
javascript:(function(){var s=document.createElement("script");s.charset="UTF-8";s.src="https://unksato.github.io/charjs/mario.min.js";document.body.appendChild(s)})(); 
```
or

```javascript
javascript:(function(t){function n(c,b,k,g){var a=document.createElement("canvas"),f=a.getContext("2d"),e=16*k;a.setAttribute("width",e.toString());a.setAttribute("height",e.toString());a.style.cssText="z-index: 999; position: fixed; bottom: 0;";for(e=0;e<c.length;e++){g&&c[e].reverse();for(var d=0;d<c[e].length;d++)0!=c[e][d]&&(f.beginPath(),f.rect(d*k,e*k,k,k),f.fillStyle=b[c[e][d]],f.fill());g&&c[e].reverse()}return a}var p=[],q=[],m=0,r=0,g=null,f=0,d=t||2,h=!1,a=!1,l=0;document.addEventListener("keypress",
function(c){32==c.keyCode&&0==a&&(a=!0,l=23)});document.addEventListener("touchstart",function(){0==a&&(a=!0,l=23)});(function(){for(var c=["#000000","#dc2900","#fea53b","#8b7300"],b=[[[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],[0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],[0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],[0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],[0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],[0,0,3,3,3,3,1,1,3,3,0,0,0,0,0,0],[2,2,3,3,3,3,1,1,1,3,3,3,2,2,2,0],[2,2,2,0,3,
3,1,2,1,1,1,3,3,2,2,0],[2,2,0,0,1,1,1,1,1,1,1,0,0,3,0,0],[0,0,0,1,1,1,1,1,1,1,1,1,3,3,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,3,3,0,0],[0,3,3,1,1,1,0,0,0,1,1,1,3,3,0,0],[0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],[0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],[0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],[0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],[0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],[0,0,0,0,3,3,1,3,3,3,0,0,0,0,0,0],
[0,0,0,3,3,3,3,1,1,3,3,0,0,0,0,0],[0,0,0,3,3,3,1,1,2,1,1,2,0,0,0,0],[0,0,0,3,3,3,3,1,1,1,1,1,0,0,0,0],[0,0,0,1,3,3,2,2,2,1,1,1,0,0,0,0],[0,0,0,0,1,3,2,2,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,3,3,3,3,0,0,0,0,0],[0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],[0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],[0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],[0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],[0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],[0,0,0,0,0,2,2,2,2,2,2,
2,0,0,0,0],[0,0,0,0,3,3,3,3,1,3,0,2,0,0,0,0],[0,0,0,2,3,3,3,3,3,3,2,2,2,0,0,0],[0,0,2,2,1,3,3,3,3,3,2,2,0,0,0,0],[0,0,3,3,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,3,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,3,3,1,1,1,0,1,1,1,0,0,0,0,0,0],[0,3,0,0,0,0,3,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],[0,0,0,0,0,0,1,1,1,1,1,0,0,2,2,2],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,2],[0,0,0,0,0,3,3,3,2,2,3,2,0,3,3,3],[0,0,0,0,3,2,3,2,2,2,3,2,2,2,3,3],[0,0,0,0,3,2,
3,3,2,2,2,3,2,2,2,0],[0,0,0,0,3,3,2,2,2,2,3,3,3,3,3,0],[0,0,0,0,0,0,2,2,2,2,2,2,2,3,0,0],[0,0,3,3,3,3,3,1,3,3,3,1,3,0,0,0],[0,3,3,3,3,3,3,3,1,3,3,3,1,0,0,3],[2,2,3,3,3,3,3,3,1,3,3,3,1,0,0,3],[2,2,2,0,1,1,3,1,1,2,1,1,2,1,3,3],[0,2,0,3,1,1,1,1,1,1,1,1,1,1,3,3],[0,3,3,3,1,1,1,1,1,1,1,1,1,1,3,3],[0,3,3,3,1,1,1,1,1,1,1,0,0,0,0,0],[0,3,0,0,0,1,1,1,0,0,0,0,0,0,0,0]]],a=0;a<b.length;a++)p.push(n(b[a],c,d,!1)),q.push(n(b[a],c,d,!0))})();setInterval(function(){var c=document.body;null!=g&&(c.removeChild(g),
g=null);var b;if(a)b=3;else switch(m){case 0:b=1;break;case 1:b=0==r?2:0;break;default:b=0}r=m;m=b;g=h?q[b]:p[b];g.style.left=f+"px";a&&(l-=4,b=l*d,0>=b&&(a=!1,l=0),g.style.bottom=b+"px");c.appendChild(g);f>window.innerWidth-16*d&&0==h&&(h=!0);0>f&&1==h&&(h=!1);f=h?f-2*d:f+2*d},50)})();

```
