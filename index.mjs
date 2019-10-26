import net from "net";

const client = new net.Socket();

client.connect(1337, "127.0.0.1", () => {
  client.write("kappa");
});

client.on("data", data => {
  console.log("Received: " + data);
  client.destroy();
});

client.on("close", () => {
  console.log("Connection closed");
});
