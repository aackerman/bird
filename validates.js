var _ = require('lodash');

function isType(type, field, object) {
  return _['is' + type](object[field]);
}

function hasPresence(presence, field, object) {
  var value = _.isUndefined(object[field]);
  if (value && presence) {
    return true;
  }
  return false;
}

function isValid(object, validations) {
  var valid = false;
  return _.all(validations, function(options, field){
    return _.all(options, function(value, validation){
      switch(validation) {
        case 'presence':
          return hasPresence(value, field, object);
        case 'type':
          return isType(value, field, object);
      }
    });
  });
}

module.exports.isValid = isValid;
