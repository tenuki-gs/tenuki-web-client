import Firebase from 'firebase';

const rootRef = new Firebase('https://crackling-heat-815.firebaseio.com/');

var getCurrentUser = (success, error) => {
    if (rootRef.getAuth()) {
        success(rootRef.getAuth());
    } else {
        rootRef.authAnonymously().then(success).catch(error);
    }
}

export {getCurrentUser}
