const { nanoid } = require('nanoid');
const books = require('./books');

const addBookByIdHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);

  // eslint-disable-next-line no-unneeded-ternary
  const finished = readPage === pageCount ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
      .code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
      .code(400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter(
    (book) => book.id === id,
  ).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
      .code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  })
    .code(500);
};

const getAllBooksHandler = (request, h) => {
  const objTemp = [];

  if (request.query !== {}) {
    const { name: nama, reading, finished } = request.query;

    if (nama !== undefined) {
      const bookFound = books.filter(
        (book) => book.name.toLowerCase().includes(nama.toLowerCase()),
      );

      for (let i = 0; i < bookFound.length; i += 1) {
        const { id, name, publisher } = bookFound[i];
        objTemp[i] = {
          id,
          name,
          publisher,
        };
      }
      return h.response({
        status: 'success',
        data: {
          books: [...objTemp],
        },
      })
        .code(200);
    }

    if (reading !== undefined) {
      if (reading === '1') {
        const bookFound = books.filter(
          (book) => book.reading === true,
        );

        for (let i = 0; i < bookFound.length; i += 1) {
          const { id, name, publisher } = bookFound[i];
          objTemp[i] = {
            id,
            name,
            publisher,
          };
        }
        return h.response({
          status: 'success',
          data: {
            books: [...objTemp],
          },
        })
          .code(200);
      }

      if (reading === '0') {
        const bookFound = books.filter(
          (book) => book.reading === false,
        );

        for (let i = 0; i < bookFound.length; i += 1) {
          const { id, name, publisher } = bookFound[i];
          objTemp[i] = {
            id,
            name,
            publisher,
          };
        }

        return h.response({
          status: 'success',
          data: {
            books: [...objTemp],
          },
        })
          .code(200);
      }
    }

    if (finished !== undefined) {
      if (finished === '1') {
        const bookFound = books.filter(
          (book) => book.finished === true,
        );

        for (let i = 0; i < bookFound.length; i += 1) {
          const { id, name, publisher } = bookFound[i];
          objTemp[i] = {
            id,
            name,
            publisher,
          };
        }
        return h.response({
          status: 'success',
          data: {
            books: [...objTemp],
          },
        })
          .code(200);
      }

      if (finished === '0') {
        const bookFound = books.filter(
          (book) => book.finished === false,
        );

        for (let i = 0; i < bookFound.length; i += 1) {
          const { id, name, publisher } = bookFound[i];
          objTemp[i] = {
            id,
            name,
            publisher,
          };
        }

        return h.response({
          status: 'success',
          data: {
            books: [...objTemp],
          },
        })
          .code(200);
      }
    }
  }

  for (let i = 0; i < books.length; i += 1) {
    const { id, name, publisher } = books[i];
    objTemp[i] = {
      id,
      name,
      publisher,
    };
  }
  return h.response({
    status: 'success',
    data: {
      books: [...objTemp],
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookFound = books.filter((b) => b.id === bookId)[0];

  if (bookFound !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book: bookFound,
      },
    })
      .code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
    .code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
      .code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
      .code(400);
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
      .code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
    .code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
      .code(404);
  }

  books.splice(index, 1);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  })
    .code(200);
};

module.exports = {
  addBookByIdHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
