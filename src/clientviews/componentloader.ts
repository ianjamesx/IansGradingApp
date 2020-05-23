let fs = require('fs');
let path = require('path');

interface Component {
  name: string;           //name (same as html file without .html)
  properties: string[];   //all properties needed for component
  code: string;           //code to render component
}

interface Tag {
  tag: string;      //tag to replace (e.g. [id] [message] etc)
  property: string; //property to replace with (e.g. param.id param.message)
}

interface Settings {
  componentpath: string;
  clientpath: string;
}

/*
load components from componentpath
if path contains folders, load all components (recursivley) from there too
*/

let loadComponents = (componentpath: string): any => {

  let absolutepath: string = path.join(__dirname, componentpath);
  let components: any = {};

  if(fs.lstatSync(absolutepath).isDirectory()){ //see if this is a directory

    let filecontent: string[] = fs.readdirSync(absolutepath), i; //scan all files in this dir

    for(i = 0; i < filecontent.length; i++){
      let nextpath: string = path.join(componentpath, filecontent[i]);
      components[filecontent[i].split('.')[0]] = loadComponents(nextpath); //recurse case
    }

  } else {
    return fs.readFileSync(absolutepath, "utf8"); //not a directory, just scan the content and return
  }

  return components;

};

/*
create function we will put in file to return a render of the individual component
function will be a string we put in our client component render file
*/

let componentRenderFunction = (component: Component | any): string => {

  let componentcontent: string = '';

  if(typeof component.name === 'undefined'){ //tell if component is not a component and is object of components if missing name prop
    
    let i: any;
    let j: any;
    for(i in component){ //if not type of component, then create indivdual render functions for all properties in this object
      componentcontent = i + ': {';
      for(j = 0; j < component[i].length; j++){
        componentcontent += componentRenderFunction(component[i][j]);
      }
    }

    componentcontent += '},';

  } else {

    let protoName = component.name;                              //name for function prototype (will be same as component name)
    componentcontent = protoName + ': function(param){';         //function header
    componentcontent += componentErrorCheck(component.properties); //for error checking if missing any properties needed
    componentcontent += 'return ' + component.code + ';';        //return code to render component
    componentcontent += '},';

  }

  return componentcontent;

};

let generateComponentContent = (components: Component[]): string => {

  let i: number;
  let filecontent: string = 'var Components = {'; //closure header

  for(i = 0; i < components.length; i++){
    filecontent += componentRenderFunction(components[i]); //append  component render function
  }

  filecontent += geterrcheckfunction(); //append function for checking errors
  filecontent += '};';
  return filecontent;

};

let remoevDuplicateProps = (properties: any[]): any[] => {
  return Array.from(new Set(properties)); //set properties must be unique, just create a set, and convert back to array
};

let componentErrorCheck = (properties: string[]): string => {

  if(properties.length === 0) return ''; //if we have no properties, no need to error check

  //create array (string of an array) of properties from needed properties for the asset
  let proplist: string = 'var properties = [';
  let i: number;
  for(i = 0; i < properties.length; i++){
    proplist += "'" + properties[i] + "',"
  }

  proplist = proplist.substring(0, proplist.length - 1); //pop off last comma
  proplist += '];\n'; //cap array string

  let errcheckcall: string = 'Components.errorcheck(properties, param);'; //line to call the error checker, passing the properties this asset needs and user object
  return proplist + errcheckcall;

};

let geterrcheckfunction = () => {

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

/*
take an array of the html strings (or objects containing strings) we read from component directory
convert strings to component objects for each component we read in
*/

let renderComponents = (components: any[]): any[] => {

  let i: string;
  let componentdata: Component[] | any[] = []; //can push components or objects containing components in here

  for(i in components){
    if(typeof components[i] !== 'string'){ //object contains more components, recurse thru
      //console.log(components[i]);
      let subcomponents: any = {};
      subcomponents[i] = renderComponents(components[i]);
      componentdata.push(subcomponents);
    } else {

      /*
      as of now, component[i] is just a string
      return function returning that string, replacing content in backticks with parameters
      first, replace everything in brackets with a parameter
      */

      let tempcomp: string = components[i];
      tempcomp = '`' + tempcomp + '`'; //put in backticks to symbol string

      let reg: any = /\[.*?\]/g;             //search for all content enclosed by [brackets]
      let tags: any[] = tempcomp.match(reg); //get all matches for content enclosed in brackets (will be replaced with object properties)

      let compassets: Tag[] = [];   //all our properties names, tags, and what to replace tag with
      let compattrs: string[] = []; //list of all properties we need for this asset (for error checking)

      if(tags){ //tags will be null if not matched anything in regex

        let j: number;
        for(j = 0; j < tags.length; j++){
          tags[j] = tags[j].replace('[', ''); //get rid of brackets
          tags[j] = tags[j].replace(']', '');

          compassets.push({
            tag: '[' + tags[j] + ']',     //recreate the tag so we can replace in the html later
            property: 'param.' + tags[j], //name of the object.property we will replace tag with
          });

          compattrs.push(tags[j]);        //actually property so we can use it for error checking
        }

        compattrs = remoevDuplicateProps(compattrs);

        //replace all instances of tags with object accessor
        for(j = 0; j < compassets.length; j++){
          let replacement: string = '` + ' + compassets[j].property + ' + `';
          tempcomp = tempcomp.replace(compassets[j].tag, replacement);
        }
      }

      let componentname: string = i.replace('.html', ''); //get rid of '.html' at end of file name (to make it into function name)

      componentdata.push({      //put this component into array of all components
        name: componentname,    //name of the component (original name of the html file)
        code: tempcomp,         //code for component render function
        properties: compattrs   //properties needed for component
      });

    }

  }

  return componentdata;

};

let writeComponentFile = (filepath: string, filecontent: string): void => {

  let absolutepath: string = path.join(__dirname, filepath);
  fs.writeFileSync(absolutepath, filecontent);

};

let load = (settings: Settings): void => {

  let componentTemplates: any[] = loadComponents(settings.componentpath); //load components as strings from folder of component html files
  let componentData: any[] = renderComponents(componentTemplates);        //turn component strings into component objects
  let filecontent: string = generateComponentContent(componentData);      //turn objects into functions that return rendered componetns

  writeComponentFile(settings.clientpath, filecontent);                   //write final filecontent output to file to send to client
};

export {
  load
}