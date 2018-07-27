'use strict';
const BitMEXClient = require('./index');
var fs = require('fs');



const client = new BitMEXClient({testnet: true});
client.on('error', console.error);
client.on('open', () => console.log('Connection opened.'));
client.on('close', () => console.log('Connection closed.'));
client.on('initialize', () => console.log('Client initialized, data is flowing.'));

client.addStream('XBTUSD', 'orderBook10', function(data, symbol, tableName) {
  console.log(`Got update for ${tableName}:${symbol}.`);
  let writeData = processData(data[0]);

  fs.appendFile("C:/tmp/data.csv", 
    writeData, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  }); 
});

const processData = (data) => {
  let writeData = '';
  let bids ='';
  let asks = '';
  data.bids.forEach((element)=> {
    bids = bids.concat(element[0].toString(),",",element[1].toString(),",");
  })


  data.asks.forEach((element)=> {
    asks = asks.concat(element[0].toString(),",",element[1].toString(),",");
  })

  writeData = writeData.concat(
    data.symbol.toString(),',',
    data.timestamp, ',', 
    'bits',',', bids, ',',
    'asks',',', asks, '\n'
  )
  return writeData;
}