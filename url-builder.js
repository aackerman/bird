function build(url, options) {
  var newUrl = url;
  if (options.interpolate) {
    options.interpolate = options.interpolate.replace(':', '');
    newUrl = newUrl.replace(options.interpolate, options[options.interpolate]);
  }
  return newUrl + '.' + 'json';
}

module.export.build = build;
