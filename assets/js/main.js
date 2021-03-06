

// Declaring constants
const url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex";

let wLocation = window.location;

if (wLocation.toString().includes('index.html')) {
    const buttonApi = document.getElementById('buttonApi');
    const buttonApiSm = document.getElementById('buttonApiSm');
    const searchBar = document.getElementById('searchBar');
    const searchBarSm = document.getElementById('searchBarSm');


    // Declaring event listeners
    buttonApi.addEventListener('click', function () {
        requestAPI(searchBar);
    });
    buttonApiSm.addEventListener('click', function () {
        requestAPI(searchBarSm);
    });
    
} else {
    const buttonRes = document.getElementById('buttonRes');
    const buttonResSm = document.getElementById('buttonResSm');
    // Declaring event listeners
    buttonRes.addEventListener('click', handleSubmit);
    buttonResSm.addEventListener('click', handleSubmit);
}




// Sliders
var maxCalories = document.getElementById('maxCalories');
var maxProtein = document.getElementById('maxProtein');
var maxFat = document.getElementById('maxFat');
var maxCarbs = document.getElementById('maxCarbs');
maxSliders = [maxProtein, maxFat, maxCarbs];


function requestAPI(search) {
    // Gets the search query and passes as a parameter to the Request
    var searchString = search.value;

    fetch(`${url}?limitLicense=false&offset=0&number=12&diet=vegan&includeIngredients=${searchString}&ranking=2&maxCalories=1500&maxFat=100&maxProtein=100&maxCarbs=100&fillIngredients=false&instructionsRequired=false&addRecipeInformation=true`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "13b8334a45mshc2f5b45765f960cp1ea18ajsnb4cf78ea6aab",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
            }
        })
        // Transform the response into a json object
        .then((response) => response.json())
        .then((data) => renderResponse(data))
        .catch((err) => errorHandling(err));
}

function requestRefined(asString) {


    fetch(`${url}?limitLicense=false&offset=0&number=12&${asString}&maxFat=${maxFat.value}&maxProtein=${maxProtein.value}&maxCarbs=${maxCarbs.value}&fillIngredients=false&instructionsRequired=false&addRecipeInformation=true`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "13b8334a45mshc2f5b45765f960cp1ea18ajsnb4cf78ea6aab",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
            }
        })
        // Transform the response into a json object
        .then((response) => response.json())
        .then((data) => renderResponse(data))
        .catch(err => errorHandling(err));
}

function sliderOutput(event, val) {
    event.nextSibling.nextSibling.value = val;
}



// Renders the JSON object in the HTML placeholder element
function renderResponse(data) {
    // Accesses the array
    data = data.results;
    // Error handling
    if (data.length === 0) {
        var resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
        resultModal.toggle();
        return;
    } else {
        let output = `
        <h2 class="title text-center">Results</h2><br>
        <div class="row">`;
        // Loops through the array of recipes and renders them separately 
        data.forEach(function (recipe) {
            // Rounds the rating to fill the stars uniformly
            rating = Math.round(recipe.spoonacularScore / 10) * 10;
            // Creates HTML element
            output +=
                `
                    <div class="col-sm-12 col-md-4">
                        <div class="card card-render">
                            <img src="${recipe.image}" class="card-img-top img-thumbnail" alt="${recipe.title}">
                            <h4 class="card-header card-header-recipe text-center section-title">${recipe.title}</h4>
                            <div class="card-body">
                                <div class="text-center">
                                    <div class="stars-outer">
                                        <div class="stars-inner" style="width:${rating}%"></div>
                                    </div>
                                    <ul class="mt-3">
                                        <ul class="icon-list">
                                            <li><i class="fas fa-users"></i><strong> ${recipe.servings} portion(s)</strong></li>
                                            <li><i class="far fa-clock"></i><strong> ${recipe.readyInMinutes} minutes</strong></li>
                                            <li><i class="fas fa-cookie-bite"></i><strong> ${recipe.calories} kcal</strong></li>
                                        </ul>
                                        <div class="mt-3">
                                            <li><strong>Protein: ${recipe.protein}</strong></li>
                                            <li><strong>Fat: ${recipe.fat}</strong></li>
                                            <li><strong>Carbs: ${recipe.carbs}</strong></li>
                                        </div>
                                    </ul>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-success" onclick="requestRecipe(${recipe.id})">Cook me!</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        });
        // Renders the above template into the target div element
        var recipeResult = output;
    }
    localStorage.setItem("recipeResult", recipeResult);
    window.location.href = "result.html";
}


// Handler functions

// How to transform formData into an URL search parameters and feed to the request - tutorial found in: [https://ultimatecourses.com/blog/transform-formdata-into-query-string]

function handleSubmit(event) {
    event.preventDefault();
    let form = document.forms[0];
    const formData = new FormData(form);
    const asString = new URLSearchParams(formData).toString();

    // "JavaScript Promise Tutorial: Resolve, Reject, and Chaining in JS and ES6" tutorial found in: https://www.freecodecamp.org/news/javascript-es6-promises-for-beginners-resolve-reject-and-chaining-explained/
    let promise = new Promise(function (resolve, reject) {
        if (asString) {
            resolve();
        } else {
            reject();
        }
    });

    promise.then(requestRefined(asString));
    promise.catch((err) => errorHandling(err));

}
// Handling error
function errorHandling(err) {
    let errModal = document.createElement('div');
    errModal.classList.add('modal fade');
    errModal.id = ('errModal');
    errModal.innerHTML =

        ` <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Oops! We found an issue:</h5>
                    </div>
                    <div class="modal-body">
                        ${err}
                    </div>
                </div>
            </div>`;

    errModal.toggle();
}

// Linking functions

function linkTo() {
    window.location = 'refined_search.html';
}
