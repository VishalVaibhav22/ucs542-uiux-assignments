document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("active");
    }
  });

  if (document.getElementById('packages-tbody')) {
    const packages = [
      { id: 'paris', name: 'Parisian Dream', destination: 'Paris, France', duration: '5 Days / 4 Nights', basePrice: 175000, season: 'Peak' },
      { id: 'rome', name: 'Roman Holiday', destination: 'Rome, Italy', duration: '6 Days / 5 Nights', basePrice: 162000, season: 'Off' },
      { id: 'kyoto', name: 'Kyoto Cultural Escape', destination: 'Kyoto, Japan', duration: '7 Days / 6 Nights', basePrice: 233000, season: 'Peak' },
      { id: 'nyc', name: 'Big Apple Adventure', destination: 'New York City, USA', duration: '4 Days / 3 Nights', basePrice: 125000, season: 'Standard' },
      { id: 'phuket', name: 'Thai Beach Bliss', destination: 'Phuket, Thailand', duration: '8 Days / 7 Nights', basePrice: 191000, season: 'Off' },
      { id: 'canyon', name: 'Grand Canyon Explorer', destination: 'Arizona, USA', duration: '3 Days / 2 Nights', basePrice: 62000, season: 'Standard' }
    ];

    function calculateFinalPrice(package) {
      let finalPrice = package.basePrice;
      let seasonalMultiplier = 1.0;

      switch (package.season) {
        case 'Peak':
          seasonalMultiplier = 1.25;
          break;
        case 'Off':
          seasonalMultiplier = 0.85;
          break;
        default:
          seasonalMultiplier = 1.0;
          break;
      }

      finalPrice *= seasonalMultiplier;
      return Math.round(finalPrice);
    }

    function renderPackages() {
      const tableBody = document.getElementById('packages-tbody');
      tableBody.innerHTML = ''; 
      
      packages.forEach(pkg => {
          const finalPrice = calculateFinalPrice(pkg);

          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${pkg.name}</td>
              <td>${pkg.destination}</td>
              <td>${pkg.duration}</td>
              <td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(finalPrice)}</td>
          `;
          tableBody.appendChild(row);
      });
    }
    
    renderPackages();
  }

  if (document.getElementById('bookingForm')) {
    const form = document.getElementById('bookingForm');
    const packageSelect = document.getElementById('package');
    const guestsInput = document.getElementById('guests');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const promoCodeInput = document.getElementById('promo-code');
    const estimatedPriceSpan = document.getElementById('estimated-price');
    const submitButton = document.getElementById('submit-button');
    
    const packageBasePrices = {
        paris: 43750,
        rome: 32400,
        kyoto: 38833,
        nyc: 41667,
        phuket: 27285,
    };

    function updatePrice() {
        const packageId = packageSelect.value;
        const guests = parseInt(guestsInput.value);
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const promoCode = promoCodeInput.value.trim().toUpperCase();

        let allFieldsValid = packageId && guests > 0 && startDateInput.value && endDateInput.value && endDate > startDate;
        
        if (!allFieldsValid) {
            estimatedPriceSpan.textContent = '₹0';
            submitButton.disabled = true;
            return;
        }
        
        const timeDiff = endDate.getTime() - startDate.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (nights <= 0) {
            estimatedPriceSpan.textContent = '₹0';
            submitButton.disabled = true;
            return;
        }

        let total = packageBasePrices[packageId] * nights;

        if (guests > 2) {
            total += (guests - 2) * (total * 0.20);
        }

        switch (promoCode) {
            case 'EARLYBIRD':
                total *= 0.90;
                break;
            case 'HOLIDAY20':
                total *= 0.80;
                break;
        }
        
        estimatedPriceSpan.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(total);
        submitButton.disabled = false;
    }

    [packageSelect, guestsInput, startDateInput, endDateInput, promoCodeInput].forEach(element => {
        element.addEventListener('input', updatePrice);
        element.addEventListener('change', updatePrice);
    });
  }

  if (document.getElementById("gallery-modal")) {
    const modal = document.getElementById("gallery-modal");
    const modalImg = document.getElementById("modal-image");
    const captionText = document.getElementById("modal-caption");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const span = document.querySelector(".modal-close");

    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
          const img = this.querySelector('img');
          modal.style.display = "block";
          modalImg.src = img.dataset.large;
          captionText.innerHTML = img.dataset.caption;
      });
    });

    function closeModal() {
      modal.style.display = "none";
    }

    span.onclick = closeModal;
    
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

});