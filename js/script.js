document.addEventListener("DOMContentLoaded", function() {
    const postListElement = document.getElementById('post-list');
    const postTitleElement = document.getElementById('post-title');
    const postDateElement = document.getElementById('post-date');
    const postBodyElement = document.getElementById('post-body');
    const progressBarElement = document.getElementById('post-progress-bar');

    // Add posts manually (as you wish)
    const posts = [
        // Add your posts here. Example:
        // { title: 'My First Blog Post', date: '2023-10-27', file: 'posts/my-first-post.md' },
        { title: 'Technology Trends', date: '2023-10-28', file: 'posts/test.md' },
    ];

    // Add posts to the menu
    posts.forEach(post => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = post.title;
        link.setAttribute('data-file', post.file);
        link.setAttribute('data-date', post.date);
        listItem.appendChild(link);
        postListElement.appendChild(listItem);
    });

    // Function to load a post
    function loadPost(filePath, postDate, postTitleText) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(markdown => {
                // Convert Markdown content to HTML
                const htmlContent = marked.parse(markdown);

                // Auto-detect title from Markdown (if the first line starts with '# ')
                let autoTitle = postTitleText;
                const firstLine = markdown.split('\n')[0];
                if (firstLine.startsWith('# ')) {
                    autoTitle = firstLine.substring(2);
                }

                postTitleElement.textContent = autoTitle;
                postDateElement.textContent = postDate;
                postBodyElement.innerHTML = htmlContent;

                // Reset reading progress
                progressBarElement.style.width = '0%';

                // Calculate reading progress after content is loaded
                setupReadingProgress();
            })
            .catch(error => {
                console.error('An error occurred while loading the post:', error);
                postTitleElement.textContent = 'Error';
                postDateElement.textContent = '';
                postBodyElement.innerHTML = '<p>Sorry, this post could not be found or loaded.</p>';
            });
    }

    // Setup reading progress
    function setupReadingProgress() {
        const postContentElement = document.getElementById('post-body');
        const progressBar = document.getElementById('post-progress-bar');

        if (!postContentElement || !progressBar) return;

        const updateProgress = () => {
            const contentHeight = postContentElement.scrollHeight;
            const visibleHeight = postContentElement.clientHeight;
            const scrollTop = postContentElement.scrollTop;

            // Don't proceed if content hasn't loaded or is empty
            if (contentHeight === 0 || visibleHeight === 0) {
                progressBar.style.width = '0%';
                return;
            }

            const scrollPercentage = (scrollTop / (contentHeight - visibleHeight)) * 100;
            progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
        };

        // Update progress on content scroll
        postBodyElement.addEventListener('scroll', updateProgress);

        // Update on window resize or content change
        // window.addEventListener('resize', updateProgress);
        // You could also use a MutationObserver

        // Show progress initially after the page loads and the scrollbar is visible
        setTimeout(updateProgress, 100);
    }

    // Add click event listener to post links in the menu
    postListElement.addEventListener('click', function(e) {
        const target = e.target;
        if (target.tagName === 'A' && target.hasAttribute('data-file')) {
            e.preventDefault();

            // Update active link
            document.querySelectorAll('#post-list a').forEach(link => link.classList.remove('active'));
            target.classList.add('active');

            const filePath = target.getAttribute('data-file');
            const postDate = target.getAttribute('data-date');
            const postTitleText = target.textContent;

            loadPost(filePath, postDate, postTitleText);
        }
    });

    // No need to show a blank screen on initial load.
    // If you want to auto-load the first post, you can uncomment the following section:
    /*
    if (posts.length > 0) {
        // Get the first post's info
        const firstPost = posts[0];
        loadPost(firstPost.file, firstPost.date, firstPost.title);
        // Make the first link active
        if (postListElement.querySelector('a')) {
            postListElement.querySelector('a').classList.add('active');
        }
    }
    */
});