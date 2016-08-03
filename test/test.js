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
  it('Type testing', function(){
    var ee = new EventEmitter();
    expect(ee.attach.bind(null,false)).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(null,{})).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(null,[])).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(null,'smth')).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(null,undefined)).to.throw(Error,/Cannot attach/);
    expect(ee.attach.bind(null,null)).to.throw(Error,/Cannot attach/);
  });
  it('Attach testing (functions)', function(){
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
  it('Attach testing (array of functions)', function(){
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

});
