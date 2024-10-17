async function performSearch() {
  const searchFunction = document.getElementById("searchFunction").value;
  const searchInput = document.getElementById("searchInput").value;
  const searchResults = document.getElementById("results_list");
  searchResults.innerHTML = "";

  const existingNoResultsMessage =
    document.getElementById("no-results-message");
  if (existingNoResultsMessage) {
    existingNoResultsMessage.remove();
  }
  try {
    const response = await fetch("/search_results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchFunction: searchFunction,
        searchInput: searchInput,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.error);
      throw new Error(errorData.error || "Network response was not ok");
    }

    const results = await response.json();

    console.log("Success:", results);

    // Add result items to the lists
    for (let result of results) {
      console.log(result);
      const listItem = document.createElement("li");
      listItem.classList.add("result-item");

      const img = document.createElement("img");
      img.addEventListener("click", displayResult);
      img.src = result.img_src; // Assuming result has an imageUrl property
      img.alt = result.imageAlt || "Search result image"; // Optional alt text
      const label = document.createElement("label");
      label.textContent = result.text;
      label.classList.add("result-label");
      listItem.appendChild(img);
      listItem.appendChild(label);
      searchResults.appendChild(listItem);
    }
  } catch (error) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.id = "no-results-message";
    noResultsMessage.textContent = "No results found.";
    searchResults.appendChild(noResultsMessage);
  }
  // Handle the response data here
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("searchInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        console.log(this.value);
        performSearch(this.value);
      }
    });
});

async function displayResult() {
  const resultData = this.parentElement.textContent;
  window.location.href = `/result_viewer?data=${resultData}`;
}
