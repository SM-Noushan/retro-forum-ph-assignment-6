// global variables
let count = 0; //stores the total number of posts that are marked as read

// toggle loading indicator
const toggleLoader = (state, id) => {
    const loader = document.getElementById(id);
    if (state) {
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    }
    else {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    }
}

// marked as read
const markAsRead = (title, view) => {
    count++;
    const postCount = document.getElementById('markedAsReadCount');
    const markedAsReadPostsContainer = document.getElementById('marked-read-posts-container');
    markedAsReadPostsContainer.innerHTML += `
        <div class="flex justify-between items-center gap-4 p-4 bg-white rounded-2xl">
            <h1 class="font-semibold text-xs md:text-base">${title}</h1>
            <div class="flex justify-end items-center gap-2">
                <i class="fa-regular fa-eye"></i>
                <span class="font-inter opacity-60">${view}</span>
            </div>
        </div>`;
    postCount.innerText = count;
}

// display error alert
const toggleErrorAlert = (status) => {
    toggleLoader(status, 'error-alert');
}

// display data
const displayAllPost = (posts) => {
    const allPostContainer = document.getElementById('all-post');
    allPostContainer.textContent = '';
    if (posts.length === 0)
        toggleErrorAlert(true);
    else {
        toggleErrorAlert(false);
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList = 'card card-side bg-[#F3F3F5] gap-2 md:gap-10 rounded-3xl p-4 md:p-10';
            postCard.innerHTML =
                `<figure class="size-28">
                <div class="p-1 relative rounded-xl">
                    <div id="status"
                        class="size-2.5 md:size-4 rounded-full ${post.isActive ? 'bg-success' : 'bg-error'} absolute end-0.5 md:end-0 top-0 z-50">
                    </div>
                    <div class="avatar">
                        <img class="rounded-xl" src="${post.image}" />
                    </div>
                </div>
            </figure>
            <div class="card-body p-0 font-inter text-color1">
                <div class="flex items-center gap-6 md:gap-10 opacity-80 font-medium text-sm">
                    <h4 class="text-xs md:text-sm"># ${post.category}</h4>
                    <h4 class="text-xs md:text-sm">Author: ${post.author.name}</h4>
                </div>
                <h2 class="card-title text-base md:text-xl font-bold">${post.title}</h2>
                <p class="w-[95%] text-justify text-sm md:text-base opacity-60 leading-7">${post.description}</p>
                <hr class="border border-dashed border-color1/25">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3 md:gap-6 text-color1/60">
                        <div class="flex items-center gap-1 md:gap-2 *:text-sm *:md:text-base">
                            <i class="fa-regular fa-comment-dots"></i>
                            <span>${post.comment_count}</span>
                        </div>
                        <div class="flex items-center gap-1 md:gap-2 *:text-sm *:md:text-base">
                            <i class="fa-regular fa-eye"></i>
                            <span>${post.view_count}</span>
                        </div>
                        <div class="flex items-center gap-1 md:gap-2 *:text-sm *:md:text-base">
                            <i class="fa-regular fa-clock"></i>
                            <span>${post.posted_time} Min</span>
                        </div>
                    </div>
                    <div class="bg-success hover:bg-success/80 rounded-full size-8 md:size-10 flex justify-center items-center">
                        <button class="mark-as-read w-full rounded-full"><i
                                class="fa-regular fa-envelope-open text-white text-base md:text-xl"></i></button>
                    </div>
                </div>
            </div>`
            allPostContainer.append(postCard);
            const btn = allPostContainer.lastChild.getElementsByTagName('button')[0];
            btn.addEventListener('click', () => markAsRead(post.title, post.view_count));
        });
    }
    toggleLoader(false, 'data-loader');
}

// fetch data
const fetchPosts = (type = 'all-post', category = null) => {
    toggleLoader(true, 'data-loader');
    let url = null;
    if (type === 'all-post')
        url = 'https://openapi.programming-hero.com/api/retro-forum/posts';
    if (type === 'search')
        url = `https://openapi.programming-hero.com/api/retro-forum/posts?category=${category}`;

    setTimeout(async () => {
        const res = await fetch(url);
        const { posts } = await res.json();
        // console.log(posts);
        displayAllPost(posts);
    }, 1);
}

// handle search
const searchPostsOnEnter = document.getElementById('search-posts-input');
const searchPostsOnClick = document.getElementById('search-posts-btn');

const searchPosts = data => {
    // searchPostsOnEnter.value = '';
    fetchPosts('search', data);
}

searchPostsOnEnter.addEventListener('keyup', e => {
    if (e.key.toLocaleLowerCase() === 'enter')
        searchPosts(searchPostsOnEnter.value || null);
});
searchPostsOnClick.addEventListener('click', () => { searchPosts(searchPostsOnEnter.value || null) });

fetchPosts();