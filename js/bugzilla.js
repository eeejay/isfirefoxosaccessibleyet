'use strict';

(function(window) {

  var debug = window.location.href.indexOf('?debug') >= 0;
  var bugzillaUrl = 'https://api-dev.bugzilla.mozilla.org/latest/';
  var bugzillaExtUrl = 'https://bugzilla.mozilla.org/';

  function get(path, callback) {
    var xhr =  new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', function() {
      callback(JSON.parse(this.responseText));
    }, false);
    xhr.send(null);
  }

  function buildUrl(url, prefix, args) {
    var external = url === bugzillaExtUrl;
    url += prefix + '?';

    Object.keys(args).forEach(function(key, index) {
      var val = args[key];
      if (external) {
        if (key === 'whiteboard') {
          key = 'status_whiteboard';
          url += '&status_whiteboard_type=substring';
        } else if (key === 'status') {
          key = 'bug_status';
        }
      }
      if (Object.prototype.toString.call(val) === "[object Array]") {
        val.forEach(function(val) {
          url += '&' + key + '=' + val;
        });
      } else {
        url += '&' + key + '=' + val;
      }
    });

    return url;
  }

  function countUrl(args) {
    return buildUrl(bugzillaUrl, 'count', args);
  }

  function listUrl(args) {
    return buildUrl(bugzillaUrl, 'bug', args)
  }

  function getCount(args, callback) {
    if (debug) {
      setTimeout(function () {
        callback(4);
      });
    } else {
      get(countUrl(args), function(response) {
        callback(response.data);
      });
    }
  }

  function getList(args, callback) {
    if (debug) {
      setTimeout(function () {
        callback([
          { id: '999999', summary: 'foo' }]);
      });
    } else {
      get(listUrl(args), function(response) {
        callback(response.bugs);
      });
    }
  }

  function getExternalUrl(args, prefix) {
    return buildUrl(bugzillaExtUrl, prefix || 'buglist.cgi', args);
  }

  window.bugzilla = {
    getList: getList,
    getCount: getCount,
    getExternalUrl: getExternalUrl,
    bugUrl: 'https://bugzilla.mozilla.org/show_bug.cgi?id='
  };

})(window);
