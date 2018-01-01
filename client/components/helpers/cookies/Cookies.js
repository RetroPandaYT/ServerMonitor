'use strict'

import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

const TokenCookie = process.env.TOKEN_COOKIE

const UserCookie = process.env.USER_COOKIE

class Cookies {

    static GetToken() {

      const username = read_cookie(UserCookie)
      const token = read_cookie(TokenCookie)

      return {
        username: username,
        token: token

      }

    }

    static SetToken(value) {

        const token = value.token
        const username = value.username

        bake_cookie(UserCookie, value);


    }

    static DelToken(){


    }

}

export default Cookies
