const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment')

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render('moviesAdd')
    },
    create: function (req, res) {
        const { title, rating, awards, release_date, length } = req.body// se requiere la propiedad name de los inputs del formulario
        db.Movie.create({// trae los valores de los modelos
            title: title.trim(),
            rating,
            awards,
            release_date,
            length
        })
            .then(movie => {
                return res.redirect('/movies')//redirige a la vista lista de peliculas
            })
            .catch(error => console.log(error))
    },
    edit: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => {
                return res.render('moviesEdit', {//renderiza hacia la vista
                    Movie,
                    release_date: moment(Movie.release_date).add(1, 'd').format('YYYY-MM-DD')//trae la fecha anterior para poder editarla
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        const { title, rating, awards, release_date, length } = req.body

        db.Movie.update(
            {
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            },
            {
                where :{
                    id : req.params.id
                }
            }
        )
        .then( () => {
            return res.redirect('/movies/detail/'+ req.params.id)
        })
        .catch(error => console.log(error))
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => {
                return res.render('moviesDelete', {//renderiza hacia la vista
                    Movie
                })
            })
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
       db.Movie.destroy({
           where :{
               id: req.params.id
           }
       })
       .then(() => {
           return res.redirect('/movies')
       })
       .catch(error => console.log(error ))
    }

}

module.exports = moviesController; 