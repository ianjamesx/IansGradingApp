var hello = async () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done!"), 1000)
  });

  let result = await promise; // wait until the promise resolves (*)
  return result;

  //console.log(result); // "done!"
};

var hello2 = async () => {

  return await hello();

};
var start = () => {
  hello2().then(console.log);
};

var sync = () => {


};

start();
