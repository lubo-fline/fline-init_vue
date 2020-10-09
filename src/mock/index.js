const Mock = require('mockjs')
let Random = Mock.Random;
const swipes = function () {
    var data = {
        code: 200,
        msg: '成功',
        data: {
            items: [],
            count: 1,
        }
    }
    var dishesType = ['大号', '中号', '小号']
    for (var i = 0; i < 8; i++) {
        var obj = {
            id: i, //固有id
            code: Random.word(8, 20), //随机长度为在8到20内的汉字字符串
            name: Random.cword(2, 6), //随机长度为2 到 6 的汉字
            price: Random.float(1, 30, 2, 2), //100到5000的随机整数
            num: 0,
            type: dishesType[Random.integer(0, 2)],
        };
        data.data.items.push(obj)
    }
    return data
};
const patients = [{
    id: '1',
    name: '张大爷',
    label: '男',
    path: '/patient',
    imgUrl: '../../static/images/20170622131955_h4eZS.thumb.700_0.jpeg'
}, ];
Mock.mock('/dishesOrderListUrl', swipes);
Mock.mock('/patients', patients);
Mock.mock("/patient", "post", (options) => {
    const jsonObj = eval('(' + options.body + ')');
    const patient = patients.filter(p => p.id == jsonObj.pid);
    return patient[0];
});
Mock.setup({
    timeout: 1000 // setter delay time
})
