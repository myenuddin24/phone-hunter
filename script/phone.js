const loadPhone = async (search, isShowAll) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phones?search=${search}`,
  );
  const data = await res.json();
  const phones = data.data;
  displayPhones(phones, isShowAll);
};

const displayPhones = (phones, isShowAll) => {
  const phonesContainer = document.getElementById("phones-container");
  phonesContainer.textContent = "";

  const showAllContainer = document.getElementById("show-all-container");
  if (phones.length === 0) {
    phonesContainer.innerHTML = `
    <div class="text-center col-span-full py-10">
      <p class="text-2xl">No Data Available</p>
    </div>
    `;
    showAllContainer.classList.add("hidden");
    toggleLoadingSpinner(false);
    return;
  }

  if (phones.length > 12 && !isShowAll) {
    showAllContainer.classList.remove("hidden");
  } else {
    showAllContainer.classList.add("hidden");
  }

  // display only 12 phones if not show all
  if (!isShowAll) {
    phones = phones.slice(0, 12);
  }

  phones.forEach((phone) => {
    const phoneCard = document.createElement("div");
    phoneCard.classList.add("card", "bg-gray-100", "shadow-sm");
    phoneCard.innerHTML = `
            <figure class="px-10 pt-10">
              <img
                src="${phone.image}"
                alt="${phone.slug}"
                class="rounded-xl"
              />
            </figure>
            <div class="card-body items-center text-center">
              <h2 class="card-title">${phone.phone_name}</h2>
              <p>
                A card component has a figure, a body part, and inside body
                there are title and actions parts
              </p>
              <div class="card-actions">
                <button onclick="handleShowDetails('${phone.slug}')" class="btn btn-primary">Show Details</button>
              </div>
            </div>
        `;
    phonesContainer.appendChild(phoneCard);
  });
  toggleLoadingSpinner(false);
};

// handle search button
const handleSearch = (isShowAll) => {
  toggleLoadingSpinner(true);
  const searchField = document.getElementById("search-field");
  const searchText = searchField.value;
  loadPhone(searchText, isShowAll);
};

// loading spinner
const toggleLoadingSpinner = (isLoading) => {
  const loadingSpinner = document.getElementById("loading-spinner");
  if (isLoading) {
    loadingSpinner.classList.remove("hidden");
  } else {
    loadingSpinner.classList.add("hidden");
  }
};

// handle show all btn
const handleShowAll = () => {
  handleSearch(true);
};

// handle show details
const handleShowDetails = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phone/${id}`,
  );
  const data = await res.json();
  const phone = data.data;
  handlePhoneDetails(phone);
};

const handlePhoneDetails = (phone) => {
  show_details_modal.showModal();

  const sensorsText = phone?.mainFeatures?.sensors
    ? phone.mainFeatures.sensors.join(", ")
    : "N/A";

  const showDetailsContainer = document.getElementById(
    "show-details-container",
  );
  showDetailsContainer.innerHTML = `
   <div class="flex justify-center">
     <img src="${phone?.image}" alt="">
   </div>
   <div class="mt-10">
     <h2 class="text-2xl font-bold mb-3">${phone?.name ?? "N/A"}</h2>
     <p><span class="font-bold">Storage:</span> ${phone?.mainFeatures?.storage ?? "N/A"}</p> 
     <p><span class="font-bold">Display Size:</span> ${phone?.mainFeatures?.displaySize ?? "N/A"}</p> 
     <p><span class="font-bold">Chipset:</span> ${phone?.mainFeatures?.chipSet ?? "N/A"}</p> 
     <p><span class="font-bold">Memory:</span> ${phone?.mainFeatures?.memory ?? "N/A"}</p> 
     <p><span class="font-bold">Slug:</span> ${phone?.slug ?? "N/A"}</p> 
     <p><span class="font-bold">Release Date:</span> ${phone?.releaseDate ?? "N/A"}</p> 
     <p><span class="font-bold">Brand:</span> ${phone?.brand ?? "N/A"}</p> 
     <p><span class="font-bold">GPS:</span> ${phone?.others?.GPS ?? "N/A"}</p> 
     <p><span class="font-bold">Sensors:</span>${sensorsText}</p> 
   </div>
  `;
};
