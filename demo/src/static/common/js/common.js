/*
 * @Description: 兼容IE8 公共方法
 * @Author: hdx
 * @Date: 2019-02-01 11:22:03
 * @LastEditors: hdx
 * @LastEditTime: 2019-02-02 13:58:43
 */
const $$ = {
  //根路径地址
  attachBase: "http://b2b.haier.com",
  //ajax公共方法
  //调用方法
  ajax(params) {
    let that = this
    let url = params.url
    let data = params.data || {}
    let method = params.method || "GET"
    let isJson = params.isJson || false
    let needLogin = params.needLogin
    let showLoading = params.showLoading || false
    let header = params.header || {}
    let dataType = params.dataType || "json"
    let beforeSend = params.beforeSend
    let successFun = params.success
    let failfun = params.fail
    let completefun = params.complete

    if (isJson) {
      header["content-type"] = "application/json"
      //if(method == "GET"){
      method = "POST"
      //}
    } else {
      header["content-type"] = "application/x-www-form-urlencoded"
    }

    return new Promise((resolve, reject) => {
      if (needLogin) {
        let token = ui.getStorageSync("token")
        //特别注意页面跳转两次获取不到本地存储
        if (!token) {
          //从缓存拿token
        }
        if (token && token.length > 0) {
          header["Authorization"] = token
        } else {
          //未登录操作
        }
      }
      typeof beforeSend === 'function' && beforeSend()
      if (showLoading) {
        //loading操作
      }
      url = that.fixApiUrl(url);
      $.ajax({
        header: header,
        method: method,
				url : url,
        data: data,
			  dataType: dataType,
				async : true,
				success : function(resp) {
          typeof successFun === 'function' && successFun(resp)
					resolve(resp);
				},
				fail : function(error) {
          typeof failfun === 'function' && failfun(error)
          reject(error)
				},
        complete: function () {
          typeof completefun === 'function' && completefun()
        }
			});
    })
  },

  /**
   * 正则校验
   * @param {规则} rule
   * @param {值} value
   */
  verify(rule, value) {
    let response = {
      success: true,
      errorMsg: "正确"
    };
    let verify = {
      required: [/[\S]+/, "必填项不能为空"],
      mobile: [/^1\d{10}$/, "请输入正确的手机号"],
      email: [
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        "邮箱格式不正确"
      ],
      url: [/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, "链接格式不正确"],
      number: function (value) {
        if (!value || isNaN(value)) return "只能填写数字";
      },
      date: [
        /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/,
        "日期格式不正确"
      ],
      identity: [/(^\d{15}$)|(^\d{17}(x|X|\d)$)/, "请输入正确的身份证号"],
      ip: [
        /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
        "ip地址不正确"
      ]
    };
    if (verify[rule]) {
      let isFn = typeof verify[rule] === "function";
      if (isFn) {
        let ret = verify[rule](value);
        if (ret) {
          response.success = false;
          response.errorMsg = ret;
        }
      } else {
        response.success = verify[rule][0].test(value);
        if (!response.success) {
          response.errorMsg = verify[rule][1];
        }
      }
    }
    return response;
  },

  /**
   * 修正图片路径
   */
  fixUrl(url) {
    var rule = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
    var picUrl = "";
    if (rule.test(url)) {
      picUrl = url;
    } else {
      picUrl = $$.attachBase + url;
    }
    return picUrl;
  },
  /**
   * 获取地址后带有的参数
   */
  getUrlParam() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  },
  /**
   * 生成16位guid
   */
  guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  /**
   * 格式化日期
   * @param {日期} date
   * @param {日期格式} fmt
   * @returns 返回格式化后的日期字符串
   * 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
   * //例子
   * formatDate(); // 2016-09-02 13:17:13
   * formatDate(new Date(), 'yyyy-MM-dd'); // 2016-09-02
   * 2016-09-02 第3季度 星期五 13:19:15:792
   * formatDate(new Date(), 'yyyy-MM-dd 第q季度 www HH:mm:ss:SSS');
   * formatDate(1472793615764); // 2016-09-02 13:20:15
   */
  formatDate(date, fmt) {
    date = date == undefined ? new Date() : date;
    date = typeof date == "number" ? new Date(date) : date;
    fmt = fmt || "yyyy-MM-dd HH:mm:ss";
    var obj = {
      y: date.getFullYear(), // 年份，注意必须用getFullYear
      M: date.getMonth() + 1, // 月份，注意是从0-11
      d: date.getDate(), // 日期
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
      w: date.getDay(), // 星期，注意是0-6
      H: date.getHours(), // 24小时制
      h: date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
      m: date.getMinutes(), // 分钟
      s: date.getSeconds(), // 秒
      S: date.getMilliseconds() // 毫秒
    };
    var week = ["天", "一", "二", "三", "四", "五", "六"];
    for (var i in obj) {
      fmt = fmt.replace(new RegExp(i + "+", "g"), function (m) {
        var val = obj[i] + "";
        if (i == "w") return (m.length > 2 ? "星期" : "周") + week[val];
        for (var j = 0, len = val.length; j < m.length - len; j++)
          val = "0" + val;
        return m.length == 1 ? val : val.substring(val.length - m.length);
      });
    }
    return fmt;
  },
  /**
   * 移除url中指定参数
   * @param {url} url
   * @param {参数名} paramName
   */
  remoteQueryParam(url, paramName) {
    var arr = url.split("?");
    var baseUrl = arr[0];
    var params = arr[1] || "";
    var paramsArr = params.split("&");
    var queryArr = [];
    for (var i = 0; i < paramsArr.length; i++) {
      var item = paramsArr[i];
      var queryItem = item.split("=");
      if (queryItem[0] != paramName) {
        queryArr.push(item);
      }
    }
    params = queryArr.join("&");
    var retUrl = baseUrl;
    if (params && params.length > 0) {
      retUrl = retUrl + "?" + params;
    }
    return retUrl;
  },

  /**
   * 字符串trim
   * @param {字符串} str
   */
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },

  /**
   * 字符串ltrim
   * @param {字符串} str
   */
  ltrim(str) {
    return str.replace(/(^\s*)/g, "");
  },

  /**
   * 字符串rtrim
   * @param {字符串} str
   */
  rtrim(str) {
    return str.replace(/(\s*$)/g, "");
  },

  /**
   * 是否是数组
   */
  in_array(search, array) {
    for (var i in array) {
      if (array[i] == search) {
        return true;
      }
    }
    return false;
  },
  /**
   * 获取本地图片
   */
  getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
      // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  },
  /**
   * html 正则解码
   * @param str
   * @returns {string}
   */
  htmlDecodeByRegExp(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "'");
    s = s.replace(/&quot;/g, '"');
    return s;
  },
  /**
   * 手机振动
   * @param {毫秒} ms
   */
  vibrate(ms) {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    } else if (navigator.webkitVibrate) {
      navigator.webkitVibrate(ms);
    }
  },
  /**
   * 延时执行
   * @param {方法} method
   * @param {上下文} context
   */
  delayExec(method, context, timeOut) {
    if (!timeOut) timeOut = 500;
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
      method.call(context);
    }, timeOut);
  },
  /**
   * 修正api路径
   */
  fixApiUrl(url) {
    var rule = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
    var apiUrl = "";
    if (rule.test(url)) {
      apiUrl = url;
    } else {
      apiUrl = $$.attachBase + url;
    }
    return apiUrl;
  },
};
export default $$;