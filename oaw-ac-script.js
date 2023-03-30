const searchBox = document.getElementById('searchBox');
const suggestionsList = document.getElementById('suggestionsList');

searchBox.addEventListener('input', async (event) => {
    const searchTerm = event.target.value;

    if (!searchTerm.trim()) {
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
        return;
    }

    try {
        const url = `https://bg.beta.oa.works/report/orgs/suggest/name/${searchTerm}?include=objectID`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data) && data.some(item => item.hasOwnProperty('name'))) {
            suggestionsList.innerHTML = data.results.map(result => `<li>${result.name}</li>`).join('');
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.innerHTML = '';
            suggestionsList.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
});

suggestionsList.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'li') {
        searchBox.value = event.target.innerText;
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
    }
});

document.addEventListener('click', (event) => {
    if (event.target !== searchBox) {
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
    }
});
