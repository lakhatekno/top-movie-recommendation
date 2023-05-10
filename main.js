// import axios from 'axios';

document.body.onload = getResult("discover/movie?");

function genreList(genre_ids, element) {
  var genre_names = '';
  axios
    .get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=ad447a5b83d006da4d6aad0b8d3b2f0e`
    )
    .then(function (response) {
      const genres = response.data.genres;
      for(let i = 0; i<genre_ids.length; i++){
        for(let j = 0; j<genres.length; j++){
          if(genre_ids[i]===genres[j].id){
            if(j+1==genres.length){
              genre_names = genre_names + ' ' + genres[j].name + ',';
            }
            else {
              genre_names = genre_names + ' ' + genres[j].name;
            }
            break;    
          }
        }
      }
      return element.innerText =  genre_names;
    });
}

function limiter(text, length) { //elipsis
  if(length>4){
    return (text.substring(0, length) + "...");
  }
  else return text.substring(0, length);
}

//eventlistener search
const search = document.querySelector('#search');
search.addEventListener('blur', ()=>{
  const main = document.querySelector('main');
  main.innerHTML = '';
  let query = `search/movie?query=${search.value}`;
  getResult(query);
})

// event listener <page>
const prev = document.querySelector('#prev');
const current = document.querySelector('#current');
const next = document.querySelector('#next');
prev.addEventListener('click', ()=>{
  if(current.innerText>'1') {current.innerText--};
  if(search.value == '') {
    query = 'discover/movie?';
  }
  else {
    query = `search/movie?query=${search.value}`;
  }
  // else alert("Already on first page");
  const main = document.querySelector("#main");
  main.innerHTML = '';
  getResult(query);
})
next.addEventListener('click', ()=>{
  current.innerText++;
  if(search.value == '') {
    query = 'discover/movie?';
  }
  else {
    query = `search/movie?query=${search.value}`;
  }
  const main = document.querySelector("#main");
  main.innerHTML = '';
  getResult(query);
})

//function untuk menampilkan cards
function getResult(query) {
const page = document.querySelector('#current').innerText;
  axios
.get(
  `https://api.themoviedb.org/3/${query}&api_key=ad447a5b83d006da4d6aad0b8d3b2f0e&page=${page}`
  )
  .then(function (response) {
    for (let i = 0; i < (response.data.results).length; i++) {
      const main = document.querySelector("#main");
      const card = document.createElement("div");
      card.className = "movie";
      const mov_img = document.createElement("img");
      const mov_text = document.createElement("div");
      const mov_title = document.createElement("h3");
      const mov_genre = document.createElement("p");
      const mov_year = document.createElement("p");
      mov_year.className = 'y';
      const hoverview = document.createElement("div");
      hoverview.className = 'overview';
      const overview = document.createElement("p");
      overview.className = 'desc'; 

      mov_title.innerText = `${response.data.results[i].title}`;
      mov_year.innerText = limiter(`${response.data.results[i].release_date}`, 4);
      genreList(response.data.results[i].genre_ids, mov_genre);
      mov_genre.className = 'genre-list';
      mov_img.src = `https://image.tmdb.org/t/p/w500${response.data.results[i].poster_path}`;
      overview.innerText = limiter(`${response.data.results[i].overview}`, 65);

      hoverview.appendChild(mov_title);
      hoverview.appendChild(mov_year);
      hoverview.appendChild(mov_genre);
      hoverview.appendChild(overview);
      card.appendChild(mov_img);
      card.appendChild(hoverview);
      main.appendChild(card);
    }
    console.log(response.data.results);
  })
  .catch(function (error) {
    console.log(error);
  });
}
