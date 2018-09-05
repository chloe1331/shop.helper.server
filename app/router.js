'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.post('/auth/login.json', controller.auth.login);
    router.post('/member/create.json', controller.member.create);
    router.get('/member/list.json', controller.member.list);
    router.delete('/member/delete.json', controller.member.delete);
    router.put('/member/resetPassword.json', controller.member.resetPassword);
};
