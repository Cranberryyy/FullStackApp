import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from './APIService';
import { Alert, Spinner } from 'react-bootstrap';

function InsertForm({ onFormSubmit }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Use the navigate hook

  useEffect(() => {
    console.log("✅ InsertForm component mounted!");
  }, []);

  const handleSubmit = (e) => {
    console.log("🚀 handleSubmit triggered!");
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      console.log("⚠️ Form fields are empty!");
      setMessage("❌ Title and Body cannot be empty!");
      return;
    }

    console.log("🟢 Submitting form with data:", { title, body });
    setLoading(true);

    APIService.InsertArticle({ title, body })
      .then(() => {
        console.log("✅ API call successful!");
        setMessage("✅ Article inserted successfully!");
        setTitle('');
        setBody('');
        setLoading(false);
        onFormSubmit();
        setTimeout(() => setMessage(''), 5000);
      })
      .catch(error => {
        console.error("❌ Insert Failed:", error);
        setMessage("❌ Failed to insert article. Try again.");
        setLoading(false);
        setTimeout(() => setMessage(''), 5000);
      });
  };

  const refresh_window = () => {
    window.location.reload();
  }


  return (
    <div>
      {message && (
        <Alert variant={message.includes("✅") ? "success" : "danger"} className="mt-3 text-center">
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            className="form-control" 
            value={title} 
            onChange={(e) => {
              setTitle(e.target.value);
              console.log("✏️ Title updated:", e.target.value);
            }} 
          />
        </div>
        <div className="form-group">
          <label>Body</label>
          <textarea 
            className="form-control" 
            value={body} 
            onChange={(e) => {
              setBody(e.target.value);
              console.log("📝 Body updated:", e.target.value);
            }} 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary mt-2"
          disabled={!title.trim() || !body.trim() || loading}
        >
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" /> : "Submit"}
        </button>

        <button 
          type="button" 
          className="btn btn-secondary mt-2 ml-2"
          onClick={() => refresh_window()}
        >
          Go Back
        </button>

      </form>
    </div>
  );
}

export default InsertForm;