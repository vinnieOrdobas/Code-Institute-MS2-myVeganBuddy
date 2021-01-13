
// Declaring constants
const url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex"
const buttonApi = document.getElementById('buttonApi');
const buttonClear = document.getElementById('buttonClear');
const recipeList = document.getElementById('recipeList');
const recipeRender = document.getElementById('recipeRender');


// Sliders
var maxCalories = document.getElementById('maxCalories');
var maxProtein = document.getElementById('maxProtein');
var maxFat = document.getElementById('maxFat');
var maxCarbs = document.getElementById('maxCarbs');
maxSliders = [maxCalories, maxProtein, maxFat, maxCarbs];


// Declaring event listeners
buttonApi.addEventListener('click', requestAPI);
document.addEventListener('onload',sliderOutput(maxSliders));
buttonClear.addEventListener('click', clearContent(recipeList));


function requestAPI() {
    // Gets the search query and passes as a parameter to the Request
    var searchString = document.getElementById('searchBar').value;

    fetch(`${url}?limitLicense=true&offset=0&number=12&diet=vegan&includeIngredients=${searchString}&ranking=2&maxCalories=${maxCalories.value}&maxFat=${maxFat.value}&maxProtein=${maxProtein.value}&maxCarbs=${maxCarbs.value}&fillIngredients=false&instructionsRequired=false&addRecipeInformation=true`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "13b8334a45mshc2f5b45765f960cp1ea18ajsnb4cf78ea6aab",
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
        }
    })
        // Transform the response into a json object
        .then((response) => response.json())
        .then((data) => renderResponse(data))
        .catch(err => alert(err));
}

// Renders the JSON object in the HTML placeholder element
function renderResponse(data) {
    recipeList.innerHTML = "";
    // Accesses the array
    data = data.results;
    // Error handling
    if (data.length === 0) {
        alert('No results found!');
    } else {
        let output = `
        <h2 class="title text-center">Results</h2><br>
        <div class="row">`
            // Loops through the array of recipes and renders them separately 
            data.forEach(function (recipe) {
                // Rounds the rating to fill the stars uniformly
                rating = Math.round(recipe.spoonacularScore/10) * 10; 
                // Creates HTML element
                output +=
                    `
                    <div class="col-sm-12 col-md-3">
                        <div class="card card-render">
                            <img src="${recipe.image}" class="card-img-top img-thumbnail" alt="${recipe.title}">
                            <h4 class="card-header text-center">${recipe.title}</h4>
                            <div class="card-body">
                                <div class="text-center">
                                    <h5><strong>Rating:</strong></h5>
                                    <div class="stars-outer">
                                        <div class="stars-inner" style="width:${rating}%"></div>
                                    </div>
                                    <ul class="mt-3">
                                        <ul class="icon-list">
                                            <li><i class="fas fa-users fa-2x"></i><strong> ${recipe.servings} portion(s)</strong></li>
                                            <li><i class="far fa-clock fa-2x"></i><strong> ${recipe.readyInMinutes} minutes</strong></li>
                                            <li><i class="fas fa-cookie-bite fa-2x"></i><strong> ${recipe.calories} kcal</strong></li>
                                        </ul>
                                        <div class="mt-3">
                                            <li><strong>Protein: ${recipe.protein}</strong></li>
                                            <li><strong>Fat: ${recipe.fat}</strong></li>
                                            <li><strong>Carbs: ${recipe.carbs}</strong></li>
                                        </div>
                                    </ul>
                                </div>
                                <div class="text-center">
                                    <a href="temp.html" target="_blank" class="btn btn-danger" onclick="requestRecipe(${recipe.id})">Cook me</a>
                                </div>
                            </div>
                        </div>
                    </div>`
        });
    // Renders the above template into the target div element
    recipeList.innerHTML = output;
    }

};


// Shows current value of sliders
function sliderOutput(sliders) {
    sliders.forEach(function (slider) {
        slider.oninput = function () {
            slider.nextElementSibling.innerHTML = slider.value;
        }

    })
};

// Clears target element for the recipes
function clearContent(element){
    element.innerHTML = "";
};


// Toggle visibility for the searchWrapper
// Code found in "Toggle visibility of an element with JavaScript https://stackoverflow.com/questions/34097615/toggle-visibility-of-an-element-with-javascript"
function toggleVisibility(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'none') {
        e.style.display == 'block'
    } else {
        e.style.display = 'none'
    };

}