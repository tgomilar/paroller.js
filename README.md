# paroller.js

A lightweight jQuery plugin that enables parallax scrolling effect.
  - You can use it on elements with background property or on any other element
  - While scrolling elements can move: vertical, horizontal
  - Manipulated through *html data-** attributes
  - Mobile ready
  - Easy to use

**DEMO:** [example page](https://tgomilar.github.io/paroller.js/)

## Install
Before closing </body> element include:

1. [jQuery](http://jquery.com/download/)
2. [jquery.paroller.js](https://github.com/tgomilar/paroller.js/tree/master/dist)

#### Bower

```sh
$ bower install paroller.js
```
#### Run
```javascript
$("body").paroller();
```

## Usage
### data attribute
To enable Paroller on element you have to add *data-paroller-factor* to selected element. 
*data-paroller-factor* sets speed and distance of element's parallax effect on scroll. 


| data-* | value | default value |
| ------ | ------ | ------ |
| data-paroller-factor | invokes *jquery.paroller.js* functionality. It sets elements offset and speed. It can be positive (0.3) or negative (-0.3). Less means slower. | 0 |
| data-paroller-type | background, foreground | background |
| data-paroller-direction | vertical, horizontal | vertical |

### JavaScript
```javascript
$("element").paroller();
```
```javascript
$(window).paroller({ factor: '0.5', type: 'foreground', direction: 'horizontal' });
```

### Todos

 - direction: diagonal

License
----

MIT

