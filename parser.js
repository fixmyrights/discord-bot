const states = require("./states.json");

exports.state = function(input) {
  const uppercaseInput = input.toUpperCase();

  if (uppercaseInput == "ALL") {
    return uppercaseInput;
  }

  const stateByName = states.find(state => state.name == uppercaseInput);
  const stateByCode = states.find(state => state.code == uppercaseInput);

  return (stateByName || stateByCode || {code: null}).code;
}

exports.title = function(bill) {
  let title = bill.title.toLowerCase()

  title.replace(/-/g, " ");

  return title;
}
