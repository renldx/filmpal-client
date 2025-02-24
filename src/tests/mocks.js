const mocks = {
    genres: ["GENRE1", "GENRE2", "GENRE3"],
    movies: [
        {
            title: "MockMovie1",
            release: 2001,
            code: "MockMovie1_2001",
        },
        {
            title: "MockMovie2",
            release: 2002,
            code: "MockMovie2_2002",
        },
        {
            title: "MockMovie3",
            release: 2003,
            code: "MockMovie3_2003",
        },
    ],
    invalidMovie: {
        title: "xyz",
        release: 0,
        code: "xyz_0000",
    },
    movieDetails: {
        response: "True",
        title: "MockMovie1",
        year: 2001,
        poster: "mock-poster.img",
    },
    invalidMovieDetails: {
        response: "False",
        title: null,
        year: null,
        poster: null,
    },
    retriedMovieDetails: {
        response: "True",
        title: "xyz",
        year: 2000,
        poster: "mock-poster.img",
    },
};

export default mocks;
