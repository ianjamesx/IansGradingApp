
var fs = require('fs');
var path = require('path');

var loadtemplates = (templatepath) => {

  var absolutepath = path.join(__dirname, templatepath);
  var templates = {};

  if(fs.lstatSync(absolutepath).isDirectory()){ //see if this is a directory

    var filecontent = fs.readdirSync(absolutepath), i; //scan all files in this dir

    for(i = 0; i < filecontent.length; i++){
      var nextpath = path.join(templatepath, filecontent[i]);
      templates[filecontent[i].split('.')[0]] = loadtemplates(nextpath); //recurse case
    }

  } else {
    return fs.readFileSync(absolutepath, "utf8"); //not a directory, just scan the content and return
  }

  return templates;

};

var loadassets = (settings) => {

  var i;

  var assetpath = path.join(__dirname, settings.assetspath);
  var assets = fs.readdirSync(assetpath);
  var assetdata = [];

  //custom delims (is user passes them)
  var delimstart = settings.delimstart || '[', delimend = settings.delimend || ']';

  for(i = 0; i < assets.length; i++){

    var assetName = (assets[i].split('.'))[0];
    assetName = delimstart + assetName + delimend;

    assetdata.push({
      tag: assetName, //tag for asset (e.g. [sidebar])
      file: assetpath + '/' + assets[i] //file path for asset
    });

  }

  for(i in assetdata){
    var assetCode = fs.readFileSync(assetdata[i].file, "utf8");
    assetdata[i].asset = assetCode; //actual code for asset
  }

  return assetdata;

};

var renderassets = (templates, assets) => {

  var i, j;
  for(i in templates){

    if(typeof templates[i] === 'object'){ //object contains more assets, recurse thru
      renderassets(templates[i], assets);
    } else {

      for(j = 0; j < assets.length; j++){ //iterate all assets to search/replace for
        templates[i] = templates[i].replace(assets[j].tag, assets[j].asset); //render asset to tag
      }

    }

  }

};

//only export this function
var load = (settings) => {
  var templates = loadtemplates(settings.templatepath);
  var assets = loadassets(settings);
  renderassets(templates, assets);
  return templates;
};

module.exports = {
  load: load
};
