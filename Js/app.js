/* ===========Variables============ */



const MY_API = "api_key=459fedcd442587f1fa9ccd000ebe2e51";
const BASE_URL = "https://api.themoviedb.org/3";
const RANDOM_URL = BASE_URL + "/discover/movie?sort_by=vote_average.desc&" + MY_API;
const KIDMOVIE_URL = BASE_URL + "/discover/movie?certification_country=CA&certification.lte=G&sort_by=popularity.desc&" + MY_API;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?sort_by=popularity.desc&" + MY_API;
const GENRE_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + MY_API;

const mainDiv = document.getElementById("main");
const tagDiv = document.getElementById("tags");
const pageNoDiv = document.getElementById("pgit initagination");
const searchBar = document.getElementById("searchBar");
const input = document.getElementById("search");
const search = document.getElementById("submit");
const OL = document.getElementById("OL");
const overlayCloseButton = document.getElementById("overlayCloseButton");
let pageNo, totPgs, lastUrl;

if (pageNo == null) {
    pageNo = 1;
}
const genreList = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
];


/* ===========showing Genres============ */


showGenres(genreList);



/* ===========Getting data From URL============ */

getMovies(KIDMOVIE_URL);

function getMovies(url, pgno = pageNo) {
    lastUrl = url;
    fetch(url + "&page=" + pgno).then(res => res.json()).then(data => {
        showMovies(data.results);
        pagination(data);
    })
};


/* ===========Showing Movies for Old HomePage============ */


function showMovies(data) {

    mainDiv.innerHTML = '';

    data.forEach(movies => {
        const {
            title,
            poster_path,
            vote_average,
            overview,
            adult,
            release_date,
            id,
            backdrop_path,
        } = movies;
        const movie = document.createElement("div");
        movie.classList.add("movie");
        movie.innerHTML = `
        
        <div class="imageDiv">
            <img src="${poster_path ? IMG_URL + poster_path : "https://via.placeholder.com/1080x1580"}" alt="Movie Image" class="movieImage">
            <div class="ageRating">
                <p>${getAgeRating(adult)}</p>
            </div>
        </div>
        <div class="movieBottomDiv">
            <div class="movieTitle" title="${title}">${title}</div>
            <div class="rating">${vote_average}</div>
        </div>

        `
        mainDiv.scrollIntoView({ behavior: "smooth" });
        mainDiv.appendChild(movie);
        movie.addEventListener("click", () => {
            currentSlide = 1;
            OL.innerHTML = '';
            const overlayCnt = document.createElement("div");
            overlayCnt.setAttribute("id", 'overlayCnt');
            overlayCnt.innerHTML = `
            

            <h1>${title}</h1>

            <div id="r1">
                    <img src="${backdrop_path ? IMG_URL + backdrop_path : "https://via.placeholder.com/1580x1080"}" alt="Movie Image">
            </div>
            <div id="r2">
                <div id="MovieSummary">
                    <h3>Summary : </h3>
                    <p>${overview}</p>
                </div>
                <div id="OLMovieInfo">
                    <p><strong>Release Date : </strong>${release_date}</p>
                    <p><strong>Certification : </strong>${getAgeRating()}</p>
                    <p><strong>Rating : </strong>${vote_average}</p>
                </div>
            </div>


            <div class="bottomDiv">

            </div>

            `;
            OL.appendChild(overlayCnt);
            overlayDiv.appendChild(OL)
            overlayDiv.style.display = 'flex';
            scrollHiderShower();

        })

    });
    mainDiv.scrollIntoView({ behavior: "smooth" });


    if (data.length == 0) {
        mainDiv.innerHTML = `
        
        <div style="display:flex;justify-content:center;align-items:center;">
            <h1>No Results</h1>
        </div>


        `
    };

};





/* ===========Main Functions============ */


searchBar.addEventListener("keyup", (e) => {
    const searchTerm = input.value;

    if (e.code === 'Enter') {
        searchQuery(searchTerm);
    }
});

search.addEventListener('click', () => {
    const searchTerm = input.value;
    searchQuery(searchTerm);
})

function searchQuery(searchTerm) {
    pageNo = 1;
    if (searchTerm) {
        getMovies(SEARCH_URL + '&query=' + searchTerm + "&page=" + pageNo)
    } else {
        getMovies(KIDMOVIE_URL + "&page=" + pageNo);
    }
    mainDiv.scrollIntoView({ behavior: "smooth" });
}



function showGenres(genres) {
    tagDiv.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement("div");
        t.classList.add("tag");
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener("click", () => {
            pageNo = 1;
            getMovies(GENRE_URL + "&with_genres=" + genre.id + "&sort_by=vote_average.desc" + "&page=" + pageNo);
            mainDiv.scrollIntoView({ behavior: "smooth" });
        })
        tagDiv.append(t);
    })
};

function pagination(data) {
    pageNoDiv.innerHTML = `
            <div id="previous" onclick="prePressed()">
                    <img src="./Images/previousSVG.svg" alt="Pre">
            </div>
            <div id="pages" class="hideScroll">
                    ${currentPage(data)} of ${totalPages(data)}
            </div>
            <div id="next" onclick="nextPressed()">
                    <img src="./Images/nextSVG.svg" alt="Next">
            </div>
    `

    const prevbt = document.getElementById("previous");
    const nextbt = document.getElementById("next");

    if (currentPage(data) == 1) {
        prevbt.setAttribute("disabled", '');
        prevbt.style.cursor = 'not-allowed';
    }
    else if (currentPage(data) == totalPages(data)) {
        nextbt.setAttribute('disabled', '');
        nextbt.style.cursor = 'not-allowed';
    }
    else {
        prevbt.removeAttribute('disabled', '');
        nextbt.removeAttribute('disabled', '');
        prevbt.style.cursor = 'pointer';
        nextbt.style.cursor = 'pointer';
    }

};



/* ===========Mini Functions============ */


function getAgeRating(adult) {

    if (adult) return "A";
    else return "U";

};



function totalPages(data) {
    totPgs = data.total_pages;
    return data.total_pages;
};

function currentPage(data) {
    return data.page;
};

function prePressed() {
    if (pageNo > 1) {
        pageNo -= 1;
    }
    getMovies(lastUrl);
}

function nextPressed() {
    if (pageNo < totPgs) {
        pageNo += 1;
    }
    getMovies(lastUrl);
}


overlayCloseButton.addEventListener('click', () => {
    overlayDiv.style.display = 'none';
    scrollHiderShower();
})



// Scroll Bar Changer
function scrollHiderShower() {

    if ((overlayDiv.style.display == 'flex') || (overlayDiv.style.display == '')) {
        document.body.style.overflow = 'hidden';
    };
    if (overlayDiv.style.display == 'none') {
        document.body.style.overflow = 'scroll';
    }

}


