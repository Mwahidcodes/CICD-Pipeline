import { useEffect, useState } from "react";

const API_URL = "/api/notes"; //replaced line

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.log("Error fetching notes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please enter title and description");
      return;
    }

    const noteData = {
      title,
      description
    };

    if (editId) {
      await updateNote(editId, noteData);
    } else {
      await addNote(noteData);
    }

    clearForm();
    getNotes();
  };

  const addNote = async (noteData) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(noteData)
      });
    } catch (error) {
      console.log("Error adding note:", error);
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(noteData)
      });
    } catch (error) {
      console.log("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");

    if (!confirmDelete) {
      return;
    }

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      getNotes();
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  };

  const editNote = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setDescription(note.description);
  };

  const clearForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="app">
      <h1>React Note App</h1>

      <div className="layout">
        <form className="note-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Update Note" : "Add Note"}</h2>

          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Enter note description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <button type="submit">
            {editId ? "Update Note" : "Add Note"}
          </button>

          {editId && (
            <button type="button" className="cancel-btn" onClick={clearForm}>
              Cancel
            </button>
          )}
        </form>

        <div className="notes-section">
          <h2>All Notes</h2>

          {notes.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div className="note-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>

                  <div className="note-actions">
                    <button className="edit-btn" onClick={() => editNote(note)}>
                      Edit
                    </button>

                    <button className="delete-btn" onClick={() => deleteNote(note.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;