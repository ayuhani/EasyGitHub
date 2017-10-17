export default function makeCancelable(promise) {
  let hasCanceled_ = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(value => {
      hasCanceled_ ? reject({isCanceled: true}) : resolve(value)
    });
    promise.catch(error => {
      hasCanceled_ ? reject({isCanceled: true}) : resolve(error)
    })
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  }
}