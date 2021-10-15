require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

var bodyParser = require("body-parser");

const database = require("./database/Database");

const BookModel = require("./database/book");

const AuthorModel = require("./database/author");

const PublicationModel = require("./database/publication");

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

    // const specificBook = database.books.filter((book) =>
    //     book.ISBN === req.params.isbn
    // );

    // if(specificBook.length === 0)
    // {
    //     return res.json({error: `No data found for the ISBN of ${req.params.isbn}`})
    // }

    if(!getSpecificBooks)
    {
        return res.json({error: `No data found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBooks});
});


// for finding the specific book with catogory.

booky.get("/c/:category", async(req,res) =>
{
    // const specificBook = database.books.filter((book) =>
    // book.category.includes(req.params.category));

    // if(specificBook.length === 0)
    // {
    //     return res.json({error: `No data found with ${req.params.category} category`});
    // }

    // return res.json({book: specificBook });



    const getSpecificBooks = await BookModel.findOne({category: req.params.category});

    if(!getSpecificBooks)
    {
        return res.json({error: `No data found with ${req.params.category} category`});
    }

    return res.json(getSpecificBooks);
});


// for finding the book with specific Language

booky.get("/lang/:language",(req,res) =>
{
    const specificBook = database.books.filter((book) =>
    book.language.includes(req.params.language));

    if(specificBook.length === 0)
    {
        return res.json({error: `No Book foun with language: ${req.params.language}`});
    }

    return res.json({book: specificBook});
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
booky.get("/au/:ids",(req,res) =>
{
    const withauthor = database.author.filter((author) =>
    author.id ===  parseInt(req.params.ids));

    if(withauthor.length === 0)
    {
        return res.json({error: `No Author found with id: ${req.params.ids}`});
    }

    return res.json({authors: withauthor});
});

// get a specific author with isbn
// To get a list of authors based on books
booky.get("/au/books/:isbn",(req,res) =>
{
    const withauthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn));

    if(withauthor.length === 0)
    {
        return res.json({error: `No Author's data found with ISBN of ${req.params.isbn}`});
    }

    return res.json({authors: withauthor});
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
booky.get("/publication/id/:id",(req,res) =>
{
    const pubid = database.publication.filter((publication) =>
    publication.id === parseInt(req.params.id));

    if(pubid.length === 0)
    {
        return res.json({error: `No Publications Were found with the id ${req.params.id}`});

    }

    return res.json({Publications : pubid});
});


//To get a list of publications based on a book

booky.get("/publication/book/:isbn",(req,res) =>
{
    const pubisbn = database.publication.filter((publication) =>
        publication.books.includes(req.params.isbn)
    );

    if(pubisbn.length === 0)
    {
        return res.json({error: `No Publication was found using the isbn number: ${req.params.isbn}`});
    }

    return res.json({Publications : pubisbn});
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

    // const {newBook} = req.body;

    // database.books.push(newBook);

    // return res.json({updatedBooks: database.books});
});

// End of adding New Book

// Add New Publication

booky.post("/add/publication", (req,res) =>
{
    const addPublication = req.body;

    database.publication.push(addPublication);
   
    return res.json({UpdatedPublicationList : database.publication});
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


    database.author.push(addauthor);

    return res.json({UpdatedAuthersList : database.author});


    // const addauthor = req.body;

    // database.author.push(addauthor);

    // return res.json({UpdatedAuthersList : database.author});
});

// End of adding new Author




// // Copy code for update and delete


// booky.put("/book/update/:isbn", async(req,res) =>
// {
//     const updateBook = await BookModel.findByIdAndUpdate(
//     {
//         ISBN: req.params.isbn
//     },
//     {
//         title: req.body.bookTitle
//     },
//     {
//         new: true
//     }
//     );

//     return res.json({
//         books: updateBook
//     });
// });

// /*
// Route            /publication/update/book
// Description      Update /add new publication
// Access           PUBLIC
// Parameter        isbn
// Methods          PUT
// */

// booky.put("/publication/update/book/:isbn", (req,res) => {
//     //Update the publication database
//     database.publication.forEach((pub) => {
//       if(pub.id === req.body.pubId) {
//         return pub.books.push(req.params.isbn);
//       }
//     });
  
//     //Update the book database
//     database.books.forEach((book) => {
//       if(book.ISBN === req.params.isbn) {
//         book.publications = req.body.pubId;
//         return;
//       }
//     });
  
//     return res.json(
//       {
//         books: database.books,
//         publications: database.publication,
//         message: "Successfully updated publications"
//       }
//     );
//   });
  
//   /****DELETE*****/
//   /*
//   Route            /book/delete
//   Description      Delete a book
//   Access           PUBLIC
//   Parameter        isbn
//   Methods          DELETE
//   */
  
//   booky.delete("/book/delete/:isbn", (req,res) => {
//     //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
//     //and rest will be filtered out
  
//     const updatedBookDatabase = database.books.filter(
//       (book) => book.ISBN !== req.params.isbn
//     )
//     database.books = updatedBookDatabase;
  
//     return res.json({books: database.books});
//   });
  
//   /*
//   Route            /book/delete/author
//   Description      Delete an author from a book and vice versa
//   Access           PUBLIC
//   Parameter        isbn, authorId
//   Methods          DELETE
//   */
  
//   booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
//     //Update the book database
//      database.books.forEach((book)=>{
//        if(book.ISBN === req.params.isbn) {
//          const newAuthorList = book.author.filter(
//            (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
//          );
//          book.author = newAuthorList;
//          return;
//        }
//      });
  
  
//     //Update the author database
//     database.author.forEach((eachAuthor) => {
//       if(eachAuthor.id === parseInt(req.params.authorId)) {
//         const newBookList = eachAuthor.books.filter(
//           (book) => book !== req.params.isbn
//         );
//         eachAuthor.books = newBookList;
//         return;
//       }
//     });
  
//     return res.json({
//       book: database.books,
//       author: database.author,
//       message: "Author was deleted!!!!"
//     });
//   });

  

//   //////end of update and delete



booky.listen(3000, () =>
{
    console.log("Server is on at port 3000 and up running");
});