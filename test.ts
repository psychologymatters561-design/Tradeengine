import https from 'https';

https.get('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS'), (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
