
var proImgInput = document.querySelector("#profile-img");
var fullNameInput = document.querySelector("#full_n");
var phoneInput = document.querySelector("#phone");
var emailAddressInput = document.querySelector("#email");
var addressInput = document.querySelector("#address");
var groupInput = document.querySelector("#group");
var noteInput = document.querySelector("#note");
var favoInput = document.querySelector("#favo");
var emerInput = document.querySelector("#emer");
var saveCon = document.querySelector("#save-contacts");
var updateCon = document.querySelector("#update-contacts");
var allContacts = document.querySelector("#all-contact");
var totalContacts = document.querySelector("#total-value");
var totalFavorites = document.querySelector("#total-favo");
var totalEmerganceys = document.querySelector("#total-emer");
var modal = document.querySelector("#exampleModal");
var addBtn = document.querySelector("#add-btn");
var favoContainer = document.querySelector("#favo-container");
var emerContainer = document.querySelector("#emer-container");
var EmptyMessage = document.querySelector("#empty-message");
var searchInput = document.querySelector("#inputSearch");

var emptyFavo = document.querySelector("#empty-favo");
var emptyEmer = document.querySelector("#empty-emer");
var inputsToValidate = [fullNameInput, phoneInput, emailAddressInput];
var emergenceyEmptyMessage = `
                    <div id="empty-emer" class="py-4 d-flex justify-content-center opacity-25"> No Emergancey contacts</div>
`;
var favoriteEmptyMessage = `
                    <div id="empty-favo" class="py-4 d-flex justify-content-center opacity-25"> No favorites yet</div>
`;
var contactEmptyMessage = `
  <div id="empty-message" class="message opacity-50 d-flex flex-column align-items-center justify-content-center ">
                <div class="m-icon d-flex align-items-center justify-content-center bg-secondary-subtle rounded-3 ">
                  <i class="fa-solid fa-contact-book fs-1 opacity-50"></i>
                  
                </div>
                <p class="fw-bold fs-4">No contacts found</p>
                  <p class="fw-lighter fs-4">Click "Add Contact" to get started</p>
              </div>
`;

var key = "data";
var contacts = [];
// ========== craete localstorage ===========
if (localStorage.getItem(key) !== null) {
  contacts = JSON.parse(localStorage.getItem(key));
  display(contacts);
}

// ================ call of showEmptyMessage to check after reload =================
showEmptyMessage(contactEmptyMessage, allContacts);
showEmptyMessage(favoriteEmptyMessage, favoContainer);
showEmptyMessage(emergenceyEmptyMessage, emerContainer);

// ==================== add new contacts event ======================
var Contact;
saveCon.addEventListener("click", function () {
  Contact = {
    pfrofileImg: proImgInput.value,
    fullName: fullNameInput.value,
    phone: phoneInput.value,
    email: emailAddressInput.value,
    address: addressInput.value,
    group: groupInput.value,
    note: noteInput.value,
    favorite: favoInput.checked,
    emergencey: emerInput.checked,
  };

  for (var i = 0; i < inputsToValidate.length; i++) {
    if (!Validation(inputsToValidate[i])) {
      return;
    }
  }
  if (validationOfDublicatedsPhones(phoneInput)) {
    return;
  }

  contacts.push(Contact);
  localStorage.setItem(key, JSON.stringify(contacts));
  clearInputs();
  addBtn.click();
  display(contacts);
  Swal.fire({
    title: "Added!",
    icon: "success",
    text: "contact has been added successfully.",
    timer: 1000,
    showConfirmButton: false,
  });
  calcTotalContacts();
});
var idxToUpdate = null;
var idxToDeleted = null;
//============= display function ===========

function display(items) {
  var box = "";
  var totalFavo = 0,
    totalEmer = 0;
  for (var i = 0; i < items.length; i++) {
    // idxToUpdate = i;
    if (items[i].favorite) {
      totalFavo++;
    }
    if (items[i].emergencey) {
      totalEmer++;
    }
    var hideEmail = items[i].email.trim() === "" ? "d-none" : "";
    var hideAddress = items[i].address.trim() === "" ? "d-none" : "";
    var hideGroup = items[i].group.trim() === "" ? "d-none" : "";
    box += `
            <div class="contact-item col-12 col-md-6 bg-transparent">
                  <div class="inner d-flex flex-column justify-content-between overflow-hidden rounded-4">
                  <div>
                    <div class="head d-flex align-items-center gap-2 p-3">
                      <div
                        class="icon position-relative rounded-3 bg-success d-flex align-items-center justify-content-center text-white"
                      >
                        <p>${assignAbbreviation(items[i].fullName)}</p>
                        <div class="emer-sign position-absolute rounded-circle ${
                          items[i].emergencey ? "d-flex" : "d-none"
                        } align-items-center justify-content-center bg-danger text-white border border-2 border-white">
                          <i class="fa-solid fa-heart-pulse fa-2xs "></i>
                        </div>
                        <div class="Favo-sign position-absolute rounded-circle ${
                          items[i].favorite ? "d-flex" : "d-none"
                        } align-items-center justify-content-center bg-warning text-white border border-2 border-white">
                          <i class="fa-solid fa-star fa-2xs "></i>
                        </div>

                      </div>
                      <div class="details">
                        <p class="name text-truncate fs14 lh20 fw-medium">
                          ${items[i].fullName}
                        </p>
                        <div class="d-flex gap-2 align-items-center">
                          <div
                            class="phone-icon rounded-2 bg-primary-subtle d-flex align-items-center justify-content-center text-primary"
                          >
                            <i class="fa-solid fa-phone fa-2xs"></i>
                          </div>
                          <p class="fs12-lh16">${items[i].phone}</p>
                        </div>
                      </div>
                    </div>
                    <div class="contact-body px-3 pb-3 mt-12">
                      <div class="ele d-flex gap-2 mb-2  ${hideEmail}">
                        <div
                        
                          class="ele-icon bg-main-subtle rounded-3 bg-success d-flex align-items-center justify-content-center txt-main"
                        >
                          <i  class="fa-solid fa-envelope fa-2xs"></i>
                        </div>
                        <span>${items[i].email}</span>
                      </div>
                      <div class="ele d-flex gap-2 ${hideAddress}">
                        <div
                        id = "address-icon"
                          class="ele-icon  bg-success-subtle rounded-3 bg-success d-flex align-items-center justify-content-center text-success"
                        >
                          <i class="fa-solid fa-location-dot fa-2xs"></i>
                        </div>
                        <span>${items[i].address}</span>
                      </div>
                      <span
                        class=" ${hideGroup} px-2 py-1 text-success bg-success-subtle mt-12 rounded-3 d-inline-block fs11-lh16"
                      >
                       ${items[i].group}
                      </span>
                      <span
                        class="  ${
                          items[i].emergencey ? "" : "d-none"
                        } fs11-lh16 px-2 py-1 text-danger bg-danger-subtle mt-12 rounded-3 d-inline-block"
                      >
                        <i class = "fa-solid fa-heart-pulse text-danger"></i> Emergancey
                      </span>
                    </div>
                    </div>
                    <div
                      class="contact-footer d-flex justify-content-between p-3"
                    >
                      <div class="d-flex gap-2">
                        <a
                          href ="tel:${items[i].phone}"
                          class="text-decoration-none footer-icon rounded-3 bg-success-subtle d-flex align-items-center justify-content-center text-success"
                        >
                          <i class="fa-solid fa-phone"></i>
                        </a>
                        <a
                        href ="mailto:${items[i].email}"
                          class="text-decoration-none footer-icon rounded-3 bg-main-subtle d-flex align-items-center justify-content-center txt-main"
                        >
                          <i class="fa-solid fa-envelope"></i>
                        </a>
                      </div>
                      <div class="d-flex gap-2">
                        <div
                         
                          class="footer-icon  favo-icon rounded-3 d-flex align-items-center justify-content-center"
                        >
                          <i class="${
                            items[i].favorite
                              ? "fa-solid text-warning"
                              : "fa-regular"
                          } fa-star "></i>
                        </div>
                        <div
                        
                          class="footer-icon emer-icon rounded-3 d-flex align-items-center justify-content-center"
                        >
                          <i class="  ${
                            items[i].emergencey
                              ? "fa-solid text-danger fa-heart-pulse "
                              : "fa-regular fa-heart"
                          }"></i>
                        </div>
                        <div
                        
                         onclick="setupFormToUpdate(${i})"
                          class="footer-icon update-btn rounded-3 d-flex align-items-center justify-content-center"
                        >
                          <i class="fa-solid fa-pen"></i>
                        </div>
                        <div
                        onclick="deleteConfirmation(${i})"
                          class="footer-icon delete-btn rounded-3 d-flex align-items-center justify-content-center"
                        >
                          <i class="fa-solid fa-trash"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        `;
  }
  allContacts.innerHTML = box;
  showEmptyMessage(contactEmptyMessage, allContacts);
  totalFavorites.innerHTML = totalFavo;
  totalEmerganceys.innerHTML = totalEmer;
  addFavoriteOrEmergancy();
  createFavoriteOrEmergancy(contacts);
  calcTotalContacts();
}
// ==========validation function =============
var inputPattern = {
  full_n: {
    patternName: /^[A-Za-z ]{2,50}$/,
    emptyMessage: {
      mTitle: "missing name",
      theMessage: "Please enter a name for the contact!",
    },
    invalidMessage: {
      iTitle: "Invalid name",
      theMessage:
        "Name should contain only letters and spaces (2-50 characters)",
    },
  },
  phone: {
    patternName: /^(\+2|20)?01(0|1|2|5)[0-9]{8}$/,
    emptyMessage: {
      mTitle: "missing Phone",
      theMessage: "Please enter a phone for the contact!",
    },
    invalidMessage: {
      iTitle: "Invalid phone",
      theMessage: "Please enter a valid Egyptian phone number",
    },
  },
  email: {
    patternName: /^$|^[a-zA-Z0-9._]+(@gmail.com){1}$/,
    invalidMessage: {
      iTitle: "Invalid email",
      theMessage: "Please enter a valid email address",
    },
  },
};

function validate(input) {
  var val = input.value;
  var pattern = inputPattern[input.id].patternName;
  var isMatch = pattern.test(val);
  if (isMatch) {
    input.nextElementSibling.classList.add("d-none");
    input.classList.remove("border", "border-1", "border-danger");
  } else {
    input.nextElementSibling.classList.remove("d-none");
    input.classList.add("border", "border-1", "border-danger");
  }
}

// ========== function  to validate empty or not ============
function Validation(input) {
   // empty inputs
  if (input.value.trim() === "" && input.id !== "email") {
    Swal.fire({
      title: inputPattern[input.id].emptyMessage.mTitle,
      icon: "error",
      text: inputPattern[input.id].emptyMessage.theMessage,
      draggable: true,
    });
    return false;
  }
  // not empty inputs 
  else {
    var val = input.value;
    var pattern = inputPattern[input.id].patternName;
    var isMatch = pattern.test(val);
    if (!isMatch) {
      Swal.fire({
        title: inputPattern[input.id].invalidMessage.iTitle,
        icon: "error",
        text: inputPattern[input.id].invalidMessage.theMessage,
        draggable: true,
      });
      return false;
    }

    return true;
  }
}
function validationOfDublicatedsPhones(phoneInput) {
  for (var i = 0; i < contacts.length; i++) {
    if (phoneInput.value === contacts[i].phone) {
      Swal.fire({
        title: "Duplicate Phone Number",
        icon: "error",
        text:
          "A contact with this phone number already exists: " +
          contacts[i].fullName,
        draggable: true,
      });
      return true;
    }
  }
  return false;
}
function clearInputs() {
  proImgInput.value = "";
  fullNameInput.value = "";
  phoneInput.value = "";
  emailAddressInput.value = "";
  addressInput.value = "";
  groupInput.value = "";
  noteInput.value = "";
  favoInput.checked = false;
  emerInput.checked = false;
}
function calcTotalContacts() {
  totalContacts.innerHTML = contacts.length;
}
function assignAbbreviation(name) {
  var ans = "";
  var words = name.trim().split(" ");

  if (words.length > 1) {
    ans = words[0].at(0) + words[words.length - 1].at(0);
  } else {
    ans = words[0].at(0);
  }
  return ans.toUpperCase();
}

// =========== add Favorite contact ====================
function createFavoriteOrEmergancy(contacts) {
  var favoBox = "";
  var emerBox = "";
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].favorite) {
      favoBox += `
        <div
                      class="favorite-item col-12 col-md-6 col-xl-12 "
                    >
                    <div class="inner d-flex align-items-center gap-2 rounded-3 p-2  border">
                      <div
                        class="icon rounded-3 bg-success d-flex align-items-center justify-content-center text-white"
                      >
                        <p>${assignAbbreviation(contacts[i].fullName)}</p>
                      </div>
                      <div class="details">
                        <p class="name text-truncate fs14 lh20 fw-medium">
                          ${contacts[i].fullName}
                        </p>
                        <p class="fs12-lh16">${contacts[i].phone}</p>
                      </div>
                      <a
                      href ="tel:${contacts[i].phone}"
                        class=" text-decoration-none icon rounded-3 bg-success-subtle d-flex align-items-center justify-content-center text-success ms-auto"
                      >
                        <i class="fa-solid fa-phone"></i>
                      </a>
                    </div>
                      
                    </div>
      `;
    }
    if (contacts[i].emergencey) {
      emerBox += `
          <div
                      class="favorite-item col-12 col-md-6 col-xl-12 "
                    >
                    <div class="inner d-flex align-items-center gap-2 rounded-3 p-2  border">
                      <div
                        class="icon rounded-3 bg-success d-flex align-items-center justify-content-center text-white"
                      >
                        <p>${assignAbbreviation(contacts[i].fullName)}</p>
                      </div>
                      <div class="details">
                        <p class="name text-truncate fs14 lh20 fw-medium">
                          ${contacts[i].fullName}
                        </p>
                        <p class="fs12-lh16">${contacts[i].phone}</p>
                      </div>
                      <a
                      href ="tel:${contacts[i].phone}"
                        class=" text-decoration-none icon rounded-3 bg-danger-subtle d-flex align-items-center justify-content-center text-danger ms-auto"
                      >
                        <i class="fa-solid fa-phone"></i>
                      </a>
                    </div>
                      
                    </div>
      `;
    }
  }
  favoContainer.innerHTML = favoBox;
  emerContainer.innerHTML = emerBox;
  showEmptyMessage(favoriteEmptyMessage, favoContainer);
  showEmptyMessage(emergenceyEmptyMessage, emerContainer);
}

function addFavoriteOrEmergancy() {
  var favoIcons = Array.from(
    document.querySelectorAll("#all-contact .favo-icon i")
  );
  var emerIcons = Array.from(
    document.querySelectorAll("#all-contact .emer-icon i")
  );

  for (let i = 0; i < favoIcons.length; i++) {
    // ============ for add Favorite ===========

    favoIcons[i].addEventListener("click", function () {
      contacts[i].favorite = !contacts[i].favorite;
      localStorage.setItem(key, JSON.stringify(contacts));
      display(contacts);
    });

    // ============ for add Emergancy ===========

    emerIcons[i].addEventListener("click", function () {
      contacts[i].emergencey = !contacts[i].emergencey;
      localStorage.setItem(key, JSON.stringify(contacts));
      display(contacts);
    });
  }
}

function search(contacts) {
  var searchWord = searchInput.value;

  searchWord = searchWord.toLowerCase().trim();
  var term = "";
  var searchedItems = [];

  for (var i = 0; i < contacts.length; i++) {
    term = contacts[i].fullName + contacts[i].phone + contacts[i].email;
    term = term.toString().trim().toLowerCase();

    if (term.includes(searchWord)) {
      searchedItems.push(contacts[i]);
    }
  }
  display(searchedItems);
}

searchInput.addEventListener("input", function () {
  search(contacts);
});

function showEmptyMessage(message, place) {
  if (place.innerHTML.trim() === "") {
    place.innerHTML = message;
  }
}

// =================== update contaccts=====================

function setupFormToUpdate(idx) {
  idxToUpdate = idx;
  addBtn.click(); // this statement to show modal form
  updateCon.classList.remove("d-none");
  saveCon.classList.add("d-none");
  fullNameInput.value = contacts[idx].fullName;
  phoneInput.value = contacts[idx].phone;
  emailAddressInput.value = contacts[idx].email;
  addressInput.value = contacts[idx].address;
  groupInput.value = contacts[idx].group;
  noteInput.value = contacts[idx].note;
  favoInput.checked = contacts[idx].favorite;
  emerInput.checked = contacts[idx].emergencey;
}

function update(idxToUpdate) {
  // console.log(idxToUpdate);

  for (var i = 0; i < inputsToValidate.length; i++) {
    if (!Validation(inputsToValidate[i])) {
      return;
    }
  }
  if (validationOfDublicatedsPhones(phoneInput) && phoneInput.value !== contacts[idxToUpdate].phone) {
    return;
  }
  var contactToUpdate = contacts[idxToUpdate];
  contactToUpdate.fullName = fullNameInput.value;
  contactToUpdate.phone = phoneInput.value;
  contactToUpdate.email = emailAddressInput.value;
  contactToUpdate.address = addressInput.value;
  contactToUpdate.group = groupInput.value;
  contactToUpdate.note = noteInput.value;
  contactToUpdate.favorite = favoInput.checked;
  contactToUpdate.emergencey = emerInput.checked;

  localStorage.setItem(key, JSON.stringify(contacts));
  display(contacts);
  clearInputs();
  updateCon.classList.add("d-none");
  saveCon.classList.remove("d-none");
  addBtn.click();
  Swal.fire({
    title: "Updated!",
    icon: "success",
    text: "Contact has been updated successfully..",
    draggable: true,
    timer: 1000,
    showConfirmButton: false,
  });
}
updateCon.addEventListener("click", function () {
  update(idxToUpdate);
});

modal.addEventListener("click", function (e) {
  if (e.target.classList.contains("clear")) {
    updateCon.classList.add("d-none");
    saveCon.classList.remove("d-none");
    clearInputs();
  }
});
//  =========== function to delete contact =============

function deleteConfirmation(idx) {
  idxToDeleted = idx;
  Swal.fire({
    title: "Are you sure?",
    text: "Are you sure you want to delete ahmed moneim? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    customClass: {
      confirmButton: "my-confirm-btn",
    },
    cancelButtonColor: "rgba(85, 85, 85, 1)",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteContact(idxToDeleted); // call function to delete contact 
      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
        draggable: true,
        timer: 1000,
        showConfirmButton: false,
      });
    }
  });
}

function deleteContact(idx) {
  // console.log(idx) ;

  contacts.splice(idx, 1);
  localStorage.setItem(key, JSON.stringify(contacts));
  display(contacts);
}
