/*

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Close the form when clicking outside it
  window.addEventListener("click", (event) => {
    if (
      addToy &&
      !toyFormContainer.contains(event.target) &&
      event.target !== addBtn
    ) {
      addToy = false;
      toyFormContainer.style.display = "none";
    }
  });

  // Add event listener for the form submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default submit

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    // Add new toy
    addNewToy(toyName, toyImage);

    // Reset form
    toyForm.reset();
    addToy = false;
    toyFormContainer.style.display = "none";
  });

  // Fetch all toys when the page loads
  fetchToys();
});

// Function to fetch toys from the server
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => {
        createToyCard(toy.name, toy.image, toy.id, toy.likes);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// Function to create a new toy card
function createToyCard(name, image, toyId, likes = 0) {
  const toyCollection = document.getElementById("toy-collection");
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
        <h2>${name}</h2>
        <img src="${image}" class="toy-avatar" alt="${name}" />
        <p>${likes} Likes</p>
        <button class="like-btn" id="${toyId}">Like ❤️</button>
    `;

  // Add event listener for likes
  card.querySelector(".like-btn").addEventListener("click", () => {
    const likesElement = card.querySelector("p");
    let currentLikes = parseInt(likesElement.textContent) + 1;

    // PATCH request to update likes
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: currentLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        likesElement.textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => console.error("Error:", error));
  });

  toyCollection.appendChild(card);
}

// Function to add a new toy
function addNewToy(name, image) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name, image, likes: 0 }),
  })
    .then((response) => response.json())
    .then((toy) => createToyCard(toy.name, toy.image, toy.id, toy.likes))
    .catch((error) => console.error("Error:", error));
}
*/


let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display toys on page load
  fetchToys();

  // Handle form submission
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    createToy(name, image);
    toyForm.reset(); // Clear the form inputs
  });

  // Fetch toys from server
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach(renderToy);
      });
  }

  // Render each toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.classList.add("like-btn");
    button.id = toy.id;
    button.textContent = "Like ❤️";

    button.addEventListener("click", () => {
      updateLikes(toy.id, toy.likes + 1);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);
    toyCollection.appendChild(card);
  }

  // Create a new toy
  function createToy(name, image) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then(renderToy);
  }

  // Update likes for a toy
  function updateLikes(id, likes) {
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        const toyCard = document.getElementById(id).closest(".card");
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }
});