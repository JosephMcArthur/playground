// oa-count-embed.js
(function() {
    // 1. Define the specific API URL provided by the user (OA Count)
    const apiUrl = 'https://bg.api.oa.works/report/works/count?q=(published_date:%3E2024-12-31%20AND%20published_date:%3C2025-11-20)%20AND%20(supplements.preprint_license.keyword%3A(%22cc-by%22%20OR%20%22pd%22%20OR%20%22cc-0%22%20OR%20%22public-domain%22)%20AND%20published_year%3A%3E2024%20AND%20((DOI%3A%2210.12688%2Fverixiv%22%20OR%20journal%3A%22gates%20open%20research%22%20OR%20supplements.sheets%3A*pub__bmgf%20OR%20supplements.sheets%3A(%22grantid_cw__bmgf%22%20OR%20%22pmc__bmgf%22%20OR%20%22all-time__bmgf%22%20OR%20%22name_epmc__bmgf%22%20OR%20%22staff__bmgf%22%20OR%20%22name_eupmc_v2__bmgf%22%20OR%20%22works_from_version_matching__bmgf%22%20OR%20%22chronos_v2__bmgf%22%20OR%20%22finance__bmgf%22%20OR%20%22users__bmgf%22%20OR%20%22apc_cost__bmgf%22)%20OR%20(funder.DOI%3A(%2210.13039%2F100000865%22%20OR%20%2210.13039%2F501100005370%22%20OR%20%2210.13039%2F100009053%22)%20OR%20funder.name%3A(%22Gates%20Foundation%22%20OR%20%22melinda%20gates%20foundation%22%20OR%20%22gates%20cambridge%20trust%22%20OR%20%22gates%20ventures%22)%20OR%20openalx.grants.funder%3A(%22F4320306137%22%20OR%20%22F4320323264%22%20OR%20%22F4320310978%22))%20OR%20(authorships.institutions.ror%3A(%220456r8d26%22%20OR%20%22033sn5p83%22)%20OR%20authorships.institutions.display_name%3A(%22Gates%20Foundation%22%20OR%20%22melinda%20gates%20foundation%22%20OR%20%22gates%20cambridge%20trust%22%20OR%20%22gates%20ventures%22)%20OR%20authorships.raw_affiliation_strings%3A(%22Gates%20Foundation%22%20OR%20%22melinda%20gates%20foundation%22%20OR%20%22gates%20cambridge%20trust%22%20OR%20%22gates%20ventures%22))%20OR%20supplements.funder.display_name_ic%3A%22gates-foundation%22%20OR%20((supplements.funding_statement_ic%3A(%22Gates%20Foundation%22%20OR%20%22melinda%20gates%20foundation%22%20OR%20%22gates%20cambridge%20trust%22%20OR%20%22gates%20ventures%22)%20OR%20supplements.acknowledgements_statement%3A(%22Gates%20Foundation%22%20OR%20%22melinda%20gates%20foundation%22%20OR%20%22gates%20cambridge%20trust%22%20OR%20%22gates%20ventures%22))%20AND%20supplements.sheets%3A%22support_declarations__all%22))%20AND%20NOT%20(supplements.removed_from_report%3A%22gates-foundation%22%20OR%20supplements.is_financial_disclosure%3A%22gates-foundation%22))%20AND%20(openalx.type%3Apreprint%20OR%20supplements.is_preprint%3Atrue%20OR%20(pubtype%3Apreprint%20AND%20NOT%20supplements.is_preprint%3Afalse)%20OR%20subtype%3Apreprint)%20AND%20NOT%20(DOI%3A%2210.12688%2F%22%20AND%20NOT%20DOI%3A%2210.12688%2Fverixiv%22))';
    
    // 2. Create the target element (plain text <span>)
    const figureSpan = document.createElement('span');
    figureSpan.textContent = '...'; // Placeholder while loading
    
    // Insert the <span> right after the script tag
    document.currentScript.parentNode.insertBefore(figureSpan, document.currentScript.nextSibling);

    // 3. Fetch the data
    fetch(apiUrl)
        .then(response => {
            // Check for successful response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // The API returns the count directly in the 'count' property
            if (data && data.count !== undefined) {
                // Set the content as pure, unformatted plain text.
                figureSpan.textContent = data.count.toLocaleString(); // Use .toLocaleString() for commas
            } else {
                figureSpan.textContent = 'N/A';
            }
        })
        .catch(error => {
            console.error('Error fetching OA count:', error);
            figureSpan.textContent = 'Error';
        });
})();
