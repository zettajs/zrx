var siren = require('siren');
var Device = require('./device');

var Zrx = module.exports = function(current) {
  if (!(this instanceof Zrx)) {
    return new Zrx(current);
  }

  this.client = siren(current);
};

Zrx.prototype.load = function(uri) {
  this.client.load(uri);
  return this;
};

Zrx.prototype.server = function(name) {
  this.client.link('http://rels.zettajs.io/peer', name);
  return this;
};

Zrx.prototype.device = function(filter) {
  this.client.entity(function(entity) {
    var device = new Device(entity);
    return filter(device);
  });

  return this;
};

Zrx.prototype.toDevice = function() {
  this.client
    .map(function(env) {
      return new Device(env.response.body);
    });

  return this;
};

Zrx.prototype.transition = function(name, cb) {
  this.client.action(name, cb);
  return this;
};

Zrx.prototype.stream = function(name) {
  this.client
    .link('http://rels.zettajs.io/object-stream', name)
    .monitor();

  return this;
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
    this.client = this.client[m].apply(this.client, args);

    return this;
  };
});
