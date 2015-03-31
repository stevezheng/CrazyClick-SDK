var php = require('phpjs');
var request = require('request');
var crypto = require('crypto');
var moment = require('moment');
var _ = require('underscore');

var md5 = function (str) {
  var instance = crypto.createHash('md5');
  instance.update(str, 'utf8');
  return instance.digest('hex');
};

var CrazyClick= function (appkey, appsecret, baseUrl) {
  this.appkey = appkey;
  this.appsecret = appsecret;
  this.baseUrl = baseUrl;
};

CrazyClick.prototype = {
  constructor: CrazyClickService,
  request: function (method, data, cb) {
    var self = this;
    var sysParams = {
      appkey: self.appkey
      , timestamp: moment().unix()
    };

    var params = php.array_merge(sysParams, data);
    params['sign'] = self._genSign(method, params);

    var requestUrl = self.baseUrl + method;

    request.post(requestUrl, {form: params}, function (err, res, body) {
      var r = php.json_decode(body, true);
      cb(r);
    });
  },
  _genSign: function (method, params) {
    var self = this;
    var keys = _.keys(params);
    keys.sort();

    var signString = method.trim();
    for (var i = 0; i < keys.length; i++) {
      signString += params[keys[i]]
    }

    signString = md5((signString + md5(self.appsecret)).trim());
    return signString.toLowerCase();
  }
};

module.exports = CrazyClick;
