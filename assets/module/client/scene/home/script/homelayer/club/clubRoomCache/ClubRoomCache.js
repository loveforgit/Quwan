window.ClubDeskSet = {



    userHeadPos(num) {
        var userPos = this.pos_4
        if (num == 2) {
            userPos = this.pos_2
        } else if (num == 3) {
            userPos = this.pos_3
        } else if (num == 4) {
            userPos = this.pos_4
        } else if (num == 6) {
            userPos = this.pos_6
        } else if (num == 8) {
            userPos = this.pos_8
        } else if (num == 10) {
            userPos = this.pos_10
        } else if (num == 12) {
            userPos = this.pos_12
        }
        return userPos
    },


    pos_2: {
        0: cc.p(-212, 0),
        1: cc.p(212.4, 0),
    },

    pos_3: {
        0: cc.p(-212, 0),
        1: cc.p(212.4, 0),
        2: cc.p(2.6, 134.1),
    },

    pos_4: {
        0: cc.p(-212, 0),
        1: cc.p(212.4, 0),
        2: cc.p(2.6, 134.1),
        3: cc.p(2.6, -137.4),
    },

    pos_6: {
        0: cc.p(-212, 0),
        1: cc.p(212.4, 0),
        2: cc.p(-80.4, 120.4),
        3: cc.p(-80.4, -120.4),
        4: cc.p(86.9, 120),
        5: cc.p(86.9, -120.2),
    },

    pos_8: {
        0: cc.p(-212, 0),
        1: cc.p(212.4, 0),
        2: cc.p(-80.4, 120.4),
        3: cc.p(-80.4, -120.4),
        4: cc.p(86.9, 120),
        5: cc.p(86.9, -120.2),
        6: cc.p(2.6, 134.1),
        7: cc.p(2.6, -137.4),
    },

    pos_10: {
        0: cc.p(-188.2, 45),
        1: cc.p(190.1, 45),
        2: cc.p(-188.2, -45),
        3: cc.p(190.1, -45),
        4: cc.p(-80.4, 120.4),
        5: cc.p(-80.4, -120.2),
        6: cc.p(86.9, 120.4),
        7: cc.p(86.9, -120.2),
        8: cc.p(2.6, 134.1),
        9: cc.p(2.6, -137.4),
    },

    pos_12: {
        0: cc.p(-212, 0),
        1: cc.p(212.4, 0),
        2: cc.p(2.6, 134.1),
        3: cc.p(2.6, -137.4),
        4: cc.p(-188.2, 71.4),
        5: cc.p(190.1, 71.4),
        6: cc.p(-188.2, -72),
        7: cc.p(190.1, -72),
        8: cc.p(-80.4, 120),
        9: cc.p(-80.4, -120.2),
        10: cc.p(86.9, 120.4),
        11: cc.p(86.9, -120.2),
    },
}