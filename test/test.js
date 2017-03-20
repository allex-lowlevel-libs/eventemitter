var expect = require('chai').expect,
  Checks = require('allex_checkslowlevellib'),
  DListBase = require('allex_doublelinkedlistbaselowlevellib'),
  Inherit = require('allex_inheritlowlevellib')(Checks.isFunction,Checks.isString).inherit,
  EventEmitter = require('..')(DListBase,Inherit,Checks.isFunction,Checks.isArrayOfFunctions);

describe('Testing \'Event emitter\' lib', function(){
  var expFn = function(retobj,a){
    //console.log(a + '^2 = ' +  a*a);
    retobj.value = a*a;
  };
  var reduceByFiveFn = function(retobj,a){
    //console.log(retobj.value + '-5+' + a + ' = ');
    retobj.value = retobj.value - 5 + a;
    //console.log(retobj.value);
  };
  var negateFn = function(retobj,a){
    retobj.value = -retobj.value;
  };
  it('Type testing', function(){
    var ee = new EventEmitter();
    expect(ee.attach.bind(ee,false)).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(ee,{})).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(ee,[])).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(ee,'smth')).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(ee,undefined)).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(ee,null)).to.throw(Error,/Cannot attach/);
  });
  it('attach testing (functions)', function(){
    var ee = new EventEmitter();
    var retObj = { value : 0 };
    var bindedExpFn = expFn.bind(null,retObj);
    var bindedReduceByFiveFn = reduceByFiveFn.bind(null,retObj);
    ee.attach(bindedExpFn);
    ee.attach(bindedReduceByFiveFn);
    ee.fire(1);
    expect(retObj.value).to.be.equal(-3);
    ee.fire(2);
    expect(retObj.value).to.be.equal(1);
    ee.fire(3);
    expect(retObj.value).to.be.equal(7);
    ee.fire(4);
    expect(retObj.value).to.be.equal(15);
  });
  it('attach testing (array of functions)', function(){
    var ee = new EventEmitter();
    var retObj = { value : 0 };
    var bindedExpFn = expFn.bind(null,retObj);
    var bindedReduceByFiveFn = reduceByFiveFn.bind(null,retObj);
    ee.attach([bindedExpFn,bindedReduceByFiveFn]);
    ee.fire(1);
    expect(retObj.value).to.be.equal(-3);
    ee.fire(2);
    expect(retObj.value).to.be.equal(1);
    ee.fire(3);
    expect(retObj.value).to.be.equal(7);
    ee.fire(4);
    expect(retObj.value).to.be.equal(15);
  });
  it('attach testing (mixed)', function(){
    var ee = new EventEmitter();
    var retObj = { value : 0 };
    var bindedExpFn = expFn.bind(null,retObj);
    var bindedReduceByFiveFn = reduceByFiveFn.bind(null,retObj);
    var bindedNegateFn = negateFn.bind(null,retObj);
    ee.attach(bindedExpFn);
    ee.attach([bindedReduceByFiveFn,bindedNegateFn]);
    ee.fire(1);
    expect(retObj.value).to.be.equal(3);
    ee.fire(2);
    expect(retObj.value).to.be.equal(-1);
    ee.fire(3);
    expect(retObj.value).to.be.equal(-7);
    ee.fire(4);
    expect(retObj.value).to.be.equal(-15);
  });

  it('attachForSingleShot testing (functions)', function(){
    var ee = new EventEmitter();
    var retObj = { value : 0 };
    var bindedExpFn = expFn.bind(null,retObj);
    var bindedReduceByFiveFn = reduceByFiveFn.bind(null,retObj);
    ee.attachForSingleShot(bindedExpFn);
    ee.attachForSingleShot(bindedReduceByFiveFn);
    ee.fire(1);
    expect(retObj.value).to.be.equal(-3);
    ee.fire(2); //no effect
    expect(retObj.value).to.be.equal(-3);
  });
  it('attachForSingleShot testing (array of functions)', function(){
    var ee = new EventEmitter();
    var retObj = { value : 0 };
    var bindedExpFn = expFn.bind(null,retObj);
    var bindedReduceByFiveFn = reduceByFiveFn.bind(null,retObj);
    ee.attachForSingleShot([bindedExpFn,bindedReduceByFiveFn]);
    ee.fire(1);
    expect(retObj.value).to.be.equal(-3);
    ee.fire(2);//no effect
    expect(retObj.value).to.be.equal(-3);
  });
  it('attachForSingleShot testing (mixed)', function(){
    var ee = new EventEmitter();
    var retObj = { value : 0 };
    var bindedExpFn = expFn.bind(null,retObj);
    var bindedReduceByFiveFn = reduceByFiveFn.bind(null,retObj);
    var bindedNegateFn = negateFn.bind(null,retObj);
    ee.attachForSingleShot(bindedExpFn);
    ee.attachForSingleShot([bindedReduceByFiveFn,bindedNegateFn]);
    ee.fire(1);
    expect(retObj.value).to.be.equal(3);
    ee.fire(2);//no effect
    expect(retObj.value).to.be.equal(3);
  });
});
