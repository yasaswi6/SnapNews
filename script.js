const NEWS_API_KEY = 'ec48b2493593467a8947d0253d2786a2';
let currentTopic = localStorage.getItem('currentTopic') || '';
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;

function fetchNews(topic) {
    currentTopic = topic;
    currentPage = 1;
    localStorage.setItem('currentTopic', currentTopic);
    localStorage.setItem('currentPage', currentPage);
    fetchNewsArticles();
}

function fetchNewsArticles() {
    const url = `https://newsapi.org/v2/everything?q=${currentTopic}&language=en&sortBy=publishedAt&pageSize=5&page=${currentPage}&apiKey=${NEWS_API_KEY}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'ok') {
                alert('Failed to fetch news.');
                return;
            }
            displayNews(data.articles);
        })
        .catch(error => console.error('Error fetching the news:', error));
}

function displayNews(articles) {
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        window.location.href = '/news.html';
        return;
    }

    const newsContainer = document.getElementById('news-articles');
    const topicTitle = document.getElementById('topic-title');
    topicTitle.textContent = `Latest ${currentTopic.charAt(0).toUpperCase() + currentTopic.slice(1)} News in Singapore`;

    if (currentPage === 1) {
        newsContainer.innerHTML = '';
    }

    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `
            <h2>${article.title}</h2>
            <p>Author: ${article.author || 'Unknown'}</p>
            <p>${article.description}</p>
            <p>${article.content || 'Content not available'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function loadMore() {
    currentPage++;
    localStorage.setItem('currentPage', currentPage);
    fetchNewsArticles();
}

function switchTopic() {
    localStorage.removeItem('currentTopic');
    localStorage.removeItem('currentPage');
    window.location.href = '/index.html';
}

window.onload = () => {
    if (currentTopic) {
        fetchNewsArticles();
    }
};