import './App.css';
import { useState, useEffect } from 'react';
import ArticleList from './components/ArticleList';
import Form from './components/Form';
import APIService from './components/APIService';

function App() {
  const [articles, setArticles] = useState([]);
  const [editedArticle, setEditedArticle] = useState(null);
  const [formType, setFormType] = useState(null); // Track which form is open
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetch('http://192.168.0.240:8333/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(resp => resp.json())
      .then(resp => setArticles(resp))
      .catch(error => console.log(error));
  }, []);

  // Open the insert article form
  const openInsertForm = () => {
    setEditedArticle({ title: '', body: '' });
    setFormType('insert');
    setFormSubmitted(false);
  };

  // Open the edit article form
  const openEditForm = () => {
    setEditedArticle({title: 'Hello', body: 'World'});
    setFormType('edit');
    setFormSubmitted(false);
  };

  // Open the search box
  const openSearchForm = () => {
    setFormType('search');
    setFormSubmitted(false);
  };

  // Insert a new article
  const insertedArticle = (article) => {
    const newArticles = [...articles, article];
    setArticles(newArticles);
    setFormSubmitted(true); // Mark form as submitted
  };

  // Update an existing article
  const updatedData = (article) => {
    const newArticles = articles.map(myArticle =>
      myArticle.id === article.id ? article : myArticle
    );
    setArticles(newArticles);
    setFormSubmitted(true); // Mark form as submitted
  };

  // Delete an article
  const deleteArticle = (article) => {
    const newArticles = articles.filter(myArticle => myArticle.id !== article.id);
    setArticles(newArticles);
  };

  // Search articles
  const searchArticles = () => {
    APIService.SearchArticle(searchQuery)
      .then(resp => setArticles(resp))
      .catch(error => console.log(error));
  };

  return (
    <div className="App">
      <h1>Hello again React</h1>
      {!formSubmitted && (
        <div className="row">
          <div className="col">
            <button className="btn btn-success" onClick={openInsertForm}>
              Insert Article
            </button>
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={() => openEditForm(articles[0])}>
              Edit Article
            </button>
          </div>
          <div className="col">
            <button className="btn btn-warning" onClick={openSearchForm}>
              Search Article
            </button>
          </div>
        </div>
      )}

      {/* Insert/Edit Form (Conditional Rendering) */}
      {formType === 'insert' || formType === 'edit' ? (
        <Form 
          article={editedArticle} 
          updatedData={updatedData} 
          insertedArticle={insertedArticle} 
          formType={formType} // Pass formType as a prop
        />
      ) : null}

      {/* Search Form */}
      {formType === 'search' ? (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search article by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={searchArticles}>
            Search
          </button>
        </div>
      ) : null}

      {/* Display the Article List */}
      <ArticleList articles={articles} editArticle={openEditForm} deleteArticle={deleteArticle} />
    </div>
  );
}

export default App;
