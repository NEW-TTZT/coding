/**
 * 手写 Object.create
 * 1. 创建一个空F函数
 * 2. 把传入的参数 赋值给 F函数的原型对象
 * 3. 返回 new这个F函数
 */
function create(obj){
    function F() {}
    F.prototype = obj
    return new F()
}

/**
 * 手写 instanceof
 * 1. 获取第一个参数的类型的原型 Object.getPrototypeOf()
 * 2. 获取第二个参数的原型对象
 * 3. 循环判断 类型原型和原型对象对比，循环获取第一个参数的类型的原型，判断成功返回t，获取到最后类型的原型为空返回f
 */
function instanceOf(left, right){
    let leftPro = Object.getPrototypeOf(left)
    let rightPro = right.prototype
    while(leftPro){
        if(!leftPro) return false
        if(leftPro === rightPro) return true
        leftPro = Object.getPrototypeOf(leftPro)
    }
}

/**
 * 手写 new
 * 1. 创建一个空对象
 * 2. 设置原型，将空对的原型设置为函数的prototype对象
 * 3. 让函数的this指向这个对象，执行构造函数的代码（为这个新对象添加属性）
 * 4. 判断函数的返回值类型，如果是值类型、返回创建的对象，如果是引用类型、返回这个引用类型
 */
function Mynew(fn, ...args){
    let newObj = Object.create(fn.prototype)
    let res = fn.call(newObj, ...args)
    if(res && (typeof res === 'object' || typeof res === 'function')){
        return  res
    }
    return newObj
}

/**
 * 手写 call
 * 1. 判断是否是函数、不是的话报错，第一个参数如果没有值就赋值window
 * 2. 定义一个fn的唯一值
 * 3. 把this赋值给context[fn]上
 * 4. 执行context[fn]并且返回回去
 */
Function.prototype.myCall = function(context, ...args) {
    if(typeof context !== 'function'){
        throw Error('type error')
    }
    context = context || window
    let fn = Symbol()
    context[fn] = this
    return context[fn](...args)
}

/**
 * 手写 apply
 * 1. 主要跟call的区别是接受第二个参数是固定一个
 */
Function.prototype.myApply = function(context, args) {
    if(typeof context !== 'function'){
        throw Error('type error')
    }
    context = context || window
    let fn = Symbol()
    context[fn] = this
    return context[fn](args)

}

/**
 * 手写 bind
 * 1. 和call的参数是一样的
 * 2. 需要返回一个函数
 * 3. 需要判断返回的函数this是不是外层的this，如果不是使用context
 * 4. 执行函数的时候、需要合并外出参数和返回函数的参数，又可以使用apply去实现执行
 */
Function.prototype.myBind = function(context, ...args) {
    if(typeof context !== 'function'){
        throw Error('type error')
    }
    context = context || window
    let fn = Symbol()
    context[fn] = this
    let _this = this
    const result = function(...innerArgs) {
        if(this instanceof _this === true){
            this[fn] = _this
            this[fn](...[...args, ...innerArgs])
        }else{
            context[fn](...[...args, ...innerArgs])
        }
    }
    result.prototype = Object.create(this.prototype)
    return result
}

/**
 * 手写 深拷贝
 * 1. 判断是否object 非null，如果是就返回当前值
 * 2. 先判断obj是否在weakmap里面，如果在就获取map返回
 * 3. 创建一个新变量，判断是否数组 ？[] : {}，并且把obj设置到map里面，第一个参数obj第二个参数新变量
 * 4. 使用Reflect.ownKeys拿出对象自身的key去遍历
 * 5. 判断是否每个属性，然后递归
 */
function isObject(val){
    return typeof obj === 'object' && obj !== null
}
function deepClone(obj, hash = new WeakMap()) {
    if(!isObject) return obj;
    if(hash.has(obj)) return hash.get(obj)
    let target = Array.isArray(obj) ? [] : {}
    hash.set(obj, target)
    Reflect.ownKeys(obj).forEach(item => {
        if(isObject(item)){
            target[item] = deepClone(obj[item], hash)
        } else {
            target[item] = obj[item]
        }
    })
}

/**
 * 手写 继承
 * 
 */
function Parent(){
    this.name = 'parent'
}
function Child(){
    this.type = 'child'
}
// 原型链继承  --> 会公用父级同一个原型对象
Child.prototype = new Parent()
//构造函数继承  --> 借助call，无法使用父级原型对象上的方法
function Child1(){
    Parent.call(this)
}
// 组合继承 --> parent执行了两次
function Child2(){
    Parent.call(this)
}
Child2.prototype = new Parent()
Child2.prototype.constructor = Child2
// 原型继承 --> create方法是可以为一些对象实现浅拷贝
let Child3 = Object.create(Parent)
// 寄生继承
// 寄生组合继承





