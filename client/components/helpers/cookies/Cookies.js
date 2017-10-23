'use strict'

import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

const CookieKey = 'JWToken'

class Cookies {

    static GetToken() {

        return read_cookie(CookieKey)

    }

    static SetToken(value) {

        bake_cookie(CookieKey, value);


    }

}

export default Cookies
