from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os
from chat import get_chatbot_response, get_qa_response, get_langchain_response

app = Flask(__name__)
CORS(app)

CSV_FILE = 'articles.csv'

# Ensure the CSV file exists and has the correct headers
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'title', 'body', 'date'])

def read_articles():
    articles = []
    with open(CSV_FILE, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            articles.append(row)
    return articles

def write_articles(articles):
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=['id', 'title', 'body', 'date'])
        writer.writeheader()
        writer.writerows(articles)

@app.route('/get', methods=['GET'])
def get_articles():
    articles = read_articles()
    return jsonify(articles)

@app.route('/get/<id>/', methods=['GET'])
def get_article(id):
    articles = read_articles()
    article = next((article for article in articles if article['id'] == id), None)
    return jsonify(article)

@app.route('/add', methods=['POST'])
def add_article():
    articles = read_articles()
    new_id = str(len(articles) + 1)
    new_article = {
        'id': new_id,
        'title': request.json['title'],
        'body': request.json['body'],
        'date': request.json.get('date', '')
    }
    articles.append(new_article)
    write_articles(articles)
    return jsonify(new_article)

@app.route('/update/<id>/', methods=['PUT'])
def update_article(id):
    articles = read_articles()
    article = next((article for article in articles if article['id'] == id), None)
    if article:
        article['title'] = request.json['title']
        article['body'] = request.json['body']
        article['date'] = request.json.get('date', article['date'])
        write_articles(articles)
    return jsonify(article)

@app.route('/delete/<id>/', methods=['DELETE'])
def delete_article(id):
    articles = read_articles()
    articles = [article for article in articles if article['id'] != id]
    write_articles(articles)
    return jsonify({'message': 'Article deleted'})

@app.route('/search', methods=['GET'])
def search_articles():
    title_query = request.args.get('title', '')
    description_query = request.args.get('description', '')
    articles = read_articles()
    filtered_articles = [
        article for article in articles 
        if title_query.lower() in article['title'].lower() or 
           description_query.lower() in article['body'].lower()
    ]
    return jsonify(filtered_articles)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    if not message.strip():
        return jsonify({'error': 'Message cannot be empty'}), 400

    reply = get_langchain_response(message)
    return jsonify({'reply': reply})

@app.route('/qa', methods=['POST'])
def qa():
    data = request.json
    question = data.get('question', '')
    context = data.get('context', '')
    if not question.strip() or not context.strip():
        return jsonify({'error': 'Question and context cannot be empty'}), 400

    answer = get_qa_response(question, context)
    return jsonify({'answer': answer})

if __name__ == "__main__":
    app.run(debug=True)
