import net from "net";

const [
  host = "0.0.0.0",
  port = 1337,
  data = "hello",
  count = 100
] = process.argv.slice(2);

const requests = [];
const start = Date.now();

for (let i = 0; i < count; i++) {
  const req = new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.connect(port, host, () => {
      client.write(data);
    });
    client.on("data", () => {
      client.destroy();
      resolve();
    });
    setTimeout(() => {
      reject("request timed out");
    }, 1000);
  });
  requests.push(req);
}

Promise.all(requests)
  .then(() => {
    console.log(Date.now() - start);
  })
  .catch(e => {
    console.error(e);
  });
