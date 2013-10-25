###*
 * Wrapper for the master client
###

master = null

# Encapsulate the id
Client = (id) ->
  return (args...) -> master.once(id, args...)

Client._init = (_master) ->
  master = _master

module.exports = Client