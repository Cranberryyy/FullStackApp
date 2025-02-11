export default class APIService {
    static UpdateArticle(id, body) {
        return fetch(`http://127.0.0.1:5000/update/${id}/`, {
            'method':'PUT',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
          })
          .then(resp => resp.json())
    }

    static InsertArticle(body) {
        return fetch(`http://127.0.0.1:5000/add`, {
            'method':'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
          })
          .then(resp => resp.json())
    }

    static DeleteArticle(id) {
        return fetch(`http://127.0.0.1:5000/delete/${id}/`, {
            'method':'DELETE',
            headers: {
              'Content-Type':'application/json'
            }
        })
    }

    static SearchArticle(query) {
        return fetch(`http://127.0.0.1:5000/search?query=${query}`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
    }

    static SearchArticle(titleQuery, descriptionQuery) {
        return fetch(`http://127.0.0.1:5000/search?title=${titleQuery}&description=${descriptionQuery}`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
    }

    static async ChatInteract(body) {
        try {
          const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json().catch(() => {
            throw new Error("Invalid JSON format from server");
          });
      
          console.log("Server Response:", data);
          return data;
        } catch (error) {
          console.error("Fetch error:", error);
          throw error;
        }
      }
      
}
      
