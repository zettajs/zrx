var Rx = require('rx');
var siren = require('siren');
var Device = require('./device');

var Zrx = module.exports = function(current) {
  if (!(this instanceof Zrx)) {
    return new Zrx(current);
  }

  this.client = siren(current);
  this.root = null;
};

Zrx.prototype.load = function(uri) {
  this.root = uri;
  this.client.load(uri);
  return this;
};

Zrx.prototype.server =
Zrx.prototype.servers =
Zrx.prototype.peer =
Zrx.prototype.peers = function(name) {
  var server = this.client
    .link('http://rels.zettajs.io/server', name)
    .catch(Rx.Observable.empty());

  var peer = siren()
    .load(this.root)
    .link('http://rels.zettajs.io/peer', name)
    .catch(Rx.Observable.empty());

  return new Zrx(server.merge(peer));
};

Zrx.prototype.query = function(ql) {
  return this.transition('query-devices', function(t) {
    t.set('ql', ql);
    return t.submit();
  }).devices();
};

Zrx.prototype.device = Zrx.prototype.devices = function(filter) {
  var client;
  if (typeof filter === 'string') {
    client = this.client.entity(function(entity) {
      var device = new Device(entity);

      return device.type === filter;
    });
  } else {
    client = this.client.entity(function(entity) {
      var device = new Device(entity);
      if (!filter) {
        return device;
      } else {
        return filter(device);
      }
    });
  }

  return new Zrx(client);
};

Zrx.prototype.toDevice = function() {
  var client = this.client
    .map(function(env) {
      return new Device(env.response.body);
    });

  return new Zrx(client);
};

Zrx.prototype.transition = function(name, cb) {
  var client = this.client.action(name, cb);
  return new Zrx(client);
};

// binary streams are not yet supported
Zrx.prototype.stream = function(name) {
  var client = this.client
    .link('http://rels.zettajs.io/object-stream', name)
    .monitor()
    .map(JSON.parse);

  return new Zrx(client);
};

var subscriptionFns = ['subscribe', 'subscribeOnNext', 'subscribeOnError',
  'subscribeOnCompleted', 'subscribeOn'];

subscriptionFns.forEach(function(m) {
  Zrx.prototype[m] = function() {
    var args = Array.prototype.slice.call(arguments);
    return this.client[m].apply(this.client, args);
  }
});

var operators = [
  'amb', 'and', 'asObservable', 'average', 'buffer',
  'bufferWithCount', 'bufferWithTime', 'bufferWithTimeOrCount',
  'catch', 'catchError', 'combineLatest', 'concat', 'concatAll',
  'concatMap', 'concatMapObserver', 'connect', 'contains',
  'controlled', 'count', 'debounce', 'debounceWithSelector',
  'defaultIfEmpty', 'delay', 'delayWithSelector', 'dematerialize',
  'distinct', 'distinctUntilChanged', 'do', 'doOnNext',
  'doOnError', 'doOnCompleted', 'doWhile', 'elementAt',
  'elementAtOrDefault', 'every', 'expand', 'filter', 'finally',
  'ensure', 'find', 'findIndex', 'first', 'firstOrDefault',
  'flatMap', 'flatMapObserver', 'flatMapLatest', 'forkJoin',
  'groupBy', 'groupByUntil', 'groupJoin', 'ignoreElements',
  'indexOf', 'isEmpty', 'join', 'jortSort', 'jortSortUntil',
  'last', 'lastOrDefault', 'let', 'letBind', 'manySelect', 'map',
  'max', 'maxBy', 'merge', 'mergeAll', 'min', 'minBy', 'multicast',
  'observeOn', 'onErrorResumeNext', 'pairwise', 'partition',
  'pausable', 'pausableBuffered', 'pluck', 'publish', 'publishLast',
  'publishValue', 'share', 'shareReplay', 'shareValue', 'refCount',
  'reduce', 'repeat', 'replay', 'retry', 'sample', 'scan', 'select',
  'selectConcat', 'selectConcatObserver', 'selectMany',
  'selectManyObserver', 'selectSwitch', 'sequenceEqual', 'single',
  'singleOrDefault', 'skip', 'skipLast', 'skipLastWithTime',
  'skipUntil', 'skipUntilWithTime', 'skipWhile', 'some', 'startWith',
  /*'subscribe', 'subscribeOnNext', 'subscribeOnError',
  'subscribeOnCompleted', 'subscribeOn', */ 'sum', 'switch',
  'switchLatest', 'take', 'takeLast', 'takeLastBuffer',
  'takeLastBufferWithTime', 'takeLastWithTime', 'takeUntil',
  'takeUntilWithTime', 'takeWhile', 'tap', 'tapOnNext', 'tapOnError',
  'tapOnCompleted', 'throttleFirst', 'throttleWithTimeout',
  'timeInterval', 'timeout', 'timeoutWithSelector', 'timestamp',
  'toArray', 'toMap', 'toSet', 'transduce', 'where', 'window',
  'windowWithCount', 'windowWithTime', 'windowWithTimeOrCount', 'zip'
]

operators.forEach(function(m) {
  Zrx.prototype[m] = function() {
    var args = Array.prototype.slice.call(arguments);
    var client = this.client[m].apply(this.client, args);

    return new Zrx(client);
  };
});
