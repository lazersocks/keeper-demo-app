import "../App.css";
import React, { useState } from "react";
import Header from "../components/Header";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import eb from "@src/eb";
import { useEffect } from "react";

function Home() {
  const [notes, setNotes] = useState([]);
  const [msg, setMsg] = useState("");
  console.log("current user", eb.auth.currentUser());

  async function addNote(newNote) {
    try {
      const res = await eb.db.createRecord("notes", {
        user: {
          type: "foreign_key",
          ref: eb.auth.currentUser(),
          collection: "users",
        },
        title: newNote.title,
        content: newNote.content,
      });
      setNotes((prevNotes) => {
        return [...prevNotes, newNote];
      });
    } catch (error) {
      setMsg(error.error);
    }
  }

  async function getNotes() {
    try {
      const res = await eb.db.listRecords("notes",{
        "user.ref": eb.auth.currentUser(),
      },{sort: {"createdAt":-1}},true)
      setNotes(res.data);
      
    } catch (error) {
      setMsg(error.error);
    }
  }
  

  useEffect(() => {
    getNotes();
  }, []);

  async function deleteNote(id) {
    try{
      const res = await eb.db.deleteRecord("notes", {
        _id: id,
      });

      setNotes((prevNotes) => {
        return prevNotes.filter((noteItem, index) => {
          return noteItem._id !== id;
        });
      });

    }
    catch(error){
      setMsg(error.error);
    }

  }

  return (
    <div>
      <Header />
      {msg}
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
    </div>
  );
}

export default Home;
