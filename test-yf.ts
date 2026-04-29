import yf from 'yahoo-finance2';

async function test() {
  try {
    // @ts-ignore
    const yahooFinance = new yf();
    const res = await yahooFinance.quote('RELIANCE.NS');
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
