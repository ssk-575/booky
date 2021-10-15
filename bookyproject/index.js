require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

var bodyParser = require("body-parser");

const database = require("./database/Database");

const BookModel = require("./database/book");

const AuthorModel = require("./database/author");

const PublicationModel = require("./database/publication");
const { db } = require("./database/book");

const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection Established"));

////


//////
// for getting all the books

booky.get("/",async (req,res) =>
{
    const getAllBooks = await BookModel.find();

    return res.json(getAllBooks);
});

// for finding the specific book with isbn number
booky.get("/is/:isbn",async(req,res) =>
{

    const getSpecificBooks = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBooks)
    {
        return res.json({error: `No data found for the ISBN of ${req.params.isbn}`});
    }

    return res.json(getSpecificBooks);
});


// for finding the specific book with catogory.

booky.get("/c/:category", async(req,res) =>
{
    const getSpecificBooks = await BookModel.findOne({category: req.params.category});

    if(!getSpecificBooks)
    {
        return res.json({error: `No data found with ${req.params.category} category`});
    }

    return res.json(getSpecificBooks);
});


// for finding the book with specific Language

booky.get("/lang/:language",async(req,res) =>
{
    const getByLanguage = await BookModel.findOne({language: req.params.language});

    if(!getByLanguage)
    {
        return res.json({Error : `No Books are Present with the Language called : ${req.params.language}`})
    }

    return res.json(getByLanguage);
});

// End of finding with Books

//Start of finding the book with Author Name

// get all authors list
booky.get("/au",async(req,res) =>
{
    const getAllAuthors = await AuthorModel.find();

    return res.json(getAllAuthors);
});

// get a specific author with id
booky.get("/au/:ids",async(req,res) =>
{
    const withauthor = await AuthorModel.findOne({id: req.params.ids});

    if(!withauthor)
    {
        return res.json({Error: `No Author was found with id: ${req.params.ids}`});
    }

    return res.json(withauthor);
});

// get a specific author with isbn
// To get a list of authors based on books
booky.get("/au/books/:isbn",async(req,res) =>
{
    const getWithISBN = await AuthorModel.findOne({books: req.params.isbn});

    if(!getWithISBN)
    {
        return res.json({Error :`No Authors were found with: ${req.params.isbn}`});
    }

    return res.json({getWithISBN});
});

// End of getting using the author name

// Using Publications

// get all Publications

booky.get("/publication",async (req,res) =>
{
    const getAllPublications = await PublicationModel.find();

    return res.json(getAllPublications);
});

//To get a specific PUBLICATIONS
booky.get("/publication/id/:id",async(req,res) =>
{
    const pubid = await PublicationModel.findOne({id: req.params.id});

    if(!pubid)
    {
        return res.json({Error : `No Publication was found with the id: ${req.params.id}`});
    }

    return res.json(pubid);
});


//To get a list of publications based on a book

booky.get("/publication/book/:isbn",async(req,res) =>
{
    const pubisbn = await PublicationModel.findOne({books: req.params.isbn});

    if(!pubisbn)
    {
        return res.json({Error: `No Publication was found with the Isbn: ${req.params.isbn}`});
    }
    return res.json(pubisbn);
});

// End of getting using the Publications

// End of the "GET" Method

// POST Method

// Add New Book

booky.post("/add/book", async(req,res) =>
{
    const {newBook} = req.body;

    const addNewBook = BookModel.create(newBook);

    return res.json({
        books: addNewBook,
        message: "Book was Added!!!"
    });
});

// End of adding New Book

// Add New Publication

booky.post("/add/publication", async(req,res) =>
{
    const {addPublication} = req.body;

    const addNewPublication = PublicationModel.create(addPublication);
   
    return res.json({
        publication: addNewPublication,
        message: "New Publication Added"
    });
});

// End of adding Publication

// Add New Author

booky.post("/add/author", async(req,res) =>
{
    const {addauthor} = req.body;

    const addNewAuthor = AuthorModel.create(addauthor);

    return res.json (
        {
            author: addauthor,
            message: "Author added"
        }
    );


    // database.author.push(addauthor);

    // return res.json({UpdatedAuthersList : database.author});
});

// End of adding new Author

// End of POST


// PUT

// Using Put to update a Book

booky.put("/update/book/:isbn", async(req,res) =>
{
    const updateBookwithISBN = await BookModel.findOneAndUpdate
    (
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.newname
        },
        {
            new: true
        }
    );
    return res.json(
    {
        books: updateBookwithISBN
    });
});

// Update the Book database and Author's database

booky.put("/update/books&author/:isbn", async(req,res) =>
{
    // update the Books database
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet:
            {
                author: req.body.newname
            }
        },
        {
            new: true
        }
    );

    //update the Author's Database
    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newname
        },
        {
            $addToSet:
            {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json({
        books: updateBook,
        author: updateAuthor,
        message: "New author added and updated to books"
    });
});


// replace Name of the Author

booky.put("/change/author/:name", async(req,res) =>
{
    const changeName = await AuthorModel.findOneAndUpdate(
        {
            name: req.params.name
        },
        {
            name: req.body.newname
        },
        {
            new: true
        }
    );

    return res.json(
    {
        name: changeName,
        message:"Name changed"
    });
});

// Delete a Book

booky.delete("/delete/book/:isbn", async(req,res) =>
{
    const deleteBook = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books: deleteBook,
        message: `Book has been deleted with the ISBN ${req.params.isbn}`
    });
}); 


// Delete an Author
booky.delete("/delete/author/:id",async(req,res) =>
{
    const deleteAuthor = await AuthorModel.findOneAndDelete(
        {
            id: req.params.id
        }
    );

    return res.json({author: deleteAuthor,message:"Author Deleted"});
});


// Delete a Publication
booky.delete("/delete/publication/:id",async(req,res) =>
{
    const deletePublication = await PublicationModel.findOneAndDelete(
        {
            id: req.params.id
        }
    );

    return res.json({author: deletePublication,message:"Publication Deleted"});
});

//Delete whole DataBase
booky.delete("/delete/everything",async(req,res) =>
{
    const deleteAuthor = await AuthorModel.remove({});
    const deleteBooks = await BookModel.remove({});
    const deletePublication = await PublicationModel.remove({});
    return res.json({message:"Database Deleted"});
});


booky.listen(3000, () =>
{
    console.log("Server is on at port 3000 and up running");
});