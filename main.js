// this is the meal finder web page
// In the web page i used the bootstrap frame work 
// dom 
//all the global declarations

let favoriteIteams =[];
// the dishes array is uded to store the dishes
let dishes =[];
// the iteams array is used to the suggitions and to display the suggistions
let iteams=[];
// the favoritesList array is used to store the favorite iteams 
let favoritesList=[];
// the below elements are featched the tags from the html file using dom proparties
// the mealInput elament is the input tag to take input from the user and the mealInput variable is used to add event listener
let mealInput = document.getElementById('autocomplete_input');
// the below mealsList is used to display the suggitions to the user
let mealsList = document.getElementById('autocomplete_list');
// the cardList is used to add some html contant to the html file in run time and add some functionalitys to it
let cardList = document.getElementById('card-list');
// this disArea is used display the dis discription and when user clicked on a card list then the disArea is visible
let dishArea = document.getElementById('dish-area');


// the below function is handled the event when the usear enter the data in the input box then this event is running to show the suggitions
mealInput.addEventListener('input', (e) => {
    let food = e.target.value;
    
    if(food===""){
        mealsList.innerHTML="";
        return
    }
    // getSugitionsAndFoodIteams(food);
    
    let finalList =filterData(iteams,food)
    displaySugitions(finalList, mealsList);

});


// the below displaySugitions are used to display the suggitions to the user when he/she typing in the input box

function displaySugitions(data, element)  {
    let output = " ";
    element.innerHTML="";
    data.forEach(dish => {
        output+=`<li id="sugition_List">${dish}</li>`
    });
    element.innerHTML=output;
    sugitionClick();
    
}
// the filterData function is used to filter the data to show the suggitions 
function filterData(data, searchText){
   return data.filter((x) => x.toLowerCase().includes(searchText.toLowerCase()));

}

// the below sugitionClick function  is help to featch the data when usear clicked on the suggitions 
 function sugitionClick(){
document.getElementById('sugition_List').addEventListener('click', (e) => {
    let sugg = e.target.innerHTML;
    getFoods(sugg,0);
    mealsList.innerHTML="";
    
});
}



// this is the display part
// at this point of time the below lines are to display the featched data from the api it is stored in dishes array
// the below event is for when usear is press enter key inn the keyboard the event is accured
// and give it to the getFoods  function to featch the data
document.getElementById('autocomplete_input').addEventListener('change', (e) => {
    let food = e.target.value;
    getFoods(food,0);

});


// the below getFoods function is used to featch the data from the api server
// it requries two things to call the function food iteam name and the 0 is for favorites display call and 1 is for usear search
function getFoods(food,iteam)  {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`)
    .then(res => res.json())
    .then(data => {       
         iteams.push(food);
         if(iteam===1){
            data.meals.forEach(meal => dishes.push(meal));
            displayFavIteams();
         }else{
            dishes=[];
        data.meals.forEach(meal => dishes.push(meal));
        dishArea.innerHTML = '';
        displayDishes();
         }
         
    })
    .catch(()=>{
        cardList.innerHTML = `<p class="lead text-center">Sorry !!! No recipes found. Try searching for soething else</p>`

    })
}
// the dispalyDishes function is used to display the reusult 
// In this below the i add some html code to display the dishes present in the array 
// the html code is added at the runtime to the index.html file when usear is press enter these all functins are run
function displayDishes()  {
    let output = '';
    dishes.forEach(dish => {
        output+=`
            <div class="col-xl-3 col-sm-6 col-lg-4">
                <div class="food-card" style="background: url('${dish.strMealThumb}');">
                    <div class="food-card-details text-white" foodId="${dish.idMeal}">
                        <h1 class="text-center">${dish.strMeal}</h1>
                    </div>
                    
                </div> 
                <div class="card_bottom">
                    <span> ${dish.strMeal} </span>
                    <span class="heart_symble"><i class="fa-solid fa-heart favorites" foodId="${dish.strMeal}"></i></span>
                </div> 
            </div>  
        `;
    });
    cardList.classList.remove('d-none');
    cardList.innerHTML = output;
    init();
    favfunction();
}

// the below displayFavIteams function is used to dispaly the favorite iteam list
// when user is press ann favorites logo then this function is called
// this function contains some html code to dispaly the iteams 
function displayFavIteams()  {
    let output = '';
        dishes.forEach(dish => {
        output+=`
            <div class="col-xl-3 col-sm-6 col-lg-4">
                <div class="food-card" style="background: url('${dish.strMealThumb}');">
                    <div class="food-card-details text-white" foodId="${dish.idMeal}">
                        <h1 class="text-center">${dish.strMeal}</h1>
                    </div>
                    
                </div> 
                <div class="card_bottom">
                    <span> ${dish.strMeal} </span>
                    <span class="heart_symble"><i class="delete_button" style="font-size:15px"foodId="${dish.strMeal}">remove</i></span>
                </div> 
            </div>  
        `;
    });
    cardList.classList.remove('d-none');
    cardList.innerHTML = output;
    init();
    favDelete();
}

// the below init function is called after the display the iteams
// this function consists of event listener for when the usear is press on any iteam then it gives that itam's id to the displayRecipe function
function init() {
    let foodItem = document.querySelectorAll('.food-card-details');
    foodItem.forEach(item => {
        item.addEventListener('click', (e)=> {
            const id = item.getAttribute("foodId");
            displayRecipe(id);
        })
    })    
}
//  the below displayRecipe function is used to display the iteams total information 
// the function is called after the usear press on any iteam
function displayRecipe(id)  {
    cardList.classList.add('d-none');
    const selectedDish = dishes.filter(dish => dish.idMeal == id);
    const dish = selectedDish[0];
    let ingredients = [];
    for(let i=1;i<=20;i++) {
        let ingredientName = `strIngredient${i}`;
        let quantity = `strMeasure${i}`;
    if(ingredientName!==""){
        if(dish[ingredientName]) {
            const ingredient = {
                'ingredientname' : dish[ingredientName],
                'quantity' : dish[quantity]
            }
            ingredients.push(ingredient);
        }
    }
    }
    let ingredientOuput = '';
    ingredients.forEach(ingredient => {
        ingredientOuput+=
        `
            <div class="ingredient lead">${ingredient.ingredientname}<span class="amount">${ingredient.quantity}</span> </div>
        `
    })
    
    let output = 
    `
        <div id="recipe-header" style="backGround : url(${dish.strMealThumb})">
        </div>
        <div class="row" id="recipe">
            <h1 class="display-2 text-center col-12 mb-5">${dish.strMeal}</h1>
            <hr class="mb-5">
            <div class="col-lg-4">
                <div class="ingredient-list">
                    ${ingredientOuput}
                </div>
            </div>
            <div class="col-lg-8 px-5">
                <div id="steps">
                    <h1 class="display-4">Instructions</h1>
                    <hr>
                    <p class="lead">${dish.strInstructions}</p>
                    <a href="${dish.strYoutube}" class="btn btn-outline btn-lg btn-outline-danger">Youtube link for the recipe</a>
                </div>
            </div>
        </div>  
    `
    dishArea.innerHTML = output;
}

// favorites
// below favfunction is used to add the favorites to the localstorage
// the below function is consist of event listener
// when an usear is fress on heart symbel it adds that iteam to the favorites list
 function favfunction () {
    let favelement = document.querySelectorAll('.favorites');
    favelement.forEach(item => {
        let temp=0;
        item.addEventListener('click', (e)=> {
            item.style.color="red";
           let id= item.getAttribute("foodId");
            for(let key in localStorage) {
                if (!localStorage.hasOwnProperty(key)) {
                  continue;
                }
                if(key===id){
                    temp=1;
                }
              }
            if(temp===0){
            addFavorites(id);
            
            }
        })
    }) 
}
    // the below function is used to add the favorite dishes into the local storage
function addFavorites(id)  {
    
        localStorage.setItem(`${id}`,id);
}
        
// the below function is used to delete the favorite dishes when usear clicked on the remove button
    function favDelete () {
        let favelement = document.querySelectorAll('.delete_button');
        favelement.forEach(item => {
            item.addEventListener('click', (e)=> {
                item.style.color="gray";
               let id= item.getAttribute("foodId");  
                localStorage.removeItem(id);
                let heading = document.getElementById('main_heading');
                let heart =document.getElementById('favoriteList_icon');
                let inputdiv = document.getElementById('sub_div');
                inputdiv.innerHTML=`<a href="index.html">back</a>`;
                inputdiv.style.fontSize = '20px';
                heart.style.display='none';
                heading.innerHTML="<h1>Favorites</h1>";
                dishes=[];  
                listIteams();
            })
        }) 
    }
    
// the below function favbutton is favorites button at the top besides the input container
// when usear clicked on the favorites the below event listener is call the display function to show the favorite dishes
 let favbutton = document.getElementById('fav_click');
 favbutton.addEventListener('click',function(){
    let heading = document.getElementById('main_heading');
    let heart =document.getElementById('favoriteList_icon');
    let inputdiv = document.getElementById('sub_div');   
    inputdiv.innerHTML=`<a href="index.html">back</a>`;
    inputdiv.style.fontSize = '20px';
    heart.style.display='none';
    heading.innerHTML="<h1>Favorites</h1>";
    
    dishes=[];
    listIteams();
       
})
// the below function is called getFoods fuction to display the favorite dishes
function listIteams() {
    let temp=0;
for(let key in localStorage) {
    
    if (!localStorage.hasOwnProperty(key)) {
      continue; // skip keys like "setItem", "getItem" etc
    }
    getFoods(localStorage.getItem(key),1);
    temp=1;
  }
  if(temp===0){
    cardList.innerHTML=`<h1 style="text-align:center;font-size:20px;margin-left:40%">No favorites</h1>`;
  }
}
