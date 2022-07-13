export const LOCAL_STORAGE_ACTIVITIES_KEY = 'activities';
export const LOCAL_STORAGE_CURRENT_ACTIVITY_ID_KEY = 'currentActivityId';
export const LOCAL_STORAGE_ORDER_ACTIVITY_KEY = 'orderActivity';
export const LOCAL_STORAGE_INTERVALS_KEY = 'intervals';
export const LOCAL_STORAGE_SETTINGS_KEY = 'settings';
export const LOCAL_STORAGE_STATISTICS_KEY = 'stat';

// there is a template for migration to new version of localStorage state
// if migration is needed - this function has to be called in main.js before everything else
export const localStorageMigration = () => {
  // if (localStorage.getItem('migration1')) {
  //   return false;
  // }
  //
  // localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
  // localStorage.setItem('migration1', true);
};
