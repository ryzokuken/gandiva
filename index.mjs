import net from "net";

const client = new net.Socket();
const [host = "0.0.0.0", port = 1337, data = "hello"] = process.argv.slice(2);

client.connect(port, host, () => {
  client.write(data);
});

client.on("data", data => {
  console.log("Received: " + data);
  client.destroy();
});

client.on("close", () => {
  console.log("Connection closed");
});
