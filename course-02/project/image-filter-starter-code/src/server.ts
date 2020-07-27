import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import validator from 'validator';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD:
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get('/filteredimage', async (req: Request, res: Response, next) => {
    const image_url: string = req.query.image_url
    if (!image_url) {
      return res.status(400).send({ "message": "No URL was provided" })
    }
    // validate image query
    if (!validator.isURL(image_url, { allow_underscores: true })) {
      return res.status(400).send({ "message": "URL is not valid" })
    }
    const authorizedExtensions = ['jpg', 'jpeg', 'svg', 'png', 'bmp', 'gif'];

    if (!authorizedExtensions.includes(image_url.split('.')[image_url.split('.').length - 1])) {
      return res.status(400).send({ "message": "Wrong image extension" })
    };

    // Extract image from the URL, filter the image and save it locally
    let image_info: string;

    try {
      image_info = await filterImageFromURL(image_url);
    } catch (error) {
      return res.status(500).send({ message: `Failed to process image: ${error.message}` });
    }

    // return the filtered image to user
    return res.sendFile(image_info, (err) => {
      deleteLocalFiles([image_info]);
    });
  });
  
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();