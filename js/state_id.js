var data = require("./data");
var states_table = data.states_table['states_table'];

var get_state_id = function get_state_id(name){

    filtered = states_table.filter(function(item){
        return item.name.toLowerCase() == name.toLowerCase();
    });

    return filtered['0']['id'];
}

module.exports = {get_state_id};
