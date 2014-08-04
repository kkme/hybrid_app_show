define(function(require,exports,module){
	var Tool = require('../base/tool');
	return {
        /**
         * 缓存
         */
        countCache: {},
        moneyCache: {},
        /**
         * 过关方式映射
         */
        passTypeMap:
        {
            '单关': [1],
            '2串1': [2],
            '2串3': [2, 1],
            '3串1': [3],
            '3串3': [2],
            '3串4': [3, 2],
            '3串7': [3, 2, 1],
            '4串1': [4],
            '4串4': [3],
            '4串5': [4, 3],
            '4串6': [2],
            '4串11': [4, 3, 2],
            '4串15': [4, 3, 2, 1],
            '5串1': [5],
            '5串5': [4],
            '5串6': [5, 4],
            '5串10': [2],
            '5串16': [5, 4, 3],
            '5串20': [3, 2],
            '5串26': [5, 4, 3, 2],
            '5串31': [5, 4, 3, 2, 1],
            '6串1': [6],
            '6串6': [5],
            '6串7': [6, 5],
            '6串15': [2],
            '6串20': [3],
            '6串22': [6, 5, 4],
            '6串42': [6, 5, 4, 3],
            '6串50': [4, 3, 2],
            '6串57': [6, 5, 4, 3, 2],
            '6串63': [6, 5, 4, 3, 2, 1],
            '7串1': [7],
            '7串7': [6],
            '7串8': [7, 6],
            '7串21': [5],
            '7串35': [4],
            '7串120': [7, 6, 5, 4, 3, 2],
            '7串127': [7, 6, 5, 4, 3, 2, 1],
            '8串1': [8],
            '8串8': [7],
            '8串9': [8, 7],
            '8串28': [6],
            '8串56': [5],
            '8串70': [4],
            '8串247': [8, 7, 6, 5, 4, 3, 2],
            '8串255': [8, 7, 6, 5, 4, 3, 2, 1],
            '9串1': [9],
            '10串1': [10],
            '11串1': [11],
            '12串1': [12],
            '13串1': [13],
            '14串1': [14],
            '15串1': [15]
        },

        /**
         * 基本注数注数
         * @param arr {array} 例如[2,1,3]表示选中场次中，选中1个号码的有2场，选中2个号码的有1场，选中3个号码的有3场。
         * @param m {number} m串1
         */
        _calCount: function(arr, m)
        {
            var num = 0;
            if (arr.length === 0 || m === 0)
            {
                return 0;
            }
            // 缓存中间结果
            var key = arr.toString() + '|' + m, cache = this.countCache[key];
            if (typeof cache === 'number')
            {
                return cache;
            }
            // 单关
            if (m === 1)
            {
                for ( var i = arr.length; -- i > -1;)
                {
                    num += arr[i] * (i + 1); // 所有选择个数相加
                }
                return this.countCache[key] = num;
            }
            // 总场次等于总串关数
            var sum = Tool.Sum(arr);
            if (sum === m)
            {
                num = 1;
                for ( var i = arr.length; -- i > -1;)
                {
                    num *= Math.pow(i + 1, arr[i]); // 所有选择个数相乘
                }
                return this.countCache[key] = num;
            }
            for ( var i = arr.length; -- i > -1;)
            {
                if (arr[i] > 0)
                {
                    var _arr = arr.concat();
                    -- _arr[i];
                    num = (i + 1) * arguments.callee.apply(this, [_arr, m - 1]) + arguments.callee.apply(this, [_arr, m]);
                    return this.countCache[key] = num;
                }
            }
            return this.countCache[key] = num;
        },
        /**
         * 计算注数
         * @param tag {boolean} true:去重（按m串1出票）/ false:不去重（按m串n出票）
         * @param dArr {array} 胆码数组，例如[2,1,3]表示设胆的场次中，选中1个号码的有2场，选中2个号码的有1场，选中3个号码的有3场。
         * @param tArr {array} 拖码数组，规则同上
         * @param passType {array/string} 过关方式
         * @param dCount {number} 胆码场次（可以计算，作为参数可以减少计算）
         * @param passType {array/string} 总场次
         */
        calCount: function(tag, dArr, tArr, passType, dCount, count)
        {
            var num = 0, m;
            if (_.isArray(passType))
            {
                for ( var i = passType.length; -- i > -1;)
                {
                    num += arguments.callee.apply(this, [tag, dArr, tArr, passType[i], dCount, count]);
                }
                return num;
            }
            // 缓存中间结果
            var key = dArr.toString() + '|' + tArr.toString() + '|' + passType, cache = this.countCache[key];
            if (typeof cache !== 'undefined')
            {
                return cache;
            }
            // 不去重算法拆单，拆单后均为无胆计算
            m = isNaN(parseInt(passType)) ? 1 : parseInt(passType);
            if ((!tag) && (count > m))
            {
                var _tArr = this.separateArray(tArr, m - dCount);
                for ( var i = _tArr.length; -- i > -1;)
                {
                    num += arguments.callee.apply(this, [true, [], this.addArray(_tArr[i], dArr), passType, 0, m]);
                }
                return this.countCache[key] = num;
            }
            // 根据passTypeMap拆成m串1计算
            var ptArr = this.passTypeMap[passType], dNum = 0;
            for ( var i = ptArr.length; -- i > -1;)
            {
                // 如果过关数小于或等于胆数，则在胆码内部计算
                if (dCount >= ptArr[i])
                {
                    num += this._calCount(dArr, ptArr[i]);
                }
                else if (dCount < ptArr[i] && dCount > 0)
                {
                    dNum = this._calCount(dArr, dCount);
                    num += dNum * this._calCount(tArr, ptArr[i] - dCount);
                }
                else
                {
                    num += this._calCount(tArr, ptArr[i]);
                }
            }
            return this.countCache[key] = num;
        },
        /**
         * 拆单算法
         * @param arr {array} 拆单数组 [2,1,1]
         * @param num {number} 拆单后场次数 2
         * @return b {array} [2,0,0]、[1,1,0]、[1,0,1]、[0,1,1]
         */
        separateArray: function(arr, num)
        {
            var a = Tool.C(this.transArrayToMatch(arr), num), // a = [[3,2],[3,1],[3,1],[2,1],[2,1],[1,1]]
            b = [];
            for ( var i = a.length; -- i > -1;)
            {
                b.push(this.transArrayToNum(a[i])); // b = [2,0,0]、[1,1,0]、[1,1,0]、[1,0,1]、[1,0,1]、[0,1,1]
            }
            return b;
        },
        /**
         * 将数组转化为对阵数目显示
         * @param arr {array} [2,1,1]
         * @return a {array} [3,2,1,1]
         */
        transArrayToMatch: function(arr)
        {
            var a = [];
            for ( var i = arr.length; -- i > -1;)
            {
                for ( var j = arr[i]; -- j > -1;)
                {
                    a.push(i + 1);
                }
            }
            return a;
        },
        /**
         * 将数组转化为统计数目显示
         * @param arr {array} [3,2,1,1]
         * @return a {array} [2,1,1]
         */
        transArrayToNum: function(arr)
        {
            var a = [0, 0, 0].concat(); // 考虑用配置项！！
            for ( var i = arr.length; -- i > -1;)
            {
                a[arr[i] - 1] ++;
            }
            return a;
        },
        /**
         * 数组按位相加
         * @param a1 {array} [2,1,1]
         * @param a2 {array} [0,2]
         * @return a {array} [2,3,1]
         */
        addArray: function(a1, a2)
        {
            var len = Math.max(a1.length, a2.length), a = [];
            for ( var i = len; -- i > -1;)
            {
                a[i] = this.numFormat(a1[i]) + this.numFormat(a2[i]);
            }
            return a;
        },
        numFormat: function(num)
        {
            return isNaN(num) ? 0 : num;
        },
        
        /**
         * 计算最小奖金
         * @param filterDup 是否去重
         * @param sps SP值数组（按小->大排序，胆场SP置于最前）
         * @param passTypes 过关方式数组（按串关小->大排序），如：["3串1", "4串1", ...]
         * @param danCount 设胆场数
         * @returns {Number} 最小奖金
         */
        calculateMinAward: function(filterDup, sps, passTypes, danCount)
        {
            // 计算每个过关方式对应的最小串关数（M）
            var result = 0, passTypeMap = this.passTypeMap, gameCounts = [], i = 0, size = passTypes.length, min = 100, moneyCache = this.moneyCache, list, gameCount, award, prefix, key;
            for (; i < size; ++ i)
            {
                list = passTypeMap[passTypes[i]];  // 过关方式对应的“串”组合，如：4串11是4串1、3串1、2串1的组合（[4, 3, 2]）
                gameCount = list[list.length - 1];  // 最小串关数（M）
                if (filterDup)  // 去重
                {
                    // 只保留最小串关数（M）
                    if (gameCount < min)  // 最小串关数
                    {
                        gameCounts.length = 0;  // 清空之前保存的最小串关数（M）列表
                        min = gameCount;
                    }
                    else if (gameCount > min)  // 串关数大
                    {
                        continue;
                    }
                }
                gameCounts[gameCounts.length] = gameCount;  // 过关方式对应的最小串关数（M）
            }
            prefix = sps.toString() + '|min|';  // 缓存Key前缀
            // 计算各M串1的最小奖金数
            for (i = gameCounts.length; -- i > -1;)
            {
                gameCount = gameCounts[i];  // 串关数（M）
                key = prefix + gameCount + "串1";  // 缓存Key
                award = moneyCache[key];  // 取缓存
                if (award == undefined)  // 无缓存结果
                {
                    if (filterDup)  // 去重
                    {
                        // 按最小串关计算
                        award = moneyCache[key] = parseFloat(Tool.Product(sps.slice(0, gameCount)).toFixed(2));  // 最小SP值列表乘积
                    }
                }
                result += award;  // 结果
            }
            return result;
        },
        
        /**
         * 计算极值（最大/最小中奖金额）
         * @param tag {boolean} true:去重（按m串1出票）/ false:不去重（按m串n出票）
         * @param spArray {array} [SP值]（每场1个最大/最小SP值）
         * @param passType {array/string} ['2串1']
         * @param dCount {number} 胆码场次
         * @param extre {string} 'min' / 'max'
         * @return num {string} 2位小数的数字
         */
        calExtreme: function(tag, spArray, passType, dCount, extreme)
        {
            var num = 0, m, ptArr, dArr, tArr, arr, i;
            if (_.isArray(passType))
            {
                for (i = passType.length; -- i > -1;)
                {
                    num += Number(this.calExtreme(tag, spArray, passType[i], dCount, extreme));
                }
                return num.toFixed(2);
            }
            // 缓存中间结果
            var key = spArray.toString() + '|' + extreme + '|' + passType, cache = this.moneyCache[key];
            if (typeof cache !== 'undefined')
            {
                return cache;
            }
            ptArr = this.passTypeMap[passType];
            // 最大值, 所有比赛全部正确
            if (extreme === 'max')
            {
                m = isNaN(parseInt(passType)) ? 1 : parseInt(passType);
                // 不去重按m串n先拆单
                if ((!tag) && (spArray.length > m))
                {
                    dArr = spArray.slice(0, dCount);
                    tArr = spArray.slice(dCount);
                    arr = Tool.dtC(tArr, dArr, m);
                    for ( var i = arr.length; -- i > -1;)
                    {
                        num += Number(arguments.callee.apply(this, [true, arr[i], passType, 0, 'max']));
                    }
                    return this.moneyCache[key] = num.toFixed(2);
                }
                // 按m串1计算
                for ( var i = ptArr.length; -- i > -1;)
                {
                    // 如果过关数小于或等于胆数，则在胆码内部计算
                    arr = Tool.C(spArray, ptArr[i]);
                    for ( var j = arr.length; -- j > -1;)
                    {
                        num += Number(Tool.Product(arr[j]).toFixed(2));
                        // console.log(arr[j] + '------' + Number(Tool.Product(arr[j]).toFixed(2)));
                    }
                }
                return this.moneyCache[key] = num.toFixed(2);
            }
            // 最小值，在过关方式允许下，中最少的比赛的奖金
            m = ptArr[ptArr.length - 1];
            // 不去重按命中胆数计算，需要比较得出最小值
            if ((!tag) && (spArray.length > m))
            {
                var maxDHit = Math.min(m, dCount), numArr = [];
                dArr = spArray.slice(0, dCount);
                tArr = spArray.slice(dCount);
                arr = Tool.dtC(tArr, dArr, m);
                // 命中的胆数从0到maxDHit
                for ( var i = 0; i < maxDHit; i ++)
                {
                    var n = 0;
                    // 命中胆数 i ，过关 m , i < m
                    for (var j = arr.length; -- j > -1;)
                    {
                        var a = arr[j], b = a.slice(0, i).concat(a.slice(dCount, m - i));
                        n += Tool.Product(b);
                    }
                    numArr.push(n);
                }
                // 排序取最小值
                numArr = numArr.sort(function(a, b)
                {
                    return a - b;
                });
                return this.moneyCache[key] = numArr[0].toFixed(2);
            }
            // 去重算法按最小过关计算即可
            arr = spArray.slice(0, m);
            return this.moneyCache[key] = Tool.Product(arr).toFixed(2);
        }
    };
});
