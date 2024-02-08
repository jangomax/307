import express from "express";
import cors from 'cors';
import { addUser, getUsers, findUserById, findUserByName, findUserByJob, deleteUserById } from "./models/user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

app.get("/users", async (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  try {
    const result = await getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await findUserById(id);
  if (result === undefined || result === null)
    res.status(404).send("Resource not found.");
  else {
    res.send({ users_list: result });
  }
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const user = await findUserById(id);
  if (!user) {
    return res.status(404).send();
  }
  await deleteUserById(id);
  res.status(204).send();
});
