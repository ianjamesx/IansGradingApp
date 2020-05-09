var fs = require('fs');
var path = require('path');

/*
NOTE:
Assets refer to components
it was a name change decided when switching to SSR
*/

var readAssets = (settings) => {

  var i, j;

  var filepath = path.join(__dirname, settings.components);
  var appendfiles = fs.readdirSync(filepath); //files containing content used in post-render appending
  var jsfile = path.join(__dirname, settings.renderfile);//file

  var allassets = []; //all html asset content (will contain {name: assetname, code: assetcode} objects)
  for(i = 0; i < appendfiles.length; i++){

    var codepath = filepath + '/' + appendfiles[i];
    var assetcode = fs.readFileSync(codepath, "utf8"); //read in html asset for append feature

    //appendcode = appendcode.replace(/(\r\n|\n|\r)/gm, ''); //take out line breaks (makes file smaller)

    assetcode = '`' + assetcode + '`'; //put in backticks to symbol string

    var reg = /\[.*?\]/g; //search for all content enclosed by [brackets]
    var tags = assetcode.match(reg); //get all matches for content enclosed in brackets (will be replaced with object properties)
    var objectassets = []; //all our properties names, tags, and what to replace tag with
    var assetproperties = []; //list of all properties we need for this asset

    if(tags){ //tags will be null if not matched anything in regex
      for(j = 0; j < tags.length; j++){
        tags[j] = tags[j].replace('[', ''); //get rid of brackets
        tags[j] = tags[j].replace(']', '');

        objectassets.push({
          tag: '[' + tags[j] + ']', //recreate the tag so we can replace in the html later
          obj: 'param.' + tags[j], //name of the object.property we will replace tag with
        });

        assetproperties.push(tags[j]); //actually property so we can use it for error checking

      }

      assetproperties = removeDuplicateProps(assetproperties);

      //replace all instances of tags with object accessor
      for(j = 0; j < objectassets.length; j++){
        var replacement = '` + ' + objectassets[j].obj + ' + `';
        assetcode = assetcode.replace(objectassets[j].tag, replacement);
      }

    }

    var assetname = appendfiles[i].replace('.html', ''); //get rid of '.html' at end of file name (to make it into function name)

    allassets.push({ //put this asset into array of all assets
      name: assetname, //name of the asset (original name of the html file)
      code: assetcode, //code for asset render function
      properties: assetproperties //properties needed for asset
    });

  }

  var filecontent = createAssetFile(allassets); //put in a js file format
  fs.writeFileSync(jsfile, filecontent);

};

var createAssetFile = (assets) => {

  var i;
  var filecontent = 'var assets = {'; //module header

  for(i = 0; i < assets.length; i++){

    var protoName = assets[i].name; //name for function prototype
    var proto = protoName + ': function(param){'; //function header
    proto += errorcheck(assets[i].properties);
    proto += 'return ' + assets[i].code + ';'; //return code
    proto += '},';

    filecontent += proto;

  }

  filecontent += getErrCheckFunction(); //append function for checking errors

  filecontent += '};';
  return filecontent;

};

var removeDuplicateProps = (properties) => {

  return Array.from(new Set(properties)); //set properties must be unique, just create a set, and convert back to array

};

var errorcheck = (properties) => {

  if(properties.length === 0) return ''; //if we have no properties, no need to error check

  //create array (string of an array) of properties from needed properties for the asset
  var proplist = 'var properties = [', i;
  for(i = 0; i < properties.length; i++){
    proplist += "'" + properties[i] + "',"
  }
  proplist = proplist.substring(0, proplist.length - 1); //pop off last comma
  proplist += '];\n'; //cap array string

  var errcheckcall = 'this.errorcheck(properties, param);'; //line to call the error checker, passing the properties this asset needs and user object
  return proplist + errcheckcall;

};

var getErrCheckFunction = () => {

  var errcheck = `errorcheck: function(properties, obj){
    var i;
    for(i = 0; i < properties.length; i++){
      if(typeof obj[properties[i]] === 'undefined'){
        throw new Error('Object property "' + properties[i] + '" not passed to asset renderer');
      }
    }
  }`;

  return errcheck;

};

var load = (settings) => {
  readAssets(settings);
};

module.exports = {
  load: load
};
