var state_stats = async function state_stats(){
    var item = {}
    var url = "https://api.covidtracking.com/v1/states/current.json";
    var get = await fetch(url);
    var data = await get.json()
    var len_j = data.length
    var items = ['death', 'positive', 'negative', 'totalTestResultsSource', 'hospitalizedCurrently']                      
    var value = 0
    for(i in items){
        value = 0
        for(j=0; j<len_j; j++){
            value += data[j][items[i]]
        }
        item[items[i]] = value/len_j
    }
    
    return item
}


var fetch = require('node-fetch');
module.exports = {state_stats};