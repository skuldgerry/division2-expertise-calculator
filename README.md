# Division 2 Expertise Calculator

This is a simple web-based tool designed to help players of The Division 2 calculate the resources required to level up their weapons, gear, and skills in the game's Expertise system.

The calculator allows users to input multiple items, set initial and target levels, and provides a detailed breakdown of the materials required to achieve the specified level. Additionally, it displays cumulative resource requirements across all selected items, including common level milestones.
Features

    Add Multiple Items: Calculate resource requirements for weapons, gear, and skills all at once.
    Initial and Target Levels: Choose starting and goal levels for each item.
    Detailed Resource Breakdown: The calculator provides a detailed list of materials like steel, polycarbonate, ceramics, and more, required for each item.
    Common Levels: Display cumulative resources for specific common levels across all items.
    Icon Integration: Displays both text and icons for the resources, weapons, gear, and skills.
    Spoiler Section: Hide or show cumulative resource details with a toggle button.

## Getting Started
### Prerequisites

    Any modern web browser (Chrome, Firefox, Safari, Edge).
    No installations or third-party dependencies required.

## Installation

    Clone this repository or download it as a zip.

    bash

    git clone https://github.com/your-username/division2-expertise-calculator.git

    Open the index.html file in a browser.

## Hosting

### GitHub Pages

You can host this on GitHub Pages. Simply push the repository to GitHub and enable GitHub Pages for the main branch by following these steps:

1. Go to your repository on GitHub.
2. Click on **Settings**.
3. Scroll down to the **GitHub Pages** section.
4. Under **Source**, select the branch (main or master) where your `index.html` is located and save.

Once enabled, your calculator will be accessible via the provided GitHub Pages URL.

### Docker

If you'd like to run this Division 2 Expertise Calculator using Docker, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/skuldgerry/division2-expertise-calculator.git
    cd division2-expertise-calculator
    ```

2. **Build the Docker image**:
    Make sure Docker is installed and running on your machine. Then build the Docker image by running:
    ```bash
    docker build -t division2-expertise-calculator .
    ```

3. **Run the Docker container**:
    After the build is complete, you can run the Docker container:
    ```bash
    docker run -d -p 8080:80 division2-expertise-calculator
    ```

4. **Access the application**:
    Once the container is running, open your browser and navigate to:
    ```
    http://localhost:8080
    ```
    You should see the Division 2 Expertise Calculator running locally.

5. **Stopping the container**:
    To stop the running container, find its ID and stop it using:
    ```bash
    docker ps
    docker stop <container_id>
    ```

---


# Usage

1. Open the calculator in your browser.
2. Add items by selecting a category (Weapon, Gear, or Skill) and specifying the initial and target levels.
3. Click "Calculate Resources" to see the total materials required.
4. Use the spoiler button to view resource totals at common level milestones.

## Demo

You can check out a live version of the tool hosted on GitHub Pages:

[Division 2 Expertise Calculator](https://skuldgerry.github.io/division2-expertise-calculator/)

## Built With AI

This tool was developed with the assistance of OpenAI's GPT-4 model. From brainstorming ideas to solving specific challenges in the code, AI played a significant role in the creation of this calculator.

## License

This project is licensed under the MIT License, meaning you can use, modify, and distribute the project freely as long as proper credit is given.
