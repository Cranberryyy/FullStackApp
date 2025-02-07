import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from './APIService';

function SearchAndEditForm({ onFormSubmit }) {
  const [titleQuery, setTitleQuery] = useState('');
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate(); // Use the navigate hook

  const handleSearch = (e) => {
    e.preventDefault();
    APIService.SearchArticle(titleQuery, descriptionQuery)
      .then(response => {
        setArticles(response);
      })
      .catch(error => console.log(error));
  };

  const handleArticleDoubleClick = (article) => {
    navigate('/details', { state: { article } }); // Navigate to the details page with the article data
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label>Search by Title</label>
          <input 
            type="text" 
            className="form-control" 
            value={titleQuery} 
            onChange={(e) => setTitleQuery(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Search by Description</label>
          <input 
            type="text" 
            className="form-control" 
            value={descriptionQuery} 
            onChange={(e) => setDescriptionQuery(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Search</button>
      </form>
      {articles.length > 0 && (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id} onDoubleClick={() => handleArticleDoubleClick(article)}>
                <td>{article.title}</td>
                <td>{article.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SearchAndEditForm;