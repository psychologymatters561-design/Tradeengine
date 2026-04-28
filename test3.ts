import https from 'https';

https.get('https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS'), (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
