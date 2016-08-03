function createHookCollection(doublelinkedlistlib, inherit, isFunction, isArrayOfFunctions){
  var ListMixin = doublelinkedlistlib.Mixin,
    ListItemCtor = doublelinkedlistlib.Item;

  function SubscriptionBase (content) {
    if (!content) {
      console.trace();
      console.log('no function for SingleShotSubscription?', content);
      console.log(args);
      process.exit(0);
    }
    ListItemCtor.call(this, content);
  }
  inherit(SubscriptionBase, ListItemCtor);
  SubscriptionBase.prototype.apply = function (args) {
    if (!this.content) {
      console.trace();
      console.log(this);
      console.log(args);
      process.exit(0);
    }
    this.doArgs(args);
  };

  function SubscriptionMixin (list) {
    this.list = list;
  }
  SubscriptionMixin.prototype.destroy = function () {
    var l = this.list;
    this.list = null;
    if (l) {
      l.remove(this);
    }
  };

  function SingleShotSubscription (content) {
    SubscriptionBase.call(this, content);
  }
  inherit(SingleShotSubscription, SubscriptionBase);
  SingleShotSubscription.prototype.isSelfDestroyable = true;
  SingleShotSubscription.prototype.doArgs = function (args) {
    this.content.apply(null, args);
  };

  function Subscription (list, content) {
    SingleShotSubscription.call(this, content);
    SubscriptionMixin.call(this, list);
  }
  inherit(Subscription, SingleShotSubscription);
  Subscription.prototype.destroy = function () {
    SubscriptionMixin.prototype.destroy.call(this);
    SingleShotSubscription.prototype.destroy.call(this);
  };
  Subscription.prototype.isSelfDestroyable = false;


  function SingleShotSubscriptionOnArray (content) {
    SubscriptionBase.call(this, content);
  }
  inherit(SingleShotSubscriptionOnArray, SubscriptionBase);
  SingleShotSubscriptionOnArray.prototype.isSelfDestroyable = true;
  SingleShotSubscriptionOnArray.prototype.doArgs = function (args) {
    this.content.forEach(this.doSingleArgs.bind(this, args));
  };
  SingleShotSubscriptionOnArray.prototype.doSingleArgs = function (args, func) {
    func.apply(null, args);
  };

  function SubscriptionOnArray (list, content) {
    SingleShotSubscriptionOnArray.call(this, content);
    SubscriptionMixin.call(this, list);
  }
  inherit(SubscriptionOnArray, SingleShotSubscriptionOnArray);
  SubscriptionOnArray.prototype.destroy = function () {
    SubscriptionMixin.prototype.destroy.call(this);
    SingleShotSubscription.prototype.destroy.call(this);
  };
  SubscriptionOnArray.prototype.isSelfDestroyable = false;


  function HookCollection() {
    ListMixin.call(this);
  }
  ListMixin.addMethods(HookCollection);
  HookCollection.prototype.destruct = HookCollection.prototype.destroy;
  HookCollection.prototype.attach = function (cb) {
    var item;
    if (isFunction(cb)) {// || isArrayOfFunctions(cb))) {
      item = new Subscription(this, cb);
    }
    if (isArrayOfFunctions(cb) && cb.length > 0) {
      item = new SubscriptionOnArray(this, cb);
    }
    if (!item) {
      throw new Error('Cannot attach');
    }
    this.assureForController();
    this.controller.addToBack(item);
    return item;
  };
  HookCollection.prototype.attachForSingleShot = function (cb) {
    var item;
    if (isFunction(cb)) {
      item = new SingleShotSubscription(cb);
    }
    if (isArrayOfFunctions(cb) && cb.length > 0) {
      item = new SingleShotSubscriptionOnArray(cb);
    }
    if (!item) {
      throw new Error('Cannot attach');
    }
    this.assureForController();
    this.controller.addToBack(item);
  };
  HookCollection.prototype.fire = function () {
    var args = Array.prototype.slice.call(arguments);
    this.assureForController();
    this.controller.traverse(args);
  };
  return HookCollection;
}

module.exports = createHookCollection;
