# zrx

* A reactive client for Zetta (https://github.com/zettajs/zetta).

## Install

```
npm install zrx
```

## Example

```js
var zrx = require('./zrx');
 
zrx()
  .load('http://zetta-cloud-2.herokuapp.com')
  .server('Detroit')
  .device(function(d) {
    return d.type === 'display';
  })
  .toDevice()
  .subscribe(function(device) {
    console.log(device.message);
  });
```

## License

MIT
