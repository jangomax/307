import React from "react";
import { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
}

function MyApp() {

  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );


  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json()
        } else {
          throw new Error(`Failed to add new user. Status ${response.status}`)
        }
      })
      .then((user) => {
        setCharacters([...characters, user])
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function removeOneCharacter(id) {
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (response.status === 204) {
          const updated = characters.filter((character) => {
            return character._id !== id;
          });

          setCharacters(updated);

          console.log(`Deleted character : ${id}`)
        } else if (response.status === 404) {
          console.log(`Character ${id} not found`)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList}/>
    </div>
  );
}

export default MyApp;
