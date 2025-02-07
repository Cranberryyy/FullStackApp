import React, { useState, useEffect } from 'react';
import APIService from '../components/APIService';

function Form(props) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    useEffect(() => {
        if (props.article) {
            setTitle(props.article.title);
            setBody(props.article.body);
        }
    }, [props.article]);

    const handleSubmit = () => {
        if (props.article.id) {
            APIService.UpdateArticle(props.article.id, { title, body })
                .then(resp => {
                    props.updatedData(resp);
                    setSubmitted(true);
                })
                .catch(error => console.log(error));
        } else {
            APIService.InsertArticle({ title, body })
                .then(resp => {
                    props.insertedArticle(resp);
                    setSubmitted(true);
                })
                .catch(error => console.log(error));
        }
    };

    return (
        <div>
            {props.article ? (
                <div className="mb-3">
                    {/* <label htmlFor="Information" className="form-label">Information</label> */}
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        placeholder="Please Enter title"
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={submitted}  // ✅ Disables input after submission
                    />

                    <textarea
                        rows="5"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="form-control"
                        placeholder="Please Enter Description"
                        disabled={submitted}  // ✅ Disables textarea after submission
                    />

                    <button 
                        onClick={handleSubmit} 
                        className="btn btn-success mt-3"
                        disabled={submitted}  // ✅ Disables button after submission
                    >
                        Insert
                        {/* {props.formType === 'edit' ? 'OK' : 'Insert'} */}
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default Form;
