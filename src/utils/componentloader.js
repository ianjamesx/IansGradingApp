var fs = require('fs');
var path = require('path');

/*
NOTE:
Assets refer to components
it was a name change decided when switching to SSR
*/

var loadcomponents = (componentpath) => {

  var absolutepath = path.join(__dirname, componentpath);
  var components = {};

  if(fs.lstatSync(absolutepath).isDirectory()){ //see if this is a directory

    var filecontent = fs.readdirSync(absolutepath), i; //scan all files in this dir

    for(i = 0; i < filecontent.length; i++){
      var nextpath = path.join(componentpath, filecontent[i]);
      components[filecontent[i].split('.')[0]] = loadcomponents(nextpath); //recurse case
    }

  } else {
    return fs.readFileSync(absolutepath, "utf8"); //not a directory, just scan the content and return
  }

  return components;

};

var createassetrender = (asset) => {

  var componentcontent = '';

  if(typeof asset.name === 'undefined'){
    var i, j;
    for(i in asset){
      componentcontent = i + ': {';
      for(j = 0; j < asset[i].length; j++){
        componentcontent += createassetrender(asset[i][j]);
      }
    }
    componentcontent += '},';

  } else {

    var protoName = asset.name; //name for function prototype
    componentcontent = protoName + ': function(param){'; //function header
    componentcontent += componenterrcheck(asset.properties);
    componentcontent += 'return ' + asset.code + ';'; //return code
    componentcontent += '},';

  }

  return componentcontent;

};

var generatecomponentcontent = (components) => {

  var i;
  var filecontent = 'var components = {'; //module header

  for(i = 0; i < components.length; i++){
    filecontent += createassetrender(components[i]); //append  component data
  }

  filecontent += geterrcheckfunction(); //append function for checking errorss
  filecontent += '};';
  return filecontent;

};

var removeduplicateprops = (properties) => {
  return Array.from(new Set(properties)); //set properties must be unique, just create a set, and convert back to array
};

var componenterrcheck = (properties) => {

  if(properties.length === 0) return ''; //if we have no properties, no need to error check

  //create array (string of an array) of properties from needed properties for the asset
  var proplist = 'var properties = [', i;
  for(i = 0; i < properties.length; i++){
    proplist += "'" + properties[i] + "',"
  }
  proplist = proplist.substring(0, proplist.length - 1); //pop off last comma
  proplist += '];\n'; //cap array string

  var errcheckcall = 'components.errorcheck(properties, param);'; //line to call the error checker, passing the properties this asset needs and user object
  return proplist + errcheckcall;

};

var geterrcheckfunction = () => {

  var errcheck = `errorcheck: function(properties, obj){
    var i;
    if(typeof obj === 'undefined') throw new Error('No object not passed to component loader');
    for(i = 0; i < properties.length; i++){
      if(typeof obj[properties[i]] === 'undefined'){
        var err = 'Object property "' + properties[i] + '" not passed to component loader: requires properties: ' + properties
        throw new Error(err);
      }
    }
  }`;

  return errcheck;

};

/**
@param assets object containing all assets (strings of html code)
e.g.
components {
  component1: <h1>hello!</h1>,
  ...
}
*/

var rendercomponents = (components) => {

  var i;
  var componentdata = [];

  for(i in components){
    if(typeof components[i] === 'object'){ //object contains more components, recurse thru
      //console.log(components[i]);
      var subcomponents = {};
      subcomponents[i] = rendercomponents(components[i]);
      componentdata.push(subcomponents);
    } else {

      /*
      turn component of just a string into a function returning that string
      first, replace everything in brackets with a parameter
      */

      var tempcomp = components[i];

      tempcomp = '`' + tempcomp + '`'; //put in backticks to symbol string

      var reg = /\[.*?\]/g; //search for all content enclosed by [brackets]
      var tags = tempcomp.match(reg); //get all matches for content enclosed in brackets (will be replaced with object properties)

      var compassets = []; //all our properties names, tags, and what to replace tag with
      var compattrs = []; //list of all properties we need for this asset (for error checking)

      if(tags){ //tags will be null if not matched anything in regex
        for(j = 0; j < tags.length; j++){
          tags[j] = tags[j].replace('[', ''); //get rid of brackets
          tags[j] = tags[j].replace(']', '');

          compassets.push({
            tag: '[' + tags[j] + ']', //recreate the tag so we can replace in the html later
            property: 'param.' + tags[j], //name of the object.property we will replace tag with
          });

          compattrs.push(tags[j]); //actually property so we can use it for error checking
        }

        compattrs = removeduplicateprops(compattrs);

        //replace all instances of tags with object accessor
        for(j = 0; j < compassets.length; j++){
          var replacement = '` + ' + compassets[j].property + ' + `';
          tempcomp = tempcomp.replace(compassets[j].tag, replacement);
        }
      }

      var componentname = i.replace('.html', ''); //get rid of '.html' at end of file name (to make it into function name)

      componentdata.push({ //put this component into array of all components
        name: componentname, //name of the component (original name of the html file)
        code: tempcomp, //code for component render function
        properties: compattrs //properties needed for component
      });

    }

  }

  return componentdata;

};

var writecomponentfile = (filepath, filecontent, buffer) => {

  var absolutepath = path.join(__dirname, filepath);
  var components;
  /*
  quickly write a module exports statement
  then get rid of it so its still client friendly
  */
  if(buffer){
    var exportstr = 'module.exports = components';
    filecontent += exportstr;
    fs.writeFileSync(absolutepath, filecontent);
    components = require(absolutepath);
    filecontent = filecontent.replace(exportstr, '');
  }
  /*
  write final final for use on client side
  */
  fs.writeFileSync(absolutepath, filecontent);
  return components;

};

var load = (settings) => {
  var componenttemplates = loadcomponents(settings.components);
  var componentdata = rendercomponents(componenttemplates);
  var jsfilecontent = generatecomponentcontent(componentdata);
  var components = writecomponentfile(settings.renderfile, jsfilecontent, settings.buffer);
  if(settings.buffer) return components;
};

module.exports = {
  load: load
};
