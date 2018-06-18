const consts = {
    table_name: "users",
    status: {
        INVITED   : 0,  // пользователю выслано приглашение
        ACTIVATED : 1,  // пользователь получил приглашение, перешел по ссылке и был активирован
        BANNED    : 2   // пользователь забанен
    },
}

module.exports = consts;