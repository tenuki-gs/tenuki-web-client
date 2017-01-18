import Firebase from 'firebase';

const rootRef = new Firebase('https://crackling-heat-815.firebaseio.com/');

var getCurrentUser = () => {
    let promise = rootRef.authAnonymously().then(success).catch(error);

    let success = (authData) => {
        return authData;
    }

    let error = (errorData) => {
        console.log('error: ', errorData);
    }
}

export {getCurrentUser}
