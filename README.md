# paroller.js

[![npm](https://img.shields.io/npm/v/paroller.js.svg)](https://www.npmjs.com/package/paroller.js)

A lightweight jQuery plugin that enables parallax scrolling effect
  - You can use it on elements with background property or on any other element
  - While scrolling elements can move: vertical, horizontal
  - Manipulated through html data-* attributes or jQuery options
  - Mobile ready
  - Easy to use

**DEMO:** [Example page](https://tgomilar.github.io/paroller.js/), [Alveus](https://alveus.si/en) 

## Install
Before closing ```</body>``` element include:

1. [jQuery](http://jquery.com/download/)
2. [jquery.paroller.js](https://github.com/tgomilar/paroller.js/tree/master/dist)


#### npm
```sh
$ npm install paroller.js
```

#### Bower
```sh
$ bower install paroller.js
```
#### Yarn
```sh
$ yarn add paroller.js
```
## Use
```javascript
// initialize paroller.js 
$('.my-paroller').paroller();
// initialize paroller.js and set attributes 
$("#my-element").paroller({ factor: '0.5', type: 'foreground', direction: 'horizontal' });
```
```html
<!-- select element -->
<div class="my-paroller" data-paroller-factor="0.3" data-paroller-type="foreground" data-paroller-direction="horizontal"></div> 
<div id="my-element"></div>
```

**npm and browserify**
```sh
require('paroller.js');
```

## Options
### data attributes
You can control scrolling parallax effect by setting data-paroller-* values attributes or by setting JavaScript options.

*data-paroller-factor* sets speed and distance of element's parallax effect on scroll. 


| data-* | value | default value |
| ------ | ------ | ------ |
| data-paroller-factor | sets offset and speed. It can be positive (0.3) or negative (-0.3). Less means slower. | 0 |
| data-paroller-type | background, foreground | background |
| data-paroller-direction | vertical, horizontal | vertical |

### JavaScript
```javascript
// initialize paroller.js and set attributes for selected elements
$(".paroller, [data-paroller-factor]").paroller({
    factor: 0.3,            // multiplier for scrolling speed and offset, +- values for direction control
    type: 'foreground',     // background, foreground
    direction: 'horizontal' // vertical, horizontal
});
                
```

License
----

MIT

