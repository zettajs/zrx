var zrx = require('./zrx');

zrx()
  .load('http://zetta-cloud-2.herokuapp.com')
  .peer('Detroit')
  .device(function(d) {
    return d.type === 'light';
  })
  .stream('luminosity')
  .subscribe(console.log)
