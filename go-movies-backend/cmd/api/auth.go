package main

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type Auth struct {
	Issuer        string
	Audience      string
	Secret        string
	TokenExpiry   time.Duration
	RefreshExpiry time.Duration
	CookieDomain  string
	CookiePath    string
	CookieName    string
}

type jwtUser struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type TokenPairs struct {
	Token        string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type Claims struct {
	jwt.RegisteredClaims
}

func (j *Auth) generateTokenPair(user *jwtUser) (TokenPairs, error) {
	//create a new token
	token := jwt.New(jwt.SigningMethodHS256)

	//set the claims
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = fmt.Sprintf("%s %s", user.FirstName, user.LastName)
	claims["sub"] = fmt.Sprint(user.ID)
	claims["aud"] = j.Audience
	claims["iss"] = j.Issuer
	claims["iat"] = time.Now().UTC().Unix()
	claims["typ"] = "JWT"

	//set the expiry for jwt
	claims["exp"] = time.Now().UTC().Add(j.TokenExpiry).Unix()

	//create a signed token
	signedAccessToken, err := token.SignedString([]byte(j.Secret))
	if err != nil {
		return TokenPairs{}, err
	}

	//create a refresh token and set claims for it
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	refreshTokenClaims := refreshToken.Claims.(jwt.MapClaims)
	refreshTokenClaims["sub"] = fmt.Sprint(user.ID)
	refreshTokenClaims["iat"] = time.Now().UTC().Unix()
	claims["exp"] = time.Now().UTC().Add(j.RefreshExpiry).Unix()

	//create a signed refresh token
	signedRefreshToken, err := refreshToken.SignedString([]byte(j.Secret))
	if err != nil {
		return TokenPairs{}, err
	}

	//create tokenpairs and populate with signed tokens

	var tokenPairs = TokenPairs{
		Token:        signedAccessToken,
		RefreshToken: signedRefreshToken,
	}

	//return tokenpairs
	return tokenPairs, nil

}

func (j *Auth) GetRefreshCookie(refreshToken string) *http.Cookie {
	return &http.Cookie{
		Name:     j.CookieName,
		Path:     j.CookiePath,
		Value:    refreshToken,
		Expires:  time.Now().Add(j.RefreshExpiry),
		MaxAge:   int(j.RefreshExpiry.Seconds()),
		SameSite: http.SameSiteStrictMode,
		Domain:   j.CookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}

func (j *Auth) GetExpiredRefreshCookie() *http.Cookie {
	return &http.Cookie{
		Name:     j.CookieName,
		Path:     j.CookiePath,
		Value:    "",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		SameSite: http.SameSiteStrictMode,
		Domain:   j.CookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}

func (j *Auth) GetTokenFromHeaderAndVerify(w http.ResponseWriter, r *http.Request) (string, *Claims, error) {
	w.Header().Add("Vary", "Authorization")
	//get auth header

	authHeader := r.Header.Get("Authorization")

	//sanity check
	if authHeader == "" {
		return "", nil, errors.New("no auth header found")
	}

	//split the header on spaces
	headerParts := strings.Split(authHeader, " ")

	//check the length of the auth header and if the first word in Bearer or not
	if len(headerParts) != 2 {
		fmt.Println("invalid auth header")
		return "", nil, errors.New("invalid auth header")
	}
	if headerParts[0] != "Bearer" {
		return "", nil, errors.New("invalid auth header")
	}
	token := headerParts[1]
	// declare an empty claims
	claims := &Claims{}
	//parse the token

	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			fmt.Println("invalid signing method")
			return nil, fmt.Errorf("unexpected signing method %v", token.Header["algo"])
		}
		return []byte(j.Secret), nil
	})
	if err != nil {
		if strings.HasPrefix(err.Error(), "token is expired by") {
			fmt.Println("expired token")
			return "", nil, errors.New("expired token")
		}
		fmt.Println("some other error occurred")
		return "", nil, err
	}
	if claims.Issuer != j.Issuer {
		fmt.Println("invalid issuer")
		return "", nil, errors.New("invalid issuer")
	}
	return token, claims, nil
}
