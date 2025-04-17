document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar').querySelector('ul');
    const mainContent = document.getElementById('content');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Build the navigation menu dynamically
    function buildNavigation() {
        sidebar.innerHTML = ''; // Clear existing menu

        mainContent.querySelectorAll('section').forEach(chapterSection => {
            const chapterTitleElement = chapterSection.querySelector('h2');
            if (!chapterTitleElement) return;

            const chapterId = chapterSection.id;
            const chapterTitle = chapterTitleElement.textContent;

            const chapterItem = document.createElement('li');
            chapterItem.classList.add('chapter');
            const chapterLink = document.createElement('a');
            chapterLink.href = `#${chapterId}`;
            chapterLink.textContent = chapterTitle;
            chapterLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Toggle active class for dropdown
                chapterItem.classList.toggle('active');
                // Scroll to chapter section
                document.getElementById(chapterId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
            chapterItem.appendChild(chapterLink);

            const articleList = document.createElement('ul');
            chapterSection.querySelectorAll('article').forEach(articleSection => {
                const articleTitleElement = articleSection.querySelector('h4');
                 if (!articleTitleElement) return;

                const articleId = articleSection.id;
                const articleTitle = articleTitleElement.textContent;

                const articleItem = document.createElement('li');
                const articleLink = document.createElement('a');
                articleLink.href = `#${articleId}`;
                articleLink.textContent = articleTitle;
                 articleLink.addEventListener('click', (e) => {
                     e.preventDefault();
                     document.getElementById(articleId).scrollIntoView({
                         behavior: 'smooth'
                     });
                 });
                articleItem.appendChild(articleLink);
                articleList.appendChild(articleItem);
            });

            chapterItem.appendChild(articleList);
            sidebar.appendChild(chapterItem);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Search functionality
    function removeHighlights() {
        document.querySelectorAll('.highlight').forEach(span => {
            const parent = span.parentNode;
            parent.replaceChild(document.createTextNode(span.textContent), span);
            parent.normalize(); // Merge adjacent text nodes
        });
    }

    function performSearch() {
        removeHighlights(); // Remove previous highlights

        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm.length < 2) return; // Don't search for very short terms

        let count = 0;
        const elementsToSearch = mainContent.querySelectorAll('p, li'); // Search within paragraphs and list items

        elementsToSearch.forEach(element => {
            // Use textContent to avoid issues with existing HTML, but this limits highlighting to text nodes
            // A more robust method involves traversing text nodes or using regex replace on innerHTML carefully
            // Let's use innerHTML with regex for simplicity and visual effect, being mindful of potential issues

            const originalHTML = element.innerHTML;
            const lowerCaseHTML = originalHTML.toLowerCase();
            const regex = new RegExp(searchTerm, 'gi'); // 'gi' for global, case-insensitive

             if (lowerCaseHTML.includes(searchTerm)) {
                 // Simple regex replace - Be cautious: this can break complex HTML inside the element
                 // It's generally safer to walk the text nodes, but this is quicker for basic structures
                 element.innerHTML = originalHTML.replace(regex, match => `<span class="highlight">${match}</span>`);
                 count++;
             }
        });

        // Optional: Scroll to the first highlight
        const firstHighlight = document.querySelector('.highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        console.log(`Found ${count} elements containing "${searchTerm}"`); // Debugging
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Initial build of the navigation menu
    buildNavigation();
});