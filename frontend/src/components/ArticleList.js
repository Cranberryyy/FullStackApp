import React from 'react';
import APIService from './APIService';

function ArticleList(props) {

    const editArticle = (article) => {
        props.editArticle(article);
    }

    const deleteArticle = (article) => {
        APIService.DeleteArticle(article.id)
        .then(() => props.deleteArticle(article))
        .catch(error => console.log(error));
    }

    return (
        <div>
            {props.articles && props.articles.map(article => (
                <div key={article.id} className="card">
                    <div className="card-body">
                        <h5 className="card-title">{article.title}</h5>
                        <p className="card-text">{article.body}</p>
                        <button className="btn btn-primary" onClick={() => editArticle(article)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => deleteArticle(article)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ArticleList;
