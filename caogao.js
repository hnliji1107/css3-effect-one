(function($, wind, doc, undefined) {

    var
        //缓存常用的全局变量
        jwind = $(wind),
        jdoc = $(doc),
        //向舞台中添加元素的的时间间隔（毫秒）
        timecell = 200,
        //统计当前已向舞台中添加元素的个数
        elemindex = 1,
        //舞台要添加的元素的对数（x2）
        elemcount = 8,
        //舞台中每个元素所占宽度
        elemwidth = 400,
        //每个元素初始化时的旋转角度
        elemdeg = 80,
        //每个元素初始化时的Y轴位移距离
        translateY = 150,
        //右侧元素的Z轴坐标
        translateZ = jwind.width() - 343,
        //每次纵深像素
        updownstep = 100,
        //每次左右平移像素
        leftrightstep = 1,
        //保存每个元素的X位置信息
        translateXArr = [],
        //保存每个元素的旋转角度信息
        rotateYArr = [],
        //当前元素纵深距离
        elemtotalstep = 0,
        //统计元素追加次数
        addcount = 0,
        //每次追加元素的数量
        eachaddcount = 5,
        //追加元素的基准深度
        addstartdistance = elemwidth,
        //图片队列
        elemimgArr = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg'],
        //新场景元素信息
        newelemtransformArr = [{img: '01.jpg', translateX: 500, translateY: 280, translateZ: -500}
                             ,{img: '02.jpg', translateX: -100, translateY: 630, translateZ: -1000}
                             ,{img: '03.jpg', translateX: -800, translateY: 380, translateZ: -1500}
                             ,{img: '04.jpg', translateX: -200, translateY: 130, translateZ: -2500}
                             ,{img: '05.jpg', translateX: 800, translateY: 30, translateZ: -3000}
                             ,{img: '06.jpg', translateX: 1730, translateY: 130, translateZ: -2500}
                             ,{img: '07.jpg', translateX: 2100, translateY: 380, translateZ: -1500}
                             ,{img: '08.jpg', translateX: 1230, translateY: 630, translateZ: -1000}
                            ],
        //新场景元素隐藏时的Z轴坐标
        hiddentranslateZ = 2000,
        //
        stage = {
            init: function() {
                this.stage = $('.stage');
                this.newscene = this.stage.find('.newscene');
                this.render();
                this.event();
            },
            render: function() {
                //构建舞台
                stageinit(this.stage);
            },
            event: function() {
                //定义舞台中元素的翻转行为
                this.stage.on('click.stage', '.showcase .offer', reserveshowcase);
                //定义舞台中元素的关闭行为
                this.stage.on('click.stage', '.showcase .close', closeshowcase);
            }
        };

    //程序入口
    $(function() {
        stage.init();
    })

    //场景切换
    function scenechange(ev) {
        ev.preventDefault();
        var stage = ev.data.stage, lfshowcase = stage.find('.showcase.left'), rtshowcase = stage.find('.showcase.right'), el;

        //左侧元素移除视觉范围
        lfshowcase.each(function(i, e) {
            el = $(e)[0];
            el.style.webkitTransform = el.style.webkitTransform + 'translateZ(-'+hiddentranslateZ+'px)';
        });

        //右侧元素移除视觉范围
        rtshowcase.each(function(i, e) {
            el = $(e)[0];
            el.style.webkitTransform = el.style.webkitTransform + 'translateZ('+hiddentranslateZ+'px)';
        });

        //载入新场景
        setTimeout(function() {
            newsceneinit(stage, ev.data.newscene);
        }, timecell);
    }

    //构建舞台
    function stageinit(stage) {
        //初始化舞台高度
        stage.height(jwind.height());
        //向舞台中添加元素
        appendelem(stage);
    }

    //新场景初始化
    function newsceneinit(stage, newscene) {
        var
            i = 0,
            len = newelemtransformArr.length,
            htmlframe = doc.createDocumentFragment(),
            sometransform, tmptranslateZ;

        //清除旧场景中的元素
        stage.find('.showcase').remove();

        //添加新场景元素到文档碎片中
        for (; i < len; i++) {
            //变换参数
            sometransform = newelemtransformArr[i];
            //保存真实的translateZ
            tmptranslateZ = sometransform.translateZ;
            //暂时使用默认的translateZ
            sometransform.translateZ = hiddentranslateZ;

            $('<div>', {
                'class': 'showcase new',
                'css': {
                    '-webkit-transform': gettransform(sometransform)
                }
            }).append('<a href="#" class="offer"><img src="'+sometransform.img+'"></a>').appendTo(htmlframe);

            //还原真实的translateZ
            sometransform.translateZ = tmptranslateZ;
        }

        //元素添加到舞台中
        newscene.html(htmlframe);

         //新场景元素渲染
        shownewcase(stage, newscene);
    }

    //detail场景初始化
    function detailsceneinit(stage, detailscene) {
    }

    //新场景元素渲染
    function shownewcase(stage, newscene) {
        //等旧场景移除后
        setTimeout(function() {
            //进入效果
            stage.find('.showcase.new').each(function(i, e) {
                changetranslatez($(e)[0], newelemtransformArr[i].translateZ);
            });

            //鼠标滑动效果
            stage.on('mousemove.slide', {newscene: newscene}, mouseslide);

            //退出和轮播效果
        	var newshowcase = stage.find('.showcase.new'), elarr = [], stylearr = [];

        	//轮播元素的初始化
        	newshowcase.each(function(i, e) {
        		var el = $(e);
                elarr.push(el);
                stylearr.push(el.attr('style'));
                el.attr('index', i);
            });
            
            stage.on('click', '.showcase.new', function(ev) {
            	var outel, index = $(this).attr('index');

            	//轮播
            	if (index) {
	        		for (var i = 0, count = elarr.length-index; i < count; i++) {
	            		outel = elarr.pop();
	            		elarr.unshift(outel);
	        		}

	                for (var i = 0, len = elarr.length; i < len; i++) {
	                	$(elarr[i]).attr({style: stylearr[i], index: i});
	                }
	            }

	            //进入detail
	            if (index == 0) {
                    //移除旧场景
	            	newshowcase.each(function(i, e) {
	            		changetranslatez($(e)[0], hiddentranslateZ);
	            	});

                    //切入新场景
                    setTimeout(function() {
                        detailsceneinit(stage, stage.find('.detailscene'));
                    }, timecell*5);
	            }
            });
        }, timecell);
    }

    //更新translateZ属性
    function changetranslatez(el, tz) {
        var pxpattern = /translateZ\(\-?\d+px\)/gi;
        el.style.webkitTransform = el.style.webkitTransform.replace(pxpattern, '') + 'translateZ('+tz+'px)';
    }

    //鼠标在新场景中的滑动效果
    function mouseslide(ev) {
        var 
            newscene = ev.data.newscene,
            xcenter = newscene.width() / 2,
            ycenter = newscene.height() / 2,
            xcursor = ev.clientX,
            ycursor = ev.clientY,
            rx = (ycursor - ycenter) / 100,
            ry = (xcursor - xcenter) / 100;

        //容器转动
        newscene.css('webkit-transform', 'rotateX('+rx+'deg) rotateY('+ry+'deg)');
    }

    //设置元素的变形
    function gettransform(transform) {
        return [
            transform && transform.rotateY !== undefined ? 'rotateY('+transform.rotateY+'deg)' : '',
            transform && transform.translateX !== undefined ? 'translateX('+transform.translateX+'px)' : '',
            transform && transform.translateY !== undefined ? 'translateY('+transform.translateY+'px)' : '',
            transform && transform.translateZ !== undefined ? 'translateZ('+transform.translateZ+'px)' : '',
            transform && transform.scale != undefined ? 'scale('+transform.scale+')' : ''
        ].join(' ');
    }

    //获取倒影片段
    function getoverhtml(img) {
        return '<span class="over" style="background:-webkit-linear-gradient(top, #000, rgba(255, 255, 255, 0)), url('+img+') no-repeat;"></span>';
    }

    //图片填充
    function picturefill(img, backimg) {
        return '<a href="#" class="offer"><img src="'+img+'" width="300" height="500"></a><a href="#" class="offer out"><img src="'+backimg+'" width="300" height="500"></a>';
    }

    //插入一个元素到舞台中
    function appendelem(stage, rotateY, newelempos) {
        //当前元素x坐标信息
        var translateX = (elemindex - 1) * elemwidth, img = elemimgArr[elemindex-1] || elemimgArr[Math.floor(Math.random()*7)];

        //动态追加渲染
        if (newelempos && newelempos > 0) {
            translateX = newelempos;
            elemdeg = rotateY;
            elemcount++;
        }

        //左侧元素渲染
        $('<div>', {
            'class': 'showcase left',
            'css': {
                '-webkit-transform': gettransform({rotateY: elemdeg, translateX: translateX, translateY: translateY})
            }
        }).append(picturefill(img, 'img-back.png')).appendTo(stage);

        //右侧元素渲染
        $('<div>', {
            'class': 'showcase right',
            'css': {
                '-webkit-transform': gettransform({rotateY: elemdeg, translateX: translateX, translateY: translateY, translateZ: translateZ})
            }
        }).append(picturefill(img, 'img-back.png')).appendTo(stage);

        //保存每个元素X坐标信息
        translateXArr.push(translateX);
        //保存每个元素的旋转角度信息
        rotateYArr.push(elemdeg);

        //一开始的初始化渲染
        if (!newelempos) {
            //累计循环次数
            elemindex++;

            //循环调用
            if (elemindex <= elemcount) {
                setTimeout(function() {
                    appendelem(stage);
                }, timecell);
            } else {
                //页面元素初始化完成之后定义方向键行为
                jdoc.on('keydown.stage', { stage: stage }, turnperspective);
                //设定每个元素的层级
                zindexsetting(stage);
                //定义舞台中的元素展开行为
                stage.on('click.stage', '.showcase.left, .showcase.right', {stage: stage}, lookshowcase);
                //场景切换
                stage.on('click.scenechange', '.scenechange', {stage: stage, newscene: stage.find('.newscene')}, scenechange);
            }
        }
    }

    //初始化完成后设定每个元素的层级
    function zindexsetting(stage) {
        var lfshowcase = stage.find('.showcase.left'), rtshowcase = stage.find('.showcase.right'), lfcasecount = lfshowcase.length;

        //设置左侧元素层级
        lfshowcase.each(function(i, e) {
            $(e).css('z-index', i);
        });

        //设置右侧元素层级
        rtshowcase.each(function(i, e) {
            $(e).css('z-index', lfcasecount+i);
        });
    }

    //方向键控制视角纵深
    function turnperspective(ev) {
        ev.preventDefault();
        var keycode = ev.keyCode, stage = ev.data.stage, lfshowcase = stage.find('.showcase.left'), rtshowcase = stage.find('.showcase.right');

        if (keycode === 38) {
            elemdepth(stage, lfshowcase, rtshowcase, 'up');
        } else if (keycode === 40) {
            elemdepth(stage, lfshowcase, rtshowcase, 'down');
        } else if (keycode === 37) {
            elemdepth(stage, lfshowcase, rtshowcase, 'left');
        } else if (keycode === 39) {
            elemdepth(stage, lfshowcase, rtshowcase, 'right');
        }
    }

    //元素的纵深
    function elemdepth(stage, lfshowcase, rtshowcase, direct) {
        var
            translateX = 0, rotateY = 80, i = 0, lfsome, rtsome,
            //每次纵深像素
            elemstep = direct === 'up' ? -updownstep : updownstep,
            //每次平移像素
            elempan = direct === 'left' ? -leftrightstep : leftrightstep;

        //移动每个元素
        for (; i < elemcount; i++) {
            //缓存遍历中的元素
            lfsome = lfshowcase.eq(i);
            rtsome = rtshowcase.eq(i);

            //上下键操作
            if (direct === 'up' || direct === 'down') {
                //防止纵深太快
                if (direct === 'down' || translateXArr[translateXArr.length-1] > 0) {
                    translateX = translateXArr[i] + elemstep;
                    lfsome.css('-webkit-transform', gettransform({rotateY: rotateYArr[i], translateX: translateX, translateY: translateY}));
                    rtsome.css('-webkit-transform', gettransform({rotateY: rotateYArr[i], translateX: translateX, translateY: translateY, translateZ: translateZ}));
                    translateXArr[i] = translateX;
                }
            }

            //左右键操作
            if (direct === 'left' || direct === 'right') {
                rotateY = rotateYArr[i] + elempan;
                lfsome.css('-webkit-transform', gettransform({rotateY: rotateY, translateX: translateXArr[i], translateY: translateY}));
                rtsome.css('-webkit-transform', gettransform({rotateY: rotateY, translateX: translateXArr[i], translateY: translateY, translateZ: translateZ}));
                rotateYArr[i] = rotateY;

                //舞台向右平移角度小于等于40deg时隐藏右排元素
                if (rotateY <= 40) {
                    rtsome.addClass('fd-hide');
                } else {
                    rtsome.removeClass('fd-hide');
                }

                //舞台向右平移角度大于等于130deg时隐藏左排元素
                if (rotateY >= 130) {
                    lfsome.addClass('fd-hide');
                } else {
                    lfsome.removeClass('fd-hide');
                }
            }
        }

        //累计纵深距离
        if (direct === 'up') {
            elemtotalstep += updownstep;    
        } else if (direct === 'down') {
            elemtotalstep -= updownstep;
        }

        //追加元素
        lfshowcase.first().off('webkitTransitionEnd').on('webkitTransitionEnd', function() {
            //防止纵深太快，缓一下再追加
            if (direct === 'up' && elemtotalstep >= addstartdistance + elemwidth*addcount && translateXArr[translateXArr.length-1] >= 0) {
                for (i = 0; i <= eachaddcount; i++) {
                    //防止添加重复位置的元素
                    if ($.inArray(translateX+elemwidth*i, translateXArr) === -1) {
                        appendelem(stage, rotateYArr[0], translateX+elemwidth*i);
                    }
                }
                //累计追加次数
                addcount++;
                //重新设定每个元素的层级
                zindexsetting(stage);
            }
        });
    }

    //查看元素
    function lookshowcase(ev) {
        ev.preventDefault();
        var winwidth, winheight, casewidth, caseheight, casetop, caseleft, showcase = $(this);

        //只针对非居中元素
        if (!showcase.hasClass('iscenter') && !ev.data.stage.find('.iscenter')[0]) {
            //过渡开始时标识元素处于居中状态
            showcase.addClass('iscenter');
            
            //居中位置计算
            winwidth = jwind.width();
            winheight = jwind.height();
            showcase = $(this);
            casewidth = showcase.outerWidth();
            caseheight = showcase.outerHeight();
            casetop = Math.floor((winheight - caseheight) / 2);
            caseleft = Math.floor((winwidth - casewidth) / 2);

            //保存元素原位置
            showcase.data('originpath', showcase[0].style.webkitTransform);
            //保存元素原层级
            showcase.data('originzindex', showcase.css('z-index'));
            //元素居中定位
            showcase.css({'z-index': 999, '-webkit-transform': gettransform({rotateY: 0, translateX: caseleft, translateY: casetop})});

            //过渡结束时为元素添加更多信息
            showcase.on('webkitTransitionEnd', function() {
                if (showcase.hasClass('iscenter')) {
                    //添加复位按钮
                    showcase.find('.close')[0] || showcase.find('.offer').append('<a href="#" class="close">复位</a>');
                    //隐藏倒影
                    showcase.addClass('cube').find('.over').removeClass('show').addClass('hide');
                    //构造一个长方体
                    showcase.find('.offer').first().addClass('cube-front');
                    showcase.find('.cube-right')[0] && showcase.find('.cube-right').removeClass('hide').addClass('show') || showcase.append('<a href="#" class="cube-right show"><img src="img-right.png"></a>');
                    showcase.find('.cube-left')[0] && showcase.find('.cube-left').removeClass('hide').addClass('show') || showcase.append('<a href="#" class="cube-left show"><img src="img-left.png"></a>');
                    showcase.find('.cube-back')[0] && showcase.find('.cube-back').removeClass('hide').addClass('show') || showcase.append('<a href="#" class="cube-back show"><img src="img-hou.png"></a>');
                }
            });
        }
    }

    //翻转元素
    function reserveshowcase(ev) {
        var that = $(this), showcase = that.closest('.showcase');
        //元素展开之后才能翻转
        if (showcase.hasClass('iscenter')) {
            that.css('visibility','visible').removeClass('in').addClass('out');
            setTimeout(function() {
                that.siblings('.offer').removeClass('out').css('visibility', 'visible').addClass('in');
            }, timecell);
        }

        //动画结束后关闭隐藏背面内容
        that.on('webkitAnimationEnd', function() {
            showcase.find('.offer.out').css('visibility', 'hidden');
        });
    }

    //复位元素
    function closeshowcase(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        var showcase = $(this).closest('.showcase');

        //运动开始时设置移动元素的层级为最高，运动结束后还原层级
        showcase.css('z-index', 999).on('webkitTransitionEnd', function() {
            if (!showcase.hasClass('iscenter')) {
                showcase.css('z-index', showcase.data('originzindex'));
            }
        });

        //执行扫尾工作
        gooriginstatus($(this).closest('.showcase'));
    }

    //还原元素位置
    function gooriginstatus(showcase) {
        //动画结束后复位元素，这里不用webkitAnimationEnd事件，以免造成混乱。
        setTimeout(function() {
            //复位并标识元素未居中
            showcase[0] && (showcase[0].style.webkitTransform = showcase.data('originpath'));
            showcase.removeClass('iscenter');
        }, timecell*5);

        //清除复位按钮
        showcase.on('webkitTransitionEnd', function() {
            showcase.find('.close').remove();
        });

        //显示倒影
        showcase.removeClass('cube').find('.over').removeClass('hide').addClass('show');
        //清除正方体状态
        showcase.find('.offer').first().removeClass('cube-front');
        showcase.find('.cube-right').removeClass('show').addClass('hide');
        showcase.find('.cube-left').removeClass('show').addClass('hide');
        showcase.find('.cube-back').removeClass('show').addClass('hide');
    }
})(jQuery, window, document);