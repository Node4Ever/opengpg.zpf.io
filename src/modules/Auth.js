class Auth {

    /**
     * Authenticates a user. Save a token string in Session Storage
     *
     * @param {string} token
     */
    static authenticateUser(token, expiresAt) {
        sessionStorage.setItem('mindstream:token', token);
        sessionStorage.setItem('mindstream:token-expiresAt', expiresAt);
    }

    /**
     * Checks if a user is authenticated - check if a token is saved in Session Storage
     *
     * @returns {boolean}
     */
    static isUserAuthenticated() {
        return sessionStorage.getItem('mindstream:token') !== null;
    }

    /**
     * Deauthenticates a user. Remove a token from Session Storage.
     *
     */
    static deauthenticateUser() {
        sessionStorage.removeItem('mindstream:token');
    }

    /**
     * Get a token value.
     *
     * @returns {string}
     */
    static getToken() {
        return sessionStorage.getItem('mindstream:token');
    }

}

export default Auth;
