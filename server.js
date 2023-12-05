const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Define the endpoint to create a text file
app.get("/createFile", (req, res) => {
  // Get the current timestamp
  const timestamp = new Date().toISOString();

  // Define the folder path where the file will be created
  const folderPath = path.join(
    "D:/Guvi - 08-04-2023/02.Main_bootcamp/Sessions Roadmap/01.Back-End_task/Back-End_task",
    "files"
  );

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Define the filename using the current date-time
  const filename = `${timestamp.replace(/:/g, "-")}.txt`;

  // Define the full path of the file
  const filePath = path.join(folderPath, filename);

  // Write the current timestamp to the file
  fs.writeFile(filePath, timestamp, (err) => {
    if (err) {
      console.error("Error creating file:", err);
      return res.status(500).send("Internal Server Error");
    }

    console.log("File created successfully:", filePath);

    // Respond with an HTML page containing information about the created file
    const responseHtml = `
      <html>
        <head>
          <title>File Created</title>
        </head>
        <body>
          <h1>File Created Successfully</h1>
          <p>File Path: ${filePath}</p>
          <p>Filename: ${filename}</p>
          <p>Timestamp: ${timestamp}</p>
        </body>
      </html>
    `;

    res.status(200).send(responseHtml);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
