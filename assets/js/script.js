// Global variable to track expand/collapse state
let isAllExpanded = false;

function expandAllColumns() {
  const expandBtn = document.querySelector(
    'button[onclick="expandAllColumns()"]'
  );
  const btnText = expandBtn.querySelector("span");
  const btnIcon = expandBtn.querySelector("img");

  document.querySelectorAll(".kanban-column .kanban-card").forEach((card) => {
    const infos = card.querySelectorAll(".info");
    const toggleBtn = card.querySelector(".toggle-show");
    const toggleText = toggleBtn?.querySelector("h3");
    const toggleIcon = toggleBtn?.querySelector("img");

    if (!isAllExpanded) {
      // Expand all cards
      infos.forEach((info) => {
        info.style.display = "flex";
      });
      card.classList.add("expanded");
      if (toggleText) toggleText.textContent = "Hide";
      if (toggleIcon) toggleIcon.style.transform = "rotate(180deg)";
    } else {
      // Collapse all cards
      infos.forEach((info, index) => {
        if (index >= 3) {
          info.style.setProperty("display", "none", "important");
        }
      });
      card.classList.remove("expanded");
      if (toggleText) toggleText.textContent = "Show";
      if (toggleIcon) toggleIcon.style.transform = "rotate(0deg)";
    }
  });

  // Toggle the global state and update button
  isAllExpanded = !isAllExpanded;

  if (isAllExpanded) {
    btnText.textContent = "Collapse";
    expandBtn.title = "Collapse";
    if (btnIcon) btnIcon.style.transform = "rotate(180deg)";
  } else {
    btnText.textContent = "Expand";
    expandBtn.title = "Expand";
    if (btnIcon) btnIcon.style.transform = "rotate(0deg)";
  }
}
// Initialize show/hide functionality for each card
function initializeShowHide() {
  document.querySelectorAll(".kanban-card").forEach((card) => {
    const infos = card.querySelectorAll(".info");
    const toggleBtn = card.querySelector(".toggle-show");

    // Show only first 3 info elements by default
    infos.forEach((info, index) => {
      if (index >= 3) {
        info.style.setProperty("display", "none", "important");
      }
    });

    // Add click event to toggle button if it exists
    if (toggleBtn) {
      this.toggleFunctionality(toggleBtn, card, infos);
    }
  });
}
function toggleFunctionality(toggleBtn, card, infos) {
  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const toggleText = toggleBtn.querySelector("h3");
    const toggleIcon = toggleBtn.querySelector("img");
    const isExpanded = card.classList.contains("expanded");

    if (isExpanded) {
      // Hide extra items (show only first 3)
      infos.forEach((info, index) => {
        if (index >= 3) {
          info.style.setProperty("display", "none", "important");
        }
      });
      card.classList.remove("expanded");
      if (toggleText) toggleText.textContent = "Show";
      // Rotate icon back
      if (toggleIcon) toggleIcon.style.transform = "rotate(0deg)";
    } else {
      // Show all items
      infos.forEach((info) => {
        info.style.display = "flex"; // Since your info elements use d-flex
      });
      card.classList.add("expanded");
      if (toggleText) toggleText.textContent = "Hide";
      // Rotate icon
      if (toggleIcon) toggleIcon.style.transform = "rotate(180deg)";
    }
  });
}
// Initialize Sortable for each column
function initializeSortable() {
  const columns = document.querySelectorAll(".kanban-column");

  columns.forEach((col) => {
    new Sortable(col, {
      group: "kanban",
      animation: 150,
      filter: ".toggle-show, .kanban-header", // prevent dragging header and toggle button
      preventOnFilter: false, // allow clicks on filtered elements

      onFilter: function (evt) {
        // Just prevent dragging, clicks work normally
        console.log("Drag prevented on filtered element");
      },

      onAdd: function (evt) {
        console.log("Check the event on moving card", evt);

        const card = evt.item;
        const newColumn = evt.to.id;
        const oldColumn = evt.from.id;
        console.log("Check the event on moving card new Column", newColumn);
        console.log("Check the event on moving card old column", oldColumn);
        if (oldColumn == "screening" && newColumn == "interview") {
          let modal = new bootstrap.Modal(
            document.getElementById("interviewModal")
          );
          modal.show();
        }
        if (oldColumn == "interview" && newColumn == "decision") {
          let modal = new bootstrap.Modal(
            document.getElementById("decisionModal")
          );
          modal.show();
        }
        if (oldColumn == "decision" && newColumn == "offer") {
          let modal = new bootstrap.Modal(
            document.getElementById("offerModal")
          );
          modal.show();
        }
        // Log the move
        const cardTitle = card.querySelector("h4");
        const titleText = cardTitle ? cardTitle.textContent : "Card";

        console.log(`"${titleText}" moved to ${newColumn}`);

        // You can add status updates here based on the column
        // For example, update the "Applied" status based on the new column
      },

      onStart: function (evt) {
        // Add dragging class for visual feedback
        evt.item.classList.add("dragging");
      },

      onEnd: function (evt) {
        // Remove dragging class
        evt.item.classList.remove("dragging");
      },
    });
  });
}

// Filter button functionality
function initializeFilter() {
  const button = document.querySelector(".filterBtn");
  const filterCard = document.querySelector(".filter-card");

  if (button && filterCard) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      filterCard.classList.toggle("show");
    });

    // Close filter when clicking outside
    document.addEventListener("click", function (e) {
      if (!button.contains(e.target) && !filterCard.contains(e.target)) {
        filterCard.classList.remove("show");
      }
    });
  }
}

// Standalone showHide function for programmatic use
function showHide(card) {
  const infos = card.querySelectorAll(".info");
  const toggleBtn = card.querySelector(".toggle-show");
  const toggleText = toggleBtn ? toggleBtn.querySelector("h3") : null;
  const toggleIcon = toggleBtn ? toggleBtn.querySelector("img") : null;
  const isExpanded = card.classList.contains("expanded");

  if (isExpanded) {
    // Hide extra items
    infos.forEach((info, index) => {
      if (index >= 3) {
        info.style.display = "none";
      }
    });
    card.classList.remove("expanded");
    if (toggleText) toggleText.textContent = "Show";
    if (toggleIcon) toggleIcon.style.transform = "rotate(0deg)";
  } else {
    // Show all items
    infos.forEach((info) => {
      info.style.display = "flex";
    });
    card.classList.add("expanded");
    if (toggleText) toggleText.textContent = "Hide";
    if (toggleIcon) toggleIcon.style.transform = "rotate(180deg)";
  }
}
function openScreenModal() {
  let modal = new bootstrap.Modal(document.getElementById("screenModal"));
  modal.show();
  const progressBar = document.querySelector(".progress-bar-custom");
  const percentage = document.querySelector(".progress-percentage");
  let currentWidth = 0;

  const interval = setInterval(() => {
    if (currentWidth >= 55) {
      clearInterval(interval);
      return;
    }
    currentWidth += 1;
    progressBar.style.width = currentWidth + "%";
    percentage.textContent = currentWidth + "%";
  }, 50);
}
function showScreen2(decision) {
  document.getElementById("screen1").style.display = "none";
  document.getElementById("screen2").style.display = "block";

  // Reset all buttons to outline state
  document.getElementById("acceptedBtn").className =
    "btn btn-outline-success w-100";
  document.getElementById("rejectedBtn").className =
    "btn btn-outline-danger w-100";
  document.getElementById("onHoldBtn").className =
    "btn btn-outline-warning w-100";

  // Activate the selected button
  if (decision === "accepted") {
    document.getElementById("acceptedBtn").className = "btn btn-success w-100";
  } else if (decision === "rejected") {
    document.getElementById("rejectedBtn").className = "btn btn-danger w-100";
  } else if (decision === "on-hold") {
    document.getElementById("onHoldBtn").className = "btn btn-warning w-100";
  }
}

function resetToScreen1() {
  document.getElementById("screen2").style.display = "none";
  document.getElementById("screen1").style.display = "block";

  // Reset radio buttons
  const radioButtons = document.querySelectorAll('input[name="reason"]');
  radioButtons.forEach((radio) => (radio.checked = false));
}
// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeShowHide();
  initializeSortable();
  initializeFilter();
});

// For Offer Modal JS

let salaryCounter = 2;
let offerTermCounter = 3;

function addSalaryComponent() {
  salaryCounter++;
  const container = document.getElementById("salaryRepeater");
  const newItem = document.createElement("div");
  newItem.className = "repeater-item";
  newItem.innerHTML = `
        <div class="row py-3 px-3 align-items-center mx-0">
            <div class="col-1">${salaryCounter}</div>
            <div class="col-5">
                <div class="custom-dropdown">
                    <select class="form-select">
                        <option value="">Select Component</option>
                        <option value="medical">Medical Allowance</option>
                        <option value="transport">Transport Allowance</option>
                        <option value="leave">Leave Fare Assistance</option>
                        <option value="bonus">Bonus</option>
                    </select>
                </div>
            </div>
            <div class="col-3">
                <input type="number" class="form-control" placeholder="0.00">
            </div>
            <div class="col-3 d-flex">
                <button type="button" class="action-btn edit-btn me-2">
                    <img src="./assets/imgs/edit-offer.svg" alt="" srcset="">
                </button>
                <button type="button" class="action-btn delete-btn" onclick="removeItem(this)">
                    <img src="./assets/imgs/delete.svg" alt="" srcset="">
                </button>
            </div>
        </div>
    `;
  container.appendChild(newItem);
  updateNumbers();
}

function addOfferTerm() {
  offerTermCounter++;
  const container = document.getElementById("offerTermsRepeater");
  const newItem = document.createElement("div");
  newItem.className = "repeater-item";
  newItem.innerHTML = `
        <div class="row py-3 px-3 align-items-center mx-0">
            <div class="col-1">${offerTermCounter}</div>
            <div class="col-3">
                <div class="custom-dropdown">
                    <select class="form-select">
                        <option value="">Select Term</option>
                        <option value="incentives">Incentives</option>
                        <option value="notice">Notice Period</option>
                        <option value="responsibilities">Responsibilities</option>
                    </select>
                </div>
            </div>
            <div class="col-6">
                <textarea class="form-control" rows="3" placeholder="Enter description"></textarea>
            </div>
            <div class="col-2">
                <button type="button" class="action-btn delete-btn" onclick="removeItem(this)">
                    <img src="./assets/imgs/delete.svg" alt="" srcset="">
                </button>
            </div>
        </div>
    `;
  container.appendChild(newItem);
  updateNumbers();
}

function removeItem(button) {
  const item = button.closest(".repeater-item");
  item.remove();
  updateNumbers();
}

function updateNumbers() {
  // Update salary component numbers
  const salaryItems = document.querySelectorAll(
    "#salaryRepeater .repeater-item"
  );
  salaryItems.forEach((item, index) => {
    const numberCell = item.querySelector(".col-1");
    numberCell.textContent = index + 1;
  });

  // Update offer terms numbers
  const offerItems = document.querySelectorAll(
    "#offerTermsRepeater .repeater-item"
  );
  offerItems.forEach((item, index) => {
    const numberCell = item.querySelector(".col-1");
    numberCell.textContent = index + 1;
  });

  // Update counters for next additions
  salaryCounter = salaryItems.length;
  offerTermCounter = offerItems.length;
}
function openEditModal() {
  let modal = new bootstrap.Modal(
    document.getElementById("interviewDetailModal")
  );
  modal.show();
}

// Add some interactivity for the interview pipeline
document.addEventListener("DOMContentLoaded", function () {
  // Handle view details buttons
  const viewDetailsButtons = document.querySelectorAll(".pipeline-btn");
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log(
        "View details clicked for:",
        this.closest(".pipeline-stage").querySelector(".stage-title")
          .textContent
      );
      // Remove "active" from all pipeline stages
      document.querySelectorAll(".pipeline-stage").forEach((stage) => {
        stage.classList.remove("active");
      });
      this.closest(".pipeline-stage").classList.add("active");
    });
  });

  // Handle status dropdown change
  const statusDropdown = document.querySelector(".status-dropdown");
  if (statusDropdown) {
    statusDropdown.addEventListener("change", function () {
      console.log("Status changed to:", this.value);
    });
  }
});
