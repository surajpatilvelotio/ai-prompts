/**
 * AI Prompts Library
 * Main JavaScript for handling the UI interactions and data loading
 */
document.addEventListener('DOMContentLoaded', () => {
    // ======================
    // Global state management
    // ======================
    const state = {
        prompts: [],
        filteredPrompts: [],
        activeFilters: {
            type: [],
            section: [],
            tag: []
        },
        searchQuery: '',
        isLoading: true
    };

    // ======================
    // DOM element references
    // ======================
    const domElements = {
        searchInput: document.getElementById('search-input'),
        searchButton: document.getElementById('search-button'),
        promptsContainer: document.getElementById('prompts-container'),
        promptCountElem: document.getElementById('prompt-count'),
        filterButtons: document.querySelectorAll('.filter-button'),
        filterToggle: document.getElementById('filter-button'),
        filterSidebar: document.getElementById('filter-sidebar'),
        filterCheckboxes: document.querySelectorAll('input[type="checkbox"]'),
        modal: document.getElementById('prompt-modal'),
        modalContent: document.getElementById('modal-content'),
        closeModal: document.querySelector('.close')
    };

    // ======================
    // Initialization
    // ======================
    function init() {
        loadPrompts()
            .then(() => {
                updatePromptCount();
                renderPrompts(state.prompts);
                state.isLoading = false;
            })
            .catch(error => {
                console.error('Failed to initialize:', error);
                showErrorState('Failed to load prompts. Please try again later.');
                state.isLoading = false;
            });

        attachEventListeners();
    }

    // ======================
    // Event listeners
    // ======================
    function attachEventListeners() {
        // Search functionality
        domElements.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        domElements.searchButton.addEventListener('click', performSearch);

        // Filter functionality
        domElements.filterToggle.addEventListener('click', () => {
            const mainContent = document.querySelector('.main-content');
            const isExpanded = mainContent.classList.toggle('show-sidebar');
            domElements.filterToggle.setAttribute('aria-expanded', isExpanded.toString());
        });

        domElements.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('active');
                updateActiveFilters();
                filterPrompts();
            });
        });

        domElements.filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateActiveFilters();
                filterPrompts();
            });
        });

        // Modal functionality
        domElements.closeModal.addEventListener('click', closePromptModal);

        window.addEventListener('click', (e) => {
            if (e.target === domElements.modal) {
                closePromptModal();
            }
        });

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && domElements.modal.style.display === 'block') {
                closePromptModal();
            }
        });
    }

    // ======================
    // Data loading functions
    // ======================
    async function loadPrompts() {
        try {
            const baseUrl = getBaseUrl();
            const indexPath = `${baseUrl}/prompt-index.json`;
            
            const indexResponse = await fetch(indexPath);
            
            if (!indexResponse.ok) {
                throw new Error(`Failed to load prompt index (${indexResponse.status})`);
            }
            
            const promptIndex = await indexResponse.json();
            
            // Sort prompts by title for consistent display
            promptIndex.sort((a, b) => a.title.localeCompare(b.title));
            
            state.prompts = promptIndex;
            state.filteredPrompts = [...promptIndex];
            
            console.log(`Loaded ${promptIndex.length} prompts successfully`);
            return promptIndex;
        } catch (error) {
            console.error('Error loading prompts:', error);
            showEmptyState();
            throw error;
        }
    }

    function getBaseUrl() {
        const url = window.location.href;
        
        // Check if we're on GitHub Pages
        if (url.includes('github.io')) {
            return '';  // Root level on GitHub Pages
        }
        
        // For local development
        const pathname = window.location.pathname;
        
        if (pathname.includes('/site/')) {
            return '.';
        }
        
        return '.';
    }

    // ======================
    // UI rendering functions
    // ======================
    function renderPrompts(prompts) {
        if (prompts.length === 0) {
            domElements.promptsContainer.innerHTML = '<div class="loading">No prompts found matching your criteria.</div>';
            return;
        }

        domElements.promptsContainer.innerHTML = '';
        
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        prompts.forEach(prompt => {
            const card = createPromptCard(prompt);
            fragment.appendChild(card);
        });
        
        domElements.promptsContainer.appendChild(fragment);
    }

    function createPromptCard(prompt) {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        
        // Extract username from contributor for avatar
        let username = 'user';
        const usernameMatch = prompt.contributor?.match(/@([a-zA-Z0-9-_]+)/);
        if (usernameMatch) {
            username = usernameMatch[1];
        }
        
        // Create card content
        card.innerHTML = `
            <div class="prompt-title">${escapeHtml(prompt.title || 'Untitled Prompt')}</div>
            <div class="prompt-description">${escapeHtml(prompt.description || '')}</div>
            <div class="prompt-tags">
                ${(prompt.tags || []).slice(0, 3).map(tag => 
                    `<span class="prompt-tag">${escapeHtml(tag)}</span>`
                ).join('')}
            </div>
            <div class="prompt-author">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random" 
                     alt="${escapeHtml(username)}" class="author-avatar" loading="lazy">
                <span class="author-name">${escapeHtml(prompt.contributor || 'Unknown')}</span>
            </div>
        `;
        
        // Add click handler
        card.addEventListener('click', () => {
            showPromptDetails(prompt);
        });
        
        return card;
    }

    function showPromptDetails(prompt) {
        if (!prompt) return;
        
        // Get the data from the prompt object, with fallbacks
        const title = escapeHtml(prompt.title || 'Untitled Prompt');
        const promptText = prompt.promptText || '';
        const description = escapeHtml(prompt.description || '');
        
        // Create clean HTML structure for the modal
        let html = `
            <div class="modal-header">
                <h1 id="modal-title">${title}</h1>
                <button class="copy-button" id="copy-prompt-button" aria-label="Copy prompt text">
                    <i class="fas fa-copy" aria-hidden="true"></i> Copy
                </button>
            </div>
            <div class="modal-body">
                <div class="prompt-description">
                    ${description}
                </div>
                
                <div class="prompt-content">
                    <pre><code>${escapeHtml(promptText)}</code></pre>
                </div>
                
                <div class="prompt-meta">
                    <div class="prompt-contributor">${escapeHtml(prompt.contributor || 'Unknown')}</div>
                    <div class="prompt-tags">
                        ${(prompt.tags || []).map(tag => 
                            `<span class="prompt-tag">${escapeHtml(tag)}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Set the modal content
        domElements.modalContent.innerHTML = html;
        
        // Add event listener to the copy button
        const copyButton = document.getElementById('copy-prompt-button');
        if (copyButton && promptText) {
            copyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                copyToClipboard(promptText)
                    .then(() => {
                        copyButton.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied!';
                        copyButton.style.backgroundColor = 'var(--success-color)';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i> Copy';
                            copyButton.style.backgroundColor = '';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Copy failed:', err);
                        copyButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> Failed';
                        copyButton.style.backgroundColor = 'var(--error-color)';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i> Copy';
                            copyButton.style.backgroundColor = '';
                        }, 2000);
                    });
            });
        }
        
        // Reset scroll position and show modal
        document.querySelector('.modal-content').scrollTop = 0;
        domElements.modal.style.display = 'block';

        // Set focus to the modal for accessibility
        setTimeout(() => {
            domElements.closeModal.focus();
        }, 100);
    }

    function closePromptModal() {
        domElements.modal.style.display = 'none';
        document.querySelector('.modal-content').scrollTop = 0;
        
        // Return focus to the element that was focused before the modal opened
        domElements.searchInput.focus();
    }

    function showEmptyState() {
        state.prompts = [];
        state.filteredPrompts = [];
        domElements.promptsContainer.innerHTML = `
            <div class="empty-state">
                <h2>No prompts available</h2>
                <p>Couldn't load the prompt library. This could be because:</p>
                <ul>
                    <li>The prompt index hasn't been generated yet</li>
                    <li>There was a network error loading the data</li>
                    <li>No prompts have been added to the library</li>
                </ul>
                <p>To add prompts, follow the instructions in the README.md file.</p>
            </div>
        `;
    }

    function showErrorState(message) {
        domElements.promptsContainer.innerHTML = `
            <div class="empty-state">
                <h2>Error</h2>
                <p>${escapeHtml(message)}</p>
                <p>Please try refreshing the page or check the console for more details.</p>
            </div>
        `;
    }

    // ======================
    // Filter and search functions
    // ======================
    function performSearch() {
        const searchQuery = domElements.searchInput.value.trim().toLowerCase();
        if (state.searchQuery === searchQuery) return; // Avoid unnecessary re-renders
        
        state.searchQuery = searchQuery;
        filterPrompts();
        
        // Add a class to highlight the search input
        if (searchQuery) {
            domElements.searchInput.classList.add('active-search');
        } else {
            domElements.searchInput.classList.remove('active-search');
        }
    }

    function updateActiveFilters() {
        // Update from filter buttons (tags)
        const activeTags = Array.from(domElements.filterButtons)
            .filter(button => button.classList.contains('active'))
            .map(button => button.dataset.filter);
        
        // Update from checkboxes (types and sections)
        const activeTypes = Array.from(document.querySelectorAll('input[data-filter-type]:checked'))
            .map(checkbox => checkbox.dataset.filterType);
        
        const activeSections = Array.from(document.querySelectorAll('input[data-filter-section]:checked'))
            .map(checkbox => checkbox.dataset.filterSection);
        
        // Update state
        state.activeFilters = {
            tag: activeTags,
            type: activeTypes,
            section: activeSections
        };
    }

    function filterPrompts() {
        state.filteredPrompts = state.prompts.filter(prompt => {
            // Filter by search query
            if (state.searchQuery && 
                !prompt.title?.toLowerCase().includes(state.searchQuery) && 
                !prompt.description?.toLowerCase().includes(state.searchQuery) &&
                !(prompt.tags || []).some(tag => tag.toLowerCase().includes(state.searchQuery))) {
                return false;
            }
            
            // Filter by type
            if (state.activeFilters.type.length > 0 && 
                !state.activeFilters.type.includes(prompt.type)) {
                return false;
            }
            
            // Filter by section
            if (state.activeFilters.section.length > 0 && 
                !state.activeFilters.section.includes(prompt.section)) {
                return false;
            }
            
            // Filter by tags
            if (state.activeFilters.tag.length > 0 && 
                !(prompt.tags || []).some(tag => 
                    state.activeFilters.tag.includes(tag))) {
                return false;
            }
            
            return true;
        });
        
        updatePromptCount();
        renderPrompts(state.filteredPrompts);
    }

    function updatePromptCount() {
        const count = state.filteredPrompts.length;
        domElements.promptCountElem.textContent = `${count} Prompt${count !== 1 ? 's' : ''}`;
    }

    // ======================
    // Utility functions
    // ======================
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to use Clipboard API:', err);
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (!successful) {
                throw new Error('Failed to copy text');
            }
        }
    }

    // Start the application
    init();
}); 