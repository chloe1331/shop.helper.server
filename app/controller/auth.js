'use strict';
const md5 = require('md5');
const Controller = require('egg').Controller;
const { generateToken, verifyToken } = require('../public');

class AuthController extends Controller {
    async login() {
        const { username, password, token } = this.ctx.request.body;
        const { User } = this.config.models;

        if (!token) {
            if (!username || !password) {
                this.ctx.throw(413, '账号密码错误');
            }

            const user = await User.model.findOne({
                where: {
                    username,
                    password: md5(password)
                }
            });

            if (!user) this.ctx.throw(403, '账号密码错误');

            const _token = generateToken({
                uid: user.id,
                password: user.password
            });

            this.ctx.body = {
                nickname: user.nickname,
                avatar: user.avatar,
                token: _token,
                role: user.role
            };
        } else {
            const verifyData = await verifyToken(token).catch(e => this.ctx.throw(403, e.message));
            const user = await User.model.findOne({
                where: {
                    id: verifyData.data.uid,
                    password: verifyData.data.password
                }
            });

            if (!user) this.ctx.throw(403, '登录失效');

            this.ctx.body = {
                nickname: user.nickname,
                avatar: user.avatar,
                token,
                role: user.role
            };
        }
    }
}

module.exports = AuthController;
