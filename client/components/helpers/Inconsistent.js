'use strict'

class Inconsistent {

    static GetPassword(stabilize) {

        if(!stabilize){

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 8; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            }

            return "Not the password: " + text;

        }

        return "9h0571N73HM4CH1n3"

    }

    static stabilize() {

        return true

    }
}

export default Inconsistent
