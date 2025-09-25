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
          // let modal = new bootstrap.Modal(
          //   document.getElementById("interviewModal")
          // );
          // modal.show();
          $('#interviewModal').modal('show');
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
// Handle Applied checkbox toggle
if (document.getElementById('applied-checkbox')) {
  document.getElementById('applied-checkbox').addEventListener('change', function() {
    const dateRangeContainer = document.getElementById('date-range-container');
    
    if (this.checked) {
        // Show date range
        dateRangeContainer.classList.remove('date-range-hidden');
        dateRangeContainer.classList.add('expanding');
        
        // Remove expanding class after animation
        setTimeout(() => {
            dateRangeContainer.classList.remove('expanding');
        }, 300);
    } else {
        // Hide date range
        dateRangeContainer.classList.add('date-range-hidden');
    }
  });
}


// Date range actions
function clearDateRange() {
  // Clear the date inputs
  const dateInputs = document.querySelectorAll('.date-input-field');
  dateInputs.forEach(input => input.value = '');
  
  // Hide the date range
  document.getElementById('date-range-container').classList.add('date-range-hidden');
  
  // Optionally uncheck the Applied checkbox
  // document.getElementById('applied-checkbox').checked = false;
}

function applyDateRange() {
  const fromDate = document.querySelectorAll('.date-input-field')[0].value;
  const toDate = document.querySelectorAll('.date-input-field')[1].value;
  
  if (fromDate && toDate) {
      // Here you can add your logic to apply the date filter
      console.log('Applying date range:', fromDate, 'to', toDate);
      
      // Optional: Show success feedback
      const applyBtn = event.target;
      const originalText = applyBtn.textContent;
      applyBtn.textContent = 'Applied ✓';
      applyBtn.classList.remove('btn-primary');
      applyBtn.classList.add('btn-success');
      
      setTimeout(() => {
          applyBtn.textContent = originalText;
          applyBtn.classList.remove('btn-success');
          applyBtn.classList.add('btn-primary');
      }, 2000);
  } else {
      alert('Please select both From and To dates');
  }
}

// Alternative: Auto-apply when dates change
document.querySelectorAll('.date-input-field').forEach(input => {
  input.addEventListener('change', function() {
      const fromDate = document.querySelectorAll('.date-input-field')[0].value;
      const toDate = document.querySelectorAll('.date-input-field')[1].value;
      
      if (fromDate && toDate) {
          // Auto-apply the filter when both dates are selected
          console.log('Auto-applying date range:', fromDate, 'to', toDate);
      }
  });
});
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

// Enhanced Applicant Page Js with Progress Step Navigation
class ESSFormManager {
  constructor() {
    this.currentMainStep = "information";
    this.currentSubStep = "professional-portfolio";
    this.completedSections = new Set([]);
    this.mainSteps = [
      "information",
      "experience",
      "education",
      "skills",
      "preferences",
      "review",
    ];
    this.subSteps = [
      "professional-portfolio",
      "personal-information",
      "identity-details",
      "contact-details",
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupFileUpload();
    this.bindProgressStepNavigation(); // Add this new method
    this.updateUI();
  }

  bindEvents() {
    // Sidebar navigation
    document.querySelectorAll(".ess-sidebar-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const section = e.currentTarget.getAttribute("data-section");
        this.navigateToSection(section);
      });
    });

    // Next/Back buttons
    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");
    
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.handleNext();
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.handleBack();
      });
    }

    // Form validation on input change
    document.querySelectorAll(".ess-form-control").forEach((input) => {
      input.addEventListener("change", () => {
        this.validateCurrentSection();
      });
    });
  }

  // NEW METHOD: Bind progress step navigation
  bindProgressStepNavigation() {
    document.querySelectorAll(".ess-progress-step").forEach((step) => {
      step.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const stepCircle = step.querySelector(".ess-step-circle");
        if (stepCircle) {
          const targetStep = stepCircle.getAttribute("data-step");
          if (targetStep && this.canNavigateToStep(targetStep)) {
            this.navigateToMainStep(targetStep);
          }
        }
      });
      
      // Add cursor pointer to indicate clickability
      step.style.cursor = "pointer";
    });
  }

  // NEW METHOD: Check if user can navigate to a specific step
  canNavigateToStep(targetStep) {
    const targetIndex = this.mainSteps.indexOf(targetStep);
    const currentIndex = this.mainSteps.indexOf(this.currentMainStep);
    
    // Allow navigation to:
    // 1. Current step
    // 2. Previous completed steps
    // 3. Next immediate step (if current step is valid)
    if (targetIndex === currentIndex) {
      return true;
    }
    
    if (targetIndex < currentIndex) {
      return true; // Can go back to any previous step
    }
    
    if (targetIndex > currentIndex) {
      return true; // Can go back to any previous step
    }
    
    if (targetIndex === currentIndex + 1) {
      // Can go to next step only if current step is valid
      // return this.validateCurrentStep();
      return true;
    }
    
    // Cannot skip multiple steps ahead
    return false;
  }

  // NEW METHOD: Navigate directly to a main step
  navigateToMainStep(targetStep) {
    if (targetStep === "information") {
      this.currentMainStep = "information";
      this.currentSubStep = "professional-portfolio";
      document.querySelectorAll(".ess-content-area").forEach((item) => {
        item.style.display = "none";
      });
      document.querySelector("#informationSection").style.display = "flex";
      document.querySelector("#informationSection .ess-content-area").style.display = "block";
      this.navigateToSection(this.currentSubStep);
    } else if (targetStep === "experience") {
      this.moveToMainStep("experience");
    } else if (targetStep === "education") {
      this.moveToMainStep("education");
    } else if (targetStep === "skills") {
      this.moveToMainStep("skills");
    } else if (targetStep === "preferences") {
      this.moveToMainStep("preferences");
    } else if (targetStep === "review") {
      this.moveToMainStep("review");
    }
    
    this.updateUI();
  }

  // ENHANCED METHOD: Validate current step (not just section)
  validateCurrentStep() {
    if (this.currentMainStep === "information") {
      // For information step, validate all completed sub-sections
      return this.completedSections.size >= 1; // At least one section completed
    }
    
    // For other steps, you can add validation logic as needed
    return true;
  }

  setupFileUpload() {
    const uploadArea = document.querySelector(".ess-upload-area");
    const fileInput = document.getElementById("resume-upload");

    if (!uploadArea || !fileInput) return;

    // Drag and drop functionality
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("dragover");
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === "application/pdf") {
        this.handleFileUpload(files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileUpload(e.target.files[0]);
      }
    });
  }

  handleFileUpload(file) {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("File size exceeds 10MB limit");
      return;
    }

    const uploadArea = document.querySelector(".ess-upload-area");
    uploadArea.innerHTML = `
                    <div class="ess-upload-icon text-success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="ess-upload-text text-success">File uploaded successfully</div>
                    <div class="ess-upload-subtext">${file.name}</div>
                `;
  }

  navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".ess-form-section").forEach((section) => {
      section.classList.remove("active");
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Update sidebar
    document.querySelectorAll(".ess-sidebar-item").forEach((item) => {
      item.classList.remove("active");
    });

    const sidebarItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (sidebarItem) {
      sidebarItem.classList.add("active");
    }

    this.currentSubStep = sectionId;
    this.updateActionButtons();
  }

  validateCurrentSection() {
    return true; // Simplified for now - you can add validation logic here
  }

  handleNext() {
    if (this.currentMainStep === "information") {
      // If we're in the Information step, handle sub-step navigation
      const currentIndex = this.subSteps.indexOf(this.currentSubStep);

      if (this.validateCurrentSection()) {
        // Mark current section as completed
        this.completedSections.add(this.currentSubStep);

        // Move to next sub-step or main step
        if (currentIndex < this.subSteps.length - 1) {
          const nextSection = this.subSteps[currentIndex + 1];
          this.navigateToSection(nextSection);
        } else {
          // All sub-steps completed, move to Experience
          this.moveToMainStep("experience");
        }

        this.updateUI();
      } else {
        this.showValidationError();
      }
    } else {
      // Handle other main steps (Experience, Education, etc.)
      const currentIndex = this.mainSteps.indexOf(this.currentMainStep);
      if (currentIndex < this.mainSteps.length - 1) {
        const nextStep = this.mainSteps[currentIndex + 1];
        this.moveToMainStep(nextStep);
      }
    }
  }

  handleBack() {
    if (this.currentMainStep === "information") {
      const currentIndex = this.subSteps.indexOf(this.currentSubStep);
      if (currentIndex > 0) {
        const prevSection = this.subSteps[currentIndex - 1];
        this.navigateToSection(prevSection);
      }
    } else {
      // Go back to previous main step
      const currentIndex = this.mainSteps.indexOf(this.currentMainStep);
      if (currentIndex > 0) {
        const prevStep = this.mainSteps[currentIndex - 1];
        if (prevStep === "information") {
          // Go back to the last sub-step of Information
          this.currentMainStep = "information";
          this.navigateToSection("contact-details");
          this.updateUI();
        } else {
          this.moveToMainStep(prevStep);
        }
      }
    }
  }

  moveToMainStep(stepName) {
    this.currentMainStep = stepName;
    document.querySelectorAll(".ess-content-area").forEach((item) => {
      item.style.display = "none";
    });

    if (stepName === "experience") {
      document.querySelector("#experienceSection").style.display = "block";

    } else if (stepName === "information") {
      document.querySelector("#informationSection").style.display = "flex";
      document.querySelector("#informationSection .ess-content-area").style.display = "block";
      this.navigateToSection(this.currentSubStep);
      
    } else if (stepName === "education") {
      // Create a placeholder for education step
      // this.showPlaceholderStep(stepName, "Education", "fas fa-graduation-cap");
      document.querySelector("#educationSection").style.display = "block";
      
    } else if (stepName === "skills") {
      // Create a placeholder for skills step
      // this.showPlaceholderStep(stepName, "Skills", "fas fa-cogs");
      document.querySelector("#skillsSection").style.display = "block";
      
    } else if (stepName === "preferences") {
      // Create a placeholder for preferences step
      // this.showPlaceholderStep(stepName, "Preferences", "fas fa-sliders-h");
      document.querySelector("#preferencesSection").style.display = "block";
      
    } else if (stepName === "review") {
      // Create a placeholder for review step
      // this.showPlaceholderStep(stepName, "Review", "fas fa-eye");
      document.querySelector("#reviewSection").style.display = "block";
    }

    this.updateUI();
  }

  // NEW METHOD: Show placeholder for unimplemented steps
  showPlaceholderStep(stepName, stepTitle, iconClass) {
    const existingPlaceholder = document.querySelector("#placeholderSection");
    
    if (existingPlaceholder) {
      existingPlaceholder.remove();
    }

    const placeholderHTML = `
      <div class="ess-content-area" id="placeholderSection">
        <div class="text-center py-5">
          <div class="mb-4">
            <i class="${iconClass}" style="font-size: 4rem; color: #6366f1;"></i>
          </div>
          <h2 class="mb-3">${stepTitle} Section</h2>
          <p class="text-muted mb-4">This is where you would add your ${stepTitle.toLowerCase()} details.</p>
        </div>
      </div>
    `;

    const container = document.querySelector(".container.mb-5");
    container.insertAdjacentHTML('beforeend', placeholderHTML);
    
    document.querySelector("#placeholderSection").style.display = "block";

    // Bind events for placeholder buttons
    // setTimeout(() => {
    //   const backBtn = document.getElementById("placeholderBack");
    //   const nextBtn = document.getElementById("placeholderNext");
      
    //   if (backBtn) {
    //     backBtn.addEventListener("click", () => {
    //       const currentIndex = this.mainSteps.indexOf(this.currentMainStep);
    //       if (currentIndex > 0) {
    //         const prevStep = this.mainSteps[currentIndex - 1];
    //         this.navigateToMainStep(prevStep);
    //       }
    //     });
    //   }
      
    //   if (nextBtn) {
    //     nextBtn.addEventListener("click", () => {
    //       const currentIndex = this.mainSteps.indexOf(this.currentMainStep);
    //       if (currentIndex < this.mainSteps.length - 1) {
    //         const nextStep = this.mainSteps[currentIndex + 1];
    //         this.navigateToMainStep(nextStep);
    //       }
    //     });
    //   }
    // }, 100);
  }

  updateUI() {
    // Update main progress bar
    document.querySelectorAll(".ess-step-circle").forEach((circle) => {
      const step = circle.getAttribute("data-step");
      const stepIndex = this.mainSteps.indexOf(step);
      const currentIndex = this.mainSteps.indexOf(this.currentMainStep);

      circle.classList.remove("active", "completed");
      const stepLabel = circle.nextElementSibling;
      if (stepLabel) {
        stepLabel.classList.remove("active");
      }

      if (stepIndex < currentIndex) {
        circle.classList.add("completed");
      } else if (stepIndex === currentIndex) {
        circle.classList.add("active");
        if (stepLabel) {
          stepLabel.classList.add("active");
        }
      }
    });

    // Update connectors
    document
      .querySelectorAll(".ess-step-connector")
      .forEach((connector, index) => {
        const currentIndex = this.mainSteps.indexOf(this.currentMainStep);
        if (index < currentIndex) {
          connector.classList.add("completed");
        } else {
          connector.classList.remove("completed");
        }
      });

    // Update sidebar (only for Information step)
    if (this.currentMainStep === "information") {
      document.querySelectorAll(".ess-sidebar-item").forEach((item) => {
        const section = item.getAttribute("data-section");
        const icon = item.querySelector(".ess-sidebar-icon");

        if (this.completedSections.has(section)) {
          item.classList.add("completed");
          icon.innerHTML = '<i class="fas fa-check"></i>';
        } else if (section === this.currentSubStep) {
          item.classList.add("active");
        }
      });
    }

    this.updateActionButtons();
  }

  updateActionButtons() {
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!backBtn || !nextBtn) return;

    // Back button logic
    if (this.currentMainStep === "information") {
      const currentIndex = this.subSteps.indexOf(this.currentSubStep);
      backBtn.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    } else {
      backBtn.style.visibility = "visible";
    }

    // Next button text
    if (this.currentMainStep === "information") {
      const currentIndex = this.subSteps.indexOf(this.currentSubStep);
      if (currentIndex === this.subSteps.length - 1) {
        nextBtn.innerHTML =
          'Save & Continue<i class="fas fa-arrow-right ms-1"></i>';
      } else {
        nextBtn.innerHTML = 'Next Step<i class="fas fa-arrow-right ms-1"></i>';
      }
    } else {
      const currentIndex = this.mainSteps.indexOf(this.currentMainStep);
      if (currentIndex === this.mainSteps.length - 1) {
        nextBtn.innerHTML = 'Complete<i class="fas fa-check ms-1"></i>';
      } else {
        nextBtn.innerHTML = 'Continue<i class="fas fa-arrow-right ms-1"></i>';
      }
    }
  }

  showValidationError() {
    // Create a temporary alert
    const alert = document.createElement("div");
    alert.className =
      "alert alert-danger alert-dismissible fade show position-fixed";
    alert.style.cssText = "top: 20px; right: 20px; z-index: 9999;";
    alert.innerHTML = `
                    <strong>Validation Error!</strong> Please fill in all required fields.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;

    document.body.appendChild(alert);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 3000);
  }
}

// Initialize the form manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ESSFormManager();
});