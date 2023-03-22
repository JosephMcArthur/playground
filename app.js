// Replace with your own values
const searchClient = algoliasearch(
  'J448NRRMMY',
  'd55ee251fd815bdda97dfb3732fbeff9' // search only API key, not admin API key
)

const search = instantsearch({
  indexName: 'dev_oareport',
  searchClient,
  routing: true,
})

search.addWidgets([
  instantsearch.widgets.configure({
    hitsPerPage: 10,
  }),
])

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#search-box',
    placeholder: 'Search for organizations',
  }),
])

search.addWidgets([
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: document.getElementById('hit-template').innerHTML,
      empty: `We didn't find any results for the search <em>"{{query}}"</em>`,
    },
  }),
])

search.start()
