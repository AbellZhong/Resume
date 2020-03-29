//单例设计模式
//loading
let loadingRender = (function () {
    let $loadingBox = $('.loadingBox'),
        $current = $loadingBox.find('.current'),
        imgData = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];
    //run:预加载图片
    let n = 0,
        len = imgData.length,
        delayTimer = null;
    let run = function run(callback) {
        imgData.forEach(item => {
            let tempImg = new Image();
            tempImg.onload = () => {
                tempImg = null;
                $current.css('width', ((++n) / len) * 100 + '%');

                //加载完成后执行回调函数(让当前loading页面消失)
                if (n === len) {
                    //正常加载完
                    clearTimeout(delayTimer);
                    callback && callback();
                }
            };
            tempImg.src = item;
        })
    };
    //最大等待时间(假设10s,到达10s我们看加载了多少,如果已经达到了90%以上,我们可以正常访问内容了),如果不足这个比例,直接提示用户当前网络状况不佳,稍后重试即可
    let maxDelay = function (callback) {
        delayTimer = setTimeout(() => {
            if (n / len >= 0.9) {
                //骗用户的
                $current.css('width', '100%');
                callback && callback();
                return;
            }
            alert('非常遗憾,您的网络状况不佳,请稍后再试!');
            window.location.href = 'http://www.baidu.com';
        }, 10000);

        //如果超过最大延时,我们不应该继续加载图片,直接让用户重定向到某个页面
    };

    //加载完毕,执行回调函数
    let done = function done() {
        //把loading区域移除,停留一秒钟,增加用户体验,进入下一个环节
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearTimeout(timer);
            phoneRender.init();
        }, 1000);
    };
    return {
        init: function () {
            $loadingBox.css('display','block');
            run(done);
            maxDelay(done);
        }
    }
})();

//关于audio的一些常用属性
// duration:播放总时间s
// currentTime:当前已经播放的时间s
// paused 当前是否为暂停状态
// volume 控制音量

// [事件]
// canplay:可以正常播放(但是播放过程中可能出现卡顿)
// canplaythrough 资源缓冲完毕
// ended:是否已经播放完成
// loadedmetadata: 资源的基础信息已经加载完成
// loadeddata: 整个资源都加载完成
// pause: 触发了暂停
// play: 触发了播放
// playing: 正在播放中

let phoneRender = (function () {
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('h2>span'),
        $answer = $phoneBox.find('.answer'),
        $answerMarkLink = $answer.find('.markLink'),
        $hangUp = $phoneBox.find('.hangUp'),
        $hangMarkLink = $hangUp.find('.markLink'),
        answerBell = $('#answerBell')[0],
        introduce = $('#introduce')[0];
    let answerMarkTouch = function () {
        //让整个answer区域移除
        $answer.remove();
        answerBell.pause();
        //一定要先暂停播放,然后再移除 否则即使移除了浏览器也会播放着声音
        $(answerBell).remove();

        //2.让hangU界面显示
        $($hangUp).css('transform', 'translateY(0rem)');
        $time.css('display', 'block');
        introduce.play();
        computedTime();
    };

    //计算播放时间
    let computedTimer = null;
    let computedTime = function computedTime() {
        let duration = 0;
        introduce.oncanplay = function () {
            duration = introduce.duration;
            console.log(duration);
        };
        computedTimer = setInterval(() => {
            let value = introduce.currentTime,
                minute = Math.floor(value / 60),
                second = Math.floor(value - minute * 60);
            if (value >= duration) {
                clearTimeout(computedTimer);
                closePhone();
                return;
            }
            minute < 10 ? minute = '0' + minute : null;
            second < 10 ? second = '0' + second : null;
            $time.html(`${minute}:${second}`);
        }, 1000);
    };

    //关闭phone
    let closePhone = function () {
        introduce.pause();
        $(introduce).remove();
        clearTimeout(computedTimer);
        $phoneBox.remove();
        messageRender.init();
    };

    return {
        init: function () {
            $phoneBox.css('display','block');

            //进来的第一件事,播放bell铃声
            answerBell.play();
            answerBell.volume = 0.5;

            //点击answer-mark
            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);
        }
    }
})();

let messageRender = (function () {
    let $messageBox = $('.messageBox'),
        $wrapper = $messageBox.find('.wrapper'),
        $messageList = $wrapper.find('li'),
        $keyBoard = $messageBox.find('.keyBoard'),
        $textIpt = $keyBoard.find('span'),
        $submit = $keyBoard.find('.submit'),
        magicMusic = $('#magicMusic')[0];

    let step = -1, //记录当前展示信息的索引
        total = $messageList.length + 1, //记录的是信息的总条数(自己还要发一条)
        autoTimer = null,
        interval = 2000; //记录信息出现的间隔时间
    let tt = 0;
    let showMessage = function showMessage() {
        ++step;
        if (step === 2) {
            //已经展示两条了:此时我们暂时结束自动发送信息,让键盘出来,开始执行手动发送
            clearTimeout(autoTimer);
            handleSend();
            return;
        }
        let $cur = $messageList.eq(step);
        $cur.addClass('active');
        if (step >= 3) {
            //    此时说明展示的条数已经是4条或者四条以上了,此时我们让wrapper向上移动,移动的距离是新展示这一条的高度
            //=> js中基于css获取transform得到的结果是一个矩阵
            let curH = $cur[0].offsetHeight;
            tt -= curH;
            $wrapper.css('transform', `translateY(${tt}px)`);
        }
        if (step >= total - 1) {
            //已经展示完了
            clearTimeout(autoTimer);
            closeMessage();
        }
    };

    //手动发送消息
    let handleSend = function handleSend() {
        $keyBoard.css('transform', 'translateY(0)');
        $keyBoard.one('transitionend', function () {
            //transition-end:监听transition动画结束的事件,有几个样式属性被改变,并且执行了过渡效果,事件就会被触发执行几次 =>用one方法做事件绑定,只会让其触发一次
            let str = '我的原生JS基础还算比较扎实!',
                n = -1,
                textTimer = null;
            textTimer = setInterval(() => {
                let originHTML = $textIpt.html();
                $textIpt.html(originHTML + str[++n]);
                if (n >= str.length - 1) {
                    //文字显示完成
                    clearTimeout(textTimer);
                    $submit.css('display', 'block');
                }
            }, 100);
        })
    };

    //点击submit
    let handleSubmit = function handleSubmit() {
        //把新创建的li增加到页面中第二个li的后面
        $(`<li class="self">
                <i class="arrow"></i>
                <img src="img/zf_messageStudent.png" alt="" class="pic">
                ${$textIpt.html()}
                </li>`).insertAfter($messageList.eq(1)).addClass('active');
        //把新的li放到页面中,此时应该重新获取li,让messageList和页面中的li正对应,方便后期根据索引展示对应的li
        $messageList = $wrapper.find('li');
        //    该消失的消失
        $textIpt.html('');
        $submit.css('display', 'none');
        $keyBoard.css('transform', 'translateY(3.7rem)');
        //    继续向下展示剩余的消息
        autoTimer = setInterval(showMessage, interval);
    };

    //关闭message区域
    let closeMessage = function closeMessage() {
        let delayTimer = setTimeout(() => {
            magicMusic.pause();
            $(magicMusic).remove();
            $messageBox.remove();
            clearTimeout(delayTimer);
        }, interval);
    };
    return {
        init: function () {
            $messageBox.css('display','block');
            //进来先展示一条信息,然后每间隔2000ms再发送一条信息
            showMessage();
            autoTimer = setInterval(showMessage, interval);
            $submit.tap(handleSubmit);

            //music
            magicMusic.play();
            magicMusic.volume = 0.3;
        }
    }
})();

//开发过程中,由于当前项目板块众多(每一个板块都是一个单例),我们最好一种机制,通过标识的判断可以让程序只执行对应版块的内容,这样开发哪个板块,我们就把标识改为啥(方便调试) hash路由的模型

//获取当前页面的哈希地址
let url = window.location.href,//=>获取当前页面的URL地址  location.href='xxx'这种写法是让其跳转到某一个页面
    well = url.indexOf('#'),
    hash = well === -1 ? null : url.slice(well + 1);
switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case 'message':
        messageRender.init();
        break;
    default:
        loadingRender.init();
        break;
}
