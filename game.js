const colors = ["red", "yellow", "blue", "green", "orange", "purple", "lawngreen", "saddlebrown"];
    const totalColorSlots = 4;
    const totalPegs = 4;
    const totalRows = 8;
    var generatedCode = [];
    var enteredColorCode = [];
    var noOfAttempts = 0;
    const boardContainer = document.getElementById("boardContainer");
    const colorPallete = document.getElementById("colorPallete");
    var activeRow = 1;



    // Setup the board when game is loaded
    setupBoard();
    generateCode();
    setActiveRow(activeRow);


    // Function for board setup
    function setupBoard() {
        boardContainer.innerHTML = "";

        // Solution Heading
        const solutionHeading = document.createElement("p");
        solutionHeading.id = "solutionHeading";
        solutionHeading.innerHTML = "Solution";

        boardContainer.appendChild(solutionHeading);

        // Create solution row
        const row = document.createElement("div");
        row.className = "row";
        row.id = "rowSolution";

        // Create section for colored circles
        const colorLine = document.createElement("div");
        colorLine.className = "colorLine";
        colorLine.id = "colorLineSolution";

        row.appendChild(colorLine);

        // Create colored circles           
        for (let j = 1; j <= totalColorSlots; j++) {
            const colorCircle = document.createElement("div");
            colorCircle.className = "colorCircle";
            colorCircle.id = `colorCircleSolution${j}`;
            colorLine.appendChild(colorCircle);
        }

        boardContainer.appendChild(row);


        // Create remaining rows
        for (let i = totalRows; i >= 1; i--) {

            // Create row
            const row = document.createElement("div");
            row.className = "row";
            row.id = `row${i}`;

            // Create section for colored circles
            const colorLine = document.createElement("div");
            colorLine.className = "colorLine";
            colorLine.id = `colorLine${i}`;

            row.appendChild(colorLine);

            // Create colored circles           
            for (let j = 1; j <= totalColorSlots; j++) {
                const colorCircle = document.createElement("div");
                colorCircle.className = "colorCircle";
                colorCircle.id = `colorCircle${i}-${j}`;

                colorLine.appendChild(colorCircle);
            }

            // Create section for pegs
            const pegSection = document.createElement("div");
            pegSection.className = "pegSection";
            pegSection.id = `pegSection${i}`;

            row.appendChild(pegSection);

            // Create pegs
            for (let k = 1; k <= totalPegs; k++) {
                const peg = document.createElement("div");
                peg.className = "peg";
                peg.id = `peg${i}-${k}`;

                pegSection.appendChild(peg);
            }

            // Create check button
            const checkButton = document.createElement("button");
            checkButton.className = "checkButton";
            checkButton.id = `checkButton${i}`;
            checkButton.innerHTML = "Check";

            row.appendChild(checkButton);

            // Create color pallete
            createColorPallete();

            boardContainer.appendChild(row);
        }

    }

    // Function to create color pallete
    function createColorPallete() {
        colorPallete.innerHTML = "";

        for (let i = 0; i < colors.length; i++) {
            const colorPalleteCircle = document.createElement("div");
            colorPalleteCircle.className = "colorPalleteCircle";
            colorPalleteCircle.id = `pallete${colors[i]}Circle`;
            colorPalleteCircle.style.backgroundColor = colors[i];
            colorPalleteCircle.setAttribute("draggable", "true");
            colorPalleteCircle.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("color", colors[i]);
            });
            colorPalleteCircle.addEventListener("dragend", (e) => {
                setActiveRow(activeRow);
            });

            colorPallete.appendChild(colorPalleteCircle);
        }
    }

    // Set active row
    function setActiveRow(rowNum) {
        for (let a = 1; a <= totalRows; a++) {
            if (rowNum === a) {
                for (let i = 1; i <= totalColorSlots; i++) {

                    // Show check button
                    const checkButton = document.getElementById(`checkButton${rowNum}`);
                    checkButton.style.visibility = "visible";

                    const colorCircle = document.getElementById(`colorCircle${rowNum}-${i}`);
                    colorCircle.addEventListener("dragover", (e) => e.preventDefault());
                    colorCircle.addEventListener("drop", (e) => {
                        e.preventDefault();
                        const color = e.dataTransfer.getData("color");

                        // Check and add the slot if not already filled
                        const slot = enteredColorCode.find(slot => slot.index === i);
                        const slotColor = enteredColorCode.find(slotColor => slotColor.color === color);

                        if (!slotColor && !slot) {
                            colorCircle.style.backgroundColor = color;
                            enteredColorCode.push({ index: i, color: color });
                        }
                        else {
                            slot.color = color;
                            colorCircle.style.backgroundColor = color;
                        }
                    });
                }
            }
        }

        compareCode();

    }

    // Generate random code
    function generateCode() {
        while (generatedCode.length < 4) {
            let j = Math.floor(Math.random() * colors.length);
            if (!(generatedCode.includes(colors[j]))) {
                generatedCode.push(colors[j]);
            }
        }
        console.log(generatedCode);
    }

    // Compare code
    function compareCode() {
        // Check if all slots are filled
        if (enteredColorCode.length === totalColorSlots) {

            // Enable check button
            const checkButton = document.getElementById(`checkButton${activeRow}`);
            checkButton.style.opacity = 1;
            checkButton.addEventListener("click", (e) => {
                // Sort entered code by index
                var sortedEnteredColorCode = enteredColorCode.sort((a, b) => a.index - b.index);
                var selectedColors = [];

                for (let i = 0; i < totalColorSlots; i++) {
                    selectedColors.push(sortedEnteredColorCode[i].color);
                }

                // Check if selected color code matches the generated one
                if (JSON.stringify(selectedColors) === JSON.stringify(generatedCode)) {
                    // Show result and play again button
                    const resultSection = document.getElementById("resultSection");
                    const resultText = document.getElementById("resultText");
                    const playAgainBtn = document.getElementById("playAgainBtn");
                    resultText.innerHTML = "*** You Won! ***";
                    resultText.style.display = "block";
                    resultSection.style.display = "block";
                    playAgainBtn.style.display = "block";

                    // Hide color pallete
                    colorPallete.style.display = "none";

                    // Hide check button
                    const checkButton = document.getElementById(`checkButton${activeRow}`);
                    checkButton.style.visibility = "hidden";

                    // Fill pegs
                    for (let i = 0; i < totalColorSlots; i++) {
                        const peg = document.getElementById(`peg${activeRow}-${i + 1}`);
                        peg.style.backgroundColor = "black";
                        peg.style.visibility = "visible";
                    }

                    // Show pegs
                    const pegSection = document.getElementById(`pegSection${activeRow}`);
                    pegSection.style.visibility = "visible";
                }
                else {
                    // Change active row
                    if (activeRow < totalRows) {
                        const checkButton = document.getElementById(`checkButton${activeRow}`);
                        checkButton.style.visibility = "hidden";

                        // Fill pegs
                        for (let i = 0; i < totalColorSlots; i++) {
                            for (let j = 0; j < totalColorSlots; j++) {
                                if (selectedColors[i] === generatedCode[j]) {
                                    const peg = document.getElementById(`peg${activeRow}-${i + 1}`);

                                    // Check if the color is correct 
                                    if (peg.style.backgroundColor === "") {
                                        peg.style.backgroundColor = "white";
                                        peg.style.visibility = "visible";

                                        // Check if both index and color are correct
                                        if (selectedColors[i] === generatedCode[i]) {
                                            peg.style.backgroundColor = "black";
                                        }
                                    }
                                    break;
                                }
                            }
                        }

                        const pegSection = document.getElementById(`pegSection${activeRow}`);
                        pegSection.style.visibility = "visible";

                        activeRow++;
                        enteredColorCode = [];
                        setActiveRow(activeRow);
                    }
                    else {
                        for (let i = 0; i < totalColorSlots; i++) {
                            const checkButton = document.getElementById(`checkButton${activeRow}`);
                            checkButton.style.visibility = "hidden";
                            const solutionCircle = document.getElementById(`colorCircleSolution${i + 1}`);
                            solutionCircle.style.backgroundColor = generatedCode[i];
                        }

                        // Fill pegs
                        for (let i = 0; i < totalColorSlots; i++) {
                            for (let j = 0; j < totalColorSlots; j++) {
                                if (selectedColors[i] === generatedCode[j]) {
                                    const peg = document.getElementById(`peg${activeRow}-${i + 1}`);

                                    // Check if the color is correct 
                                    if (peg.style.backgroundColor === "") {
                                        peg.style.backgroundColor = "white";
                                        peg.style.visibility = "visible";

                                        // Check if both index and color are correct
                                        if (selectedColors[i] === generatedCode[i]) {
                                            peg.style.backgroundColor = "black";
                                        }
                                    }
                                    break;
                                }
                            }
                        }

                        const pegSection = document.getElementById(`pegSection${activeRow}`);
                        pegSection.style.visibility = "visible";

                        // Hide color pallete
                        colorPallete.style.display = "none";

                        // Show solution
                        const solutionRow = document.getElementById("rowSolution");
                        const solutionHeading = document.getElementById("solutionHeading");

                        solutionRow.style.display = "block";
                        solutionHeading.style.display = "block";

                        // Show result and play again button
                        const resultSection = document.getElementById("resultSection");
                        const resultText = document.getElementById("resultText");
                        const playAgainBtn = document.getElementById("playAgainBtn");
                        resultText.innerHTML = "*** You Lost! ***";
                        resultText.style.display = "block";
                        resultSection.style.display = "block";
                        playAgainBtn.style.display = "block";

                    }
                }

                console.log(sortedEnteredColorCode);
            });
        }
    }
