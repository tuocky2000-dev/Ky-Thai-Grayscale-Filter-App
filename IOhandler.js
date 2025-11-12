const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const yauzl = require('yauzl-promise')
const {pipeline} = require('stream/promises')
/*
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {
  const zip= await yauzl.open(pathIn)
  fs.stat(pathOut,(err,stats)=>{
    if(err){
      fs.mkdir(pathOut,(err)=>{
      if (err){
        console.log(err)
      }})
    }else if(stats.isDirectory()){
      console.log("Folder already exists!")
    }
  })
  for await(const entry of zip){
    try{
      if(entry.filename.startsWith("_",0) || entry.filename.startsWith(".",0) || entry.filename.startsWith("-",0)){
        continue
    }
    const readStream= await zip.openReadStream(entry)
    const outPutPath= path.join(pathOut, entry.filename)
    const writeStream= fs.createWriteStream(outPutPath)
    await pipeline(readStream, writeStream)
  } catch (err){
    console.log(`Failed to unzip ${entry.filename}:`)
    }
    
}console.log("Extraction operation complete")
return pathOut
};
/*
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = async (dir) => {
  try{let filesArray=[]
  const files = await fs.promises.readdir(dir);
    for(const file of files){
      if(path.extname(file)!=".png"){
        continue
      }else{
        const filePath= path.join(dir, file).toString()
        filesArray.push(filePath)
      }
      }
   
  console.log(filesArray)
  return filesArray}
  catch (err){
    if(err){
      console.log(err)
    }
  }
}

/*
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = async (pathIn, pathOut) => {
  try{
    fs.stat(pathOut,(err,stats)=>{
    if(err){
      fs.mkdir(pathOut,(err)=>{
      if (err){
        console.log(err)
      }})
    }else if(stats.isDirectory()){
      console.log("Folder already exists!")
    }
  })
    let modifiedPNGs=[]
    for(let file of pathIn){
      
      const readStream= fs.createReadStream(file).pipe(
    new PNG({
      filterType: 4,
    })
  ).on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
      
        let Red = this.data[idx]
        let Green= this.data[idx + 1] 
        let Blue= this.data[idx + 2] 

        Gray = (Red + Green + Blue) / 3

        this.data[idx]=Gray
        this.data[idx + 1]=Gray
        this.data[idx + 2]=Gray

        
      }
    }

    const outFile = path.join(pathOut, path.basename(file));
    this.pack().pipe(fs.createWriteStream(outFile));
;
  })
    modifiedPNGs.push(readStream)
    }
    return modifiedPNGs
  }catch (err){
    if(err){
      console.log(err)
    }
  }
};
module.exports = {
  unzip,
  readDir,
  grayScale,
};
