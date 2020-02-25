const path = require("path");

__basedir = path.join(__dirname, "..", "..");

xrequire = (...module) => {
  if (module[0] && module[0].startsWith(".")) {
    return require(path.resolve(...module));
  }

  return require(module[0]);
};

xrequire.cache = require.cache;
xrequire.main = require.main;

xrequire.resolve = (request, options = null) => {
  if (request.startsWith(".")) {
    return require.resolve(path.resolve(request), options);
  }

  return require.resolve(request, options);
};

xrequire.resolve.paths = request => {
  if (request.startsWith(".")) {
    return require.resolve.paths(path.resolve(request));
  }

  return require.resolve.paths(request);
};
