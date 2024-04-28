package graph

import (
	"backend/internal/models"

	"github.com/graphql-go/graphql"
)

type Graph struct {
	Movies      []*models.Movie
	QueryString string
	Config      graphql.SchemaConfig
	fields      graphql.Fields
	movieType   *graphql.Object
}

func New(movies []models.Movie) *Graph {
	var movieType = graphql.NewObject(
		graphql.ObjectConfig{
			Name : "Movie",
			Fields: graphql.Fields{
				"id": &graphql.Field{
					Type: graphql.Int,
				},
				"title": graphql.Field{
					Type: graphql.String,
				},
				"description": graphql.Field{
					Type: graphql.String,
				},
				"release_date": graphql.Field{
					Type: graphql.DateTime,
				},
				"runtime": graphql.Field{
					Type: graphql.Int,
				},
				"imdb_rating": graphql.Field{
					Type: graphql.String,
				},
				"created_at": graphql.Field{
					Type: graphql.DateTime,
				},
				"updated_at": graphql.Field{
					Type: graphql.DateTime,
				},
				"image": graphql.Field{
					Type: graphql.String,
				},
			},
		},
	)
	var fields = graphql.Fields{
		"list": &graphql.Field{
			Type: graphql.NewList(movieType),
			Description: "Get all movies",
			Resolve: func(params graphql.ResolveParams) (interface{}, error){
              return movies,nil
			},
		},
		"search": &graphql.Field{
         Type: graphql.NewList(movieType),
		 Description: "Get movies by title",
		 Args: graphql.FieldConfigArgument()

		},
	}
}