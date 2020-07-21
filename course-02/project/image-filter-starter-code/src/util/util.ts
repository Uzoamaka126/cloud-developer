import { Jimp } from 'jimp/es';
import fs from 'fs';
const Jimp = require('jimp');
import path from 'path';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async (resolve, reject) => {
        const image_name:string = 'filtered.'+ Math.floor(Math.random() * 2000) +'.jpg';
        const image_path:string = path.join(__dirname, 'tmp', image_name);

        try {
            const photo:Jimp = await Jimp.read(inputURL);
            photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(image_path, (img) => {
                resolve(image_path);
            })
        } catch(e) {
            reject(e)
        }
    });
}
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}