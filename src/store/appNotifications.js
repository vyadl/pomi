import { writable, derived, get } from 'svelte/store';

function createValidationMessages() {
  const { subscribe, update } = writable({});

  return {
    subscribe,
    update,
    addMessage: (key, message, visibleTime = 0) => {
      update($appNotifications => {
        $appNotifications[key] = message;

        if (visibleTime) {
          setTimeout(() => {
            appNotifications.removeMessage(key);
          }, visibleTime);
        }

        return $appNotifications;
      });
    },
    removeMessage: (key) => {
      update(appNotifications => {
        delete appNotifications[key];

        return appNotifications;
      });
    },
  };
}

export const appNotifications = createValidationMessages();

export const notificationsArr = derived(appNotifications, $appNotifications => {
  return Object.entries($appNotifications);
})

export const addMessage = appNotifications.addMessage;
export const removeMessage = appNotifications.removeMessage;
