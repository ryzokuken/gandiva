import net from "net";

const [
  host = "0.0.0.0",
  port = 1337,
  payload = "hello",
  numClients = 5,
  count = 200
] = process.argv.slice(2);

const clients = [];
for (let i = 0; i < numClients; i++) {
  clients.push(makeClient(payload, count));
}
Promise.all(clients).then(times => {
  const [mean, min, max] = processValues(times);
  console.log(`Min time: ${min}`);
  console.log(`Mean time: ${mean}`);
  console.log(`Max time: ${max}`);
});

function makeRequest(client, data) {
  return new Promise(resolve => {
    client.write(data);
    client.once("data", () => {
      resolve();
    });
  });
}

function makeClient(payload, count) {
  return new Promise(resolve => {
    const client = new net.Socket();
    const start = Date.now();
    client.connect(port, host, async () => {
      for (let i = 0; i < count; i++) {
        await makeRequest(client, payload);
      }
      client.destroy();
      resolve(Date.now() - start);
    });
  });
}

function processValues(values) {
  const len = values.length;
  if (len === 0) return [];
  let [sum, min, max] = new Array(3).fill(values[0]);
  for (let i = 1; i < len; i++) {
    const val = values[i];
    sum += val;
    if (val < min) min = val;
    if (val > max) max = val;
  }
  return [sum / len, min, max];
}
