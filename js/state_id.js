var data = require("./data");
var states_table = data.states_table['states_table'];

var get_state = function get_state(name){
    filtered = states_table.filter(function(item){
        return item.name == name;         
    });
    return filtered['0']['id'];
}

module.exports = {get_state};
