// figure-handler.js
(function() {
    // 1. Internal Map of Friendly Names to API URLs
    const API_URLS = {
        "is_compliant": 'https://bg.api.oa.works/report/works?q=((DOI:%2210.12688/verixiv%22 OR journal:%22gates open research%22 OR supplements.sheets:*pub__bmgf OR supplements.sheets:(%22grantid_cw__bmgf%22 OR %22pmc__bmgf%22 OR %22all-time__bmgf%22 OR %22name_epmc__bmgf%22 OR %22staff__bmgf%22 OR %22name_eupmc_v2__bmgf%22 OR %22works_from_version_matching__bmgf%22 OR %22chronos_v2__bmgf%22 OR %22finance__bmgf%22 OR %22users__bmgf%22 OR %22apc_cost__bmgf%22) OR (funder.DOI:(%2210.13039/100000865%22 OR %2210.13039/501100005370%22 OR %2210.13039/100009053%22) OR funder.name:(%22Gates%20Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22) OR openalx.grants.funder:(%22F4320306137%22 OR %22F4320323264%22 OR %22F4320310978%22)) OR (authorships.institutions.ror:(%220456r8d26%22 OR %22033sn5p83%22) OR authorships.institutions.display_name:(%22Gates%20Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22) OR authorships.raw_affiliation_strings:(%22Gates%20Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22)) OR supplements.funder.display_name_ic:%22gates-foundation%22 OR ((supplements.funding_statement_ic:(%22Gates Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22) OR supplements.acknowledgements_statement:(%22Gates Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22)) AND supplements.sheets:%22support_declarations__all%22)) AND NOT (supplements.removed_from_report:%22gates-foundation%22 OR supplements.is_financial_disclosure:%22gates-foundation%22)) AND (type:(%22article%22 OR %22editorial%22 OR %22letter%22 OR %22review%22) OR DOI:%2210.12688/%22) AND NOT openalx.type_crossref:%22proceedings-article%22 AND NOT (supplements.is_preprint:true OR (pubtype:preprint AND NOT supplements.is_preprint:false) OR subtype:preprint) AND openalex:* AND journal:* AND (publisher_license_v2.keyword:(%22cc-by%22 OR %22pd%22 OR %22cc-0%22 OR %22public-domain%22) OR publisher_license.keyword:(%22cc-by%22 OR %22pd%22 OR %22cc-0%22 OR %22public-domain%22) OR supplements.publisher_license_crossref.keyword:(%22cc-by%22 OR %22cc0%22) OR epmc_licence.keyword:(%22cc-by%22 OR %22pd%22 OR %22cc-zero%22 OR %22cc0%22) OR repository_license.keyword:(%22cc-by%22 OR %22pd%22 OR %22cc-0%22 OR %22public-domain%22) OR repository_license_v2.keyword:(%22cc-by%22 OR %22pd%22 OR %22cc0%22 OR %22public-domain%22) OR supplements.publisher_license_ic.keyword:(%22cc-by%22 OR %22pd%22 OR %22cc0%22) OR supplements.preprint_license.keyword:(%22cc-by%22 OR %22pd%22 OR %22cc-0%22 OR %22public-domain%22) OR supplements.oasupport.status:Successful)&size=0',
        "is_paper": 'https://bg.api.oa.works/report/works?q=((DOI:%2210.12688/verixiv%22 OR journal:%22gates open research%22 OR supplements.sheets:*pub__bmgf OR supplements.sheets:(%22grantid_cw__bmgf%22 OR %22pmc__bmgf%22 OR %22all-time__bmgf%22 OR %22name_epmc__bmgf%22 OR %22staff__bmgf%22 OR %22name_eupmc_v2__bmgf%22 OR %22works_from_version_matching__bmgf%22 OR %22chronos_v2__bmgf%22 OR %22finance__bmgf%22 OR %22users__bmgf%22 OR %22apc_cost__bmgf%22) OR (funder.DOI:(%2210.13039/100000865%22 OR %2210.13039/501100005370%22 OR %2210.13039/100009053%22) OR funder.name:(%22Gates%20Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22) OR openalx.grants.funder:(%22F4320306137%22 OR %22F4320323264%22 OR %22F4320310978%22)) OR (authorships.institutions.ror:(%220456r8d26%22 OR %22033sn5p83%22) OR authorships.institutions.display_name:(%22Gates%20Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22) OR authorships.raw_affiliation_strings:(%22Gates%20Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22)) OR supplements.funder.display_name_ic:%22gates-foundation%22 OR ((supplements.funding_statement_ic:(%22Gates Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22) OR supplements.acknowledgements_statement:(%22Gates Foundation%22 OR %22melinda gates foundation%22 OR %22gates cambridge trust%22 OR %22gates ventures%22)) AND supplements.sheets:%22support_declarations__all%22)) AND NOT (supplements.removed_from_report:%22gates-foundation%22 OR supplements.is_financial_disclosure:%22gates-foundation%22)) AND (type:(%22article%22 OR %22editorial%22 OR %22letter%22 OR %22review%22) OR DOI:%2210.12688/%22) AND NOT openalx.type_crossref:%22proceedings-article%22 AND NOT (supplements.is_preprint:true OR (pubtype:preprint AND NOT supplements.is_preprint:false) OR subtype:preprint) AND openalex:* AND journal:*&size=0'
    };

    // Helper function to fetch the count from a single URL
    const fetchCount = (url, figureElement) => {
        figureElement.textContent = '...'; // Set loading state
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const count = data?.hits?.total; 

                if (count !== undefined) {
                    figureElement.textContent = count.toLocaleString();
                } else {
                    figureElement.textContent = 'N/A';
                }
            })
            .catch(error => {
                console.error(`Error fetching figure:`, error);
                figureElement.textContent = 'Error';
            });
    };

    // 2. Handle Single Count Figures
    document.querySelectorAll('.oa-figure-count').forEach(figureElement => {
        const figureType = figureElement.getAttribute('data-figure-type');
        const apiUrl = API_URLS[figureType];

        if (apiUrl) {
            fetchCount(apiUrl, figureElement);
        } else {
            figureElement.textContent = 'Invalid figure type.';
        }
    });

    // 3. Handle Percentage Calculation Figures
    document.querySelectorAll('.oa-figure-calc').forEach(figureElement => {
        const numeratorName = figureElement.getAttribute('data-numerator');
        const denominatorName = figureElement.getAttribute('data-denominator');

        const numeratorUrl = API_URLS[numeratorName];
        const denominatorUrl = API_URLS[denominatorName];

        if (!numeratorUrl || !denominatorUrl) {
            figureElement.textContent = 'Error: Missing names.';
            return;
        }

        figureElement.textContent = '...'; 

        Promise.all([
            fetch(numeratorUrl).then(res => res.json()),
            fetch(denominatorUrl).then(res => res.json())
        ])
        .then(results => {
            const oaCount = results[0]?.hits?.total;
            const totalCount = results[1]?.hits?.total;

            if (oaCount === undefined || totalCount === undefined || totalCount === 0) {
                figureElement.textContent = '0%';
                return;
            }

            const percentage = (oaCount / totalCount) * 100;
            figureElement.textContent = `${percentage.toFixed(1)}%`;
        })
        .catch(error => {
            console.error(`Error calculating figure:`, error);
            figureElement.textContent = 'Error';
        });
    });
})();
