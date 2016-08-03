var expect = require('chai').expect,
  Checks = require('allex_checkslowlevellib'),
  DListBase = require('allex_doublelinkedlistbaselowlevellib'),
  Inherit = require('allex_inheritlowlevellib')(Checks.isFunction,Checks.isString).inherit,
  EventEmitter = require('..')(DListBase,Inherit,Checks.isFunction,Checks.isArrayOfFunctions);

describe('Testing \'Event emitter\' lib', function(){
  var expFn = function(retobj,a){
    console.log(a + '^2 = ' + a*a);
    retobj.value = a*a;
  }
  it('Attach testing (functions)', function(){
    var ee = new EventEmitter();
    var retObj = { value : 0 };
    var bindedExpFn = expFn.bind(null,retObj);
    expect(ee.attach.bind(null,false)).to.throw(Error,/Cannot attach/);
    ee.attach(bindedExpFn);
    ee.fire(1);
    expect(retObj.value).to.be.equal(1);
    ee.fire(2);
    expect(retObj.value).to.be.equal(4);
    ee.fire(3);
    expect(retObj.value).to.be.equal(9);
    ee.fire(4);
    expect(retObj.value).to.be.equal(16);
  });
  it('Attach testing (array of functions)', function(){
    var ee = new EventEmitter();
  });

});
