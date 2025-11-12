const path = require("path");

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

async function logicWiring() {
  try {
    const unzippedDir = await IOhandler.unzip(zipFilePath, pathUnzipped);

    const pngFiles = await IOhandler.readDir(unzippedDir);

    const processedFiles = await IOhandler.grayScale(pngFiles, pathProcessed);
    console.log("All files processed");
    return processedFiles

  } catch (err) {
    console.error( err);
  }
}
logicWiring()
