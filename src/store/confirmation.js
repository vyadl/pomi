import { _ } from '../utils/langUtils.js';
import { writable, get } from 'svelte/store';
import { DeferredBoolean } from '../utils/generalUtils.js';

function getConfirmDeffered() {
  const confirmDeffered = new DeferredBoolean();

  confirmDeffered.promise
    .finally(() => {
      confirmStore.resetStatus();
    });

  return confirmDeffered;
}

function createConfirmStore() {
  const { subscribe, update } = writable({
    active: false,
    deffered: getConfirmDeffered(),
  });

  return {
    subscribe,
    update,
    askConfirmation: (options) => {
      confirmStore.resetStatus();

      update($confirmStore => {
        $confirmStore.active = true;

        if (
          options &&
          Object.keys(options).every(
            item => ['title', 'body', 'confirmText', 'rejectText'].includes(item)
          )
        ) {
          $confirmStore = {
            ...$confirmStore,
            ...options,
          }
        }

        return $confirmStore;
      });

      return get(confirmStore).deffered.promise;
    },
    resetStatus: () => {
      update(() => {
        return {
          confirmActive: false,
          title: _('are_you_sure'),
          confirmText: _('yes'),
          rejectText: _('no'),
          body: '',
          deffered: getConfirmDeffered(),
        };
      });
    },
    confirm: () => {
      get(confirmStore).deffered.resolve();
      //confirmStore.resetStatus();
    },
    reject: () => {
      get(confirmStore).deffered.reject();
      //confirmStore.resetStatus();
    },
  };
}

export const confirmStore = createConfirmStore();
export const askConfirmation = confirmStore.askConfirmation;
export const confirm = confirmStore.confirm;
export const reject = confirmStore.reject;
