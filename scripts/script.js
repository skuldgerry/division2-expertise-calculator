// script.js

// Expertise data for weapons, gear, and skills
const expertiseData = {
    weapon: [
        { level: 1, steel: 122, titanium: 76, receiver_components: 130, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 2, steel: 138, titanium: 88, receiver_components: 150, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 3, steel: 154, titanium: 100, receiver_components: 170, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 4, steel: 170, titanium: 112, receiver_components: 190, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 5, steel: 186, titanium: 124, receiver_components: 210, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 6, steel: 0, titanium: 136, receiver_components: 230, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 7, steel: 0, titanium: 148, receiver_components: 250, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 8, steel: 0, titanium: 160, receiver_components: 270, shd_calibration: 0, field_recon_data: 1, exotic_components: 0 },
        { level: 9, steel: 0, titanium: 172, receiver_components: 290, shd_calibration: 0, field_recon_data: 2, exotic_components: 0 },
        { level: 10, steel: 0, titanium: 184, receiver_components: 310, shd_calibration: 0, field_recon_data: 3, exotic_components: 0 },
        { level: 11, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 0, field_recon_data: 3, exotic_components: 0 },
        { level: 12, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 0, field_recon_data: 4, exotic_components: 0 },
        { level: 13, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 1, field_recon_data: 5, exotic_components: 1 },
        { level: 14, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 1, field_recon_data: 5, exotic_components: 1 },
        { level: 15, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 2, field_recon_data: 6, exotic_components: 2 },
        { level: 16, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 2, field_recon_data: 7, exotic_components: 2 },
        { level: 17, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 3, field_recon_data: 7, exotic_components: 3 },
        { level: 18, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 3, field_recon_data: 8, exotic_components: 3 },
        { level: 19, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 4, field_recon_data: 9, exotic_components: 4 },
        { level: 20, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 4, field_recon_data: 10, exotic_components: 4 },
        { level: 21, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 5, field_recon_data: 10, exotic_components: 5 },
        { level: 22, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 5, field_recon_data: 11, exotic_components: 5 },
        { level: 23, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 6, field_recon_data: 12, exotic_components: 6 },
        { level: 24, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 6, field_recon_data: 12, exotic_components: 6 },
        { level: 25, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 7, field_recon_data: 13, exotic_components: 7 },
        { level: 26, ceramic: 0, titanium: 0, receiver_components: 0, shd_calibration: 7, field_recon_data: 14, exotic_components: 7 }
    ],
    gear: [
        { level: 1, polycarbonate: 61, carbon_fiber: 40, protective_fabric: 65, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 2, polycarbonate: 69, carbon_fiber: 46, protective_fabric: 75, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 3, polycarbonate: 77, carbon_fiber: 52, protective_fabric: 85, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 4, polycarbonate: 85, carbon_fiber: 58, protective_fabric: 95, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 5, polycarbonate: 93, carbon_fiber: 64, protective_fabric: 105, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 6, polycarbonate: 0, carbon_fiber: 70, protective_fabric: 115, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 7, polycarbonate: 0, carbon_fiber: 76, protective_fabric: 125, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 8, polycarbonate: 0, carbon_fiber: 82, protective_fabric: 135, shd_calibration: 1, field_recon_data: 1, exotic_components: 1 },
        { level: 9, polycarbonate: 0, carbon_fiber: 88, protective_fabric: 145, shd_calibration: 2, field_recon_data: 2, exotic_components: 2 },
        { level: 10, polycarbonate: 0, carbon_fiber: 94, protective_fabric: 155, shd_calibration: 3, field_recon_data: 3, exotic_components: 3 },
        { level: 11, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 0, field_recon_data: 3, exotic_components: 0 },
        { level: 12, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 0, field_recon_data: 4, exotic_components: 0 },
        { level: 13, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 1, field_recon_data: 5, exotic_components: 1 },
        { level: 14, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 1, field_recon_data: 5, exotic_components: 1 },
        { level: 15, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 2, field_recon_data: 6, exotic_components: 2 },
        { level: 16, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 2, field_recon_data: 7, exotic_components: 2 },
        { level: 17, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 3, field_recon_data: 7, exotic_components: 3 },
        { level: 18, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 3, field_recon_data: 8, exotic_components: 3 },
        { level: 19, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 4, field_recon_data: 9, exotic_components: 4 },
        { level: 20, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 4, field_recon_data: 10, exotic_components: 4 },
        { level: 21, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 5, field_recon_data: 10, exotic_components: 5 },
        { level: 22, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 5, field_recon_data: 11, exotic_components: 5 },
        { level: 23, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 6, field_recon_data: 12, exotic_components: 6 },
        { level: 24, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 6, field_recon_data: 12, exotic_components: 6 },
        { level: 25, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 7, field_recon_data: 13, exotic_components: 7 },
        { level: 26, polycarbonate: 0, carbon_fiber: 0, protective_fabric: 0, shd_calibration: 7, field_recon_data: 14, exotic_components: 7 }
    ],
    skill: [
        { level: 1, ceramic: 122, electronics: 76, printer_filament: 130, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 2, ceramic: 138, electronics: 88, printer_filament: 150, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 3, ceramic: 154, electronics: 100, printer_filament: 170, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 4, ceramic: 170, electronics: 112, printer_filament: 190, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 5, ceramic: 186, electronics: 124, printer_filament: 210, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 6, ceramic: 0, electronics: 136, printer_filament: 230, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 7, ceramic: 0, electronics: 148, printer_filament: 250, shd_calibration: 0, field_recon_data: 0, exotic_components: 0 },
        { level: 8, ceramic: 0, electronics: 160, printer_filament: 270, shd_calibration: 1, field_recon_data: 1, exotic_components: 1 },
        { level: 9, ceramic: 0, electronics: 172, printer_filament: 290, shd_calibration: 2, field_recon_data: 2, exotic_components: 2 },
        { level: 10, ceramic: 0, electronics: 184, printer_filament: 310, shd_calibration: 3, field_recon_data: 3, exotic_components: 3 },
        { level: 11, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 0, field_recon_data: 3, exotic_components: 0 },
        { level: 12, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 0, field_recon_data: 4, exotic_components: 0 },
        { level: 13, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 1, field_recon_data: 5, exotic_components: 1 },
        { level: 14, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 1, field_recon_data: 5, exotic_components: 1 },
        { level: 15, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 2, field_recon_data: 6, exotic_components: 2 },
        { level: 16, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 2, field_recon_data: 7, exotic_components: 2 },
        { level: 17, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 3, field_recon_data: 7, exotic_components: 3 },
        { level: 18, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 3, field_recon_data: 8, exotic_components: 3 },
        { level: 19, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 4, field_recon_data: 9, exotic_components: 4 },
        { level: 20, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 4, field_recon_data: 10, exotic_components: 4 },
        { level: 21, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 5, field_recon_data: 10, exotic_components: 5 },
        { level: 22, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 5, field_recon_data: 11, exotic_components: 5 },
        { level: 23, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 6, field_recon_data: 12, exotic_components: 6 },
        { level: 24, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 6, field_recon_data: 12, exotic_components: 6 },
        { level: 25, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 7, field_recon_data: 13, exotic_components: 7 },
        { level: 26, ceramic: 0, electronics: 0, printer_filament: 0, shd_calibration: 7, field_recon_data: 14, exotic_components: 7 }
    ]
};

// Maximum number of items allowed
const maxItems = 10;

// Common levels to display in the spoiler
const commonLevels = [12, 15, 20, 25];

// Add event listener for resetting the calculator
document.getElementById('reset-calculator').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    clearInputs(); // Clear the input fields
    location.reload(); // Refresh the page
});

// Function to clear input fields
function clearInputs() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], select');
    inputs.forEach(input => {
        if (input.type === "text") {
            input.value = "";
        } else if (input.type === "number") {
            if (input.classList.contains('target-level')) {
                input.value = 26; // Reset Target Level to 26
            } else {
                input.value = input.min; // Reset other numbers to their min value
            }
        } else if (input.tagName === "SELECT") {
            input.selectedIndex = 0;
        }
    });
}

// Add event listeners for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('item-list').children.length === 0) {
        addItemWithStyles();  // Add one item by default on load without the remove button
    }
    document.getElementById('add-item').addEventListener('click', addItemWithStyles);
    document.getElementById('calculate').addEventListener('click', calculateResources);
});

// Function to add a new item form with proper styles
function addItemWithStyles() {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';

    const itemCount = document.querySelectorAll('.item').length;

    itemDiv.innerHTML = `
        <div class="field-group">
            <label>Category</label>
            <select class="category">
                <option value="weapon">Weapon</option>
                <option value="gear">Gear</option>
                <option value="skill">Skill</option>
            </select>
        </div>
        <div class="field-group">
            <label>Item Name</label>
            <input type="text" class="item-name" placeholder="Enter item name (optional)">
        </div>
        <div class="field-group">
            <label>Initial Level</label>
            <input type="number" class="initial-level" min="0" max="26" value="0">
        </div>
        <div class="field-group">
            <label>Target Level</label>
            <input type="number" class="target-level" min="1" max="26" value="26">
        </div>
        ${itemCount > 0 ? `
        <div class="input-group remove-button-group">
            <button class="remove-item" onclick="removeItem(this)">
                <img src="data/remove-icon.png" alt="Remove" class="remove-icon">
            </button>
        </div>` : `<div class="input-group remove-button-group">
            <button class="remove-item first-row-remove-button" style="background-color: #444; cursor: default;" disabled>
                <img src="data/remove-icon.png" alt="Remove" class="remove-icon">
            </button>
        </div>`}
    `;

    applyStylesToInputs(itemDiv);
    document.getElementById('item-list').appendChild(itemDiv);

    if (itemCount >= maxItems - 1) {
        document.getElementById('add-item').disabled = true; // Disable the "Add another item" button if max items reached
    }
}

// Ensure styles are consistent across all inputs
function applyStylesToInputs(itemDiv) {
    const inputs = itemDiv.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.style.backgroundColor = "#444";
        input.style.color = "#f0f0f0";
        input.style.border = "1px solid #555";
        input.style.borderRadius = "4px";
        input.style.padding = "10px"; // Adjusted padding to maintain size
        input.style.fontSize = "14px"; // Smaller font size
        input.style.width = "100%";
        input.style.boxSizing = "border-box";
        input.style.textAlign = "center"; // Ensure text is centered
    });

    const inputGroups = itemDiv.querySelectorAll('.field-group');
    inputGroups.forEach(group => {
        group.style.marginBottom = "10px";
        group.style.flex = "1";
    });

    const labels = itemDiv.querySelectorAll('.field-group label');
    labels.forEach(label => {
        label.style.display = "block";
        label.style.marginBottom = "5px";
        label.style.fontSize = "14px";
        label.style.color = "#f0f0f0";
        label.style.textAlign = "center";
    });
}

// Existing event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-item').addEventListener('click', addItemWithStyles);
    document.getElementById('calculate').addEventListener('click', calculateResources);
    if (document.getElementById('item-list').children.length === 0) {
        addItemWithStyles();  // Add one item by default on load
    }
});

// Function to remove an item form
function removeItem(button) {
    const itemList = document.getElementById('item-list');
    button.closest('.item').remove();

    // Re-enable the add button if it was disabled
    if (itemList.children.length < maxItems) {
        document.getElementById('add-item').disabled = false;
    }
}

// Function to calculate and display resources
function calculateResources() {
    const items = document.querySelectorAll('.item');
    let overallTotal = {};
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results

    const originalScrollY = window.scrollY;

    // Iterate through each item to calculate the resources
    items.forEach(item => {
        const itemName = item.querySelector('.item-name') ? item.querySelector('.item-name').value : 'Unnamed Item';
        const category = item.querySelector('.category').value;
        const initialLevel = parseInt(item.querySelector('.initial-level').value);
        const targetLevel = parseInt(item.querySelector('.target-level').value);

        const resources = getCumulativeResources(initialLevel + 1, targetLevel, category);

        // Accumulate the total resources
        for (const key in resources) {
            if (!overallTotal[key]) overallTotal[key] = 0;
            overallTotal[key] += resources[key];
        }

        // Create a div to display the individual item results
        const resultItemDiv = document.createElement('div');
        displayResults(resultItemDiv, resources, `Resources for ${itemName} (${category}) from Level ${initialLevel} to ${targetLevel}`);
        resultsDiv.appendChild(resultItemDiv);
    });

    // Display the total resources for all items
    const overallTotalDiv = document.createElement('div');
    displayResults(overallTotalDiv, overallTotal, 'Total Resources for All Items', true);
    resultsDiv.prepend(overallTotalDiv);

    // Calculate and display common levels
    calculateCommonLevels(items);

    // Reset the scroll position
    window.scrollTo(0, originalScrollY);
}

// Function to get cumulative resources for a given category
function getCumulativeResources(start, end, category) {
    const data = expertiseData[category];
    const totals = {};

    for (let i = start - 1; i < end; i++) {
        if (i < data.length) {
            for (const [resource, amount] of Object.entries(data[i])) {
                if (resource !== 'level') {
                    if (!totals[resource]) totals[resource] = 0;
                    totals[resource] += amount;
                }
            }
        }
    }
    return totals;
}

// Function to display results with icons for categories and resources
function displayResults(element, resources, headerText, isTotal = false) {
    const header = document.createElement('h3');
    
    if (isTotal) {
        header.className = 'total-resources-title';
        header.textContent = headerText;
    } else {
        header.className = 'item-title';

        // Replace category text with icons in the header and remove parentheses
        if (headerText.includes('(weapon)')) {
            headerText = headerText.replace('(weapon)', `<img src="data/weapon-icon.png" alt="Weapon" class="resource-icon">`);
        } else if (headerText.includes('(gear)')) {
            headerText = headerText.replace('(gear)', `<img src="data/gear-icon.png" alt="Gear" class="resource-icon">`);
        } else if (headerText.includes('(skill)')) {
            headerText = headerText.replace('(skill)', `<img src="data/skill-icon.png" alt="Skill" class="resource-icon">`);
        }

        // Extract and style the item name separately
        const itemNameMatch = headerText.match(/Resources for (.*?) from/);
        if (itemNameMatch && itemNameMatch[1].trim()) {
            const itemName = itemNameMatch[1];
            const highlightedName = `<span class="highlight">${itemName}</span>`;
            headerText = headerText.replace(itemName, highlightedName);
        }

        header.innerHTML = headerText;
    }

    element.appendChild(header);

    const list = document.createElement('ul');
    for (const [resource, amount] of Object.entries(resources)) {
        if (amount > 0) {  // Only display non-zero resources
            // Convert resource name: replace underscores with spaces and capitalize words
            const formattedResourceName = resource.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            const item = document.createElement('li');
            // Display both icon and formatted text for the resource
            item.innerHTML = `<img src="data/${resource}-icon.png" alt="${resource}" class="resource-icon"> ${formattedResourceName}: ${amount}`;
            list.appendChild(item);
        }
    }
    element.appendChild(list);

    if (isTotal) {
        element.classList.add('total-resources');
    } else {
        element.classList.add('item-resources');
    }
}

// Function to calculate resources for common levels and display in a spoiler
function calculateCommonLevels(items) {
    const spoilerContainer = document.getElementById('spoiler-container');
    const existingButton = document.getElementById('common-levels-toggle');
    const existingContent = document.getElementById('common-levels');

    // Remove existing button if it exists
    if (existingButton) {
        existingButton.remove();
    }

    // Clear existing content if it exists
    if (existingContent) {
        existingContent.remove();
    }

    const spoiler = document.createElement('button');
    spoiler.id = 'common-levels-toggle';
    spoiler.className = 'common-levels-toggle';

    const plusIcon = document.createElement('img');
    plusIcon.src = 'data/plus-icon.png';  // Ensure the path to your icon is correct
    plusIcon.alt = 'Show Common Levels';
    spoiler.appendChild(plusIcon);

    spoiler.onclick = (event) => {
        event.preventDefault(); // Prevent any default behavior

        const content = document.getElementById('common-levels');
        const originalScrollY = window.scrollY; // Save current scroll position

        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'grid';
            plusIcon.src = 'data/minus-icon.png';
            plusIcon.alt = 'Hide Common Levels';

            // Scroll to the content smoothly
            setTimeout(() => {
                content.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 0);
        } else {
            content.style.display = 'none';
            plusIcon.src = 'data/plus-icon.png';
            plusIcon.alt = 'Show Common Levels';
        }

        // Restore the original scroll position if needed
        setTimeout(() => {
            window.scrollTo(0, originalScrollY);
        }, 0);

        // Remove focus from the button to prevent automatic scrolling
        spoiler.blur();
    };

    const content = document.createElement('div');
    content.id = 'common-levels';
    content.style.display = 'none'; // Keep it hidden until toggled

    let hasContent = false; // Track if there are common levels to show

    items.forEach(item => {
        const itemName = item.querySelector('.item-name') ? item.querySelector('.item-name').value : '';
        const category = item.querySelector('.category').value;

        commonLevels.forEach(level => {
            const resources = getCumulativeResources(level, level, category);
            if (Object.keys(resources).length > 0) { // Only add if there are resources
                hasContent = true; // Set flag to true if we have content
                const commonLevelDiv = document.createElement('div');
                commonLevelDiv.className = 'common-level-item';

                // Modify the header to highlight item name if it exists
                let headerText = `Common Level ${level} for `;
                if (itemName) {
                    headerText += `<span class="highlight">${itemName}</span>`;
                } else {
                    headerText += `Unnamed Item`;
                }
                headerText += ` (${category})`;

                displayResults(commonLevelDiv, resources, headerText);
                content.appendChild(commonLevelDiv);
            }
        });
    });

    if (hasContent) {
        // Append the content first, then the button
        spoilerContainer.appendChild(content);
        spoilerContainer.parentNode.insertBefore(spoiler, spoilerContainer); // Insert button before the spoiler container

        spoiler.style.display = 'block';
        spoiler.style.margin = '20px auto';
    } else {
        spoiler.style.display = 'none'; // Hide the button if no content
    }
}