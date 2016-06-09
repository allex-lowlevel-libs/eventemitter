function createHookCollection(doublelinkedlistlib, inherit, isFunction){
  var ListMixin = doublelinkedlistlib.Mixin,
    ListItemCtor = doublelinkedlistlib.Item;

  function SingleShotSubscription (content) {
    if (!content) {
      console.trace();
      console.log('no function for SingleShotSubscription?', content);
      console.log(args);
      process.exit(0);
    }
    ListItemCtor.call(this, content);
  }
  inherit(SingleShotSubscription, ListItemCtor);
  SingleShotSubscription.prototype.apply = function (args) {
    if (!this.content) {
      console.trace();
      console.log(this);
      console.log(args);
      process.exit(0);
    }
    this.content.apply(null, args);
  };
  SingleShotSubscription.prototype.isSelfDestroyable = true;

  function Subscription (list, content) {
    SingleShotSubscription.call(this, content);
    this.list = list;
  }
  inherit(Subscription, SingleShotSubscription);
  Subscription.prototype.destroy = function () {
    var l = this.list;
    this.list = null;
    if (l) {
      l.remove(this);
    }
    SingleShotSubscription.prototype.destroy.call(this);
  };
  Subscription.prototype.isSelfDestroyable = false;


  function HookCollection() {
    ListMixin.call(this);
  }
  ListMixin.addMethods(HookCollection);
  HookCollection.prototype.destruct = HookCollection.prototype.destroy;
  HookCollection.prototype.attach = function (cb) {
    var item;
    if (!isFunction(cb)) {
      return;
    }
    item = new Subscription(this, cb);
    this.assureForController();
    this.controller.addToBack(item);
    return item;
  };
  HookCollection.prototype.attachForSingleShot = function (cb) {
    var item;
    if (!isFunction(cb)) {
      return;
    }
    item = new SingleShotSubscription(cb);
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
