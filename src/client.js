var net = require('net'),
    when = require('when'),
    _ = require('lodash'),
    uuid = require('node-uuid');

exports = module.exports = Client;

function Client(options) {
  this.queue = {};
  this.client = net.connect(options);
  this.client.on('data', this.onData.bind(this));

  this.once = this.once.bind(this);
}

Client.prototype.onData = function (data) {
  var packets;
  packets = data.toString().split(/\s*\n(\[.*\])\s*/gm);
  packets
  .map(this.parsePacket, this)
  .forEach(function (packet) {
    if (packet && packet.id in this.queue) {
      var callback = this.queue[packet.id];
      if (callback) callback.call(this, packet.response);
    }
  }, this);
};

Client.prototype.parsePacket = function (packet) {
  var message = {}, id, response;
  if (_.isEmpty(packet)) { return; }
  try {
    message = JSON.parse(packet);
    if (!_.isArray(message)) { return; }
    id = message.shift();
    response = message.shift();

    if (~~response < 0) { return; }

    return { id: id, response: response };
  } catch (e) {
    return;
  }
};

Client.prototype.once = function () {
  var args = [].slice.call(arguments);
  args.unshift(1);
  return this.listen.apply(this, args);
};

Client.prototype.listen = function (times) {
  var args = [].slice.call(arguments, 1);
  var id = uuid.v4();

  var deferred = when.defer();
  this.queue[id] = function (times) {
    return function (response) {
      if (times === 1) {
        delete this.queue[id];
        deferred.resolve(response);
      } else {
        deferred.notify(response);
      }
      times -= 1;
    };
  }(times);

  args.unshift(id);
  var message = JSON.stringify(args);
  this.client.write(message + '\n');

  return deferred.promise;
};
