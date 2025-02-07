import React, { useState } from 'react';
import APIService from './APIService';

function InsertForm({ onFormSubmit }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    APIService.InsertArticle({ title, body })
      .then(response => {
        onFormSubmit();
      })
      .catch(error => console.log(error));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="form-group">
        <label>Title</label>
        <input 
          type="text" 
          className="form-control" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Body</label>
        <textarea 
          className="form-control" 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2">Submit</button>
    </form>
  );
}

export default InsertForm;
