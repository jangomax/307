import express from "express";
import cors from 'cors';

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

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

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job || null;
  let result;
  if (name != undefined) {
    if (job) {
      result = findUserByNameAndJob(name, job);
    } else {
      result = findUserByName(name);
    }
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = {
    name: req.body.name,
    job: req.body.job,
    id: generateId()
  }
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  if (findUserById(id) == undefined) {
    res.status(404).send()
    return
  }
  removeUserById(id)
  res.status(204).send()
})

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const removeUserById = (id) => {
  if (users["users_list"].every(u => u["id"] !== id)) {
    return false /* Not found */
  }
  users["users_list"] = users["users_list"].filter(u => u["id"] !== id)
  return true
}

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);


const generateId = () => {
  return `${Math.floor(Math.random() * 2147483647)}`
}
