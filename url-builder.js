function build(opts, options) {
  var url = opts.url, val;
  if (opts && opts.interpolate) {
    val = options[opts.interpolate];
    if (val) {
      url = url.replace(":" + opts.interpolate, options[opts.interpolate]);
    } else {
      throw new Error('Missing interpolation value: ' + opts.interpolate + ' in options');
    }
  }
  return url + '.json';
}

module.exports.build = build;
