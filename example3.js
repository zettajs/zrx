var zrx = require('./zrx');

zrx()
  .load('http://zetta-cloud-2.herokuapp.com')
  .servers()
  .devices()
  .toDevice()
  .subscribe(console.log)
