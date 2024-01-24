// Variable Declarations
const beerName = document.getElementById('beer-name');
const beerImage = document.getElementById('beer-image');
const beerDescription = document.getElementById('beer-description');
const beerReviewForm = document.getElementById('review-form');
const beerReviewText = document.getElementById('review');

// Function to Fetch Beer Data
async function fetchData(beerId = null) {
    const baseURL = 'http://localhost:3000/beers/';
    const url = beerId ? `${baseURL}${beerId}` : baseURL;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to Update Beer (using PATCH Method)
async function updateBeer(beer) {
    try {
        const response = await fetch(`http://localhost:3000/beers/${beer.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(beer)
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const updatedBeer = await response.json();
        beerDisplay(updatedBeer);
    } catch (error) {
        console.error('Error updating beer:', error);
    }
}

// Function to Display Beer Details
function beerDisplay(beer) {
    const beerDescriptionForm = document.getElementById('des-form');
    const beerEditDescription = document.getElementById('description');
    const beerReviewList = document.getElementById('review-list');

    // Remove place-holder for customer reviews
    while (beerReviewList.firstElementChild) {
        beerReviewList.removeChild(beerReviewList.lastElementChild);
    }

    // Display beer details
    beerName.textContent = beer.name;
    beerImage.src = beer.image_url;
    beerDescription.textContent = beer.description;
    beerEditDescription.value = beer.description;

    // Event listener to update beer description
    beerDescriptionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        beer.description = beerEditDescription.value;
        await updateBeer(beer);
    });

    // Event listener to add reviews
    beerReviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Conditional to not allow users to add empty reviews
        if (beerReviewText.value.trim() !== '') {
            beer.reviews.push(beerReviewText.value.trim());
            await updateBeer(beer);
        } else {
            alert('Please add a review!');
        }
    });
}

// Function to Display Navigation on the Left Side
function navDisplay(beers) {
    const navBeerList = document.querySelector('#beer-list');

    // Populate the left side bar with beer names
    while (navBeerList.firstElementChild) {
        navBeerList.removeChild(navBeerList.lastElementChild);
    }

    beers.forEach(beer => {
        const navElement = document.createElement('li');
        navElement.textContent = beer.name;
        navElement.setAttribute('index', beer.id);
        navBeerList.append(navElement);

        // Add event listener to beer names onClick
        navElement.addEventListener('click', async (event) => {
            // When clicked, fetch beer data using its id value
            const selectedBeer = await fetchData(event.target.getAttribute('index'));
            if (selectedBeer) {
                beerDisplay(selectedBeer);
            }
        });
    });
}

// Function to Load Beer from the left navigation bar
async function getBeerFromNav() {
    try {
        // Fetch and display the navigation bar
        const beers = await fetchData();
        if (beers) {
            navDisplay(beers);
        }

        // Fetch and display the first beer
        const firstBeer = await fetchData(1);
        if (firstBeer) {
            beerDisplay(firstBeer);
        }
    } catch (error) {
        console.error('Error initializing FlataBeer:', error);
    }
}

// Call the getBeerFromNav function
getBeerFromNav();
