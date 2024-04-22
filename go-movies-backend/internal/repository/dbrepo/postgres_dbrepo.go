package dbrepo

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"fmt"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 10

func (m *PostgresDBRepo) Connection() *sql.DB {
	fmt.Println(m.DB)
	return m.DB
}
func (m *PostgresDBRepo) AllMovies() ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()
	var movies []*models.Movie

	query := `
	select 
	   id,title,release_date,runtime,imdb_rating,
	   description, coalesce(image,''), created_at,
	   updated_at
	from 
	   movies
	order by
	   title
	`

	rows, err := m.DB.QueryContext(ctx, query)
	fmt.Println(err)
	fmt.Println(rows)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.ImdbRating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		movies = append(movies, &movie)

	}
	return movies, nil
}
