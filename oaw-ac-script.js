const searchBox = document.getElementById('searchBox');
const suggestionsList = document.getElementById('suggestionsList');
let selectedIndex = -1;

searchBox.addEventListener('input', async (event) => {
    const searchTerm = event.target.value;

    if (!searchTerm.trim()) {
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
        selectedIndex = -1;
        return;
    }

    try {
        const url = `https://bg.beta.oa.works/report/orgs/suggest/name/${searchTerm}?include=objectID,private`;
        const response = await fetch(url);
        const data = await response.json();

        const filteredData = data.filter(item => !item.private);

        if (Array.isArray(filteredData) && filteredData.some(item => item.hasOwnProperty('name'))) {
            suggestionsList.innerHTML = filteredData.map(result => `<li><a href="https://oa.report/${result.objectID}">${result.name}</a></li>`).join('');
            suggestionsList.style.display = 'block';
            selectedIndex = -1;
        } else {
            suggestionsList.innerHTML = '';
            suggestionsList.style.display = 'none';
            selectedIndex = -1;
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
});

searchBox.addEventListener('keydown', (event) => {
    const items = suggestionsList.getElementsByTagName('li');
    const maxIndex = items.length - 1;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = (selectedIndex === maxIndex) ? 0 : selectedIndex + 1;
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = (selectedIndex === 0) ? maxIndex : selectedIndex - 1;
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedIndex !== -1) {
            window.location.href = items[selectedIndex].firstElementChild.href;
        }
        return;
    } else {
        return;
    }

    Array.from(items).forEach((item, index) => {
        if (index === selectedIndex) {
            item.firstElementChild.focus();
        } else {
            item.firstElementChild.blur();
        }
    });
});

suggestionsList.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'a') {
        searchBox.value = event.target.innerText;
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
        selectedIndex = -1;
    }
});

document.addEventListener('click', (event) => {
    if (event.target !== searchBox) {
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
        selectedIndex = -1;
    }
});
