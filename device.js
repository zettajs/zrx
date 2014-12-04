var Device = module.exports = function(data) {
  this._data = data;

  if (this._data.properties) {
    var self = this;
    Object.keys(this._data.properties).forEach(function(key) {
      self[key] = self._data.properties[key];
    });
  };
};
