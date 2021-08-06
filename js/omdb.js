"use strict";

    
const inp = document.querySelector("#form__input"); // инпут
const btn = document.querySelector("#btn__request"); // кнопка поиска
const select = document.querySelector("#select"); // селект выбора жанра
const header = document.querySelector(".header"); 
const main = document.querySelector(".main");
const favBtn = document.querySelector("#favorite-btn"); // кнопка Избранное


let url = `http://www.omdbapi.com/?apikey=d4c2ff4e&`; // базовый URL, к нему потом будем добавлять параметры поиска

let arrResp;
let newEl;
let errMessage;


btn.onclick = getSearchResult;  //вешаем обработчик на кнопку Search

favBtn.onclick = getFavMovies;  //вешаем обработчик на кнопку Избранное


// Делает запрос на сервер исходя из параметров поиска
function getSearchResult() {
    fetch(getURL(url))
        .then(response => response.json())
        .then(json => json.Search)
        .then(array => createMovieBlock(array))
        .catch(() => {
            createErrorMessage();
        })
}

// Делает запрос на сервер исходя из избранного в Local Storage
function getFavMovies() {
    clearError();
    let arr = [];
    let arrOfHeart = [];
    //перебираем Local Storage и складываем id фильмов в массив
    for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        let value = localStorage.getItem(key)
        arr.push(value);
    }

    if (newEl === undefined && arr !== '') {
        newEl = document.createElement("div");
        newEl.classList.add('block-movie');
        // поочерёдно делаем запрос на сервер используя каждый ID фильма в адесной строке
        for (let item of arr) {
            let urlReq = `${url}i=${item}`;
            
            fetch(urlReq)
                .then(response => response.json())
                .then(data => createFavMovieBlock(data, newEl))
                .then(() => {
                        //получаем все сердечки избранных фильмов и навешиваем на каждое обработчик
                        let heart = document.querySelectorAll(".fa-heart");
                        arrOfHeart = [...heart];
                        for (let item of arrOfHeart) {
                        item.onclick = chooseHeart;
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            
        }
        main.append(newEl);
       
    } else if (newEl !== undefined && arr !== '') {
        newEl.remove();
        newEl = document.createElement("div");
        newEl.classList.add('block-movie');

         for (let item of arr) {
             let urlReq = `${url}i=${item}`;
             
            fetch(urlReq)
                .then(response => response.json())
                .then(data => createFavMovieBlock(data, newEl))
                .then(() => {
                        //получаем все сердечки избранных фильмов и навешиваем на каждое обработчик
                        let heart = document.querySelectorAll(".fa-heart");
                        arrOfHeart = [...heart];
                        for (let item of arrOfHeart) {
                        item.onclick = chooseHeart;
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
             
        }
        main.append(newEl);
    
    }
    
    
}

// Создаёт блок с избранным фильмом
function createFavMovieBlock(arr, parent) {
    
    let movieItem = document.createElement('div');
    movieItem.classList.add("movie-item");
    movieItem.innerHTML += `
        <img src="${arr.Poster}">
        <div class="block-info">
            <a class="fas fa-heart" style="color:${findFavorites(arr)}"></a>
            <span>${arr.imdbID}</span>
            <p>${arr.Title}</p>
        </div>`;
    parent.append(movieItem);

    
    
}


// Управляет сердечком и соответственно добавляет в local storage id фильма или удаляет
function chooseHeart() {
   
  let idSpan = this.nextElementSibling;
  let keyTag = idSpan.nextElementSibling;
  let key = keyTag.innerHTML;
  let id = idSpan.innerHTML;
    if (this.style.color !== 'red') {
            this.style.color = 'red';
            localStorage.setItem(key, id);
    } else if (this.style.color === 'red') {
        this.style.color = 'white';
        localStorage.removeItem(key);
        }
    
}
    
//Сравнивает id фильма из поиска с содержимым local storage и соответственно 
//окрашивает сердце в красный, если фильм уже бЫл лайкнут раньше
function findFavorites(item) {
   
    for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        if (item.imdbID === value) {
           return "red";
        }
    }
}

// Формирует URL для поискового запроса из базового URL и того что ввёл пользователь
function getURL(url) {
    let inpValue = inp.value;
    let opt = select.value;
    if (inpValue !== "") {
      return  url = `${url}s=${inpValue}&type=${opt}`;
    } else {
        alert("Введите, пожалуйста название фильма");
        return url;
        
    }
}

// Формирует блоки с фильмами из поиска и выводит их на страницу
function createMovieBlock(arrResp) {
    console.log(arrResp);
    if (newEl === undefined && arrResp !== '') {
        newEl = document.createElement("div");
        newEl.classList.add('block-movie');
        for (let item of arrResp) {
    
            let movieItem = document.createElement('div');
            movieItem.classList.add("movie-item");
            movieItem.innerHTML += `
            <img src="${item.Poster}">
            <div class="block-info">
                <a class="fas fa-heart" style="color:${findFavorites(item)}"></a>
                <span>${item.imdbID}</span>
                <p>${item.Title}</p>
            </div>`;
            newEl.append(movieItem);

        }

        main.append(newEl);
            
    } else if (newEl !== undefined && arrResp !== '') {
        newEl.remove();
        newEl = document.createElement("div");
        newEl.classList.add('block-movie');
        for (let item of arrResp) {
           
            let movieItem = document.createElement('div');
            movieItem.classList.add("movie-item");
            movieItem.innerHTML += `
            <img src="${item.Poster}">
            <div class="block-info">
                <a class="fas fa-heart" style="color:${findFavorites(item)}"></a>
                <span>${item.imdbID}</span>
                <p>${item.Title}</p>
            </div>`;
            newEl.append(movieItem);

        }
        main.append(newEl);

    } else if(arrResp === undefined){
        createErrorMessage();
        clearForm();
    } else {
        createErrorMessage();
        clearForm();
    }
    // получаем все сердечки из выведенных фильмов и навешиваем на каждое обработчик
    let hearts = document.querySelectorAll(".fa-heart");
    for (let item of hearts) {
        item.onclick = chooseHeart;
    }
    clearError();
    clearForm();
}

// Формирует сообщение об ошибке поиска и выводит на страницу
function createErrorMessage() {
    clearForm();
    if (errMessage === undefined) {
        errMessage = document.createElement('p');
        errMessage.classList.add('error-message');
        errMessage.innerHTML = "Такой фильм не найдено";
        header.append(errMessage);
    } else if (errMessage !== undefined) {
        errMessage.remove();
        errMessage = document.createElement('p');
        errMessage.classList.add('error-message');
        errMessage.innerHTML = "Такой фильм не найдено";
        header.append(errMessage);
    }

}

// Очищает инпут от текста
function clearForm() {
    inp.value = "";
}

// Удаляет сообщение с ошибкой
function clearError() {

    if(errMessage !== undefined) errMessage.remove();
    
}