import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import ArticleList from './components/ArticleList';
import InsertForm from './components/InsertForm';
import SearchAndEditForm from './components/SearchAndEditForm';
import { useNavigate } from 'react-router-dom';
import ChatBot from './components/ChatBot'; // Import Chatbot component

function App() {
  const [articles, setArticles] = useState([]);
  const [editedArticle, setEditedArticle] = useState(null);
  const [formType, setFormType] = useState(null); 
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate(); // Used for navigation

  useEffect(() => {
    fetch('http://192.168.0.240:8333/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(resp => resp.json())
      .then(resp => setArticles(resp))
      .catch(error => console.log(error));
  }, []);

  // Handle article double-click for navigation to details page
  const handleArticleDoubleClick = (article) => {
    navigate('/details', { state: { article } });
  };

  const handleFormSubmit = () => {
    setFormSubmitted(true);
    fetch('http://192.168.0.240:8333/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(resp => resp.json())
      .then(resp => setArticles(resp))
      .catch(error => console.log(error));
  };

  return (
    <div className="App">
      <h1>Article Management</h1>
      {!formSubmitted && (
        <div className="row">
          <div className="col">
            <button className="btn btn-success" onClick={() => setFormType('insert')}>
              Insert Article
            </button>
            <button className="btn btn-primary" onClick={() => setFormType('searchAndEdit')}>
              Search and Edit Article
            </button>
          </div>
        </div>
      )}

      {formType === 'insert' && (
        <InsertForm onFormSubmit={handleFormSubmit} />
      )}

      {formType === 'searchAndEdit' && (
        <SearchAndEditForm onFormSubmit={handleFormSubmit} />
      )}

      {formSubmitted && formType === 'searchAndEdit' ? (
        <table className="table table-striped">
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
      ) : null}

      {formType !== 'searchAndEdit' ? (
        <ArticleList 
          articles={articles} 
          editArticle={(article) => setEditedArticle(article)} 
          deleteArticle={(article) => setArticles(articles.filter(a => a.id !== article.id))} 
        />
      ) : null}
      <ChatBot /> {/* Add Chatbot component */}
    </div>
  );
}

export default App;
