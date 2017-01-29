export default class ObservableModel {
    /*
    ObservableModel defines a lightweight convention for asynchronous
    communication among different layers. The initial intent is to provide
    a way for React Components to listen for changes to associated models.

    The target architecture is a more-or-less symmetric set of Models and
    Components. For example, there is a Game model which is composed of a
    Board model. There are analogous Game and Board components.

    Exactly how and when the ObservableModel convention is used is situational.
    For example, the Game model report on changes to its immediate properties
    by calling ObservableModel.onChange. The Board model is immutable,
    so it does not inherit from ObservableModel. The Game model handles calling
    onChange when there is a new board state.
    */

    constructor() {
        this.onChangeCallbacks = [];
    }

    onChange(callback) {
        if (this.onChangeCallbacks.indexOf(callback) === -1) {
            this.onChangeCallbacks.push(callback);
        }
        callback(this);
    }

    change() {
        this.onChangeCallbacks.forEach(callback => {
            callback(this);
        });
    }
}
