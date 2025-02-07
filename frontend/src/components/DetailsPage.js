import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import APIService from './APIService';
import './DetailsPage.css'; // Import the CSS file for styling

const DetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article; // Get the passed article details

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(article?.title || '');
  const [body, setBody] = useState(article?.body || '');

  if (!article) {
    return <h2>No article selected</h2>;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    APIService.UpdateArticle(article.id, { title, body })
      .then(() => {
        setIsEditing(false);
        navigate(-1); // Go back to the previous page after saving
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="details-page">
      <div className="box">
        <h2>Title</h2>
        {isEditing ? (
          <input 
            type="text" 
            className="form-control" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        ) : (
          <p>{article.title}</p>
        )}
      </div>
      <div className="box">
        <h2>Description</h2>
        {isEditing ? (
          <textarea 
            className="form-control" 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
          />
        ) : (
          <p>{article.body}</p>
        )}
      </div>
      {isEditing ? (
        <button className="btn btn-primary" onClick={handleSaveClick}>
          Save
        </button>
      ) : (
        <button className="btn btn-secondary" onClick={handleEditClick}>
          Edit
        </button>
      )}
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default DetailsPage;