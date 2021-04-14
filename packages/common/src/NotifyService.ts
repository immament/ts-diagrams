type NotifyServiceCallback = (event: {key: string; value: unknown}) => void;

export class NotifyService {
  private callbacks: {key: string; cb: NotifyServiceCallback}[] = [];

  notify(key: string, value: unknown) {
    this.callbacks.forEach((item, index, arr) => {
      if (item.key === key) {
        item.cb({key, value});
        arr.slice(index);
      }
    });
  }

  register(key: string, cb: NotifyServiceCallback) {
    this.callbacks.push({key, cb});
  }
}
