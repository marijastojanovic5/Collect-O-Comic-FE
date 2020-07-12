document.addEventListener("DOMContentLoaded", ()=> {
    fetchComics()
    getNerdCollection()
    getAllComics()
    getSearchform().submit.addEventListener('click', submittingForm)
    getRandomizerBtn().addEventListener('click', randomizerHandler)

})

let allComics = []

function getSearchform(){
    return document.querySelector('#search-bar')
}


function getNerdCollection(){
    let userCollectionBtn = document.querySelector('#user-collection')
    userCollectionBtn.addEventListener('click', fetchUser)
}
// fetches the user comics
function fetchUser(event,comic){
    fetch("http://localhost:3000/users/1")
    .then(response => response.json())
    .then(user =>{
        
    let userComics = user.comic_books
  
    if(!comic){
        displaysNerdCollection(userComics)
    }else{
        fetch('http://localhost:3000/collections', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({user_id: user.id, comic_book_id: comic.id}),
          })
            
          .then((response) =>response.json())
          .then(data => {
              
            new_array = Array.from(data)
              displaysNerdCollection(new_array)
            
            })
       

    }
    })
    
}

function getAllComics(){
    let allComicBtn = document.querySelector('#all-comic')
    allComicBtn.addEventListener('click', fetchComics)
}


function fetchComics(){
    let listedComic =  document.querySelector('#listed-comics') 
    listedComic.innerHTML = ""
    fetch("http://localhost:3000/comic_books")
    .then(resp => resp.json())
    .then(comics =>{
     allComics = comics
     renderComics() })
}

function renderComics(searchedComics){
    
    let comics = searchedComics ? searchedComics : allComics
    comics.forEach(comic => buildComicCard(comic))

}


function buildComicCard(comic){
        let listedComic =  document.querySelector('#listed-comics')    
        
        let comicCard = document.createElement('div')  
        comicCard.className = 'comic-card'
        
        comicCard.id = comic.id
        
        let comicName = document.createElement('h3')
        comicName.innerText = comic.name
        
        let comicImage = document.createElement('img')
        comicImage.src = comic.image
        // button for specific card
        let comicBtn = document.createElement('button')
        comicBtn.innerText = "Show Details"
        comicBtn.className = "comic-card-btn-all-comics"
        comicBtn.addEventListener('click', () => fetchSpecificComic(comicCard.id))
        
        listedComic.appendChild(comicCard)
        comicCard.append(comicName, comicImage, comicBtn)
    }
    
    
// grabs a specific comic
    function fetchSpecificComic(comicId){
        fetch(`http://localhost:3000/comic_books/${comicId}`)
        .then(response => response.json())
        .then(comic => displayComicDetailPage(comic))
    }
// displays comic show page
    function displayComicDetailPage(comic){
        let list = document.querySelector("#listed-comics")
        list.innerHTML = ""
        let listedComic =  document.querySelector('#listed-comics') 

        let infoDiv = document.createElement('div')
        infoDiv.id = "info-div"
        // card
        let comicDiv = document.createElement('div')  
        comicDiv.className = 'comic' 
        listedComic.appendChild(comicDiv)
        
        let comicName  = document.createElement('h1')
        comicName.className = "detail-page-h1"
        comicName.innerText = comic.name
        
        let comicImage = document.createElement('img')
        comicImage.src = comic.image
        comicImage.className = "detail-page-img"
        
        let comicDescription = document.createElement('p')
        comicDescription.id = "comic-desc"
        comicDescription.innerText = comic.description
        
        let comicEpisodeCount = document.createElement('p')
        comicEpisodeCount.innerText = `Number of episodes: ${comic.count_of_episodes}`
        
        let comicRating = document.createElement('p')
        // comicRating.innerText = `Rating: ${comic.rating}`
        comicRating.className = "ratings"
        
        comicRating.innerText = `Current Rating: ${comic.rating}`

        let ratingDropDwn = document.createElement('div')
        ratingDropDwn.innerHTML = `
        <label for="rating-box">Rate this Show:</label>
        <select id = "rating-box">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        `
        let ratingBtn = document.createElement('button')
        ratingBtn.id = 'rating-button'
        ratingBtn.className = "btn btn-outline-primary"
        ratingBtn.innerText = "Submit Rating"
        comicRating.append(ratingBtn)
        ratingBtn.addEventListener('click', (event)=>submitRating(event, comic))
        ratingDropDwn.appendChild(ratingBtn)
        let backBtn = document.createElement('button')
        backBtn.className = "btn btn-outline-primary"
        backBtn.innerText = "Back"
        backBtn.id = "back-button"
        backBtn.addEventListener('click', fetchComics)
        
        // add to collection button
        let addComicBtn = document.createElement('button')
        
        addComicBtn.innerText = "Add to Collection"
        addComicBtn.className ="btn btn-outline-primary"
        addComicBtn.id = "add-btn"
        addComicBtn.addEventListener('click', ()=>fetchUser(null,comic))
        
        infoDiv.append(comicName, comicImage, comicDescription, comicEpisodeCount, comicRating, ratingDropDwn)
        comicDiv.append(infoDiv, backBtn, addComicBtn)
    }
 
    function displaysNerdCollection(userComics, fetchSpecificComic){
        let listedComic =  document.querySelector('#listed-comics') 
        listedComic.innerHTML = ""
        listedComic.style.display = "block"
        
        userComics.forEach(comic =>{
            let comicCard = document.createElement('div')
            comicCard.className = 'comic-card'
            let comicName = document.createElement('h3')
            comicName.innerText = comic.name 
            
            let comicImage = document.createElement('img')
            comicImage.src = comic.image
            // button for specific card
            comicCard.id = comic.id
            let comicBtn = document.createElement('button')
            comicBtn.innerText = "Show Details"

            comicBtn.addEventListener('click', ()=> displayComicDetailPage(comic))
            
            listedComic.appendChild(comicCard)
            
            comicCard.append(comicName, comicImage, comicBtn)
        })  
    }

    //randomizer functions

    function getRandomizerBtn(){
        return document.getElementById('randomizer')
    }

    function getListedComics(){
        return document.getElementById('listed-comics') 
    }

    function randomizerHandler(event){
        clearDiv(getListedComics())
        let randomText = document.createElement('h4')
        randomText.innerText = "Looking for something new to watch? Click button below!"
        let randBtn = document.createElement('button')
        randBtn.innerText = "Get Random Show"
        randBtn.type = "button"
        randBtn.className = "btn btn-primary btn-lg"
        randBtn.id = "randomizer-button"
        let randomContainer = document.createElement('div')
        randomContainer.className = "random-container"
        getListedComics().append(randomText,randBtn, randomContainer)

        randBtn.addEventListener('click', ()=> 
            fetch("http://localhost:3000/comic_books")
            .then(resp => resp.json())
            .then(comicArray => randomFunction(comicArray))
            )
        
    }

    function randomFunction(comicArray){
        const length = comicArray.length
        const random_number = Math.floor((Math.random() * length-1))
        const random_item = comicArray[random_number]
        
        let randomContainer = document.querySelector('.random-container')
        clearDiv(randomContainer)
    
        let randomCard = document.createElement('div')
        randomCard.className = "random-card"

        let randomName = document.createElement('h2')
        randomName.innerText = random_item.name

        let randomImg = document.createElement('img')
        randomImg.src = random_item.image

        randomContainer.appendChild(randomCard)
        randomCard.append(randomName, randomImg)
    }


    function clearDiv(div){
        while(div.firstChild){
          div.firstChild.remove()
        }
      }
    

    function submittingForm(e){
        e.preventDefault()
        let parentForm = e.target.parentElement
        let searchComic =  parentForm.userInput.value.toLowerCase()
        let searchResult =allComics.filter(comic => comic.name.toLowerCase().includes(searchComic))
        let listedComics = document.querySelector('#listed-comics')
        clearDiv(listedComics)
        renderComics(searchResult)
        e.target.parentElement.reset()
        
    }

   
   function submitRating(event, comic){
    
        let ratingValue = event.target.parentElement.children[1].value
        let ratingInt =  parseInt(ratingValue)
        let updatedRating = event.target.parentElement.parentElement.children[4]

        let comicId = comic.id

        let ratingObj = {rating: ratingInt}
        fetch(`http://localhost:3000/comic_books/${comicId}`,{
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(ratingObj)
          
        }).then(res =>res.json())
        .then(json =>{
        updatedRating.innerText = json.rating.toString()
        })
   }
