var util = require('../util/index');

module.exports = {
  
  models: undefined,
  
  init: function(model) {
    this.models = model; 
    return this;
  },
  
  prev: function() {
    return util.retUndefinedError(this.models);
  },

  logUser: function() {
  
    this.prev();
  
    var User = this.models.User();
    var realUser = new User({
      name: 'function loguser'
    });
  
    return util.retMsg(200, realUser.name);

  }

};
