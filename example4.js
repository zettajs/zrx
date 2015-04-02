var Rx = require('rx');
var zrx = require('./zrx');

var subject = new Rx.ReplaySubject();

var detroit = zrx()
  .load('http://zetta-cloud-2.herokuapp.com')
  .server('Detroit')
  .subscribe(subject);

var lightQuery = zrx(subject).query('where type="light"');
var displayQuery = zrx(subject).query('where type="display"');

Rx.Observable.zipArray(lightQuery, displayQuery)
  .map(function(devices) {
    return devices.map(function(device) {
      return device.request.raw.uri;
    });
  })
  .subscribe(function(devices) {
    var light = zrx().load(devices[0]);
    var display = new Rx.ReplaySubject();

    zrx().load(devices[1]).subscribe(display);

    light
      .stream('luminosity')
      .subscribe(function(msg) {
        if (msg.data > 785) {
          zrx(display).transition('change', function(t) {
            t.set('message', 'Blinking: ' + Date.now());
            return t.submit();
          })
          .toDevice()
          .subscribe(function() {
            console.log('blinking');
          });
        }
      });
  });
