const baseUrl = 'https://www.omdbapi.com'
const apiKey = '8220aa3f'
const searchMovie = document.getElementById('search-movie')
const searchBtn = document.getElementById('search-btn')
const main = document.getElementById('main')
const modal = document.getElementById('modal')
let dataArray = []
let page = 1


searchBtn.addEventListener('click', () => {
    const searchTerm = searchMovie.value
    getMovieList(searchTerm)
})

searchMovie.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        const searchTerm = searchMovie.value
        getMovieList(searchTerm)
    }
})

async function getMovieList(term) {
    const res = await fetch(`${baseUrl}/?apikey=${apiKey}&s=${term}&type=movie&page=${page}`)
    const data = await res.json()
    getMovieById(data)    
}

function getMovieById(movieList) {
    movieList.Search.map(movie => {
        fetch(`${baseUrl}/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`)
            .then(res => res.json())
            .then(data => {
                if(!dataArray.findIndex(element => element.Title === data.Title) > -1) {
                    dataArray.push(data)
                }
            })
    })
    setTimeout(() => {
        getHtml(dataArray)
    }, 300)
}

function getHtml(data) {
    let html = ''
    data.sort((item1, item2) => (item1.Year > item2.Year) ? -1 : ((item2.Year > item1.Year) ? 1 : 0))

    data.forEach(item => {
        if (item.Poster != 'N/A' && item.Plot != 'N/A') {
            // console.log(item)
            html += `
                <div class="container" id="${item.imdbID}">
                    
                    <img class="poster-image" src="${item.Poster}" />
                    <div id="modal-${item.imdbID}" class="modal-box">
                        <div class="modal-content" id="modal-content-${item.imdbID}">
                            <span id="close-modal" data-closeModalId="${item.imdbID}" class="close">&times;</span>
                            <h2>${item.Title}</h2>
                            <p>${item.Plot}</p>
                        </div>
                    </div>
                    <div class="content">
                        <button id="modal-btn" data-modalId="${item.imdbID}" class="show-mobile">Movie Details</button>
                        <div class="hide">
                            <h2>${item.Title}</h2>
                            <span class="text-spacing">${item.imdbRating}</span>
                            <span class="text-spacing">${item.Rated}</span>
                        </div>
                        <div class="hide">
                            <span>${item.Year}</span>
                            <span class="text-spacing">${item.Runtime}</span>
                            <span class="text-spacing">${item.Genre}</span>
                        </div>
                        <div class="hide">
                            <p>${item.Plot}</p>
                        </div>
                    </div>
                </div>
                
            `
        }
    })

    render(html)
}

function handleMovieDetailsClick(modalId) {
    document.getElementById(`modal-${modalId}`).style.display = "block"
}

function handleModalCloseClick(modalId) {
    document.getElementById(`modal-${modalId}`).style.display = "none"
}

function getModal() {
    document.querySelectorAll('.show-mobile').forEach((el) => {
        el.addEventListener('click', (e) => {
        handleMovieDetailsClick(e.currentTarget.dataset.modalid) 
        })
    })
    
    document.querySelectorAll('.close').forEach((el) => {
      el.addEventListener('click', (e) => {
        handleModalCloseClick(e.currentTarget.dataset.closemodalid) 
        })   
    })
}

function render(html) {
    main.innerHTML = html
    dataArray = []
    getModal()
}

