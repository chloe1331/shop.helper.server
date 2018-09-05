'use strict';
const md5 = require('md5');
const uuid = require('uuid/v4');
const Controller = require('egg').Controller;
const { verifyToken, randomPassword } = require('../public');

class MemberController extends Controller {
    async create() {
        const { token, username, password, nickname } = this.ctx.request.body;
        const { User } = this.config.models;

        if (!token) this.ctx.throw(403, '登录失效');

        const verifyData = await verifyToken(token).catch(e => this.ctx.throw(403, e.message));
        const user = await User.model.findOne({
            where: {
                id: verifyData.data.uid,
                password: verifyData.data.password
            }
        });

        if (!user) this.ctx.throw(403, '登录失效');

        if (user.role != 'admin') this.ctx.throw(403, '没有操作权限');

        if (!username || !password || !nickname) this.ctx.throw(419, '参数错误');

        const memeber = await User.model.create({
            nickname,
            username,
            password: md5(password),
            role: 'member',
            uid: md5(uuid()),
            parent_id: user.id
        }).catch(e => {

            this.ctx.throw(403, e.errors.length ? e.errors[0].message : e.message);
        });

        this.ctx.body = {
            uid: memeber.uid
        };
    }

    async list() {
        const { token } = this.ctx.request.query;
        const { User } = this.config.models;

        if (!token) this.ctx.throw(403, '登录失效');

        const verifyData = await verifyToken(token).catch(e => this.ctx.throw(403, e.message));
        const user = await User.model.findOne({
            where: {
                id: verifyData.data.uid,
                password: verifyData.data.password
            }
        });

        if (!user) this.ctx.throw(403, '登录失效');

        const list = await User.model.findAll({
            where: {
                parent_id: user.id,
                role: 'member'
            },
            attributes: ['username', 'nickname', 'uid', 'created_at']
        });

        this.ctx.body = {
            list
        };
    }

    async delete() {
        const { token, uid } = this.ctx.request.body;
        const { User } = this.config.models;

        if (!token) this.ctx.throw(403, '登录失效');

        const verifyData = await verifyToken(token).catch(e => this.ctx.throw(403, e.message));
        const user = await User.model.findOne({
            where: {
                id: verifyData.data.uid,
                password: verifyData.data.password
            }
        });

        if (!user) this.ctx.throw(403, '登录失效');

        if (!uid) this.ctx.throw(419, '参数错误');

        await User.model.destroy({
            where: {
                uid
            }
        });

        this.ctx.body = {
            success: true
        };
    }

    async resetPassword() {
        const { token, uid } = this.ctx.request.body;
        const { User } = this.config.models;

        if (!token) this.ctx.throw(403, '登录失效');

        const verifyData = await verifyToken(token).catch(e => this.ctx.throw(403, e.message));
        const user = await User.model.findOne({
            where: {
                id: verifyData.data.uid,
                password: verifyData.data.password
            }
        });

        if (!user) this.ctx.throw(403, '登录失效');

        if (!uid) this.ctx.throw(419, '参数错误');

        const password = randomPassword(8);

        await User.model.update({
            password: md5(password)
        }, {
            where: { uid }
        });

        this.ctx.body = {
            password
        };
    }
}

module.exports = MemberController;
