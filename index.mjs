import net from "net";

const [
  host = "0.0.0.0",
  port = 1337,
  data = "hello",
  numClients = 5,
  count = 200
] = process.argv.slice(2);

(async () => {
  const start = Date.now();
  for (let i = 0; i < numClients; i++) {
    await makeClient(data, count);
  }
  console.log(Date.now() - start);
})();

function makeRequest(client, data) {
  return new Promise(resolve => {
    client.write(data);
    client.on("data", res => {
      if (res.toString() === data) resolve();
    });
  });
}

function makeClient(data, count) {
  return new Promise(resolve => {
    const client = new net.Socket();
    client.setMaxListeners(count);
    client.connect(port, host, async () => {
      for (let i = 0; i < count; i++) {
        await makeRequest(client, data + i);
      }
      client.destroy();
      resolve();
    });
  });
}
