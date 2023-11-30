const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

app.all("/createFile", (req, res) => {
  try {
    // Get current timestamp
    const timestamp = new Date().toISOString().replace(/:/g, "-");

    // Create file content with timestamp
    const fileContent = `Current Timestamp: ${timestamp}`;

    // Define the folder path
    const folderPath = path.join(
      "D:/Guvi - 08-04-2023/02.Main_bootcamp/Sessions Roadmap/01.Back-End_task/Day-35",
      "files"
    );

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Define the file path with current date-time.txt
    const filePath = path.join(folderPath, `${timestamp}.txt`);

    // Write content to the file
    fs.writeFileSync(filePath, fileContent);

    // Send success response
    res.status(201).json({ message: "File created successfully", filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
