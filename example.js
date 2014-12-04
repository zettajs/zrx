var Rx = require('rx');
var zrx = require('./zrx');
 
var display = new Rx.ReplaySubject();
 
zrx()
  .load('http://zetta-cloud-2.herokuapp.com')
  .server('Detroit')
  .device(function(d) {
    return d.type === 'display';
  })
  .subscribe(display);
 
zrx(display)
  .stream('message')
  .take(1)
  .subscribe(function(message) {
    console.log(message);
  });

var timer = Rx.Observable.timer(2000)
  .flatMap(function() {
    return display;
  });

zrx(timer)
  .transition('change', function(t) {
    t.set('message', 'Hello world: ' + Date.now());
    return t.submit();
  })
  .toDevice()
  .subscribe(function(device) {
    console.log(device.message);
  });
