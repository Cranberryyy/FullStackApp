import React from 'react';
import APIService from './APIService';

function ArticleList({ articles, editArticle, deleteArticle, onArticleClick }) {

    const handleEditArticle = (article) => {
        editArticle(article);
    }

    const handleDeleteArticle = (article) => {
        APIService.DeleteArticle(article.id)
        .then(() => deleteArticle(article))
        .catch(error => console.log(error));
    }

    return (
        <div>
            {articles && articles.map(article => (
                <div key={article.id} className="card" onClick={() => onArticleClick(article)}>
                    <div className="card-body">
                        <h5 className="card-title">{article.title}</h5>
                        <p className="card-text">{article.body}</p>
                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleEditArticle(article); }}>Edit</button>
                        <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteArticle(article); }}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ArticleList;