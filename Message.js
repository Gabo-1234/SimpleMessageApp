import mongoose from "mongoose";
import express from "express";
import connectDB from "./connect.js";

const app = express();
app.use(express.json());

const messageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

async function addMessage(author, text) {
  await connectDB();
  await Message.create({ author, text });
  console.log(`Message saved from ${author}.`);
}

async function readAll() {
  await connectDB();
  const messages = await Message.find();
  if (messages.length === 0) {
    console.log("No messages yet.");
  } else {
    messages.forEach((m) => console.log(`${m.author}: ${m.text}`));
  }
}

async function startServer() {
  await connectDB();

  app.get("/messages", async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
  });

  app.post("/messages", async (req, res) => {
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: "author and text are required" });
    }
    const message = await Message.create({ author, text });
    res.status(201).json(message);
  });

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

async function main() {
  const [, , command, ...args] = process.argv;

  if (command === "add") {
    const [author, text] = args;
    if (!author || !text) {
      console.error('Usage: node app.js add "name" "message"');
      process.exit(1);
    }
    await addMessage(author, text);
    await mongoose.disconnect();
  } else if (command === "readAll") {
    await readAll();
    await mongoose.disconnect();
  } else if (command === "server") {
    await startServer();
  } else {
    console.error("Unknown command. Use: add | readAll | server");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
