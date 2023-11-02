document.addEventListener("DOMContentLoaded", async function () {
  const API_URL = "https://jsonplaceholder.typicode.com/photos?";
  const cardsContainer = document.querySelector(".cards");
  const spinnerBar = document.querySelector(".spinner-border");
  let limitPerScroll = 0;

  async function fetchPosts() {
    try {
      const res = await fetch(API_URL+new URLSearchParams({albumId:1}), { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error(`An Error happened : ${res.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  let photos;
  try {
    photos = await fetchPosts();
  } catch (e) {
    throw new Error(`An error occurred :${e}`);
  }
  //scroll effect
  //it observe the last card whenever last card visible to the screen it loads next 10 cards
  const observer = new IntersectionObserver(
    (entries) => {
      const lastCard = entries[0];
      if (lastCard.isIntersecting) {
        //every time we make 10 cards per scroll
        console.log("observe")
        makeCard(photos.slice(limitPerScroll, limitPerScroll + 10));
        observer.observe(document.querySelector(".card:last-child"));
        observer.unobserve(lastCard.target);
      }
    },
    { threshold: 0.7 }
  );

  observer.observe(document.querySelector(".card:last-child"));

  function makeCard(data) {
    // if we run out of results we'll stop making cards
    if (data.length === 0) {
      spinnerBar.classList.remove("spinner-border");
      return;
    }
    for (let photo of data) {
      const cardBody = `<img src=${photo.url} class="card-img-top" alt="album image">
          <div class="card-body">
            <p class="card-text">${photo.title}</p>
          </div>
        `;
      const card = document.createElement("div");
      card.classList.add("card", "col-4", "m-2", "col-md-6");
      card.style.width = "18rem";
      card.innerHTML = cardBody;
      cardsContainer.append(card);
    }
    limitPerScroll += 10;
  }
});
