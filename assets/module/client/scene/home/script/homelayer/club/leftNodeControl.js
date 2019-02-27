
cc.Class({
    extends: cc.Component,

    properties: {

        createClubNode: {
            default: null,
            type: cc.Node
        },
        joinClubNode: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {
        this.selectCreateOrJoin(false, false)
    },

    onClickLeftClubEvent() {
        this.selectCreateOrJoin(false, false)
        this.node.active = false
    },

    onClickCreateClub() {
        this.selectCreateOrJoin(true, false)
    },

    onClickJoinClub() {
        this.selectCreateOrJoin(false, true)
    },

    //选择 创建 还是 加入  俱乐部
    selectCreateOrJoin(isCreate, isJoin) {
        this.createClubNode.active = isCreate
        this.joinClubNode.active = isJoin
    },


});
