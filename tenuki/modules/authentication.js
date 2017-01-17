import Firebase from 'firebase';

const rootRef = new Firebase('https://crackling-heat-815.firebaseio.com/');

let authentication = {
}

let firebaseAuthentication = {
    getCurrentUser() {
        var user;
        var authDataCallback = (authData) => {
            if (authData) {
                user = authData;
            } else {
                rootRef.authAnonymously();
            }
        };

        rootRef.onAuth(authDataCallback);
        return user;
    }
}

export {authentication, firebaseAuthentication}
